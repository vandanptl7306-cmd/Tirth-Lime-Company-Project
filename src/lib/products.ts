import chunaWhite from "@/assets/chuna-white.jpg";
import chunaYellow from "@/assets/chuna-yellow.jpg";

export type Product = {
  id: string;
  name: string;
  variant: string;
  color: "white" | "yellow" | string;
  image: string;
  images?: string[];
  videos?: string[];
  tag: string;
  minQuantity?: number;
};

export const PRODUCTS: Product[] = [
  {
    id: "tirth-white-medium",
    name: "Tirth Chuna Parcel",
    variant: "White — Medium",
    color: "white",
    image: chunaWhite,
    images: [chunaWhite],
    tag: "Premium white chuna in medium parcel size",
  },
  {
    id: "tirth-white-ghata",
    name: "Tirth Chuna Parcel",
    variant: "White — Ghata",
    color: "white",
    image: chunaWhite,
    images: [chunaWhite],
    tag: "Traditional ghata pack of white chuna",
  },
  {
    id: "tirth-yellow-medium",
    name: "Tirth Chuna Parcel",
    variant: "Yellow — Medium",
    color: "yellow",
    image: chunaYellow,
    images: [chunaYellow],
    tag: "Rich yellow chuna in medium parcel size",
  },
  {
    id: "tirth-yellow-ghata",
    name: "Tirth Chuna Parcel",
    variant: "Yellow — Ghata",
    color: "yellow",
    image: chunaYellow,
    images: [chunaYellow],
    tag: "Traditional ghata pack of yellow chuna",
  },
  {
    id: "riddhi-yellow-packing",
    name: "Riddhi Siddhi Chuna Parcel",
    variant: "Yellow — Packing",
    color: "yellow",
    image: chunaYellow,
    images: [chunaYellow],
    tag: "Retail-ready packed yellow chuna",
  },
  {
    id: "riddhi-yellow-loose",
    name: "Riddhi Siddhi Chuna Parcel",
    variant: "Yellow — Loose",
    color: "yellow",
    image: chunaYellow,
    images: [chunaYellow],
    tag: "Loose yellow chuna for bulk repacking",
  },
];

export const WHATSAPP_NUMBER = "919998421346"; // +91 99984 21346
export const PHONE_DISPLAY = "+91 99984 21346";
export const EMAIL = "patelsanjay5412@gmail.com";
export const ADDRESS = "Kachiyavalo Kuvo, Badarkha, Ahmedabad — 387810";

export function buildWaLink(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function getStoredProducts(): Product[] {
  if (typeof window === "undefined") return PRODUCTS;
  const stored = localStorage.getItem("khodiyar_products_data");
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      return PRODUCTS;
    }
  }
  localStorage.setItem("khodiyar_products_data", JSON.stringify(PRODUCTS));
  return PRODUCTS;
}

export function saveStoredProducts(products: Product[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem("khodiyar_products_data", JSON.stringify(products));
}
