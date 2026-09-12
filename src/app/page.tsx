import CosmosLayer from "@/components/CosmosLayer";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Concept from "@/components/Concept";
import Expertise from "@/components/Expertise";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";
import FloatingContact from "@/components/FloatingContact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <CosmosLayer />
      <Header />
      <main>
        <Hero />
        <Concept />
        <Expertise />
        <Projects />
        <Contact />
      </main>
      <Footer />
      <FloatingContact />
    </>
  );
}
