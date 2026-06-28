import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  TrendingUp,
  CheckCircle2,
  Clock,
  Coins,
  Package,
  Plus,
  Trash2,
  Building,
  Calendar,
  Layers,
  Filter,
  Printer,
  X,
  FileSpreadsheet,
  Lock,
  User,
  LogOut,
  Star,
  UserPlus,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";

import { Button } from "@/components/ui/button";
import logoImg from "@/assets/logo.png";
import { SiteLayout } from "@/components/site/SiteLayout";
import { SectionHeading } from "@/components/site/SectionHeading";
import { PRODUCTS, getStoredProducts, saveStoredProducts, buildWaLink, type Product } from "@/lib/products";
import { getStoredGallery, saveStoredGallery, type GallerySlide } from "@/lib/gallery";
import { getStoredFeedback, saveStoredFeedback, hasProfanity, type CustomerFeedback } from "@/lib/feedback";
import { getStoredCustomers, saveStoredCustomers, type Customer } from "@/lib/customers";
import { toast } from "sonner";
import { useLanguage } from "@/hooks/useLanguage";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Sales & Operations Dashboard — KHODIYAR GRUH UDHYOG" },
      {
        name: "description",
        content: "Track wholesale orders, sales growth, product distribution, and transaction statuses.",
      },
    ],
  }),
  component: AdminDashboard,
});

type SaleItem = {
  product: string;
  packSize: "12x1 pack" | "24x1 pack";
  quantity: number;
  price: number;
  total: number;
};

type Sale = {
  id: string;
  date: string;
  company: string;
  phone?: string;
  items: SaleItem[];
  revenue: number;
  status: "Done" | "Pending";
};

const MOCK_SALES: Sale[] = [
  {
    id: "s1",
    date: "2026-04-10",
    company: "Janta Paan Bhandar",
    phone: "919998421346",
    items: [{ product: "Tirth Chuna Parcel (White — Medium)", packSize: "12x1 pack", quantity: 50, price: 300, total: 15000 }],
    revenue: 15000,
    status: "Done"
  },
  {
    id: "s2",
    date: "2026-04-18",
    company: "Maruti Traders",
    phone: "919998421346",
    items: [{ product: "Riddhi Siddhi Chuna Parcel (Yellow — Packing)", packSize: "24x1 pack", quantity: 30, price: 600, total: 18000 }],
    revenue: 18000,
    status: "Done"
  },
  {
    id: "s3",
    date: "2026-05-02",
    company: "Kalyan Paan Shop",
    phone: "919998421346",
    items: [{ product: "Tirth Chuna Parcel (Yellow — Ghata)", packSize: "12x1 pack", quantity: 20, price: 350, total: 7000 }],
    revenue: 7000,
    status: "Done"
  },
  {
    id: "s4",
    date: "2026-05-15",
    company: "Gujarat Lime Distributors",
    phone: "919998421346",
    items: [{ product: "Riddhi Siddhi Chuna Parcel (Yellow — Loose)", packSize: "24x1 pack", quantity: 100, price: 450, total: 45000 }],
    revenue: 45000,
    status: "Done"
  },
  {
    id: "s5",
    date: "2026-05-28",
    company: "Rajasthan Paan Center",
    phone: "919998421346",
    items: [{ product: "Tirth Chuna Parcel (White — Ghata)", packSize: "12x1 pack", quantity: 40, price: 325, total: 13000 }],
    revenue: 13000,
    status: "Pending"
  },
  {
    id: "s6",
    date: "2026-06-05",
    company: "Apex Retailers Vapi",
    items: [{ product: "Tirth Chuna Parcel (White — Medium)", packSize: "24x1 pack", quantity: 60, price: 533, total: 32000 }],
    revenue: 32000,
    status: "Done"
  },
  {
    id: "s7",
    date: "2026-06-12",
    company: "Ambaji Chuna Agency",
    items: [{ product: "Riddhi Siddhi Chuna Parcel (Yellow — Packing)", packSize: "12x1 pack", quantity: 80, price: 325, total: 26000 }],
    revenue: 26000,
    status: "Pending"
  },
  {
    id: "s8",
    date: "2026-06-18",
    company: "Sneh Traders Mehsana",
    items: [{ product: "Tirth Chuna Parcel (Yellow — Medium)", packSize: "24x1 pack", quantity: 45, price: 533, total: 24000 }],
    revenue: 24000,
    status: "Pending"
  },
];

// Simulated DB API functions with network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function apiGetSales(): Promise<Sale[]> {
  await delay(300);
  if (typeof window === "undefined") return MOCK_SALES;
  const stored = localStorage.getItem("khodiyar_sales_data");
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      const isOldFormat = parsed.some((s: any) => !s.items);
      if (isOldFormat) {
        localStorage.setItem("khodiyar_sales_data", JSON.stringify(MOCK_SALES));
        return MOCK_SALES;
      }
      return parsed;
    } catch {
      localStorage.setItem("khodiyar_sales_data", JSON.stringify(MOCK_SALES));
      return MOCK_SALES;
    }
  }
  localStorage.setItem("khodiyar_sales_data", JSON.stringify(MOCK_SALES));
  return MOCK_SALES;
}

async function apiSaveSales(salesList: Sale[]): Promise<Sale[]> {
  await delay(300);
  if (typeof window !== "undefined") {
    localStorage.setItem("khodiyar_sales_data", JSON.stringify(salesList));
  }
  return salesList;
}

async function apiGetProducts(): Promise<Product[]> {
  await delay(250);
  return getStoredProducts();
}

async function apiSaveProducts(productsList: Product[]): Promise<Product[]> {
  await delay(250);
  saveStoredProducts(productsList);
  return productsList;
}

async function apiGetGallery(): Promise<GallerySlide[]> {
  await delay(250);
  return getStoredGallery();
}

async function apiSaveGallery(galleryList: GallerySlide[]): Promise<GallerySlide[]> {
  await delay(250);
  saveStoredGallery(galleryList);
  return galleryList;
}

type CustomTooltipProps = {
  active?: boolean;
  payload?: any[];
  label?: string;
};

const CustomChartTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900/95 dark:bg-slate-950/98 backdrop-blur-md border border-slate-700/50 p-3.5 rounded-2xl shadow-xl text-xs space-y-1.5 select-none text-white transition-all">
        {label && <p className="font-bold opacity-80 uppercase tracking-wider text-[10px]">{label}</p>}
        {payload.map((item: any, idx: number) => {
          const isCurrency = !item.name.toLowerCase().includes("qty") && 
                             !item.name.toLowerCase().includes("volume") && 
                             !item.name.toLowerCase().includes("orders") &&
                             !item.name.toLowerCase().includes("status") &&
                             !item.name.toLowerCase().includes("completed") &&
                             !item.name.toLowerCase().includes("pending");
          return (
            <div key={idx} className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full border border-white/10" style={{ backgroundColor: item.color || item.fill || 'var(--brand-blue)' }} />
              <span className="font-medium text-slate-300">{item.name}:</span>
              <span className="font-black text-white">
                {isCurrency ? `₹${Number(item.value).toLocaleString("en-IN")}` : Number(item.value).toLocaleString("en-IN")}
              </span>
            </div>
          );
        })}
      </div>
    );
  }
  return null;
};

function numberToWords(num: number): string {
  const a = [
    "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten",
    "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"
  ];
  const b = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

  if (num === 0) return "Zero";
  
  function g(n: number): string {
    if (n === 0) return "";
    if (n < 20) return a[n];
    if (n < 100) return b[Math.floor(n / 10)] + (n % 10 ? " " + a[n % 10] : "");
    if (n < 1000) return a[Math.floor(n / 100)] + " Hundred" + (n % 100 ? " and " + g(n % 100) : "");
    if (n < 100000) return g(Math.floor(n / 1000)) + " Thousand" + (n % 1000 ? " " + g(n % 1000) : "");
    if (n < 10000000) return g(Math.floor(n / 100000)) + " Lakh" + (n % 100000 ? " " + g(n % 100000) : "");
    return g(Math.floor(n / 10000000)) + " Crore" + (n % 10000000 ? " " + g(n % 10000000) : "");
  }
  
  return (g(num) + " Rupees Only").toUpperCase();
}

