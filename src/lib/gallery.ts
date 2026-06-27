import factoryImg from "@/assets/factory.jpg";
import factoryInteriorImg from "@/assets/factory_interior.png";
import packagingLineImg from "@/assets/packaging_line.png";
import qualityLabImg from "@/assets/quality_lab.png";
import chunaWhiteImg from "@/assets/chuna-white.jpg";
import chunaYellowImg from "@/assets/chuna-yellow.jpg";

export type GallerySlide = {
  id: string;
  img: string;
  type?: "image" | "video";
  title: {
    en: string;
    gu: string;
    hi: string;
  };
  desc: {
    en: string;
    gu: string;
    hi: string;
  };
};

export const DEFAULT_GALLERY: GallerySlide[] = [
  {
    id: "g1",
    img: factoryImg,
    title: {
      en: "Factory Exterior",
      gu: "ફેક્ટરી બહારનો દેખાવ",
      hi: "फैक्ट्री का बाहरी दृश्य",
    },
    desc: {
      en: "Our primary manufacturing facility in Ahmedabad, Gujarat.",
      gu: "અમદાવાદ, ગુજરાતમાં આવેલી અમારી મુખ્ય ઉત્પાદન સુવિધા.",
      hi: "अहमदाबाद, गुजरात में हमारी मुख्य विनिर्माण सुविधा।",
    }
  },
  {
    id: "g2",
    img: factoryInteriorImg,
    title: {
      en: "Hygienic Processing Area",
      gu: "સ્વચ્છ પ્રોસેસિંગ એરિયા",
      hi: "स्वच्छ प्रसंस्करण क्षेत्र",
    },
    desc: {
      en: "Spotless stainless steel mixing tanks for pure lime filtration.",
      gu: "શુદ્ધ ચૂનાના ગાળણ માટે કાટમુક્ત સ્ટેનલેસ સ્ટીલ મિક્સિંગ ટેન્ક.",
      hi: "शुद्ध चूना छानने के लिए बेदाग स्टेनलेस स्टील मिक्सिंग टैंक।",
    }
  },
  {
    id: "g3",
    img: packagingLineImg,
    title: {
      en: "Automated Packaging Line",
      gu: "ઓટોમેટેડ પેકેજિંગ લાઇન",
      hi: "स्वचालित पैकेजिंग लाइन",
    },
    desc: {
      en: "Organized and food-safety compliant box packaging for distributors.",
      gu: "વિતરકો માટે તૈયાર કરાયેલા સુરક્ષિત ફૂડ-ગ્રેડ બોક્સ પેકિંગ.",
      hi: "वितरकों के लिए तैयार किए गए सुरक्षित खाद्य-ग्रेड बॉक्स पैकेजिंग।",
    }
  },
  {
    id: "g4",
    img: qualityLabImg,
    title: {
      en: "Quality Control Laboratory",
      gu: "ગુણવત્તા નિયંત્રણ લેબોરેટરી",
      hi: "गुणवत्ता नियंत्रण प्रयोगशाला",
    },
    desc: {
      en: "Strict batch testing and physical-chemical inspection for FSSAI compliance.",
      gu: "FSSAI પાલન માટે કડક બેચ ટેસ્ટિંગ અને ગુણવત્તા નિરીક્ષણ.",
      hi: "FSSAI अनुपालन के लिए सख्त बैच परीक्षण और गुणवत्ता निरीक्षण।",
    }
  },
  {
    id: "g5",
    img: chunaWhiteImg,
    title: {
      en: "Tirth Brand Edible Chuna",
      gu: "તીર્થ બ્રાન્ડ ખાવાલાયક ચૂનો",
      hi: "तीर्थ ब्रांड खाने योग्य चूना",
    },
    desc: {
      en: "Premium white lime paste, processed for fine consistency.",
      gu: "પ્રીમિયમ સફેદ ખાવાલાયક ચૂનો, મધ્યમ અને ઘટ્ટ વેરિઅન્ટમાં.",
      hi: "प्रीमियम सफेद खाने योग्य चूना पेस्ट, मध्यम और घट्टा संस्करण में।",
    }
  },
  {
    id: "g6",
    img: chunaYellowImg,
    title: {
      en: "Riddhi Siddhi Brand Chuna",
      gu: "રિદ્ધિ સિદ્ધિ બ્રાન્ડ ચૂનો",
      hi: "रिद्धि सिद्धि ब्रांड चूना",
    },
    desc: {
      en: "Traditional yellow edible lime paste with optimized packaging.",
      gu: "પીળો ખાવાલાયક ચૂનો, રીટેલ પેકિંગ અને લૂઝ વેરિઅન્ટમાં.",
      hi: "पीला खाने योग्य चूना पेस्ट, खुदरा पैकिंग और ढीले संस्करण में।",
    }
  }
];

export function getStoredGallery(): GallerySlide[] {
  if (typeof window === "undefined") return DEFAULT_GALLERY;
  const stored = localStorage.getItem("khodiyar_about_gallery");
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (err) {
      console.error("Error parsing stored gallery", err);
      return DEFAULT_GALLERY;
    }
  }
  localStorage.setItem("khodiyar_about_gallery", JSON.stringify(DEFAULT_GALLERY));
  return DEFAULT_GALLERY;
}

export function saveStoredGallery(gallery: GallerySlide[]): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("khodiyar_about_gallery", JSON.stringify(gallery));
  }
}
