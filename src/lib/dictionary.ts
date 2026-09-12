export type Lang = "en" | "ar";

export type Project = {
  /** Product names are proper nouns — identical in both languages. */
  title: string;
  desc: string;
  tags: string[];
};

export type Dictionary = {
  dir: "ltr" | "rtl";
  locale: string;
  nav: { href: string; label: string }[];
  a11y: { nav: string; openMenu: string; closeMenu: string; whatsapp: string };
  lang: { toggle: string; en: string; ar: string };
  hero: {
    kicker: string;
    tagline: string;
    primary: string;
    ghost: string;
    scroll: string;
  };
  concept: {
    eyebrow: string;
    heading: string;
    body: [string, string];
    quote: string;
  };
  expertise: { eyebrow: string; heading: string; sub: string };
  projects: {
    eyebrow: string;
    heading: string;
    sub: string;
    items: Project[];
  };
  contact: {
    eyebrow: string;
    heading: string;
    sub: string;
    whatsapp: string;
    email: string;
  };
  /** `brand` is Latin in both languages and always rendered dir="ltr". */
  footer: { brand: string; rights: string; credit: string };
};

// Shared across both languages so a stack name is never translated.
const TAGS: string[][] = [
  ["React Native", "Education"],
  ["React Native", "Bulk E-commerce"],
  ["React Native", "Custom Analytics"],
  ["Booking Engine", "Tournament API"],
  ["React Native", "Firebase"],
  ["Geolocation", "Job Dispatch"],
  ["React Native", "Agora SDK", "Gifted Chat", "Redux Toolkit"],
  ["React Native", "Stripe", "Google Maps"],
  ["Node.js", "MongoDB", "Stripe"],
  ["GraphQL", "AWS S3"],
  ["Firebase", "Push Notifications"],
  ["E-Reader Engine", "PDF Reader"],
];

const TITLES = [
  "Key",
  "أوفر جملة",
  "My Car",
  "Riadi",
  "Suzuki Project",
  "MG Plumbers",
  "HighHigh",
  "Rescounts",
  "Sovio",
  "Cammani",
  "Caffee",
  "Rida",
];

function withMeta(descriptions: string[]): Project[] {
  return descriptions.map((desc, i) => ({
    title: TITLES[i],
    desc,
    tags: TAGS[i],
  }));
}

export const STACK = [
  "React Native",
  "Redux Toolkit",
  "TypeScript",
  "Reanimated & Layout Animations",
  "Agora Live Streaming",
  "Gifted Chat",
  "Stripe Payments",
  "Firebase",
  "GraphQL & REST",
  "Node.js & MongoDB",
  "AWS S3",
  "i18next",
  "React Navigation",
  "Google Maps API",
];

const en: Dictionary = {
  dir: "ltr",
  locale: "en",
  nav: [
    { href: "#concept", label: "The Idea" },
    { href: "#expertise", label: "Expertise" },
    { href: "#projects", label: "Work" },
    { href: "#contact", label: "Contact" },
  ],
  a11y: {
    nav: "Main navigation",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    whatsapp: "Message us on WhatsApp",
  },
  lang: { toggle: "Language", en: "EN", ar: "ع" },
  hero: {
    kicker: "Software House · Egypt",
    tagline:
      'Out of the primordial waters came everything that exists. We work by the same logic: we take your idea while it is still formless, and "forge" it into a complete digital product — powerful, and working.',
    primary: "See our work",
    ghost: "Start your project",
    scroll: "Scroll",
  },
  concept: {
    eyebrow: "The Idea",
    heading: "Why the name Nunforge?",
    body: [
      'In ancient Egyptian belief, "Nun" is the dark primordial water the whole universe floated in before any shape or order was created. Out of Nun rose the sun, rose Ra, rose life in all its detail.',
      'We work on the same idea: you come to us with an idea still at the "primordial water" stage — no shape, no code, no interface. And we "forge" it into something real: a working app, a strong design, and clean code that can grow with you.',
    ],
    quote: '"Out of the darkness, everything rose."',
  },
  expertise: {
    eyebrow: "Expertise",
    heading: "The tools we forge with",
    sub: "The technologies and libraries we use to build mobile and web products that are powerful, fast, and ready to scale.",
  },
  projects: {
    eyebrow: "Work",
    heading: "Work that shipped, not just ideas",
    sub: "Real products running in the Egyptian and Arab market — from e-commerce to bookings to social platforms.",
    items: withMeta([
      'An education app under the banner "Knowledge Empowers You" — delivering learning content and study paths to its users.',
      "A wholesale commerce platform for bulk deals and discounts, with a multi-supplier cart.",
      "Car maintenance and ownership management: expense tracking, service reminders, and sharing a car's data with family or transferring ownership by code.",
      "Sports pitch booking and tournament management — from finding a pitch to tracking the standings.",
      "The official app for browsing Suzuki cars, booking test drives, and finding the nearest showroom.",
      "Connects customers to the nearest plumber, with instant booking and live location tracking.",
      "A social platform for creators: high-quality live streaming, stories and reels, and real-time interaction on posts.",
      "Table reservations and pre-ordering food at restaurants, with map locations and secure payments.",
      "An e-commerce platform with real-time inventory updates, a smart cart, and Stripe payments.",
      "A platform for photographers and digital artists to showcase and sell their work, with optimised, fast image uploads.",
      "A café management app: live menu editing, coffee order customisation, and reward points.",
      "A book and article reading app, with a reading experience the reader can tune for comfort.",
    ]),
  },
  contact: {
    eyebrow: "Contact",
    heading: "Ready to build something powerful?",
    sub: "Send us your idea and we'll handle the rest — from design to launch.",
    whatsapp: "WhatsApp us",
    email: "Email us",
  },
  footer: {
    brand: "© 2026 Nunforge.",
    rights: "All rights reserved.",
    credit: "Powered by NUNforge",
  },
};

