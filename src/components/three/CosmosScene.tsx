"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { buildJourney, cosmos, poseAt, type Keyframe } from "@/lib/cosmos";

const GOLD = new THREE.Color("#c9a227");
const GOLD_BRIGHT = new THREE.Color("#e8c766");
const DEEP = new THREE.Color("#363b47");

/* ------------------------------------------------------------------ *
 * The waters of Nun converging into Ra's disc.
 * ------------------------------------------------------------------ */

const vertexShader = /* glsl */ `
  uniform float uForm;
  uniform float uTime;
  uniform float uSize;
  uniform float uPixelRatio;

  attribute vec3 aTarget;
  attribute float aRandom;
  attribute float aGold;

  varying float vGold;
  varying float vAlpha;

  void main() {
    // Stagger each particle so the field resolves in waves, never as one snap.
    float p = clamp((uForm - aRandom * 0.55) / 0.45, 0.0, 1.0);
    p = p * p * (3.0 - 2.0 * p);

    vec3 drift = vec3(
      sin(uTime * 0.13 + aRandom * 24.0),
      cos(uTime * 0.11 + aRandom * 19.0),
      sin(uTime * 0.09 + aRandom * 31.0)
    ) * 0.22 * (1.0 - p);

    float a = (1.0 - p) * uTime * 0.045;
    float c = cos(a);
    float s = sin(a);
    vec3 src = position;
    src.xz = mat2(c, -s, s, c) * src.xz;

    vec3 pos = mix(src + drift, aTarget, p);

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * uPixelRatio * (0.55 + aGold * 0.7) * (36.0 / -mv.z);

    vGold = aGold;
    vAlpha = mix(0.34 + aRandom * 0.24, 0.085, p);
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uGold;
  uniform vec3 uDeep;
  uniform float uOpacity;

  varying float vGold;
  varying float vAlpha;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    float mask = smoothstep(0.5, 0.02, d);
    vec3 color = mix(uDeep, uGold, vGold);
    gl_FragColor = vec4(color, mask * vAlpha * uOpacity);
  }
`;

function useParticles(count: number) {
  return useMemo(() => {
    const position = new Float32Array(count * 3);
    const target = new Float32Array(count * 3);
    const random = new Float32Array(count);
    const gold = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      // Source: a wide, flattened cloud — the dark water, mostly formless.
      const r = 3.4 + Math.random() * 6.2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      position[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      position[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.55;
      position[i * 3 + 2] = r * Math.cos(phi) * 0.7;

      // Target: an even Fibonacci shell — the sun disc.
      const t = (i + 0.5) / count;
      const inclination = Math.acos(1 - 2 * t);
      const azimuth = Math.PI * (1 + Math.sqrt(5)) * i;
      const shell = 1.05 + (Math.random() - 0.5) * 0.07;
      target[i * 3] = shell * Math.sin(inclination) * Math.cos(azimuth);
      target[i * 3 + 1] = shell * Math.sin(inclination) * Math.sin(azimuth);
      target[i * 3 + 2] = shell * Math.cos(inclination);

      random[i] = Math.random();
      gold[i] = Math.random() < 0.42 ? 0.5 + Math.random() * 0.5 : Math.random() * 0.18;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(position, 3));
    geo.setAttribute("aTarget", new THREE.BufferAttribute(target, 3));
    geo.setAttribute("aRandom", new THREE.BufferAttribute(random, 1));
    geo.setAttribute("aGold", new THREE.BufferAttribute(gold, 1));
    geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 14);
    return geo;
  }, [count]);
}

/* ------------------------------------------------------------------ *
 * Ra's disc — a small core inside a soft billboard glow. The glow plane
 * is wider than the viewport so its falloff never reaches an edge and
 * shows as a box.
 * ------------------------------------------------------------------ */

const glowVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const glowFragment = /* glsl */ `
  uniform float uIntensity;
  uniform vec3 uInner;
  uniform vec3 uOuter;
  varying vec2 vUv;
  void main() {
    float d = length(vUv - 0.5) * 2.0;
    float core = pow(clamp(1.0 - d, 0.0, 1.0), 3.4);
    float bloom = pow(clamp(1.0 - d, 0.0, 1.0), 1.5) * 0.28;
    vec3 color = mix(uOuter, uInner, core);
    gl_FragColor = vec4(color, (core + bloom) * uIntensity);
  }
`;

const RINGS = [
  { r: 1.5, tilt: 0.0, speed: 1.0, opacity: 0.5 },
  { r: 1.95, tilt: 0.42, speed: -0.72, opacity: 0.38 },
  { r: 2.4, tilt: -0.3, speed: 0.55, opacity: 0.28 },
  { r: 2.9, tilt: 0.62, speed: -0.4, opacity: 0.18 },
];