function AdminDashboard() {
  const { t, language, setLanguage } = useLanguage();
  const queryClient = useQueryClient();

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const sessionAuth = sessionStorage.getItem("khodiyar_admin_auth");
      const localAuth = localStorage.getItem("khodiyar_admin_auth");
      return sessionAuth === "true" || localAuth === "true";
    }
    return false;
  });
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loginError, setLoginError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (usernameInput.trim() === "admin" && passwordInput === "TirthLime@2026") {
      setIsAuthenticated(true);
      setLoginError("");
      if (rememberMe) {
        localStorage.setItem("khodiyar_admin_auth", "true");
      } else {
        sessionStorage.setItem("khodiyar_admin_auth", "true");
      }
      toast.success(language === "gu" ? "સફળતાપૂર્વક લોગિન થયું!" : language === "hi" ? "सफलतापूर्वक लॉगिन हुआ!" : "Successfully signed in!");
    } else {
      setLoginError(t("admin.loginError"));
      toast.error(t("admin.loginError"));
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("khodiyar_admin_auth");
    localStorage.removeItem("khodiyar_admin_auth");
    toast.success(language === "gu" ? "લૉગ આઉટ થયા!" : language === "hi" ? "लॉग आउट किया गया!" : "Logged out successfully.");
  };

  const { data: sales = [], isLoading: salesLoading } = useQuery<Sale[]>({
    queryKey: ["sales"],
    queryFn: apiGetSales,
  });

  const { data: products = [], isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: apiGetProducts,
  });

  const { data: gallery = [], isLoading: galleryLoading } = useQuery<GallerySlide[]>({
    queryKey: ["gallery"],
    queryFn: apiGetGallery,
  });

  // Mutations
  const salesMutation = useMutation({
    mutationFn: apiSaveSales,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sales"] });
    },
  });

  const productsMutation = useMutation({
    mutationFn: apiSaveProducts,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  const galleryMutation = useMutation({
    mutationFn: apiSaveGallery,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gallery"] });
    },
  });

  const [activeTab, setActiveTab] = useState<"sales" | "products" | "gallery" | "feedbacks" | "customers">("sales");
  const [timeRange, setTimeRange] = useState<"7days" | "30days" | "all">("all");
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteProductConfirm, setDeleteProductConfirm] = useState<string | null>(null);
  const [deleteSaleConfirm, setDeleteSaleConfirm] = useState<string | null>(null);

  // Gallery management states
  const [showAddSlideModal, setShowAddSlideModal] = useState(false);
  const [editingSlide, setEditingSlide] = useState<GallerySlide | null>(null);
  const [deleteSlideConfirm, setDeleteSlideConfirm] = useState<string | null>(null);

  // Form states for gallery slides
  const [slideImg, setSlideImg] = useState("");
  const [slideType, setSlideType] = useState<"image" | "video">("image");
  const [slideEnTitle, setSlideEnTitle] = useState("");
  const [slideGuTitle, setSlideGuTitle] = useState("");
  const [slideHiTitle, setSlideHiTitle] = useState("");
  const [slideEnDesc, setSlideEnDesc] = useState("");
  const [slideGuDesc, setSlideGuDesc] = useState("");
  const [slideHiDesc, setSlideHiDesc] = useState("");

  // Form states for product management
  const [prodName, setProdName] = useState("");
  const [prodVariant, setProdVariant] = useState("");
  const [prodColor, setProdColor] = useState("white");
  const [prodTag, setProdTag] = useState("");
  const [prodMinQty, setProdMinQty] = useState("");
  const [prodImage, setProdImage] = useState("");

  const [mounted, setMounted] = useState(false);
  const [filterStatus, setFilterStatus] = useState<"All" | "Done" | "Pending">("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeInvoice, setActiveInvoice] = useState<Sale | null>(null);

  // Form states
  const [formCompany, setFormCompany] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formDate, setFormDate] = useState("");
  const [formStatus, setFormStatus] = useState<"Done" | "Pending">("Pending");
  const [formItems, setFormItems] = useState<{
    product: string;
    packSize: "12x1 pack" | "24x1 pack";
    quantity: number;
    price: number;
    total: number;
  }[]>([
    { product: "", packSize: "12x1 pack", quantity: 1, price: 0, total: 0 }
  ]);

  const [feedbacksList, setFeedbacksList] = useState<CustomerFeedback[]>([]);
  const [customersList, setCustomersList] = useState<Customer[]>([]);
  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);
  const [custName, setCustName] = useState("");
  const [custCompany, setCustCompany] = useState("");
  const [custPhone, setCustPhone] = useState("");
  const [custAddress, setCustAddress] = useState("");

  useEffect(() => {
    setMounted(true);
    setFeedbacksList(getStoredFeedback());
    setCustomersList(getStoredCustomers());
  }, []);

  useEffect(() => {
    const shouldStop = showAddModal || activeInvoice || showAddProductModal || showAddSlideModal;
    if (shouldStop) {
      (window as any).lenis?.stop();
      document.body.style.overflow = "hidden";
    } else {
      (window as any).lenis?.start();
      document.body.style.overflow = "";
    }
    return () => {
      (window as any).lenis?.start();
      document.body.style.overflow = "";
    };
  }, [showAddModal, activeInvoice, showAddProductModal, showAddSlideModal]);

  const handleAddCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!custCompany || !custPhone) {
      alert("Company name and phone number are required.");
      return;
    }

    const newCustomer: Customer = {
      id: "c" + Date.now(),
      name: custName || "Owner",
      company: custCompany,
      phone: custPhone,
      address: custAddress,
      dateAdded: new Date().toISOString().split("T")[0]
    };

    const updated = [newCustomer, ...customersList];
    setCustomersList(updated);
    saveStoredCustomers(updated);
    setShowAddCustomerModal(false);

    // Reset fields
    setCustName("");
    setCustCompany("");
    setCustPhone("");
    setCustAddress("");
    toast.success("Offline customer added successfully!");
  };

  const handleDeleteCustomer = (id: string) => {
    if (confirm("Are you sure you want to delete this customer profile?")) {
      const updated = customersList.filter(c => c.id !== id);
      setCustomersList(updated);
      saveStoredCustomers(updated);
      toast.success("Customer profile deleted.");
    }
  };

  const handleToggleApproveFeedback = (id: string) => {
    const updated = feedbacksList.map((fb) => {
      if (fb.id === id) {
        return { ...fb, approved: !fb.approved };
      }
      return fb;
    });
    setFeedbacksList(updated);
    saveStoredFeedback(updated);
    toast.success("Feedback status updated!");
  };

  const handleDeleteFeedback = (id: string) => {
    if (confirm("Are you sure you want to delete this review?")) {
      const updated = feedbacksList.filter((fb) => fb.id !== id);
      setFeedbacksList(updated);
      saveStoredFeedback(updated);
      toast.success("Review deleted successfully.");
    }
  };

  const saveSales = (newSales: Sale[]) => {
    salesMutation.mutate(newSales);
  };

  const saveProducts = (newProducts: Product[]) => {
    productsMutation.mutate(newProducts);
  };

  const handleToggleStatus = (id: string) => {
    const updated = sales.map((s) =>
      s.id === id ? { ...s, status: s.status === "Done" ? ("Pending" as const) : ("Done" as const) } : s
    );
    saveSales(updated);
  };

  const handleDelete = (id: string) => {
    setDeleteSaleConfirm(id);
  };

  // Form Item row handlers
  const handleItemChange = (index: number, field: string, value: any) => {
    const updated = [...formItems];
    if (field === "quantity") {
      const qty = Number(value) || 0;
      updated[index] = {
        ...updated[index],
        quantity: qty,
        total: qty * (updated[index].price || 0)
      };
    } else if (field === "price") {
      const prc = Number(value) || 0;
      updated[index] = {
        ...updated[index],
        price: prc,
        total: (updated[index].quantity || 0) * prc
      };
    } else {
      updated[index] = {
        ...updated[index],
        [field]: value
      };
    }
    setFormItems(updated);
  };

  const handleAddItemRow = () => {
    setFormItems([
      ...formItems,
      { product: "", packSize: "12x1 pack", quantity: 1, price: 0, total: 0 }
    ]);
  };

  const handleRemoveItemRow = (index: number) => {
    if (formItems.length === 1) return;
    setFormItems(formItems.filter((_, i) => i !== index));
  };

  const handleAddSale = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formCompany || !formDate) {
      alert("Customer name and dispatch date are required.");
      return;
    }

    const calculatedRevenue = formItems.reduce((acc, item) => acc + Number(item.total), 0);

    const newSale: Sale = {
      id: "s" + Date.now(),
      company: formCompany,
      phone: formPhone || "919998421346",
      items: formItems.map(item => ({
        product: item.product,
        packSize: item.packSize,
        quantity: Number(item.quantity),
        price: Number(item.price),
        total: Number(item.total)
      })),
      revenue: calculatedRevenue,
      date: formDate,
      status: formStatus,
    };

    saveSales([newSale, ...sales]);
    setShowAddModal(false);

    // Reset Form
    setFormCompany("");
    setFormPhone("");
    setFormDate("");
    setFormStatus("Pending");
    setFormItems([{ product: "", packSize: "12x1 pack", quantity: 1, price: 0, total: 0 }]);
  };

  const resetProductForm = () => {
    setEditingProduct(null);
    setProdName("");
    setProdVariant("");
    setProdColor("white");
    setProdTag("");
    setProdMinQty("");
    setProdImage("");
  };

  const handleAddOrEditProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName || !prodVariant) {
      alert("Product name and pack details are required.");
      return;
    }

    const updatedProduct: Product = {
      id: editingProduct ? editingProduct.id : "prod_" + Date.now(),
      name: prodName,
      variant: prodVariant,
      color: prodColor,
      image: prodImage || (prodColor === "yellow" ? PRODUCTS[2].image : PRODUCTS[0].image),
      tag: prodTag || "Edible chuna product",
      minQuantity: prodMinQty ? Number(prodMinQty) : undefined,
    };

    let newProductsList: Product[];
    if (editingProduct) {
      newProductsList = products.map((p) => (p.id === editingProduct.id ? updatedProduct : p));
      toast.success("Product updated successfully!");
    } else {
      newProductsList = [updatedProduct, ...products];
      toast.success("New product added successfully!");
    }

    saveProducts(newProductsList);
    
    setShowAddProductModal(false);
    resetProductForm();
  };

  const handleEditProductClick = (product: Product) => {
    setEditingProduct(product);
    setProdName(product.name);
    setProdVariant(product.variant);
    setProdColor(product.color);
    setProdTag(product.tag);
    setProdMinQty(product.minQuantity ? String(product.minQuantity) : "");
    setProdImage(product.image);
    setShowAddProductModal(true);
  };

  const handleDeleteProduct = (id: string) => {
    setDeleteProductConfirm(id);
  };

  // Gallery Management helpers
  const saveGallery = (newGallery: GallerySlide[]) => {
    galleryMutation.mutate(newGallery);
  };

  const resetSlideForm = () => {
    setEditingSlide(null);
    setSlideImg("");
    setSlideType("image");
    setSlideEnTitle("");
    setSlideGuTitle("");
    setSlideHiTitle("");
    setSlideEnDesc("");
    setSlideGuDesc("");
    setSlideHiDesc("");
  };

  const handleAddOrEditSlide = (e: React.FormEvent) => {
    e.preventDefault();
    if (!slideImg || !slideEnTitle) {
      alert("Media and English title are required.");
      return;
    }

    const updatedSlide: GallerySlide = {
      id: editingSlide ? editingSlide.id : "slide_" + Date.now(),
      img: slideImg,
      type: slideType,
      title: {
        en: slideEnTitle,
        gu: slideGuTitle || slideEnTitle,
        hi: slideHiTitle || slideEnTitle,
      },
      desc: {
        en: slideEnDesc,
        gu: slideGuDesc || slideEnDesc,
        hi: slideHiDesc || slideEnDesc,
      }
    };

    let newGalleryList: GallerySlide[];
    if (editingSlide) {
      newGalleryList = gallery.map((s) => (s.id === editingSlide.id ? updatedSlide : s));
      toast.success("Gallery slide updated successfully!");
    } else {
      newGalleryList = [...gallery, updatedSlide];
      toast.success("New gallery slide added successfully!");
    }

    saveGallery(newGalleryList);
    setShowAddSlideModal(false);
    resetSlideForm();
  };

  const handleEditSlideClick = (slide: GallerySlide) => {
    setEditingSlide(slide);
    setSlideImg(slide.img);
    setSlideType(slide.type || "image");
    setSlideEnTitle(slide.title.en);
    setSlideGuTitle(slide.title.gu);
    setSlideHiTitle(slide.title.hi);
    setSlideEnDesc(slide.desc.en);
    setSlideGuDesc(slide.desc.gu);
    setSlideHiDesc(slide.desc.hi);
    setShowAddSlideModal(true);
  };

  const handleDeleteSlideClick = (id: string) => {
    setDeleteSlideConfirm(id);
  };

  // Excel CSV exporter
  const handleExportExcelCSV = () => {
    try {
      if (sales.length === 0) {
        toast.error("No sales records available to export.");
        return;
      }

      toast.info("Preparing Excel export...");

      let csvContent = "\uFEFF"; // Add BOM for Excel encoding
      csvContent += "Date,Invoice No,Customer/Company,Product,Pack Size,Quantity (Boxes),Price per Pack (INR),Total Price (INR),Grand Total Invoice (INR),Status\n";

      sales.forEach((sale) => {
        const idStr = String(sale.id || "");
        const invoiceNo = `INV-2026-${idStr.replace("s_", "")}`;
        
        const items = sale.items || [];
        items.forEach((item, index) => {
          const row = [
            `"${(sale.date || "").replace(/"/g, '""')}"`,
            `"${invoiceNo.replace(/"/g, '""')}"`,
            `"${(sale.company || "").replace(/"/g, '""')}"`,
            `"${(item.product || "").replace(/"/g, '""')}"`,
            `"${(item.packSize || "").replace(/"/g, '""')}"`,
            item.quantity || 0,
            item.price || 0,
            item.total || 0,
            index === 0 ? (sale.revenue || 0) : "",
            `"${(sale.status || "").replace(/"/g, '""')}"`,
          ].join(",");
          csvContent += row + "\n";
        });
      });

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `KHODIYAR_GRUH_UDHYOG_Sales_Registry_${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 1000);
      
      toast.success("Excel sheet exported successfully!");
    } catch (error: any) {
      console.error("Excel export error:", error);
      toast.error("Failed to export Excel file: " + (error?.message || "Unknown error"));
    }
  };

  // Filter sales by timeRange first
  const statsSales = sales.filter((s) => {
    if (timeRange === "all") return true;
    const saleDate = new Date(s.date);
    const baselineDate = new Date("2026-06-21");
    const diffTime = baselineDate.getTime() - saleDate.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
    if (timeRange === "7days") return diffDays >= 0 && diffDays <= 7;
    if (timeRange === "30days") return diffDays >= 0 && diffDays <= 30;
    return true;
  });

  // Calculate metrics
  const totalSales = statsSales.reduce((acc, curr) => acc + curr.revenue, 0);
  const doneSales = statsSales.filter((s) => s.status === "Done").reduce((acc, curr) => acc + curr.revenue, 0);
  const pendingSales = statsSales.filter((s) => s.status === "Pending").reduce((acc, curr) => acc + curr.revenue, 0);
  const totalOrders = statsSales.length;
  const completedOrders = statsSales.filter((s) => s.status === "Done").length;
  const pendingOrders = statsSales.filter((s) => s.status === "Pending").length;
  const totalQuantity = statsSales.reduce(
    (acc, curr) => acc + curr.items.reduce((sum, item) => sum + item.quantity, 0),
    0
  );

  // Group sales by month for the Growth Chart (Monthly Growth)
  const calculateMonthlyGrowthData = () => {
    const monthlyMap: Record<string, { monthKey: string; revenue: number; timestamp: number }> = {};
    
    statsSales.forEach((s) => {
      const dateObj = new Date(s.date);
      const monthLabel = dateObj.toLocaleDateString("en-IN", {
        month: "short",
        year: "numeric"
      });
      const monthKey = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, "0")}`;
      
      if (!monthlyMap[monthKey]) {
        monthlyMap[monthKey] = {
          monthKey: monthLabel,
          revenue: 0,
          timestamp: new Date(dateObj.getFullYear(), dateObj.getMonth(), 1).getTime()
        };
      }
      monthlyMap[monthKey].revenue += s.revenue;
    });

    const sortedMonths = Object.values(monthlyMap).sort((a, b) => a.timestamp - b.timestamp);

    let cumulative = 0;
    return sortedMonths.map((m) => {
      cumulative += m.revenue;
      return {
        date: m.monthKey,
        revenue: m.revenue,
        cumulative: cumulative
      };
    });
  };

  const growthData = calculateMonthlyGrowthData();

  // Done vs Pending Pie Chart Data
  const statusPieData = [
    { name: t("admin.completed"), value: completedOrders, color: "#15803d" }, // green-700
    { name: t("admin.pendingLegend"), value: pendingOrders, color: "#d97706" }, // amber-600
  ];

  // Brand sales breakdown (Tirth vs Riddhi Siddhi)
  const brandBreakdown = statsSales.reduce(
    (acc: { [key: string]: number }, curr) => {
      curr.items.forEach((item) => {
        const brand = item.product.startsWith("Tirth") ? "Tirth Brand" : "Riddhi Siddhi";
        acc[brand] = (acc[brand] || 0) + item.total;
      });
      return acc;
    },
    { "Tirth Brand": 0, "Riddhi Siddhi": 0 }
  );

  const brandChartData = Object.keys(brandBreakdown).map((key) => ({
    name: key,
    revenue: brandBreakdown[key],
  }));

  // Filtering list
  const filteredSales = sales.filter((s) => {
    const matchesStatus = filterStatus === "All" || s.status === filterStatus;
    const matchesSearch =
      s.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.items.some((item) => item.product.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  // Calculate customer reorder reminders
  const calculateReorderReminders = () => {
    const customerMap: Record<string, { lastDate: string; phone?: string; product: string }> = {};
    
    sales.forEach((s) => {
      const existing = customerMap[s.company];
      if (!existing || new Date(s.date) > new Date(existing.lastDate)) {
        const mainProduct = s.items[0]?.product || "Edible Chuna";
        customerMap[s.company] = {
          lastDate: s.date,
          phone: s.phone,
          product: mainProduct
        };
      }
    });

    const reminders: { company: string; lastDate: string; daysAgo: number; phone: string; product: string }[] = [];
    const now = new Date();

    Object.entries(customerMap).forEach(([company, info]) => {
      const lastOrderDate = new Date(info.lastDate);
      const diffTime = Math.abs(now.getTime() - lastOrderDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays >= 30) {
        reminders.push({
          company,
          lastDate: info.lastDate,
          daysAgo: diffDays,
          phone: info.phone || "919998421346", // Fallback number
          product: info.product
        });
      }
    });

    return reminders.sort((a, b) => b.daysAgo - a.daysAgo);
  };

  const reorderReminders = calculateReorderReminders();

  const handleSendReminderMessage = (reminder: { company: string; lastDate: string; daysAgo: number; phone: string; product: string }) => {
    const text = `Hello ${reminder.company}, this is Sanjay Patel from KHODIYAR GRUH UDHYOG. We noticed it has been ${reminder.daysAgo} days since your last order of ${reminder.product}. Would you like to review your stock and place a new bulk order?`;
    const cleanPhone = reminder.phone.replace(/[^0-9]/g, "");
    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  if (!isAuthenticated) {
    return (
      <SiteLayout>
        <div className="min-h-[70vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-secondary/30 via-background to-secondary/20">
          <div className="max-w-md w-full space-y-8 p-8 rounded-3xl border border-border/80 bg-card/60 backdrop-blur-xl shadow-2xl relative overflow-hidden animate-scale-in">
            {/* Background design elements */}
            <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-brand-gold/10 blur-2xl" />
            <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-brand-blue/10 blur-2xl" />
            
            <div className="relative space-y-6">
              <div className="text-center">
                <div className="mx-auto h-12 w-12 rounded-2xl bg-gradient-to-br from-brand-gold to-brand-blue flex items-center justify-center text-white shadow-lg">
                  <Lock className="h-6 w-6" />
                </div>
                <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-foreground">
                  {t("admin.loginTitle")}
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  {t("admin.loginSubtitle")}
                </p>
              </div>

              {loginError && (
                <div className="p-3.5 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-semibold text-center flex items-center justify-center gap-2 animate-pulse">
                  <span className="h-2 w-2 rounded-full bg-destructive" />
                  {loginError}
                </div>
              )}

              <form onSubmit={handleLogin} className="mt-8 space-y-4">
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                      {t("admin.usernameLabel")}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground/60">
                        <User className="h-4 w-4" />
                      </div>
                      <input
                        type="text"
                        required
                        value={usernameInput}
                        onChange={(e) => setUsernameInput(e.target.value)}
                        placeholder={t("admin.usernamePlaceholder")}
                        className="block w-full pl-10 pr-3 py-2.5 text-sm rounded-xl border border-border focus:outline-none focus:border-brand-gold/60 bg-background/50 focus:bg-background transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                      {t("admin.passwordLabel")}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground/60">
                        <Lock className="h-4 w-4" />
                      </div>
                      <input
                        type="password"
                        required
                        value={passwordInput}
                        onChange={(e) => setPasswordInput(e.target.value)}
                        placeholder={t("admin.passwordPlaceholder")}
                        className="block w-full pl-10 pr-3 py-2.5 text-sm rounded-xl border border-border focus:outline-none focus:border-brand-gold/60 bg-background/50 focus:bg-background transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded border-border text-brand-gold focus:ring-brand-gold/40 h-4 w-4 accent-brand-gold"
                    />
                    <span className="text-xs text-muted-foreground font-medium">
                      {t("admin.rememberMe")}
                    </span>
                  </label>
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    className="w-full bg-primary hover:bg-brand-blue text-primary-foreground font-semibold py-2.5 rounded-xl shadow-lg hover:shadow-brand-blue/10 transition-all flex items-center justify-center gap-2"
                  >
                    <span>{t("admin.loginButton")}</span>
                  </Button>
                </div>
              </form>

              {/* Language Selection */}
              <div className="pt-6 border-t border-border/50">
                <div className="flex gap-2 justify-center">
                  <button
                    type="button"
                    onClick={() => setLanguage("en")}
                    className={`px-3 py-1.5 text-[11px] font-bold rounded-lg transition-colors border ${
                      language === "en"
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background text-muted-foreground border-border hover:bg-secondary/40"
                    }`}
                  >
                    English
                  </button>
                  <button
                    type="button"
                    onClick={() => setLanguage("gu")}
                    className={`px-3 py-1.5 text-[11px] font-bold rounded-lg transition-colors border ${
                      language === "gu"
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background text-muted-foreground border-border hover:bg-secondary/40"
                    }`}
                  >
                    ગુજરાતી
                  </button>
                  <button
                    type="button"
                    onClick={() => setLanguage("hi")}
                    className={`px-3 py-1.5 text-[11px] font-bold rounded-lg transition-colors border ${
                      language === "hi"
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background text-muted-foreground border-border hover:bg-secondary/40"
                    }`}
                  >
                    हिन्दी
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SiteLayout>
    );
  }

  const handlePrint = () => {
    const printContent = document.getElementById("print-invoice-area");
    if (!printContent) return;

    try {
      const printWindow = window.open("", "_blank");
      if (!printWindow) {
        window.print();
        return;
      }

      let stylesHtml = "";
      document.querySelectorAll("style, link[rel='stylesheet']").forEach((el) => {
        stylesHtml += el.outerHTML;
      });

      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Invoice - KHODIYAR GRUH UDHYOG</title>
            ${stylesHtml}
            <style>
              body {
                background: white !important;
                color: black !important;
                padding: 20px !important;
                margin: 0 !important;
              }
              .print-hidden, button, .absolute.top-4.right-4 {
                display: none !important;
              }
              #print-invoice-area {
                border: none !important;
                box-shadow: none !important;
                width: 100% !important;
                max-width: 100% !important;
                margin: 0 !important;
                padding: 0 !important;
              }
            </style>
          </head>
          <body>
            <div>
              ${printContent.innerHTML}
            </div>
            <script>
              window.onload = function() {
                setTimeout(function() {
                  window.print();
                  setTimeout(function() {
                    window.close();
                  }, 500);
                }, 500);
              };
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    } catch (e) {
      window.print();
    }
  };

  return (
    <SiteLayout>
      <section className="bg-secondary/40 py-12 border-b border-border/60 print:hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <SectionHeading
            align="left"
            eyebrow={t("admin.operationsPortal")}
            title={
              <span>
                {t("admin.salesPerformance")} <span className="text-brand-blue">{t("admin.adminLabel")}</span>
              </span>
            }
            description={t("admin.manageDescription")}
          />
          <div className="flex flex-wrap gap-3 self-start md:self-center">
            <Button
              onClick={handleExportExcelCSV}
              variant="outline"
              className="border-emerald-600 text-emerald-800 hover:bg-emerald-50 shadow-sm font-semibold flex items-center gap-1.5"
            >
              <FileSpreadsheet className="h-4 w-4" /> {t("admin.exportExcel")}
            </Button>
            <Button
              onClick={() => {
                setFormItems([{ product: "", packSize: "12x1 pack", quantity: 1, price: 0, total: 0 }]);
                setShowAddModal(true);
              }}
              className="bg-primary text-primary-foreground hover:bg-brand-blue shadow-md font-semibold"
            >
              <Plus className="mr-2 h-5 w-5" /> {t("admin.addOfflineBill")}
            </Button>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="border-destructive/40 text-destructive hover:bg-destructive/5 hover:text-destructive shadow-sm font-semibold flex items-center gap-1.5"
            >
              <LogOut className="h-4 w-4" /> {t("admin.logoutButton")}
            </Button>
          </div>
        </div>
      </section>

      <section className="py-12 bg-background print:hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          {/* Dashboard Tabs */}
          <div className="flex border-b border-border/80 mb-8 gap-6">
            <button
              onClick={() => setActiveTab("sales")}
              className={`pb-3 text-sm font-bold border-b-2 px-2 transition-all relative ${
                activeTab === "sales"
                  ? "border-brand-blue text-brand-blue"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {t("admin.registryAnalytics")}
            </button>
            <button
              onClick={() => setActiveTab("products")}
              className={`pb-3 text-sm font-bold border-b-2 px-2 transition-all relative ${
                activeTab === "products"
                  ? "border-brand-blue text-brand-blue"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {t("admin.manageCatalog")}
            </button>
             <button
              onClick={() => setActiveTab("gallery")}
              className={`pb-3 text-sm font-bold border-b-2 px-2 transition-all relative ${
                activeTab === "gallery"
                  ? "border-brand-blue text-brand-blue"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {t("admin.manageGallery")}
            </button>
            <button
              onClick={() => setActiveTab("feedbacks")}
              className={`pb-3 text-sm font-bold border-b-2 px-2 transition-all relative ${
                activeTab === "feedbacks"
                  ? "border-brand-blue text-brand-blue"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {language === "gu" ? "ગ્રાહક પ્રતિસાદ" : language === "hi" ? "ग्राहक समीक्षा" : "Customer Reviews"}
            </button>
            <button
              onClick={() => setActiveTab("customers")}
              className={`pb-3 text-sm font-bold border-b-2 px-2 transition-all relative ${
                activeTab === "customers"
                  ? "border-brand-blue text-brand-blue"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {language === "gu" ? "ગ્રાહકોની સૂચિ" : language === "hi" ? "ग्राहक सूची" : "Customers Directory"}
            </button>
          </div>

          {activeTab === "sales" ? (
            <>
              {/* Time Range Selector */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 bg-card border border-border/80 p-4 rounded-3xl shadow-sm">
                <div>
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5">
                    <Filter className="h-4 w-4 text-brand-blue" />
                    {t("admin.timeRangeLabel")}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Filter analytics dashboard by dispatch date
                  </p>
                </div>
                <div className="flex items-center gap-1 bg-secondary/50 p-1 rounded-2xl border border-border/60 w-fit">
                  <button
                    onClick={() => setTimeRange("7days")}
                    className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                      timeRange === "7days"
                        ? "bg-background text-brand-blue shadow-sm border border-border/30"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {t("admin.last7Days")}
                  </button>
                  <button
                    onClick={() => setTimeRange("30days")}
                    className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                      timeRange === "30days"
                        ? "bg-background text-brand-blue shadow-sm border border-border/30"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {t("admin.last30Days")}
                  </button>
                  <button
                    onClick={() => setTimeRange("all")}
                    className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                      timeRange === "all"
                        ? "bg-background text-brand-blue shadow-sm border border-border/30"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {t("admin.allTime")}
                  </button>
                </div>
              </div>

              {/* STATS CARDS */}
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {/* Card 1: Total Revenue */}
                <div className="relative overflow-hidden rounded-3xl border border-border bg-card/70 p-6 shadow-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-md flex items-center justify-between group">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-gold to-yellow-500" />
                  <div>
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">{t("admin.totalRevenue")}</span>
                    <span className="text-3xl font-black text-foreground mt-1.5 block tracking-tight group-hover:text-brand-blue transition-colors">
                      ₹{totalSales.toLocaleString("en-IN")}
                    </span>
                    <span className="text-[10px] text-emerald-600 font-semibold mt-2 inline-flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" /> {t("admin.healthyPipeline")}
                    </span>
                  </div>
                  <div className="h-12 w-12 rounded-2xl bg-brand-gold/10 text-brand-gold flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                    <Coins className="h-6 w-6" />
                  </div>
                </div>

                {/* Card 2: Completed Orders */}
                <div className="relative overflow-hidden rounded-3xl border border-border bg-card/70 p-6 shadow-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-md flex items-center justify-between group">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-emerald-600" />
                  <div>
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">{t("admin.completedOrders")}</span>
                    <span className="text-3xl font-black text-foreground mt-1.5 block tracking-tight group-hover:text-emerald-700 transition-colors">
                      {completedOrders} <span className="text-sm font-normal text-muted-foreground">/ {totalOrders}</span>
                    </span>
                    <span className="text-[10px] text-muted-foreground mt-2 block">
                      ₹{doneSales.toLocaleString("en-IN")} {t("admin.totalValue")}
                    </span>
                  </div>
                  <div className="h-12 w-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                </div>

                {/* Card 3: Pending Orders */}
                <div className="relative overflow-hidden rounded-3xl border border-border bg-card/70 p-6 shadow-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-md flex items-center justify-between group">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 to-orange-600" />
                  <div>
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">{t("admin.pendingOrders")}</span>
                    <span className="text-3xl font-black text-foreground mt-1.5 block tracking-tight group-hover:text-amber-600 transition-colors">
                      {pendingOrders} <span className="text-sm font-normal text-muted-foreground">/ {totalOrders}</span>
                    </span>
                    <span className="text-[10px] text-amber-600 font-medium mt-2 block">
                      ₹{pendingSales.toLocaleString("en-IN")} {t("admin.pendingCollection")}
                    </span>
                  </div>
                  <div className="h-12 w-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                    <Clock className="h-6 w-6" />
                  </div>
                </div>

                {/* Card 4: Total Volume Sold */}
                <div className="relative overflow-hidden rounded-3xl border border-border bg-card/70 p-6 shadow-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-md flex items-center justify-between group">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-blue to-cyan-600" />
                  <div>
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">{t("admin.totalVolumeSold")}</span>
                    <span className="text-3xl font-black text-foreground mt-1.5 block tracking-tight group-hover:text-brand-blue transition-colors">
                      {totalQuantity} <span className="text-sm font-normal text-muted-foreground">{t("admin.parcels")}</span>
                    </span>
                    <span className="text-[10px] text-muted-foreground mt-2 block">
                      {t("admin.acrossBrands")}
                    </span>
                  </div>
                  <div className="h-12 w-12 rounded-2xl bg-brand-blue/10 text-brand-blue flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                    <Package className="h-6 w-6" />
                  </div>
                </div>
              </div>

          {/* CHARTS CONTAINER */}
          {mounted ? (
            <div className="mt-12 grid gap-6 lg:grid-cols-3">
              {/* Line/Area Growth Chart */}
              <div className="lg:col-span-2 rounded-3xl border border-border bg-card p-6 shadow-sm flex flex-col justify-between transition-all duration-300 hover:shadow-md">
                <div>
                  <h3 className="text-lg font-bold text-foreground">{t("admin.cumulativeGrowth")}</h3>
                  <p className="text-xs text-muted-foreground">{t("admin.growthDescription")}</p>
                </div>
                <div className="h-72 w-full mt-6">
                  {growthData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={growthData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorCumulative" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="var(--brand-blue)" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="var(--brand-blue)" stopOpacity={0.01} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="oklch(0.92 0.01 255)" />
                        <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="oklch(0.5 0.03 260)" />
                        <YAxis tickFormatter={(val) => `₹${val / 1000}k`} tick={{ fontSize: 10 }} stroke="oklch(0.5 0.03 260)" />
                        <Tooltip content={<CustomChartTooltip />} />
                        <Area
                          type="monotone"
                          dataKey="cumulative"
                          name={t("admin.totalRevenue")}
                          stroke="var(--brand-blue)"
                          strokeWidth={2.5}
                          fillOpacity={1}
                          fill="url(#colorCumulative)"
                        />
                        <Area
                          type="monotone"
                          dataKey="revenue"
                          name="Monthly Revenue"
                          stroke="var(--brand-gold)"
                          strokeWidth={1.5}
                          fillOpacity={0}
                          strokeDasharray="4 4"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center text-sm text-muted-foreground">
                      {t("admin.noSalesData")}
                    </div>
                  )}
                </div>
              </div>

              {/* Pie Chart & Bar Chart Stack */}
              <div className="grid gap-6 lg:col-span-1">
                {/* Done vs Pending Pie */}
                <div className="rounded-3xl border border-border bg-card p-6 shadow-sm flex flex-col justify-between transition-all duration-300 hover:shadow-md">
                  <div>
                    <h3 className="text-lg font-bold text-foreground">{t("admin.orderStatusRatio")}</h3>
                    <p className="text-xs text-muted-foreground">{t("admin.completedPendingDesc")}</p>
                  </div>
                  <div className="h-44 w-full relative flex items-center justify-center mt-4">
                    {totalOrders > 0 ? (
                      <>
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Tooltip content={<CustomChartTooltip />} />
                            <Pie
                              data={statusPieData}
                              cx="50%"
                              cy="50%"
                              innerRadius={50}
                              outerRadius={65}
                              paddingAngle={4}
                              dataKey="value"
                            >
                              {statusPieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                          </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute text-center pointer-events-none select-none">
                          <span className="text-2xl font-black text-foreground block">
                            {Math.round((completedOrders / (totalOrders || 1)) * 100)}%
                          </span>
                          <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">
                            {t("admin.completed")}
                          </span>
                        </div>
                      </>
                    ) : (
                      <span className="text-sm text-muted-foreground">{t("admin.noDataAvailable")}</span>
                    )}
                  </div>
                  <div className="flex justify-center gap-6 mt-2 text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-full bg-emerald-700 block" />
                      <span className="text-muted-foreground">{t("admin.doneLegend")} ({completedOrders})</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-full bg-amber-600 block" />
                      <span className="text-muted-foreground">{t("admin.pendingLegend")} ({pendingOrders})</span>
                    </div>
                  </div>
                </div>

                {/* Brand breakdown bar chart */}
                <div className="rounded-3xl border border-border bg-card p-6 shadow-sm flex flex-col justify-between transition-all duration-300 hover:shadow-md">
                  <div>
                    <h3 className="text-base font-bold text-foreground">{t("admin.revenueByBrand")}</h3>
                    <p className="text-xs text-muted-foreground">{t("admin.brandPerformanceDesc")}</p>
                  </div>
                  <div className="h-32 w-full mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={brandChartData} layout="vertical" margin={{ left: -10, right: 10 }}>
                        <defs>
                          <linearGradient id="colorBrandGold" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#b45309" stopOpacity={0.8} />
                            <stop offset="100%" stopColor="var(--brand-gold)" stopOpacity={1} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="oklch(0.92 0.01 255)" />
                        <XAxis type="number" tickFormatter={(val) => `₹${val / 1000}k`} tick={{ fontSize: 10 }} stroke="oklch(0.5 0.03 260)" />
                        <YAxis dataKey="name" type="category" tick={{ fontSize: 10 }} width={80} stroke="oklch(0.5 0.03 260)" />
                        <Tooltip content={<CustomChartTooltip />} />
                        <Bar dataKey="revenue" name={t("admin.totalRevenue")} fill="url(#colorBrandGold)" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-96 w-full flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          )}

          {/* REORDER REMINDERS WIDGET */}
          {activeTab === "sales" && reorderReminders.length > 0 && (
            <div className="mt-12 rounded-3xl border border-border bg-card p-6 shadow-sm flex flex-col justify-between transition-all duration-300 hover:shadow-md animate-fade-in">
              <div>
                <h3 className="text-lg font-bold text-foreground flex items-center gap-1.5">
                  <Clock className="h-5 w-5 text-amber-500 animate-pulse" />
                  Reorder Reminders Due
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  These wholesale customers have not ordered in the last 30+ days. Prompt them to refill their stock.
                </p>
              </div>
              
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {reorderReminders.map((reminder) => (
                  <div 
                    key={reminder.company}
                    className="rounded-2xl border border-amber-200/50 bg-amber-50/20 dark:bg-amber-950/5 p-4 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex justify-between items-start">
                        <span className="text-xs font-bold text-foreground truncate max-w-[70%]">{reminder.company}</span>
                        <span className="inline-flex items-center rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-800 border border-amber-200/40">
                          {reminder.daysAgo} days ago
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-2">
                        Last order: <span className="font-semibold">{reminder.lastDate}</span> ({reminder.product})
                      </p>
                    </div>
                    
                    <Button
                      onClick={() => handleSendReminderMessage(reminder)}
                      className="mt-4 w-full bg-whatsapp text-white hover:bg-whatsapp/90 font-semibold text-xs h-8 rounded-xl"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="mr-1.5 h-3.5 w-3.5">
                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.262 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.458L0 24zm6.59-4.846c1.666.988 3.307 1.493 5.352 1.494 5.518 0 10.005-4.486 10.008-10.007.002-2.673-1.03-5.188-2.908-7.067C17.16 1.7 14.654.655 11.994.655 6.476.655 1.99 5.14 1.987 10.66c-.001 2.055.508 3.707 1.503 5.385l-.988 3.606 3.701-.971z" />
                      </svg>
                      Send WhatsApp Reminder
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CRUD TRANSACTIONS TABLE */}
          <div className="mt-12 rounded-3xl border border-border bg-card shadow-sm overflow-hidden">
            <div className="p-6 border-b border-border bg-secondary/15 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-foreground">{t("admin.salesRegistry")}</h3>
                <p className="text-xs text-muted-foreground">{t("admin.manageLogs")}</p>
              </div>

              {/* FILTER / SEARCH */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                  <input
                    type="text"
                    placeholder={t("admin.searchPlaceholder")}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="h-9 rounded-lg border border-border bg-background pl-3 pr-8 text-xs focus:outline-none focus:border-brand-gold/60 w-48 sm:w-56"
                  />
                </div>

                <div className="flex items-center border border-border rounded-lg bg-background overflow-hidden h-9">
                  <div className="px-2 text-muted-foreground border-r border-border h-full flex items-center bg-secondary/35">
                    <Filter className="h-3.5 w-3.5" />
                  </div>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value as any)}
                    className="text-xs px-2 h-full focus:outline-none bg-transparent"
                  >
                    <option value="All">{t("admin.allStatuses")}</option>
                    <option value="Done">{t("admin.completedOnly")}</option>
                    <option value="Pending">{t("admin.pendingOnly")}</option>
                  </select>
                </div>
              </div>
            </div>

            {/* TABLE */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-border bg-secondary/5 font-semibold text-muted-foreground text-xs uppercase tracking-wider">
                    <th className="p-4">{t("admin.date")}</th>
                    <th className="p-4">{t("admin.companyName")}</th>
                    <th className="p-4">{t("admin.productDetails")}</th>
                    <th className="p-4 text-center">{t("admin.packSize")}</th>
                    <th className="p-4 text-right">{t("admin.quantity")}</th>
                    <th className="p-4 text-right">{t("admin.totalRevenue")}</th>
                    <th className="p-4 text-center">{t("admin.status")}</th>
                    <th className="p-4 text-center">{t("admin.actions")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {filteredSales.length > 0 ? (
                    filteredSales.map((s) => (
                      <tr key={s.id} className="hover:bg-secondary/15 transition-colors">
                        <td className="p-4 text-xs whitespace-nowrap text-muted-foreground">{s.date}</td>
                        <td className="p-4 font-bold text-foreground">{s.company}</td>
                        <td className="p-4 text-xs text-muted-foreground">
                          <div className="space-y-1">
                            {s.items.map((item, index) => (
                              <div key={index} className="font-semibold text-foreground">
                                {item.product}
                              </div>
                            ))}
                          </div>
                        </td>
                        <td className="p-4 text-center text-xs whitespace-nowrap">
                          <div className="space-y-1">
                            {s.items.map((item, index) => (
                              <div key={index} className="inline-block px-1.5 py-0.5 rounded border border-border bg-secondary/5 block">
                                {item.packSize}
                              </div>
                            ))}
                          </div>
                        </td>
                        <td className="p-4 text-right font-medium text-xs">
                          <div className="space-y-1">
                            {s.items.map((item, index) => (
                              <div key={index}>{item.quantity}</div>
                            ))}
                            {s.items.length > 1 && (
                              <div className="border-t border-border pt-1 font-black text-foreground text-[11px]">
                                {s.items.reduce((sum, item) => sum + item.quantity, 0)}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="p-4 text-right font-bold text-foreground">
                          ₹{s.revenue.toLocaleString("en-IN")}
                        </td>
                        <td className="p-4 text-center">
                          <button
                            onClick={() => handleToggleStatus(s.id)}
                            title="Click to toggle status"
                            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold select-none cursor-pointer transition-all hover:scale-105 active:scale-95 ${
                              s.status === "Done"
                                ? "bg-emerald-50 text-emerald-800 border border-emerald-200/50"
                                : "bg-amber-50 text-amber-800 border border-amber-200/50"
                            }`}
                          >
                            <span className={`h-1.5 w-1.5 rounded-full ${s.status === "Done" ? "bg-emerald-600" : "bg-amber-600"}`} />
                            {s.status === "Done" ? t("admin.paid") : t("admin.unpaid")}
                          </button>
                        </td>
                        <td className="p-4 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <Button
                              onClick={() => setActiveInvoice(s)}
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-brand-blue hover:bg-brand-blue/10 hover:text-brand-blue rounded-lg"
                              title={t("admin.printInvoice")}
                            >
                              <Printer className="h-4 w-4" />
                            </Button>
                            <Button
                              onClick={() => handleDelete(s.id)}
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive rounded-lg"
                              title={t("admin.delete")}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="p-8 text-center text-muted-foreground text-sm">
                        {t("admin.noRecords")}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : activeTab === "products" ? (
            /* PRODUCT CATALOG MANAGEMENT UI */
            <div className="mt-6 rounded-3xl border border-border bg-card shadow-sm overflow-hidden animate-fade-in">
              <div className="p-6 border-b border-border bg-secondary/15 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold text-foreground">{t("admin.catalogManagement")}</h3>
                  <p className="text-xs text-muted-foreground">{t("admin.catalogDesc")}</p>
                </div>
                <Button
                  onClick={() => {
                    resetProductForm();
                    setShowAddProductModal(true);
                  }}
                  className="bg-primary text-primary-foreground hover:bg-brand-blue shadow-md font-semibold self-start sm:self-center"
                >
                  <Plus className="mr-2 h-5 w-5" /> {t("admin.addNewProduct")}
                </Button>
              </div>

              {/* TABLE */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-border bg-secondary/5 font-semibold text-muted-foreground text-xs uppercase tracking-wider">
                      <th className="p-4 w-20">{t("admin.productImage")}</th>
                      <th className="p-4">{t("admin.productBrandName")}</th>
                      <th className="p-4">{t("admin.packDetails")}</th>
                      <th className="p-4 text-center">{t("admin.colorFamily")}</th>
                      <th className="p-4">{t("admin.taglineDesc")}</th>
                      <th className="p-4 text-center">{t("admin.defaultMinQty")}</th>
                      <th className="p-4 text-center">{t("admin.actions")}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {products.length > 0 ? (
                      products.map((p) => (
                        <tr key={p.id} className="hover:bg-secondary/15 transition-colors">
                          <td className="p-4">
                            <div className="h-12 w-12 rounded-xl overflow-hidden border border-border bg-secondary">
                              <img
                                src={p.image}
                                alt={p.name}
                                className="h-full w-full object-cover"
                              />
                            </div>
                          </td>
                          <td className="p-4 font-bold text-foreground">{p.name}</td>
                          <td className="p-4 text-xs font-semibold text-brand-blue">{p.variant}</td>
                          <td className="p-4 text-center">
                            <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider border ${
                              p.color === "yellow"
                                ? "bg-brand-gold-soft text-amber-900 border-brand-gold/30"
                                : p.color === "white"
                                ? "bg-secondary text-primary border-border"
                                : "bg-blue-50 text-blue-800 border-blue-200"
                            }`}>
                              {p.color === "yellow" ? t("catalog.colors.yellow") : p.color === "white" ? t("catalog.colors.white") : p.color}
                            </span>
                          </td>
                          <td className="p-4 text-xs text-muted-foreground max-w-xs truncate" title={p.tag}>{p.tag}</td>
                          <td className="p-4 text-center font-bold text-xs text-foreground">
                            {p.minQuantity !== undefined ? `${p.minQuantity} ${t("admin.parcels")}` : "None"}
                          </td>
                          <td className="p-4 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <Button
                                onClick={() => handleEditProductClick(p)}
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-brand-blue hover:bg-brand-blue/10 hover:text-brand-blue rounded-lg"
                                title={t("admin.editDetails")}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                </svg>
                              </Button>
                              <Button
                                onClick={() => handleDeleteProduct(p.id)}
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive rounded-lg"
                                title={t("admin.delete")}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-muted-foreground text-sm">
                          {t("admin.noRecords")}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : activeTab === "gallery" ? (
            /* GALLERY SLIDES MANAGEMENT UI */
            <div className="mt-6 rounded-3xl border border-border bg-card shadow-sm overflow-hidden animate-fade-in">
              <div className="p-6 border-b border-border bg-secondary/15 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold text-foreground">{t("admin.manageGallery")}</h3>
                  <p className="text-xs text-muted-foreground">Add, edit, or remove photos in the About page slideshow gallery.</p>
                </div>
                <Button
                  onClick={() => {
                    resetSlideForm();
                    setShowAddSlideModal(true);
                  }}
                  className="bg-primary text-primary-foreground hover:bg-brand-blue shadow-md font-semibold self-start sm:self-center"
                >
                  <Plus className="mr-2 h-5 w-5" /> {t("admin.addNewSlide")}
                </Button>
              </div>

              {/* TABLE */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-border bg-secondary/5 font-semibold text-muted-foreground text-xs uppercase tracking-wider">
                      <th className="p-4 w-20">Photo</th>
                      <th className="p-4">Title (English / translation)</th>
                      <th className="p-4">Description</th>
                      <th className="p-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {gallery.length > 0 ? (
                      gallery.map((slide) => (
                        <tr key={slide.id} className="hover:bg-secondary/15 transition-colors">
                          <td className="p-4">
                            <div className="h-12 w-16 rounded-xl overflow-hidden border border-border bg-secondary flex items-center justify-center">
                              {slide.type === "video" ? (
                                <video
                                  src={slide.img}
                                  className="h-full w-full object-cover"
                                  muted
                                  playsInline
                                />
                              ) : (
                                <img
                                  src={slide.img}
                                  alt="Slide"
                                  className="h-full w-full object-cover"
                                />
                              )}
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="font-bold text-foreground">{slide.title.en}</div>
                            <div className="text-[10px] text-muted-foreground space-y-0.5 mt-0.5">
                              <div>ગુજ: {slide.title.gu}</div>
                              <div>हिन्दी: {slide.title.hi}</div>
                            </div>
                          </td>
                          <td className="p-4 text-xs text-muted-foreground max-w-sm truncate" title={slide.desc.en}>
                            <div>{slide.desc.en}</div>
                            <div className="text-[10px] text-muted-foreground/75 space-y-0.5 mt-0.5">
                              <div>ગુજ: {slide.desc.gu}</div>
                              <div>हिन्दी: {slide.desc.hi}</div>
                            </div>
                          </td>
                          <td className="p-4 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <Button
                                onClick={() => handleEditSlideClick(slide)}
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-brand-blue hover:bg-brand-blue/10 hover:text-brand-blue rounded-lg"
                                title={t("admin.editDetails")}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                </svg>
                              </Button>
                              <Button
                                onClick={() => handleDeleteSlideClick(slide.id)}
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive rounded-lg"
                                title={t("admin.delete")}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="p-8 text-center text-muted-foreground text-sm">
                          {t("admin.noRecords")}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : activeTab === "feedbacks" ? (
            /* FEEDBACKS MANAGEMENT UI */
            <div className="mt-6 rounded-3xl border border-border bg-card shadow-sm overflow-hidden animate-fade-in">
              <div className="p-6 border-b border-border bg-secondary/15 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold text-foreground">
                    {language === "gu" ? "ગ્રાહક પ્રતિસાદ સંચાલન" : language === "hi" ? "ग्राहक प्रतिक्रिया प्रबंधन" : "Customer Feedback Management"}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {language === "gu" 
                      ? "વેબસાઇટ પર કઈ રેટિંગ અને સમીક્ષાઓ પ્રદર્શિત કરવી તે મંજૂર કરો અથવા છુપાવો." 
                      : language === "hi" 
                      ? "वेबसाइट पर कौन सी रेटिंग और समीक्षाएं प्रदर्शित करनी हैं उन्हें स्वीकृत या छुपाएं।" 
                      : "Approve or hide which ratings and reviews are displayed on the website homepage."}
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-border bg-secondary/5 font-semibold text-muted-foreground text-xs uppercase tracking-wider">
                      <th className="p-4 w-20">Rating</th>
                      <th className="p-4">Customer</th>
                      <th className="p-4">Review / Comment</th>
                      <th className="p-4 w-36 text-center">Status</th>
                      <th className="p-4 w-36 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {feedbacksList.length > 0 ? (
                      feedbacksList.map((fb) => (
                        <tr key={fb.id} className="hover:bg-secondary/15 transition-colors">
                          <td className="p-4">
                            <div className="flex items-center gap-0.5 text-brand-gold font-bold">
                              <span>{fb.rating}</span>
                              <Star className="h-3.5 w-3.5 fill-brand-gold text-brand-gold" />
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="font-bold text-foreground">{fb.name}</div>
                            <div className="text-[10px] text-muted-foreground mt-0.5">{fb.company}</div>
                          </td>
                          <td className="p-4 text-xs text-muted-foreground max-w-md break-words" title={fb.comment}>
                            <div>{fb.comment}</div>
                            {hasProfanity(fb.comment) && (
                              <div className="mt-1.5 inline-flex items-center gap-1 rounded bg-rose-50 px-2 py-0.5 text-[9px] font-bold text-rose-600 border border-rose-200 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900/30">
                                ⚠️ Review: Flagged Words Detected
                              </div>
                            )}
                          </td>
                          <td className="p-4 text-center">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                              fb.approved 
                                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 border border-emerald-200/50" 
                                : "bg-yellow-50 text-yellow-700 dark:bg-yellow-950/30 dark:text-yellow-400 border border-yellow-200/50"
                            }`}>
                              {fb.approved ? "Approved" : "Pending Approval"}
                            </span>
                          </td>
                          <td className="p-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <Button
                                onClick={() => handleToggleApproveFeedback(fb.id)}
                                variant="outline"
                                size="sm"
                                className="h-8 text-xs font-bold"
                              >
                                {fb.approved ? "Hide" : "Approve"}
                              </Button>
                              <Button
                                onClick={() => handleDeleteFeedback(fb.id)}
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive hover:bg-destructive/10 rounded-lg"
                                title="Delete Review"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-muted-foreground text-sm">
                          {t("admin.noRecords")}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            /* CUSTOMERS DIRECTORY PANEL */
            <div className="mt-6 rounded-3xl border border-border bg-card shadow-sm overflow-hidden animate-fade-in">
              <div className="p-6 border-b border-border bg-secondary/15 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold text-foreground">
                    {language === "gu" ? "ઑફલાઇન ગ્રાહક ડિરેક્ટરી" : language === "hi" ? "ऑफ़लाइन ग्राहक निर्देशिका" : "Offline Customers Directory"}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {language === "gu"
                      ? "તમારા ઑફલાઇન જથ્થાબંધ ગ્રાહકોની વિગતો મેનેજ કરો."
                      : language === "hi"
                      ? "अपने ऑफ़लाइन थोक ग्राहकों के विवरण प्रबंधित करें।"
                      : "Manage contact profiles for your offline wholesale distributors and paan-shop owners."}
                  </p>
                </div>
                <Button
                  onClick={() => setShowAddCustomerModal(true)}
                  className="bg-primary text-primary-foreground hover:bg-brand-blue shadow-md font-semibold self-start sm:self-center"
                >
                  <UserPlus className="mr-2 h-5 w-5" />
                  {language === "gu" ? "નવો ગ્રાહક ઉમેરો" : language === "hi" ? "नया ग्राहक जोड़ें" : "Add Offline Customer"}
                </Button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-border bg-secondary/5 font-semibold text-muted-foreground text-xs uppercase tracking-wider">
                      <th className="p-4">Customer Name</th>
                      <th className="p-4">Company / Shop</th>
                      <th className="p-4">WhatsApp Number</th>
                      <th className="p-4">Delivery Address</th>
                      <th className="p-4 w-28 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {customersList.length > 0 ? (
                      customersList.map((c) => (
                        <tr key={c.id} className="hover:bg-secondary/15 transition-colors">
                          <td className="p-4 font-bold text-foreground">{c.name}</td>
                          <td className="p-4 text-xs font-semibold text-muted-foreground">{c.company}</td>
                          <td className="p-4 text-xs font-bold text-brand-blue">
                            <a href={`https://wa.me/${c.phone.replace(/[^0-9]/g, "")}`} target="_blank" rel="noreferrer" className="hover:underline flex items-center gap-1">
                              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="h-3.5 w-3.5 text-whatsapp">
                                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.262 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.458L0 24zm6.59-4.846c1.666.988 3.307 1.493 5.352 1.494 5.518 0 10.005-4.486 10.008-10.007.002-2.673-1.03-5.188-2.908-7.067C17.16 1.7 14.654.655 11.994.655 6.476.655 1.99 5.14 1.987 10.66c-.001 2.055.508 3.707 1.503 5.385l-.988 3.606 3.701-.971z" />
                              </svg>
                              +{c.phone}
                            </a>
                          </td>
                          <td className="p-4 text-xs text-muted-foreground max-w-sm truncate" title={c.address}>
                            {c.address || "N/A"}
                          </td>
                          <td className="p-4 text-center">
                            <Button
                              onClick={() => handleDeleteCustomer(c.id)}
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:bg-destructive/10 rounded-lg"
                              title="Delete Customer Profile"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-muted-foreground text-sm">
                          {t("admin.noRecords")}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ADD SALE MODAL */}
      {showAddModal && (
        <div data-lenis-prevent className="fixed inset-0 z-50 flex items-center justify-center bg-primary-foreground/30 bg-black/40 backdrop-blur-sm p-4 overflow-y-auto animate-fade-in">
          <div className="bg-card w-full max-w-2xl rounded-3xl border border-border p-6 shadow-2xl relative max-h-[90vh] flex flex-col justify-between overflow-hidden animate-scale-in">
            <div>
              <h3 className="text-xl font-bold text-foreground">{t("admin.logBillTitle")}</h3>
              <p className="text-xs text-muted-foreground mt-0.5">{t("admin.logBillDesc")}</p>
            </div>

            <form data-lenis-prevent onSubmit={handleAddSale} className="mt-4 overflow-y-auto flex-1 pr-1 space-y-4 py-2">
              {/* SAVED CUSTOMER SELECT */}
              <div className="grid gap-1.5 bg-secondary/15 border border-border/60 p-3 rounded-2xl">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                  <User className="h-3.5 w-3.5 text-brand-blue" /> Choose Customer Profile (Optional Autofill)
                </label>
                <select
                  onChange={(e) => {
                    const selectedVal = e.target.value;
                    if (selectedVal === "custom") {
                      setFormCompany("");
                      setFormPhone("");
                    } else {
                      const selectedCust = customersList.find((c) => c.id === selectedVal);
                      if (selectedCust) {
                        setFormCompany(selectedCust.company);
                        setFormPhone(selectedCust.phone);
                      }
                    }
                  }}
                  className="h-10 rounded-lg border border-border px-3 text-sm focus:outline-none focus:border-brand-gold/60 bg-background"
                >
                  <option value="custom">-- Custom / Unsaved Entry --</option>
                  {customersList.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.company} ({c.name})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                <div className="grid gap-1.5">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                    <Building className="h-3 w-3" /> {t("admin.customerName")}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Paan Agency"
                    value={formCompany}
                    onChange={(e) => setFormCompany(e.target.value)}
                    className="h-10 rounded-lg border border-border px-3 text-sm focus:outline-none focus:border-brand-gold/60 bg-background"
                  />
                </div>

                <div className="grid gap-1.5">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-3 w-3 text-brand-blue">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.387a12.035 12.035 0 0 1-7.108-7.108c-.155-.44.01-.928.387-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                    </svg>
                    Phone / WhatsApp
                  </label>
                  <input
                    type="tel"
                    placeholder="e.g. 919998421346"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    className="h-10 rounded-lg border border-border px-3 text-sm focus:outline-none focus:border-brand-gold/60 bg-background"
                  />
                </div>

                <div className="grid gap-1.5">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> {t("admin.dispatchDate")}
                  </label>
                  <input
                    type="date"
                    required
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="h-10 rounded-lg border border-border px-3 text-sm focus:outline-none focus:border-brand-gold/60 bg-background"
                  />
                </div>
              </div>

              {/* PRODUCTS LIST */}
              <div className="border-t border-border pt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                    <Layers className="h-3.5 w-3.5" /> {t("admin.orderedProducts")}
                  </span>
                  <Button
                    type="button"
                    onClick={handleAddItemRow}
                    size="sm"
                    className="h-8 bg-brand-blue/10 text-brand-blue hover:bg-brand-blue/20 hover:text-brand-blue text-xs font-semibold"
                  >
                    <Plus className="mr-1 h-3.5 w-3.5" /> {t("admin.addProductBtn")}
                  </Button>
                </div>

                <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                  {formItems.map((item, idx) => (
                    <div key={idx} className="flex flex-col sm:flex-row gap-3 border border-border/80 bg-secondary/10 p-3 rounded-xl items-end relative">
                      <div className="flex-1 grid gap-1 w-full">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase">{t("admin.productDetails")}</label>
                        <select
                          required
                          value={item.product}
                          onChange={(e) => handleItemChange(idx, "product", e.target.value)}
                          className="h-9 rounded-lg border border-border px-2 text-xs focus:outline-none focus:border-brand-gold/60 bg-background w-full"
                        >
                          <option value="" disabled>{t("admin.selectProduct")}</option>
                          {products.map((p) => (
                            <option key={p.id} value={`${p.name} (${p.variant})`}>
                              {p.name} — {p.variant}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="grid gap-1 w-full sm:w-28">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase">{t("admin.packSize")}</label>
                        <select
                          value={item.packSize}
                          onChange={(e) => handleItemChange(idx, "packSize", e.target.value)}
                          className="h-9 rounded-lg border border-border px-2 text-xs focus:outline-none focus:border-brand-gold/60 bg-background w-full"
                        >
                          <option value="12x1 pack">12x1 Pack</option>
                          <option value="24x1 pack">24x1 Pack</option>
                        </select>
                      </div>

                      <div className="grid gap-1 w-full sm:w-16">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase">{t("admin.quantity")}</label>
                        <input
                          type="number"
                          required
                          min="1"
                          placeholder="e.g. 5"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(idx, "quantity", e.target.value)}
                          className="h-9 rounded-lg border border-border px-2 text-xs focus:outline-none focus:border-brand-gold/60 bg-background w-full"
                        />
                      </div>

                      <div className="grid gap-1 w-full sm:w-20">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase">{t("admin.pricePerBox")}</label>
                        <input
                          type="number"
                          required
                          min="1"
                          placeholder="e.g. 300"
                          value={item.price}
                          onChange={(e) => handleItemChange(idx, "price", e.target.value)}
                          className="h-9 rounded-lg border border-border px-2 text-xs focus:outline-none focus:border-brand-gold/60 bg-background w-full"
                        />
                      </div>

                      <div className="grid gap-1 w-full sm:w-24 text-right pr-2">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase block text-right">{t("admin.subtotalLabel")}</label>
                        <span className="h-9 flex items-center justify-end text-xs font-black text-foreground">
                          ₹{(item.total || 0).toLocaleString("en-IN")}
                        </span>
                      </div>

                      {formItems.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveItemRow(idx)}
                          className="h-9 w-9 border border-destructive/20 text-destructive hover:bg-destructive/10 rounded-lg flex items-center justify-center shrink-0 self-end"
                          title={t("admin.delete")}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* FOOTER ACTIONS */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-t border-border pt-4">
                <div className="flex gap-4 h-10 items-center">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{t("admin.status")}: </label>
                  <label className="flex items-center gap-1.5 cursor-pointer text-sm font-medium">
                    <input
                      type="radio"
                      name="status"
                      value="Pending"
                      checked={formStatus === "Pending"}
                      onChange={() => setFormStatus("Pending")}
                      className="accent-brand-blue"
                    />
                    {t("admin.pendingStatus")}
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer text-sm font-medium">
                    <input
                      type="radio"
                      name="status"
                      value="Done"
                      checked={formStatus === "Done"}
                      onChange={() => setFormStatus("Done")}
                      className="accent-brand-blue"
                    />
                    {t("admin.completedStatus")}
                  </label>
                </div>

                <div className="text-right">
                  <span className="text-xs font-semibold text-muted-foreground uppercase">{t("admin.grandTotal")}</span>
                  <span className="text-xl font-black text-foreground block">
                    ₹{formItems.reduce((sum, item) => sum + (item.total || 0), 0).toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddModal(false)}
                  className="font-medium"
                >
                  {t("admin.cancel")}
                </Button>
                <Button
                  type="submit"
                  className="bg-primary text-primary-foreground hover:bg-brand-blue font-semibold"
                >
                  {t("admin.saveBill")}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD CUSTOMER MODAL */}
      {showAddCustomerModal && (
        <div data-lenis-prevent className="fixed inset-0 z-50 flex items-center justify-center bg-primary-foreground/30 bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-card w-full max-w-md rounded-3xl border border-border p-6 shadow-2xl relative animate-scale-in">
            <button
              onClick={() => setShowAddCustomerModal(false)}
              className="absolute top-4 right-4 h-8 w-8 rounded-full border border-border hover:bg-secondary/40 text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors animate-fade-in"
            >
              <X className="h-4 w-4" />
            </button>

            <div>
              <h3 className="text-xl font-bold text-foreground">Add New Offline Customer</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Register a wholesale customer's contact details for easy dispatch logging.</p>
            </div>

            <form onSubmit={handleAddCustomer} className="mt-6 space-y-4">
              <div className="grid gap-1.5">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Contact / Owner Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Rameshbhai Patel"
                  value={custName}
                  onChange={(e) => setCustName(e.target.value)}
                  className="h-10 rounded-lg border border-border px-3 text-sm focus:outline-none focus:border-brand-gold/60 bg-background"
                />
              </div>

              <div className="grid gap-1.5">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Company / Shop Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Janta Paan Bhandar"
                  value={custCompany}
                  onChange={(e) => setCustCompany(e.target.value)}
                  className="h-10 rounded-lg border border-border px-3 text-sm focus:outline-none focus:border-brand-gold/60 bg-background"
                />
              </div>

              <div className="grid gap-1.5">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  WhatsApp Number *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 919998421346"
                  value={custPhone}
                  onChange={(e) => setCustPhone(e.target.value)}
                  className="h-10 rounded-lg border border-border px-3 text-sm focus:outline-none focus:border-brand-gold/60 bg-background"
                />
              </div>

              <div className="grid gap-1.5">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Delivery Address
                </label>
                <textarea
                  placeholder="e.g. Sector-11, Gandhinagar"
                  value={custAddress}
                  onChange={(e) => setCustAddress(e.target.value)}
                  rows={2}
                  className="rounded-lg border border-border p-3 text-sm focus:outline-none focus:border-brand-gold/60 bg-background resize-none"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-brand-blue text-primary-foreground font-semibold py-2.5 rounded-xl shadow-lg transition-colors flex items-center justify-center gap-1.5"
              >
                <Plus className="h-4 w-4" /> Save Customer Profile
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* ADD/EDIT PRODUCT MODAL */}
      {showAddProductModal && (
        <div data-lenis-prevent className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 overflow-y-auto animate-fade-in">
          <div className="bg-card w-full max-w-lg rounded-3xl border border-border p-6 shadow-2xl relative max-h-[95vh] flex flex-col justify-between overflow-hidden animate-scale-in">
            <div>
              <h3 className="text-xl font-bold text-foreground">
                {editingProduct ? t("admin.editProductTitle") : t("admin.addProductTitle")}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                {editingProduct ? t("admin.updateCatalogDesc") : t("admin.addNewProductDesc")}
              </p>
            </div>

            <form data-lenis-prevent onSubmit={handleAddOrEditProduct} className="mt-4 overflow-y-auto flex-1 pr-1 space-y-4 py-2">
              <div className="grid gap-4">
                
                {/* NAME */}
                <div className="grid gap-1.5">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    {t("admin.productBrandName")}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tirth Chuna Parcel"
                    value={prodName}
                    onChange={(e) => setProdName(e.target.value)}
                    className="h-10 rounded-lg border border-border px-3 text-sm focus:outline-none focus:border-brand-gold/60 bg-background"
                  />
                </div>

                {/* PACK SIZE / VARIANT */}
                <div className="grid gap-1.5">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    {t("admin.packDetails")}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Yellow — Ghata or 12x1 Pack"
                    value={prodVariant}
                    onChange={(e) => setProdVariant(e.target.value)}
                    className="h-10 rounded-lg border border-border px-3 text-sm focus:outline-none focus:border-brand-gold/60 bg-background"
                  />
                </div>

                {/* COLOR FAMILY & MIN QUANTITY */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="grid gap-1.5">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      {t("admin.colorFamily")}
                    </label>
                    <select
                      value={prodColor}
                      onChange={(e) => setProdColor(e.target.value)}
                      className="h-10 rounded-lg border border-border px-3 text-sm focus:outline-none focus:border-brand-gold/60 bg-background w-full"
                    >
                      <option value="white">{t("admin.whiteTirth")}</option>
                      <option value="yellow">{t("admin.yellowRiddhi")}</option>
                      <option value="other">Other / Custom</option>
                    </select>
                  </div>

                  <div className="grid gap-1.5">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      {t("admin.minWholesaleQty")}
                    </label>
                    <input
                      type="number"
                      min="1"
                      placeholder="e.g. 20 (Optional)"
                      value={prodMinQty}
                      onChange={(e) => setProdMinQty(e.target.value)}
                      className="h-10 rounded-lg border border-border px-3 text-sm focus:outline-none focus:border-brand-gold/60 bg-background"
                    />
                  </div>
                </div>

                {/* IF COLOR IS OTHER, TEXT INPUT */}
                {prodColor !== "white" && prodColor !== "yellow" && (
                  <div className="grid gap-1.5 animate-fade-in">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      Specify Custom Color Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Red, Multicolor"
                      value={prodColor === "other" ? "" : prodColor}
                      onChange={(e) => setProdColor(e.target.value)}
                      className="h-10 rounded-lg border border-border px-3 text-sm focus:outline-none focus:border-brand-gold/60 bg-background"
                    />
                  </div>
                )}

                {/* DESCRIPTION */}
                <div className="grid gap-1.5">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    {t("admin.taglineDesc")}
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Premium edible chuna for bulk wholesalers"
                    value={prodTag}
                    onChange={(e) => setProdTag(e.target.value)}
                    className="h-10 rounded-lg border border-border px-3 text-sm focus:outline-none focus:border-brand-gold/60 bg-background"
                  />
                </div>

                {/* PHOTO UPLOAD */}
                <div className="grid gap-1.5">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    {t("admin.productImage")}
                  </label>
                  <div className="flex gap-4 items-center">
                    <div className="h-20 w-20 rounded-2xl border border-border overflow-hidden bg-secondary shrink-0 relative flex items-center justify-center">
                      {prodImage ? (
                        <img src={prodImage} alt="Preview" className="h-full w-full object-cover" />
                      ) : (
                        <span className="text-[10px] text-muted-foreground font-bold text-center">No Photo</span>
                      )}
                    </div>
                    <div className="flex-1 grid gap-1">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setProdImage(reader.result as string);
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="text-xs file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-secondary file:text-secondary-foreground hover:file:bg-secondary-foreground/10 file:cursor-pointer"
                      />
                      <p className="text-[10px] text-muted-foreground">
                        Upload custom photo (automatically saved locally) or leave blank for color fallback.
                      </p>
                    </div>
                  </div>
                </div>

              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowAddProductModal(false);
                    resetProductForm();
                  }}
                  className="font-medium"
                >
                  {t("admin.cancel")}
                </Button>
                <Button
                  type="submit"
                  className="bg-primary text-primary-foreground hover:bg-brand-blue font-semibold"
                >
                  {editingProduct ? t("admin.saveChanges") : t("admin.addProductBtn")}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PRINT INVOICE MODAL & TEMPLATE */}
      {activeInvoice && (() => {
        const customerInfo = customersList.find((c) => c.company === activeInvoice.company);
        return (
          <div data-lenis-prevent className="print-invoice-overlay fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 overflow-y-auto print:bg-white print:p-0 print:block print:absolute print:top-0 print:left-0 print:w-full print:h-auto animate-fade-in">
            <style>{`
              @media print {
                body, html {
                  background: white !important;
                  color: black !important;
                  margin: 0 !important;
                  padding: 0 !important;
                  height: auto !important;
                  overflow: visible !important;
                }
                .print-invoice-overlay {
                  position: absolute !important;
                  top: 0 !important;
                  left: 0 !important;
                  width: 100% !important;
                  height: auto !important;
                  background: white !important;
                  padding: 0 !important;
                  margin: 0 !important;
                  display: block !important;
                  z-index: 99999 !important;
                  backdrop-filter: none !important;
                  filter: none !important;
                  opacity: 1 !important;
                  animation: none !important;
                  transform: none !important;
                }
                #print-invoice-area {
                  border: none !important;
                  box-shadow: none !important;
                  width: 100% !important;
                  max-width: 100% !important;
                  margin: 0 !important;
                  padding: 0 !important;
                  background: white !important;
                  color: black !important;
                  display: block !important;
                }
                /* Hide screen-only interactive controls during print */
                .print-hidden,
                button,
                .absolute.top-4.right-4,
                [role="status"] {
                  display: none !important;
                }
              }
            `}</style>

            <div
              id="print-invoice-area"
              className="bg-card w-full max-w-3xl rounded-3xl border border-border p-6 shadow-2xl relative flex flex-col justify-between print:border-none print:shadow-none print:max-w-none print:rounded-none"
            >
              {/* Screen Close Button */}
              <button
                onClick={() => setActiveInvoice(null)}
                className="absolute top-4 right-4 h-9 w-9 rounded-full bg-secondary hover:bg-secondary-foreground/10 flex items-center justify-center text-muted-foreground transition-colors print:hidden"
                title={t("admin.close")}
              >
                <X className="h-5 w-5" />
              </button>

              <div className="border border-slate-950 p-4 bg-white text-slate-900 text-xs font-sans print:border print:p-4 rounded-2xl print:rounded-none">
                
                {/* Header Box */}
                <div className="grid grid-cols-12 items-center border-b border-slate-950 pb-4 gap-4">
                  
                  {/* Left Badge: Tirth */}
                  <div className="col-span-3 flex flex-col items-center justify-center">
                    <div className="border-4 border-double border-red-700 px-3 py-1 text-center text-red-700">
                      <div className="font-extrabold text-base tracking-wide leading-none">તીર્થ</div>
                      <div className="text-[9px] font-bold mt-0.5 tracking-wider leading-none">ચુના પાર્સલ</div>
                    </div>
                    <div className="text-[8px] text-slate-500 font-bold mt-1 text-center">Mfg. of Lime Water</div>
                  </div>

                  {/* Center Content */}
                  <div className="col-span-6 text-center space-y-1">
                    <img
                      src={logoImg}
                      alt="KHODIYAR GRUH UDHYOG"
                      className="h-12 w-auto mx-auto object-contain"
                    />
                    <p className="text-[10px] font-bold text-slate-700 uppercase tracking-wide">
                      Mfg. : Lime Water Parcel (Chuna Parcel)
                    </p>
                    <p className="text-[9px] text-slate-600 font-medium">
                      Kachhiya Valo Kuvo, At. Badarkha, Ta. Dholka, Dist. Ahmedabad - 382270.
                    </p>
                    <p className="text-[9px] font-bold text-slate-900">
                      GSTIN : <span className="text-red-700 font-extrabold">24BCYPP6507J1ZY</span>
                    </p>
                  </div>

                  {/* Right Badge: Riddhi Siddhi & Phone */}
                  <div className="col-span-3 flex flex-col items-end justify-center">
                    <div className="border-2 border-red-700 rounded-full px-3 py-0.5 text-center text-red-700">
                      <div className="font-extrabold text-[11px] tracking-wide leading-none">રિદ્ધિ સિદ્ધિ</div>
                      <div className="text-[8px] font-bold tracking-wider leading-none">ચુના અને ગોળ</div>
                    </div>
                    <div className="text-[9px] font-bold text-slate-900 mt-2 text-right">
                      <div className="text-slate-800">Sanjay Patel</div>
                      <div className="text-slate-600">99984 21346</div>
                      <div className="text-slate-600">99743 07216</div>
                    </div>
                  </div>

                </div>

                {/* Bill Type & PAN / Info Bar */}
                <div className="grid grid-cols-3 border-b border-slate-950 text-center py-1 text-[9px] font-bold bg-slate-50">
                  <div className="text-left pl-2">PAN : 26CORPP3939N1 (Exempt)</div>
                  <div className="text-center font-black uppercase text-slate-900 tracking-wider">TAX INVOICE / BILL OF SUPPLY</div>
                  <div className="text-right pr-2 uppercase">Original for Recipient</div>
                </div>

                {/* Customer & Invoice details Grid */}
                <div className="grid grid-cols-2 border-b border-slate-950 text-[10px]">
                  
                  {/* Left: Customer Info */}
                  <div className="border-r border-slate-950 p-2 space-y-1">
                    <div className="font-bold text-slate-500 uppercase tracking-wider text-[8px]">Customer Details</div>
                    <div><strong>M/S:</strong> <span className="text-sm font-bold text-slate-900">{activeInvoice.company}</span></div>
                    <div><strong>Address:</strong> {customerInfo?.address || "Gujarat, India"}</div>
                    <div><strong>Phone:</strong> +{customerInfo?.phone || activeInvoice.phone || "N/A"}</div>
                    <div><strong>GSTIN:</strong> <span className="font-bold">{customerInfo?.gstin || "N/A"}</span></div>
                    <div><strong>Place of Supply:</strong> {customerInfo?.address?.toLowerCase().includes("rajasthan") ? "Rajasthan ( 08 )" : "Gujarat ( 24 )"}</div>
                  </div>

                  {/* Right: Invoice Info */}
                  <div className="p-2 space-y-1">
                    <div className="font-bold text-slate-500 uppercase tracking-wider text-[8px]">Invoice Details</div>
                    <div className="grid grid-cols-2 gap-x-2">
                      <div><strong>Invoice No:</strong> KGU-2026-{activeInvoice.id.replace("s_", "")}</div>
                      <div><strong>Invoice Date:</strong> {activeInvoice.date}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-x-2">
                      <div><strong>Challan No:</strong> 10{activeInvoice.id.replace("s_", "")}</div>
                      <div><strong>Challan Date:</strong> {activeInvoice.date}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-x-2">
                      <div><strong>E-Way Bill No:</strong> 78456{activeInvoice.id.replace("s_", "")}</div>
                      <div><strong>Transport:</strong> Silver Roadlines</div>
                    </div>
                    <div className="grid grid-cols-2 gap-x-2">
                      <div><strong>Transport ID:</strong> 24ABSFS0321B2ZL</div>
                      <div><strong>Despatch Through:</strong> Road Transport</div>
                    </div>
                  </div>

                </div>

                {/* Table items */}
                <div className="min-h-[200px]">
                  <table className="w-full text-left text-[10px] border-collapse border-b border-slate-950">
                    <thead>
                      <tr className="border-b border-slate-950 font-bold bg-slate-50 text-slate-800 text-[9px] uppercase tracking-wider">
                        <th className="border-r border-slate-950 p-2 text-center w-8">Sr.</th>
                        <th className="border-r border-slate-950 p-2">Description of Goods</th>
                        <th className="border-r border-slate-950 p-2 text-center w-20">Packing</th>
                        <th className="border-r border-slate-950 p-2 text-right w-16">Qty</th>
                        <th className="border-r border-slate-950 p-2 text-right w-20">Rate</th>
                        <th className="border-r border-slate-950 p-2 text-right w-24">Taxable Value</th>
                        <th className="border-r border-slate-950 p-2 text-center w-28">GST (CGST+SGST / IGST)</th>
                        <th className="p-2 text-right w-24">Total Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activeInvoice.items.map((item, idx) => {
                        const isInterstate = customerInfo?.address?.toLowerCase().includes("rajasthan");
                        const taxableVal = item.total; 
                        
                        return (
                          <tr key={idx} className="border-b border-slate-950/20 font-medium">
                            <td className="border-r border-slate-950 p-2 text-center">{idx + 1}</td>
                            <td className="border-r border-slate-950 p-2 font-bold text-slate-900">{item.product}</td>
                            <td className="border-r border-slate-950 p-2 text-center text-slate-600">{item.packSize === "12x1 pack" ? "12X1" : item.packSize === "24x1 pack" ? "24X1" : item.packSize}</td>
                            <td className="border-r border-slate-950 p-2 text-right font-bold">{item.quantity} NOS</td>
                            <td className="border-r border-slate-950 p-2 text-right text-slate-600">₹{item.price.toLocaleString("en-IN")}</td>
                            <td className="border-r border-slate-950 p-2 text-right font-bold">₹{taxableVal.toLocaleString("en-IN")}</td>
                            <td className="border-r border-slate-950 p-2 text-center text-slate-500">
                              {isInterstate ? "IGST 0%" : "CGST 0% + SGST 0%"} (Exempt)
                            </td>
                            <td className="p-2 text-right font-extrabold text-slate-900">₹{item.total.toLocaleString("en-IN")}</td>
                          </tr>
                        );
                      })}
                      
                      {/* Empty spacer rows to align to printed look */}
                      {activeInvoice.items.length < 4 && 
                        Array.from({ length: 4 - activeInvoice.items.length }).map((_, i) => (
                          <tr key={`spacer-${i}`} className="h-6 opacity-30 border-b border-slate-950/10">
                            <td className="border-r border-slate-950">&nbsp;</td>
                            <td className="border-r border-slate-950">&nbsp;</td>
                            <td className="border-r border-slate-950">&nbsp;</td>
                            <td className="border-r border-slate-950">&nbsp;</td>
                            <td className="border-r border-slate-950">&nbsp;</td>
                            <td className="border-r border-slate-950">&nbsp;</td>
                            <td className="border-r border-slate-950">&nbsp;</td>
                            <td>&nbsp;</td>
                          </tr>
                        ))
                      }
                    </tbody>
                  </table>
                </div>

                {/* Table Total Summary Row */}
                <div className="grid grid-cols-12 border-b border-slate-950 font-bold bg-slate-50 text-[10px]">
                  <div className="col-span-3 border-r border-slate-950 p-2 text-right uppercase">Total</div>
                  <div className="col-span-2 border-r border-slate-950 p-2 text-center">
                    {activeInvoice.items.reduce((sum, item) => sum + item.quantity, 0)} NOS
                  </div>
                  <div className="col-span-2 border-r border-slate-950 p-2 text-right">&nbsp;</div>
                  <div className="col-span-2 border-r border-slate-950 p-2 text-right">
                    ₹{activeInvoice.revenue.toLocaleString("en-IN")}
                  </div>
                  <div className="col-span-3 p-2 text-right text-slate-900 font-extrabold">
                    ₹{activeInvoice.revenue.toLocaleString("en-IN")}
                  </div>
                </div>

                {/* Footer Calculations, Bank & Signatures Grid */}
                <div className="grid grid-cols-12 text-[9px] border-b border-slate-950">
                  
                  {/* Left block (col-span-8): Total in Words, Bank Details, Terms */}
                  <div className="col-span-8 border-r border-slate-950 p-2 space-y-3">
                    
                    {/* Total in words */}
                    <div>
                      <span className="font-bold text-slate-500 uppercase tracking-wider text-[8px] block">Total Amount in Words</span>
                      <span className="font-extrabold text-slate-900 block text-[10px] mt-0.5">
                        {numberToWords(activeInvoice.revenue)}
                      </span>
                    </div>

                    {/* Bank Details & UPI QR Code side-by-side */}
                    <div className="grid grid-cols-12 gap-3 border border-slate-300 p-2.5 rounded-xl bg-slate-50/50">
                      
                      {/* Bank Info */}
                      <div className="col-span-8 space-y-1">
                        <span className="font-bold text-slate-800 uppercase tracking-wider text-[8px] block">Bank Account Details</span>
                        <div><strong>BANK NAME:</strong> STATE BANK OF INDIA</div>
                        <div><strong>BRANCH:</strong> BADARKHA</div>
                        <div><strong>A/C NO.:</strong> <span className="font-bold text-slate-900">36842624436</span></div>
                        <div><strong>IFSC CODE:</strong> <span className="font-bold text-slate-900">SBIN0003805</span></div>
                      </div>

                      {/* UPI QR Code */}
                      <div className="col-span-4 flex flex-col items-center justify-center text-center border-l border-slate-200 pl-2">
                        <img 
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=70x70&data=${encodeURIComponent(`upi://pay?pa=36842624436@sbi&pn=Khodiyar%20Gruh%20Udhyog&am=${activeInvoice.revenue}&cu=INR`)}`} 
                          alt="UPI Payment QR Code" 
                          className="h-14 w-14 object-contain border border-slate-200 p-0.5 bg-white"
                        />
                        <span className="text-[7px] font-black text-slate-600 mt-1 uppercase leading-none">Pay using UPI</span>
                      </div>

                    </div>

                    {/* Terms & Conditions */}
                    <div className="space-y-1">
                      <span className="font-bold text-slate-500 uppercase tracking-wider text-[8px] block">Terms & Conditions</span>
                      <ul className="list-decimal list-inside space-y-0.5 text-slate-600 leading-tight">
                        <li>Goods once sold will not be taken back.</li>
                        <li>Interest @ 18% p.a. will be charge if payment is not made within due date.</li>
                        <li>Our risk and responsibility ceases as soon as the goods leave our premises.</li>
                        <li>Subject to Dholka Jurisdiction. E. & O. E.</li>
                      </ul>
                    </div>

                    {/* Customer Signature */}
                    <div className="pt-2 flex justify-between items-end">
                      <div>
                        <div className="text-[8px] font-bold text-slate-500 uppercase tracking-wider">Customer's Signature</div>
                        <div className="h-6 w-36 border-b border-slate-400 mt-2" />
                      </div>
                    </div>

                  </div>

                  {/* Right block (col-span-4): Calculation Breakdown, Signatory */}
                  <div className="col-span-4 flex flex-col justify-between p-2">
                    
                    {/* Calculation Box */}
                    <div className="space-y-1.5 text-right border-b border-slate-200 pb-3">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Taxable Value:</span>
                        <span className="font-bold">₹{activeInvoice.revenue.toLocaleString("en-IN")}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">CGST (0%):</span>
                        <span className="font-bold">₹0.00</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">SGST (0%):</span>
                        <span className="font-bold">₹0.00</span>
                      </div>
                      <div className="flex justify-between border-t border-slate-200 pt-1 font-extrabold text-[11px] text-slate-900">
                        <span>Total Amount:</span>
                        <span>₹{activeInvoice.revenue.toLocaleString("en-IN")}</span>
                      </div>
                    </div>

                    {/* Declaration & Signatory */}
                    <div className="space-y-2 text-center pt-2">
                      <p className="text-[7px] text-slate-500 leading-none">
                        Certified that the particulars given above are true and correct.
                      </p>
                      <div className="text-center font-bold text-[9px] text-slate-900 mt-1">
                        For, Khodiyar Gruh Udhyog
                      </div>
                      <div className="h-8 flex items-center justify-center select-none opacity-40 italic text-[7px] border border-dashed border-slate-300 rounded text-slate-500 mx-2 bg-slate-50">
                        Computer Generated Bill - No Sign. Required
                      </div>
                      <div className="text-[8px] font-extrabold text-slate-800 uppercase tracking-wider">
                        Authorised Signatory
                      </div>
                    </div>

                  </div>

                </div>

                {/* Thank You greeting */}
                <div className="text-center text-[10px] font-bold py-2 text-slate-700 bg-slate-50 tracking-wider">
                  Thank you for shopping with us!
                </div>

              </div>

              {/* Bottom Print / Close Controls */}
              <div className="mt-4 flex justify-end gap-3 print:hidden">
                <Button
                  onClick={() => setActiveInvoice(null)}
                  variant="outline"
                  className="font-medium animate-fade-in"
                >
                  {t("admin.close")}
                </Button>
                <Button
                  type="button"
                  onClick={handlePrint}
                  className="bg-emerald-700 text-white hover:bg-emerald-800 font-semibold shadow-md flex items-center gap-1.5 cursor-pointer hover:scale-102 active:scale-98 transition-all"
                >
                  <Printer className="h-4 w-4" /> {t("admin.printInvoice")}
                </Button>
              </div>

            </div>
          </div>
        );
      })()}

      {/* DELETE PRODUCT CONFIRMATION MODAL */}
      {deleteProductConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-card w-full max-w-md rounded-3xl border border-border p-6 shadow-2xl relative animate-scale-in">
            <h3 className="text-lg font-bold text-foreground">{t("admin.deleteProduct")}</h3>
            <p className="text-sm text-muted-foreground mt-2">
              {t("admin.confirmDeleteProduct")}
            </p>
            <div className="flex justify-end gap-3 mt-6">
              <Button
                variant="outline"
                onClick={() => setDeleteProductConfirm(null)}
                className="font-medium"
              >
                {t("admin.cancel")}
              </Button>
              <Button
                onClick={() => {
                  const newProductsList = products.filter((p) => p.id !== deleteProductConfirm);
                  saveProducts(newProductsList);
                  toast.success("Product deleted from catalog.");
                  setDeleteProductConfirm(null);
                }}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90 font-semibold"
              >
                {t("admin.delete")}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE SALE CONFIRMATION MODAL */}
      {deleteSaleConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-card w-full max-w-md rounded-3xl border border-border p-6 shadow-2xl relative animate-scale-in">
            <h3 className="text-lg font-bold text-foreground">{t("admin.deleteSale")}</h3>
            <p className="text-sm text-muted-foreground mt-2">
              {t("admin.confirmDeleteSale")}
            </p>
            <div className="flex justify-end gap-3 mt-6">
              <Button
                variant="outline"
                onClick={() => setDeleteSaleConfirm(null)}
                className="font-medium"
              >
                {t("admin.cancel")}
              </Button>
              <Button
                onClick={() => {
                  const updated = sales.filter((s) => s.id !== deleteSaleConfirm);
                  saveSales(updated);
                  toast.success("Sale transaction deleted successfully.");
                  setDeleteSaleConfirm(null);
                }}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90 font-semibold"
              >
                {t("admin.delete")}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE GALLERY SLIDE CONFIRMATION MODAL */}
      {deleteSlideConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-card w-full max-w-md rounded-3xl border border-border p-6 shadow-2xl relative animate-scale-in">
            <h3 className="text-lg font-bold text-foreground">{t("admin.deleteSlide")}</h3>
            <p className="text-sm text-muted-foreground mt-2">
              {t("admin.confirmDeleteSlide")}
            </p>
            <div className="flex justify-end gap-3 mt-6">
              <Button
                variant="outline"
                onClick={() => setDeleteSlideConfirm(null)}
                className="font-medium"
              >
                {t("admin.cancel")}
              </Button>
              <Button
                onClick={() => {
                  const updatedGallery = gallery.filter((s) => s.id !== deleteSlideConfirm);
                  saveGallery(updatedGallery);
                  toast.success("Gallery slide deleted successfully.");
                  setDeleteSlideConfirm(null);
                }}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90 font-semibold"
              >
                {t("admin.delete")}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ADD/EDIT GALLERY SLIDE MODAL */}
      {showAddSlideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-card w-full max-w-lg rounded-3xl border border-border p-6 shadow-2xl relative max-h-[95vh] flex flex-col justify-between overflow-hidden animate-scale-in">
            <div>
              <h3 className="text-xl font-bold text-foreground">
                {editingSlide ? t("admin.editSlide") : t("admin.addNewSlide")}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Add or edit slides for the About Us photo carousel.
              </p>
            </div>

            <form onSubmit={handleAddOrEditSlide} className="mt-4 overflow-y-auto flex-1 pr-1 space-y-4 py-2">
              <div className="grid gap-4">
                
                {/* LOCALIZED TITLES (English, Gujarati, Hindi) */}
                <div className="grid gap-2 p-3 bg-secondary/15 rounded-2xl border border-border/60">
                  <span className="text-xs font-bold text-primary block uppercase tracking-wider">Slide Titles</span>
                  
                  <div className="grid gap-1.5">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase">English Title</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Processing Line"
                      value={slideEnTitle}
                      onChange={(e) => setSlideEnTitle(e.target.value)}
                      className="h-9 rounded-lg border border-border px-3 text-xs focus:outline-none focus:border-brand-gold/60 bg-background"
                    />
                  </div>

                  <div className="grid gap-1.5">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase">Gujarati Title (ગુજરાતી)</label>
                    <input
                      type="text"
                      placeholder="e.g. પ્રોસેસિંગ લાઇન"
                      value={slideGuTitle}
                      onChange={(e) => setSlideGuTitle(e.target.value)}
                      className="h-9 rounded-lg border border-border px-3 text-xs focus:outline-none focus:border-brand-gold/60 bg-background"
                    />
                  </div>

                  <div className="grid gap-1.5">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase">Hindi Title (हिन्दी)</label>
                    <input
                      type="text"
                      placeholder="e.g. प्रोसेसिंग लाइन"
                      value={slideHiTitle}
                      onChange={(e) => setSlideHiTitle(e.target.value)}
                      className="h-9 rounded-lg border border-border px-3 text-xs focus:outline-none focus:border-brand-gold/60 bg-background"
                    />
                  </div>
                </div>

                {/* LOCALIZED DESCRIPTIONS (English, Gujarati, Hindi) */}
                <div className="grid gap-2 p-3 bg-secondary/15 rounded-2xl border border-border/60">
                  <span className="text-xs font-bold text-primary block uppercase tracking-wider">Slide Descriptions</span>
                  
                  <div className="grid gap-1.5">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase">English Description</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Spotless stainless steel processing tanks..."
                      value={slideEnDesc}
                      onChange={(e) => setSlideEnDesc(e.target.value)}
                      className="h-9 rounded-lg border border-border px-3 text-xs focus:outline-none focus:border-brand-gold/60 bg-background"
                    />
                  </div>

                  <div className="grid gap-1.5">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase">Gujarati Description</label>
                    <input
                      type="text"
                      placeholder="e.g. ઉત્પાદન સુવિધાની વિગતો..."
                      value={slideGuDesc}
                      onChange={(e) => setSlideGuDesc(e.target.value)}
                      className="h-9 rounded-lg border border-border px-3 text-xs focus:outline-none focus:border-brand-gold/60 bg-background"
                    />
                  </div>

                  <div className="grid gap-1.5">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase">Hindi Description</label>
                    <input
                      type="text"
                      placeholder="e.g. उत्पादन सुविधा का विवरण..."
                      value={slideHiDesc}
                      onChange={(e) => setSlideHiDesc(e.target.value)}
                      className="h-9 rounded-lg border border-border px-3 text-xs focus:outline-none focus:border-brand-gold/60 bg-background"
                    />
                  </div>
                </div>

                {/* MEDIA TYPE selection */}
                <div className="grid gap-2 p-3 bg-secondary/15 rounded-2xl border border-border/60">
                  <label className="text-xs font-bold text-primary block uppercase tracking-wider">Media Type</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 text-xs text-foreground cursor-pointer select-none">
                      <input
                        type="radio"
                        name="slideType"
                        value="image"
                        checked={slideType === "image"}
                        onChange={() => {
                          setSlideType("image");
                          setSlideImg("");
                        }}
                      />
                      Photo / Image
                    </label>
                    <label className="flex items-center gap-2 text-xs text-foreground cursor-pointer select-none">
                      <input
                        type="radio"
                        name="slideType"
                        value="video"
                        checked={slideType === "video"}
                        onChange={() => {
                          setSlideType("video");
                          setSlideImg("");
                        }}
                      />
                      Video
                    </label>
                  </div>
                </div>

                {/* MEDIA SOURCE selection */}
                <div className="grid gap-1.5">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    {slideType === "video" ? "Video Source" : "Photo Source"}
                  </label>
                  <div className="flex gap-4 items-center">
                    <div className="h-20 w-20 rounded-2xl border border-border overflow-hidden bg-secondary shrink-0 relative flex items-center justify-center">
                      {slideImg ? (
                        slideType === "video" ? (
                          <video src={slideImg} className="h-full w-full object-cover animate-pulse" muted playsInline />
                        ) : (
                          <img src={slideImg} alt="Preview" className="h-full w-full object-cover" />
                        )
                      ) : (
                        <span className="text-[10px] text-muted-foreground font-bold text-center">
                          {slideType === "video" ? "No Video" : "No Photo"}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 grid gap-2">
                      <input
                        type="file"
                        accept={slideType === "video" ? "video/*" : "image/*"}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            if (slideType === "video" && file.size > 25 * 1024 * 1024) {
                              alert("Video file is too large. Please use a video under 25MB or paste a direct video link.");
                              return;
                            }
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setSlideImg(reader.result as string);
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="text-xs file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-secondary file:text-secondary-foreground hover:file:bg-secondary-foreground/10 file:cursor-pointer"
                      />
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-muted-foreground">OR URL:</span>
                        <input
                          type="text"
                          placeholder={slideType === "video" ? "Paste direct video link..." : "Paste direct image link..."}
                          value={slideImg.startsWith("data:") ? "" : slideImg}
                          onChange={(e) => setSlideImg(e.target.value)}
                          className="h-7 rounded-md border border-border px-2 text-[10px] focus:outline-none focus:border-brand-gold/60 bg-background flex-1"
                        />
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowAddSlideModal(false);
                    resetSlideForm();
                  }}
                  className="font-medium"
                >
                  {t("admin.cancel")}
                </Button>
                <Button
                  type="submit"
                  className="bg-primary text-primary-foreground hover:bg-brand-blue font-semibold"
                >
                  {editingSlide ? t("admin.saveChanges") : t("admin.addNewSlide")}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </SiteLayout>
  );
}
