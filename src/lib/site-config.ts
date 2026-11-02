export const siteConfig = {
  name: {
    ar: "د. سامح قاسم",
    en: "Dr. Sameh Qassem",
  },
  title: {
    ar: "استشاري جراحة المخ والأعصاب والعمود الفقري",
    en: "Consultant Neurosurgeon & Spine Surgeon",
  },
  domain: "https://www.drsamehqassem.com",
  phoneDisplay: "+20 100 123 4567",
  phoneHref: "tel:+201001234567",
  whatsappNumber: "201001234567",
  email: "contact@drsamehqassem.com",
  social: {
    facebook: "https://facebook.com/drsamehqassem",
    instagram: "https://instagram.com/drsamehqassem",
    tiktok: "https://tiktok.com/@drsamehqassem",
    youtube: "https://youtube.com/@drsamehqassem",
    linkedin: "https://linkedin.com/in/drsamehqassem",
  },
  clinics: [
    {
      ar: { name: "مصر الجديدة" },
      en: { name: "Heliopolis" },
      address: "٦٠ شارع الخليفة المأمون، برج كوين سنتر، الدور السابع، Ultra Health Care",
      mapUrl: "https://maps.app.goo.gl/EMutUAhHwnisxix26",
    },
    {
      ar: { name: "المهندسين" },
      en: { name: "Mohandessin" },
      address: "برج الحكمة الطبي، ٢٠ شارع البطل أحمد عبد العزيز تقاطع شارع الفريق عبد المنعم رياض، المهندسين",
      mapUrl: "https://maps.app.goo.gl/U96iBpU7vKC9GVhq8",
    },
    {
      ar: { name: "شبرا" },
      en: { name: "Shubra" },
      address: "١٦ شارع دولتيان، الخلفاوي، شبرا، بجوار مترو الخلفاوي أعلى مركز عيون",
      mapUrl: "https://maps.app.goo.gl/4Y1GMLwbwPTeGbaJ8",
    },
    {
      ar: { name: "العبور" },
      en: { name: "El Obour" },
      address: "الحي التاسع، O Court Mall، عيادات ميدكير، عيادة G 05",
      mapUrl: "https://maps.app.goo.gl/xhhXT9j3gBJfD85f9",
    },
    {
      ar: { name: "التجمع الخامس" },
      en: { name: "5th Settlement" },
      address: "Clinic B 203، أوزون ميديكال سنتر، التجمع الخامس",
      mapUrl: "https://maps.app.goo.gl/fKiphTFaq1dJmENk6",
    },
  ],
  workingHours: {
    ar: "السبت إلى الأربعاء: 3:00 م - 9:00 م",
    en: "Saturday to Wednesday: 3:00 PM - 9:00 PM",
  },
} as const;

export function buildWhatsAppLink(message: string, whatsappNumber: string = siteConfig.whatsappNumber) {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${whatsappNumber}?text=${encoded}`;
}

export function buildDirectionsLink(query: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

// A plain text query embed — no API key needed, unlike the "pb=..." embed
// code Google's own share dialog generates (which has to be copied by hand
// per location). Good enough for a labeled location preview; it just can't
// show a precise pin the way a real place/coordinate embed would.
export function buildMapEmbedUrl(query: string) {
  return `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
}