function Orb({ count, onReady }: { count: number; onReady?: () => void }) {
  const group = useRef<THREE.Group>(null);
  const coreMat = useRef<THREE.MeshBasicMaterial>(null);
  const ringGroup = useRef<THREE.Group>(null);
  const ringRefs = useRef<(THREE.Mesh | null)[]>([]);
  const journey = useRef<Keyframe[]>([]);
  const announced = useRef(false);
  const geometry = useParticles(count);

  const particleMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uForm: { value: cosmos.form },
          uTime: { value: 0 },
          uSize: { value: 4.5 },
          uPixelRatio: { value: 1 },
          uOpacity: { value: 1 },
          uGold: { value: GOLD.clone() },
          uDeep: { value: DEEP.clone() },
        },
      }),
    []
  );

  const glowMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: glowVertex,
        fragmentShader: glowFragment,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uIntensity: { value: 0 },
          uInner: { value: GOLD_BRIGHT.clone() },
          uOuter: { value: GOLD.clone() },
        },
      }),
    []
  );

  useFrame((state, delta) => {
    if (!announced.current) {
      announced.current = true;
      onReady?.();
    }

    // Section offsets change with fonts, images and resizes — rebuild cheaply.
    if (!journey.current.length || state.clock.elapsedTime % 2 < delta) {
      journey.current = buildJourney();
    }

    const y = window.scrollY;
    const pose = poseAt(journey.current, y);
    const time = state.clock.elapsedTime;
    const breath = 1 + Math.sin(time * 0.8) * 0.018;

    const u = particleMaterial.uniforms;
    u.uTime.value += delta;
    u.uForm.value = cosmos.form;
    u.uPixelRatio.value = state.gl.getPixelRatio();
    u.uOpacity.value = pose.dim;

    // The core is already alight when the page opens, then brightens as the
    // field arrives — the visitor never faces an empty screen.
    const born = 0.35 + 0.65 * Math.min(1, Math.max(0, (cosmos.form - 0.2) / 0.7));
    if (coreMat.current) coreMat.current.opacity = born * pose.dim * 0.2;
    glowMaterial.uniforms.uIntensity.value = born * pose.dim * 0.27 * breath;

    if (group.current) {
      group.current.position.set(pose.pos[0], pose.pos[1], pose.pos[2]);
      group.current.scale.setScalar(pose.scale * breath);
    }

    if (ringGroup.current) {
      ringGroup.current.visible = pose.rings > 0.01;
      ringGroup.current.rotation.y = y * 0.0009;
      ringRefs.current.forEach((mesh, i) => {
        if (!mesh) return;
        const ring = RINGS[i];
        // Scroll turns the rings, not the clock.
        mesh.rotation.z = ring.tilt + y * 0.0016 * ring.speed;
        mesh.rotation.x = 1.15 + Math.sin(y * 0.0006) * 0.22 * ring.speed;
        const material = mesh.material as THREE.MeshBasicMaterial;
        material.opacity = ring.opacity * pose.rings * pose.dim;
      });
    }
  });

  return (
    <group ref={group}>
      <points geometry={geometry} material={particleMaterial} frustumCulled={false} />

      <mesh>
        <sphereGeometry args={[0.4, 48, 48]} />
        <meshBasicMaterial ref={coreMat} color={GOLD_BRIGHT} transparent opacity={0} />
      </mesh>

      <mesh material={glowMaterial} position={[0, 0, -0.1]}>
        <planeGeometry args={[9, 9]} />
      </mesh>

      <group ref={ringGroup}>
        {RINGS.map((ring, i) => (
          <mesh
            key={ring.r}
            ref={(m) => {
              ringRefs.current[i] = m;
            }}
          >
            <torusGeometry args={[ring.r, 0.006, 8, 180]} />
            <meshBasicMaterial
              color={GOLD}
              transparent
              opacity={0}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}

export default function CosmosScene({
  quality,
  onReady,
}: {
  quality: "full" | "lite";
  onReady?: () => void;
}) {
  const full = quality === "full";

  return (
    <Canvas
      camera={{ position: [0, 0, 6.2], fov: 46 }}
      dpr={full ? [1, 1.75] : [1, 1.3]}
      gl={{
        antialias: full,
        alpha: true,
        powerPreference: "high-performance",
      }}
      style={{ position: "absolute", inset: 0 }}
    >
      <Orb count={full ? 6000 : 2600} onReady={onReady} />
    </Canvas>
  );
}
