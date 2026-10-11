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
      mapUrl: "https://maps.app.goo.gl/EMutUAhHwnisxix26",
    },
    {
      ar: { name: "المهندسين" },
      en: { name: "Mohandessin" },
      mapUrl: "https://maps.app.goo.gl/U96iBpU7vKC9GVhq8",
    },
    {
      ar: { name: "شبرا" },
      en: { name: "Shubra" },
      mapUrl: "https://maps.app.goo.gl/4Y1GMLwbwPTeGbaJ8",
    },
    {
      ar: { name: "العبور" },
      en: { name: "El Obour" },
      mapUrl: "https://maps.app.goo.gl/xhhXT9j3gBJfD85f9",
    },
    {
      ar: { name: "التجمع الخامس" },
      en: { name: "5th Settlement" },
      mapUrl: "https://maps.app.goo.gl/fKiphTFaq1dJmENk6",
      mapEmbed:
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13803.0!2d31.4!3d30.02!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzDCsDAxJzEyLjAiTiAzMcKwMjQnMDAuMCJF!5e0!3m2!1sen!2seg!4v1700000000000",
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