// Arabic copy is the client-approved original — kept verbatim.
const ar: Dictionary = {
  dir: "rtl",
  locale: "ar",
  nav: [
    { href: "#concept", label: "الفكرة" },
    { href: "#expertise", label: "خبراتنا" },
    { href: "#projects", label: "مشاريعنا" },
    { href: "#contact", label: "تواصل" },
  ],
  a11y: {
    nav: "التنقل الرئيسي",
    openMenu: "فتح القائمة",
    closeMenu: "إغلاق القائمة",
    whatsapp: "تواصل معانا على واتساب",
  },
  lang: { toggle: "اللغة", en: "EN", ar: "ع" },
  hero: {
    kicker: "Software House · Egypt",
    tagline:
      "من المياه الأزلية طلع كل حاجة موجودة. من نفس المنطق، بناخد فكرتك وهي لسه من غير شكل، ونصهر منها منتج رقمي متكامل، قوي، وشغال.",
    primary: "شوف مشاريعنا",
    ghost: "ابدأ مشروعك",
    scroll: "Scroll",
  },
  concept: {
    eyebrow: "الفكرة",
    heading: "ليه الاسم Nunforge؟",
    body: [
      'في المعتقد المصري القديم، "نون" هي المياه الأزلية المظلمة اللي كان الكون كله عايم فيها قبل ما يتخلق أي شكل أو نظام. من جوة "نون" طلعت الشمس، طلع رع، طلعت الحياة بكل تفاصيلها.',
      'إحنا بنشتغل بنفس الفكرة: بتيجي لنا بفكرة لسه في مرحلة "المياه الأزلية" — مالهاش شكل، مالهاش كود، مالهاش واجهة. ونحن بنصهر منها منتج حقيقي: تطبيق شغال، بتصميم قوي، وكود نضيف يقدر يكبر معاك.',
    ],
    quote: '"من الظلام، طلع كل شيء."',
  },
  expertise: {
    eyebrow: "خبراتنا",
    heading: "أدواتنا في صنع القوة",
    sub: "التقنيات والمكتبات اللي بنبني بيها منتجات موبايل وويب قوية، سريعة، وقابلة للتوسع.",
  },
  projects: {
    eyebrow: "مشاريعنا",
    heading: "شغل اتعمل، مش مجرد أفكار",
    sub: "مشاريع حقيقية شغالة في السوق المصري والعربي — من التجارة الإلكترونية للحجوزات للمنصات الاجتماعية.",
    items: withMeta([
      'تطبيق تعليمي بشعار "Knowledge Empowers You" — بيقدّم محتوى تعليمي ومسارات تعلم للمستخدمين.',
      "منصة تجارة جملة، لعروض وخصومات الشراء بالكمية وإدارة سلة متعددة الموردين.",
      "إدارة صيانة وملكية السيارات: تتبع المصاريف، تنبيهات الصيانة، ومشاركة بيانات العربية مع العيلة أو نقل ملكيتها بكود.",
      "حجز ملاعب رياضية وإدارة بطولات — من البحث عن ملعب لتتبع ترتيب البطولة.",
      "تطبيق رسمي لعرض سيارات سوزوكي، حجز تجارب قيادة، وتحديد أقرب معرض.",
      "ربط العملاء بأقرب فني سباكة، بحجز فوري وتتبع الموقع.",
      "منصة تواصل اجتماعي للمبدعين، بث مباشر بجودة عالية، ستوريز وريلز، وتفاعل لحظي على المنشورات.",
      "حجز طاولات وطلب أكل مسبق في المطاعم، بمواقع دلالة عالخريطة ومدفوعات آمنة.",
      "منصة تجارة إلكترونية بتحديث فوري للمخزون، سلة شراء ذكية، ومدفوعات Stripe.",
      "منصة للمصورين والفنانين الرقميين لعرض وبيع أعمالهم، مع تحميل صور محسّن وسريع.",
      "تطبيق إدارة كافيهات: قوائم تعديل لحظية، تخصيص طلبات القهوة، ونقاط مكافآت.",
      "تطبيق قراءة كتب ومقالات، بتجربة عرض قابلة للتخصيص لراحة القارئ.",
    ]),
  },
  contact: {
    eyebrow: "تواصل",
    heading: "جاهز نبني حاجة قوية؟",
    sub: "ابعتلنا فكرتك، وإحنا نتكفل بالباقي — من التصميم للإطلاق.",
    whatsapp: "واتساب مباشر",
    email: "راسلنا بالإيميل",
  },
  footer: {
    brand: "© 2026 Nunforge.",
    rights: "جميع الحقوق محفوظة.",
    credit: "Powered by NUNforge",
  },
};

export const DICTIONARIES: Record<Lang, Dictionary> = { en, ar };
export const DEFAULT_LANG: Lang = "en";
