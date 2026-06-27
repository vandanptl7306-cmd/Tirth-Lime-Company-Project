export type CustomerFeedback = {
  id: string;
  name: string;
  company: string;
  rating: number; // 1-5
  comment: string;
  approved: boolean;
  date: string;
};

export const DEFAULT_FEEDBACKS: CustomerFeedback[] = [
  {
    id: "f1",
    name: "Sanjay Patel",
    company: "Janta Paan House, Ahmedabad",
    rating: 5,
    comment: "The quality of Tirth white chuna is exceptional. Consistent texture and premium purity in every single parcel we buy.",
    approved: true,
    date: "2026-04-12"
  },
  {
    id: "f2",
    name: "Rajesh Shah",
    company: "Maruti Traders, Sanchore",
    rating: 5,
    comment: "Reliable bulk supply and prompt delivery to border markets. Riddhi Siddhi yellow packing is highly demanded by our local vendors.",
    approved: true,
    date: "2026-05-18"
  },
  {
    id: "f3",
    name: "Karan Mishra",
    company: "Kalyan Paan Shop, Mount Abu",
    rating: 4,
    comment: "Excellent packaging quality that retains moisture. We have been purchasing Tirth Ghata chuna for over two years now.",
    approved: true,
    date: "2026-06-05"
  }
];

export function getStoredFeedback(): CustomerFeedback[] {
  if (typeof window === "undefined") return DEFAULT_FEEDBACKS;
  const stored = localStorage.getItem("khodiyar_feedbacks");
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      return DEFAULT_FEEDBACKS;
    }
  }
  localStorage.setItem("khodiyar_feedbacks", JSON.stringify(DEFAULT_FEEDBACKS));
  return DEFAULT_FEEDBACKS;
}

export function saveStoredFeedback(feedbacks: CustomerFeedback[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem("khodiyar_feedbacks", JSON.stringify(feedbacks));
}

// B2B Blocklist for filtering out offensive language or spam comments
export const PROFANITY_LIST = [
  // English profanities & spam terms
  "abuse", "badword", "fake", "scam", "spam", "worst", "fraud", "cheap", "useless", "waste", "garbage", "trash", "hate",
  // Common transliterated Hindi/Gujarati slang terms
  "bakwas", "kachra", "bekar", "kamine", "harami", "chutiya", "saala", "fuddu", "badtamiz", "gandu", "bhadwa"
];

export function hasProfanity(text: string): boolean {
  if (!text) return false;
  const lowerText = text.toLowerCase();
  return PROFANITY_LIST.some((word) => {
    // Check using word boundary logic to avoid false positives (e.g. matching "glass" for "ass")
    const regex = new RegExp(`\\b${word}\\b`, "i");
    return regex.test(lowerText);
  });
}

