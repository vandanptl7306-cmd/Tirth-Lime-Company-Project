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
import { SiteLayout } from "@/components/site/SiteLayout";
import { SectionHeading } from "@/components/site/SectionHeading";
import { PRODUCTS, getStoredProducts, saveStoredProducts, type Product } from "@/lib/products";
import { getStoredGallery, saveStoredGallery, type GallerySlide } from "@/lib/gallery";
import { toast } from "sonner";
import { useLanguage } from "@/hooks/useLanguage";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Sales & Operations Dashboard — Khodiyar Industry" },
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
  items: SaleItem[];
  revenue: number;
  status: "Done" | "Pending";
};

const MOCK_SALES: Sale[] = [
  {
    id: "s1",
    date: "2026-04-10",
    company: "Janta Paan Bhandar",
    items: [{ product: "Tirth Chuna Parcel (White — Medium)", packSize: "12x1 pack", quantity: 50, price: 300, total: 15000 }],
    revenue: 15000,
    status: "Done"
  },
  {
    id: "s2",
    date: "2026-04-18",
    company: "Maruti Traders",
    items: [{ product: "Riddhi Siddhi Chuna Parcel (Yellow — Packing)", packSize: "24x1 pack", quantity: 30, price: 600, total: 18000 }],
    revenue: 18000,
    status: "Done"
  },
  {
    id: "s3",
    date: "2026-05-02",
    company: "Kalyan Paan Shop",
    items: [{ product: "Tirth Chuna Parcel (Yellow — Ghata)", packSize: "12x1 pack", quantity: 20, price: 350, total: 7000 }],
    revenue: 7000,
    status: "Done"
  },
  {
    id: "s4",
    date: "2026-05-15",
    company: "Gujarat Lime Distributors",
    items: [{ product: "Riddhi Siddhi Chuna Parcel (Yellow — Loose)", packSize: "24x1 pack", quantity: 100, price: 450, total: 45000 }],
    revenue: 45000,
    status: "Done"
  },
  {
    id: "s5",
    date: "2026-05-28",
    company: "Rajasthan Paan Center",
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

  const [activeTab, setActiveTab] = useState<"sales" | "products" | "gallery">("sales");
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

  useEffect(() => {
    setMounted(true);
  }, []);


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
      alert("Please fill in company name and dispatch date.");
      return;
    }

    const incompleteItem = formItems.find(item => !item.product || item.quantity <= 0 || item.price <= 0);
    if (incompleteItem) {
      alert("Please ensure all products, quantities, and prices are filled correctly.");
      return;
    }

    const calculatedRevenue = formItems.reduce((sum, item) => sum + item.total, 0);

    const newSale: Sale = {
      id: "s_" + Date.now(),
      company: formCompany,
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
      alert("Image and English title are required.");
      return;
    }

    const updatedSlide: GallerySlide = {
      id: editingSlide ? editingSlide.id : "slide_" + Date.now(),
      img: slideImg,
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
      link.download = `Khodiyar_Industry_Sales_Registry_${new Date().toISOString().split("T")[0]}.csv`;
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

  // Prepare chart data (Chronological Growth)
  const growthData = [...statsSales]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .reduce((acc: { date: string; revenue: number; cumulative: number }[], curr) => {
      const lastCumulative = acc.length > 0 ? acc[acc.length - 1].cumulative : 0;
      const formattedDate = new Date(curr.date).toLocaleDateString("en-IN", {
        month: "short",
        day: "numeric",
      });
      acc.push({
        date: formattedDate,
        revenue: curr.revenue,
        cumulative: lastCumulative + curr.revenue,
      });
      return acc;
    }, []);

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
          ) : (
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
                            <div className="h-12 w-16 rounded-xl overflow-hidden border border-border bg-secondary">
                              <img
                                src={slide.img}
                                alt="Slide"
                                className="h-full w-full object-cover"
                              />
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
          )}
        </div>
      </section>

      {/* ADD SALE MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary-foreground/30 bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-card w-full max-w-2xl rounded-3xl border border-border p-6 shadow-2xl relative max-h-[90vh] flex flex-col justify-between overflow-hidden animate-scale-in">
            <div>
              <h3 className="text-xl font-bold text-foreground">{t("admin.logBillTitle")}</h3>
              <p className="text-xs text-muted-foreground mt-0.5">{t("admin.logBillDesc")}</p>
            </div>

            <form onSubmit={handleAddSale} className="mt-4 overflow-y-auto flex-1 pr-1 space-y-4 py-2">
              <div className="grid sm:grid-cols-2 gap-4">
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

      {/* ADD/EDIT PRODUCT MODAL */}
      {showAddProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-card w-full max-w-lg rounded-3xl border border-border p-6 shadow-2xl relative max-h-[95vh] flex flex-col justify-between overflow-hidden animate-scale-in">
            <div>
              <h3 className="text-xl font-bold text-foreground">
                {editingProduct ? t("admin.editProductTitle") : t("admin.addProductTitle")}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                {editingProduct ? t("admin.updateCatalogDesc") : t("admin.addNewProductDesc")}
              </p>
            </div>

            <form onSubmit={handleAddOrEditProduct} className="mt-4 overflow-y-auto flex-1 pr-1 space-y-4 py-2">
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
      {activeInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 print:bg-white print:p-0 print:block print:absolute print:top-0 print:left-0 print:w-full print:h-auto">
          <style>{`
            @media print {
              body {
                background: white !important;
                color: black !important;
                margin: 0 !important;
                padding: 0 !important;
              }
              body * {
                visibility: hidden !important;
              }
              #print-invoice-area, #print-invoice-area * {
                visibility: visible !important;
              }
              #print-invoice-area {
                position: absolute !important;
                top: 0 !important;
                left: 0 !important;
                width: 100% !important;
                height: auto !important;
                background: white !important;
                color: black !important;
                padding: 16px !important;
                border: none !important;
                box-shadow: none !important;
                margin: 0 !important;
              }
            }
          `}</style>

          <div
            id="print-invoice-area"
            className="bg-card w-full max-w-2xl rounded-3xl border border-border p-8 shadow-2xl relative flex flex-col justify-between print:border-none print:shadow-none print:max-w-none print:rounded-none"
          >
            {/* Screen Close Button */}
            <button
              onClick={() => setActiveInvoice(null)}
              className="absolute top-4 right-4 h-9 w-9 rounded-full bg-secondary hover:bg-secondary-foreground/10 flex items-center justify-center text-muted-foreground transition-colors print:hidden"
              title={t("admin.close")}
            >
              <X className="h-5 w-5" />
            </button>

            <div>
              {/* Header Info */}
              <div className="flex flex-col sm:flex-row sm:justify-between items-start gap-4 pb-6 border-b border-border">
                <div className="leading-tight">
                  <div className="text-2xl font-black text-foreground">
                    {t("admin.companyInfoName")}
                  </div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-0.5">
                    {t("admin.licNo")}
                  </div>
                  <p className="text-xs text-muted-foreground mt-3 max-w-xs">
                    {t("admin.addressLabel")}
                  </p>
                </div>
                <div className="text-left sm:text-right text-xs text-muted-foreground space-y-1">
                  <div className="font-bold text-foreground uppercase tracking-wider text-sm mb-1">{t("admin.wholesaleInvoice")}</div>
                  <div><strong>{t("admin.invoiceNo")}</strong> INV-2026-{activeInvoice.id.replace("s_", "")}</div>
                  <div><strong>{t("admin.dateLabel")}</strong> {activeInvoice.date}</div>
                  <div><strong>{t("admin.statusLabel")}</strong> {activeInvoice.status === "Done" ? t("admin.paid") : t("admin.unpaid")}</div>
                </div>
              </div>

              {/* Bill To */}
              <div className="py-6 border-b border-border">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">{t("admin.billTo")}</span>
                <span className="text-base font-bold text-foreground block mt-1">{activeInvoice.company}</span>
                <span className="text-xs text-muted-foreground block mt-0.5">B2B Wholesale Customer</span>
              </div>

              {/* Items Table */}
              <div className="py-6">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-border/85 font-bold text-muted-foreground uppercase text-[10px] tracking-wider">
                      <th className="pb-3 w-8">#</th>
                      <th className="pb-3">{t("admin.productDetails")}</th>
                      <th className="pb-3 text-center">{t("admin.packSize")}</th>
                      <th className="pb-3 text-right w-16">{t("admin.qty")}</th>
                      <th className="pb-3 text-right w-24">{t("admin.rate")}</th>
                      <th className="pb-3 text-right w-24">{t("admin.total")}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {activeInvoice.items.map((item, index) => (
                      <tr key={index} className="font-medium text-foreground">
                        <td className="py-4">{index + 1}</td>
                        <td className="py-4 text-sm font-semibold">{item.product}</td>
                        <td className="py-4 text-center text-muted-foreground">{item.packSize}</td>
                        <td className="py-4 text-right font-semibold">{item.quantity}</td>
                        <td className="py-4 text-right text-muted-foreground">
                          ₹{item.price.toLocaleString("en-IN")}
                        </td>
                        <td className="py-4 text-right font-bold text-foreground">
                          ₹{item.total.toLocaleString("en-IN")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Calculations and Footer Block */}
            <div className="border-t border-border pt-6">
              <div className="flex flex-col sm:flex-row sm:justify-between items-start gap-6">
                {/* Note */}
                <div className="text-xs text-muted-foreground max-w-xs space-y-1.5">
                  <div className="font-bold text-foreground">{t("admin.billOfSupply")}:</div>
                  <p className="leading-relaxed">
                    This bill represents official dispatch records of Khodiyar Industry. Edible chuna products are manufactured under food safety license FSSAI requirements.
                  </p>
                </div>

                {/* Subtotals */}
                <div className="w-full sm:w-64 space-y-1.5 text-xs text-right">
                  <div className="flex justify-between text-muted-foreground">
                    <span>{t("admin.subtotalLabel")}:</span>
                    <span>₹{Math.round(activeInvoice.revenue / 1.18).toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>CGST (9%):</span>
                    <span>₹{Math.round((activeInvoice.revenue - Math.round(activeInvoice.revenue / 1.18)) / 2).toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>SGST (9%):</span>
                    <span>₹{Math.round((activeInvoice.revenue - Math.round(activeInvoice.revenue / 1.18)) / 2).toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between text-sm font-black text-foreground pt-2 border-t border-border">
                    <span>{t("admin.grandTotal")}:</span>
                    <span>₹{activeInvoice.revenue.toLocaleString("en-IN")}</span>
                  </div>
                </div>
              </div>

              {/* Bottom Print / Close Controls */}
              <div className="mt-8 pt-6 border-t border-border flex justify-end gap-3 print:hidden">
                <Button
                  onClick={() => setActiveInvoice(null)}
                  variant="outline"
                  className="font-medium"
                >
                  {t("admin.close")}
                </Button>
                <Button
                  onClick={() => window.print()}
                  className="bg-emerald-700 text-white hover:bg-emerald-800 font-semibold"
                >
                  <Printer className="mr-2 h-4 w-4" /> {t("admin.printInvoice")}
                </Button>
              </div>

              {/* Signature block for printed version */}
              <div className="hidden print:flex justify-between items-end mt-16 text-xs text-muted-foreground">
                <div>
                  <p>Customer Signature</p>
                  <div className="h-10 w-44 border-b border-muted-foreground mt-4" />
                </div>
                <div className="text-right">
                  <p>For, Khodiyar Industry</p>
                  <div className="h-10 w-44 border-b border-muted-foreground mt-4" />
                  <p className="mt-2 text-[10px]">{t("admin.authorizedSignatory")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

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

                {/* PHOTO SOURCE selection */}
                <div className="grid gap-1.5">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    {t("admin.productImage")}
                  </label>
                  <div className="flex gap-4 items-center">
                    <div className="h-20 w-20 rounded-2xl border border-border overflow-hidden bg-secondary shrink-0 relative flex items-center justify-center">
                      {slideImg ? (
                        <img src={slideImg} alt="Preview" className="h-full w-full object-cover" />
                      ) : (
                        <span className="text-[10px] text-muted-foreground font-bold text-center">No Photo</span>
                      )}
                    </div>
                    <div className="flex-1 grid gap-2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
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
                          placeholder="Paste direct image link..."
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
