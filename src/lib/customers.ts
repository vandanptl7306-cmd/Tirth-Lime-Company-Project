export type Customer = {
  id: string;
  name: string;      // Owner / Contact Name
  company: string;   // Agency / Company Name
  phone: string;     // WhatsApp Number
  address?: string;  // Delivery Address
  gstin?: string;    // GSTIN Number
  dateAdded: string; // ISO date YYYY-MM-DD
};

export function getStoredCustomers(): Customer[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem("khodiyar_customers");
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error("Error parsing stored customers:", e);
    }
  }

  // Default seed list to populate the dashboard immediately
  const defaultCustomers: Customer[] = [
    {
      id: "c1",
      name: "Rameshbhai Patel",
      company: "Janta Paan Bhandar",
      phone: "919998421346",
      address: "G-12, Sector-11, Gandhinagar, Gujarat",
      gstin: "24BCYPP1234A1Z1",
      dateAdded: "2026-04-10"
    },
    {
      id: "c2",
      name: "Sureshchandra Shah",
      company: "Maruti Traders",
      phone: "919998421346",
      address: "Shop No. 4, APMC Market, Rajkot, Gujarat",
      gstin: "24BCYPP5678B2Z2",
      dateAdded: "2026-04-18"
    },
    {
      id: "c3",
      name: "Kalyanji Gala",
      company: "Kalyan Paan Shop",
      phone: "919998421346",
      address: "Near Station Road, Bhuj, Gujarat",
      gstin: "24BCYPP9012C3Z3",
      dateAdded: "2026-05-02"
    },
    {
      id: "c4",
      name: "Maheshbhai Prajapati",
      company: "Gujarat Lime Distributors",
      phone: "919998421346",
      address: "Lime Compound, Kalol, Gandhinagar, Gujarat",
      gstin: "24BCYPP3456D4Z4",
      dateAdded: "2026-05-15"
    },
    {
      id: "c5",
      name: "Rajesh Sharma",
      company: "Rajasthan Paan Center",
      phone: "919998421346",
      address: "Johari Bazaar, Jaipur, Rajasthan",
      gstin: "08BCYPP7890E5Z5",
      dateAdded: "2026-05-28"
    }
  ];

  localStorage.setItem("khodiyar_customers", JSON.stringify(defaultCustomers));
  return defaultCustomers;
}

export function saveStoredCustomers(customers: Customer[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem("khodiyar_customers", JSON.stringify(customers));
}
