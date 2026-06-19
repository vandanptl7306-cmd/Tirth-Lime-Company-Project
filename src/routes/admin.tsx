import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
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
import { toast } from "sonner";

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

function AdminDashboard() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [activeTab, setActiveTab] = useState<"sales" | "products">("sales");
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

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
    setProducts(getStoredProducts());
    const stored = localStorage.getItem("khodiyar_sales_data");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const isOldFormat = parsed.some((s: any) => !s.items);
        if (isOldFormat) {
          localStorage.setItem("khodiyar_sales_data", JSON.stringify(MOCK_SALES));
          setSales(MOCK_SALES);
        } else {
          setSales(parsed);
        }
      } catch (err) {
        localStorage.setItem("khodiyar_sales_data", JSON.stringify(MOCK_SALES));
        setSales(MOCK_SALES);
      }
    } else {
      localStorage.setItem("khodiyar_sales_data", JSON.stringify(MOCK_SALES));
      setSales(MOCK_SALES);
    }
  }, []);

  const saveSales = (newSales: Sale[]) => {
    setSales(newSales);
    localStorage.setItem("khodiyar_sales_data", JSON.stringify(newSales));
  };

  const handleToggleStatus = (id: string) => {
    const updated = sales.map((s) =>
      s.id === id ? { ...s, status: s.status === "Done" ? ("Pending" as const) : ("Done" as const) } : s
    );
    saveSales(updated);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this sale transaction?")) {
      const updated = sales.filter((s) => s.id !== id);
      saveSales(updated);
    }
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

    setProducts(newProductsList);
    saveStoredProducts(newProductsList);
    
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
    if (window.confirm("Are you sure you want to delete this product from the catalog?")) {
      const newProductsList = products.filter((p) => p.id !== id);
      setProducts(newProductsList);
      saveStoredProducts(newProductsList);
      toast.success("Product deleted from catalog.");
    }
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
      URL.revokeObjectURL(url);
      
      toast.success("Excel sheet exported successfully!");
    } catch (error: any) {
      console.error("Excel export error:", error);
      toast.error("Failed to export Excel file: " + (error?.message || "Unknown error"));
    }
  };

  // Calculate metrics
  const totalSales = sales.reduce((acc, curr) => acc + curr.revenue, 0);
  const doneSales = sales.filter((s) => s.status === "Done").reduce((acc, curr) => acc + curr.revenue, 0);
  const pendingSales = sales.filter((s) => s.status === "Pending").reduce((acc, curr) => acc + curr.revenue, 0);
  const totalOrders = sales.length;
  const completedOrders = sales.filter((s) => s.status === "Done").length;
  const pendingOrders = sales.filter((s) => s.status === "Pending").length;
  const totalQuantity = sales.reduce(
    (acc, curr) => acc + curr.items.reduce((sum, item) => sum + item.quantity, 0),
    0
  );

  // Prepare chart data (Chronological Growth)
  const growthData = [...sales]
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
    { name: "Completed", value: completedOrders, color: "#15803d" }, // green-700
    { name: "Pending", value: pendingOrders, color: "#d97706" }, // amber-600
  ];

  // Brand sales breakdown (Tirth vs Riddhi Siddhi)
  const brandBreakdown = sales.reduce(
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

  return (
    <SiteLayout>
      <section className="bg-secondary/40 py-12 border-b border-border/60 print:hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <SectionHeading
            align="left"
            eyebrow="Operations Portal"
            title={
              <span>
                Sales & Performance <span className="text-brand-blue">Admin</span>
              </span>
            }
            description="Manage B2B orders, print bills, and track operations performance."
          />
          <div className="flex flex-wrap gap-3 self-start md:self-center">
            <Button
              onClick={handleExportExcelCSV}
              variant="outline"
              className="border-emerald-600 text-emerald-800 hover:bg-emerald-50 shadow-sm font-semibold flex items-center gap-1.5"
            >
              <FileSpreadsheet className="h-4 w-4" /> Export to Excel
            </Button>
            <Button
              onClick={() => {
                setFormItems([{ product: "", packSize: "12x1 pack", quantity: 1, price: 0, total: 0 }]);
                setShowAddModal(true);
              }}
              className="bg-primary text-primary-foreground hover:bg-brand-blue shadow-md font-semibold"
            >
              <Plus className="mr-2 h-5 w-5" /> Add Offline Bill
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
              Sales Registry & Analytics
            </button>
            <button
              onClick={() => setActiveTab("products")}
              className={`pb-3 text-sm font-bold border-b-2 px-2 transition-all relative ${
                activeTab === "products"
                  ? "border-brand-blue text-brand-blue"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Manage Product Catalog
            </button>
          </div>

          {activeTab === "sales" ? (
            <>
              {/* STATS CARDS */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-3xl border border-border bg-card p-6 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">Total Revenue</span>
                <span className="text-2xl font-black text-foreground mt-1 block">
                  ₹{totalSales.toLocaleString("en-IN")}
                </span>
                <span className="text-[10px] text-emerald-600 font-semibold mt-1 inline-flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" /> Healthy pipeline
                </span>
              </div>
              <div className="h-12 w-12 rounded-2xl bg-brand-gold/10 text-brand-gold flex items-center justify-center">
                <Coins className="h-6 w-6" />
              </div>
            </div>

            <div className="rounded-3xl border border-border bg-card p-6 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">Completed Orders</span>
                <span className="text-2xl font-black text-foreground mt-1 block">
                  {completedOrders} <span className="text-sm font-normal text-muted-foreground">/ {totalOrders}</span>
                </span>
                <span className="text-[10px] text-muted-foreground mt-1 block">
                  ₹{doneSales.toLocaleString("en-IN")} total value
                </span>
              </div>
              <div className="h-12 w-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6" />
              </div>
            </div>

            <div className="rounded-3xl border border-border bg-card p-6 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">Pending Orders</span>
                <span className="text-2xl font-black text-foreground mt-1 block">
                  {pendingOrders} <span className="text-sm font-normal text-muted-foreground">/ {totalOrders}</span>
                </span>
                <span className="text-[10px] text-amber-600 font-medium mt-1 block">
                  ₹{pendingSales.toLocaleString("en-IN")} pending collection
                </span>
              </div>
              <div className="h-12 w-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Clock className="h-6 w-6" />
              </div>
            </div>

            <div className="rounded-3xl border border-border bg-card p-6 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">Total Volume Sold</span>
                <span className="text-2xl font-black text-foreground mt-1 block">
                  {totalQuantity} <span className="text-sm font-normal text-muted-foreground">Parcels</span>
                </span>
                <span className="text-[10px] text-muted-foreground mt-1 block">
                  Across both brand families
                </span>
              </div>
              <div className="h-12 w-12 rounded-2xl bg-brand-blue/10 text-brand-blue flex items-center justify-center">
                <Package className="h-6 w-6" />
              </div>
            </div>
          </div>

          {/* CHARTS CONTAINER */}
          {mounted ? (
            <div className="mt-12 grid gap-6 lg:grid-cols-3">
              {/* Line/Area Growth Chart */}
              <div className="lg:col-span-2 rounded-3xl border border-border bg-card p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-foreground">Cumulative Sales Growth</h3>
                  <p className="text-xs text-muted-foreground">Timeline progress based on recorded orders</p>
                </div>
                <div className="h-72 w-full mt-6">
                  {growthData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={growthData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorCumulative" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="var(--brand-blue)" stopOpacity={0.2} />
                            <stop offset="95%" stopColor="var(--brand-blue)" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="oklch(0.92 0.01 255)" />
                        <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="oklch(0.5 0.03 260)" />
                        <YAxis tickFormatter={(val) => `₹${val / 1000}k`} tick={{ fontSize: 10 }} stroke="oklch(0.5 0.03 260)" />
                        <Tooltip formatter={(value: number) => [`₹${value.toLocaleString("en-IN")}`, "Cumulative Revenue"]} />
                        <Area
                          type="monotone"
                          dataKey="cumulative"
                          stroke="var(--brand-blue)"
                          strokeWidth={2}
                          fillOpacity={1}
                          fill="url(#colorCumulative)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center text-sm text-muted-foreground">
                      No sales data available to show growth chart.
                    </div>
                  )}
                </div>
              </div>

              {/* Pie Chart & Bar Chart Stack */}
              <div className="grid gap-6 lg:col-span-1">
                {/* Done vs Pending Pie */}
                <div className="rounded-3xl border border-border bg-card p-6 shadow-sm flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-foreground">Order Status Ratio</h3>
                    <p className="text-xs text-muted-foreground">Completed vs pending orders</p>
                  </div>
                  <div className="h-44 w-full relative flex items-center justify-center mt-4">
                    {totalOrders > 0 ? (
                      <>
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
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
                        <div className="absolute text-center">
                          <span className="text-2xl font-black text-foreground block">
                            {Math.round((completedOrders / (totalOrders || 1)) * 100)}%
                          </span>
                          <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">
                            Completed
                          </span>
                        </div>
                      </>
                    ) : (
                      <span className="text-sm text-muted-foreground">No data available</span>
                    )}
                  </div>
                  <div className="flex justify-center gap-6 mt-2 text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-full bg-emerald-700 block" />
                      <span className="text-muted-foreground">Done ({completedOrders})</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-full bg-amber-600 block" />
                      <span className="text-muted-foreground">Pending ({pendingOrders})</span>
                    </div>
                  </div>
                </div>

                {/* Brand breakdown bar chart */}
                <div className="rounded-3xl border border-border bg-card p-6 shadow-sm flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-bold text-foreground">Revenue by Brand</h3>
                    <p className="text-xs text-muted-foreground">Tirth vs Riddhi Siddhi sales performance</p>
                  </div>
                  <div className="h-32 w-full mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={brandChartData} layout="vertical" margin={{ left: -10, right: 10 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="oklch(0.92 0.01 255)" />
                        <XAxis type="number" tickFormatter={(val) => `₹${val / 1000}k`} tick={{ fontSize: 10 }} stroke="oklch(0.5 0.03 260)" />
                        <YAxis dataKey="name" type="category" tick={{ fontSize: 10 }} width={80} stroke="oklch(0.5 0.03 260)" />
                        <Tooltip formatter={(value: number) => `₹${value.toLocaleString("en-IN")}`} />
                        <Bar dataKey="revenue" fill="var(--brand-gold)" radius={[0, 4, 4, 0]} />
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
                <h3 className="text-xl font-bold text-foreground">Sales Registry</h3>
                <p className="text-xs text-muted-foreground">Manage, print bills and edit logs</p>
              </div>

              {/* FILTER / SEARCH */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search company or product..."
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
                    <option value="All">All Statuses</option>
                    <option value="Done">Completed Only</option>
                    <option value="Pending">Pending Only</option>
                  </select>
                </div>
              </div>
            </div>

            {/* TABLE */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-border bg-secondary/5 font-semibold text-muted-foreground text-xs uppercase tracking-wider">
                    <th className="p-4">Date</th>
                    <th className="p-4">Company Name</th>
                    <th className="p-4">Product details</th>
                    <th className="p-4 text-center">Pack Size</th>
                    <th className="p-4 text-right">Quantity</th>
                    <th className="p-4 text-right">Total Revenue</th>
                    <th className="p-4 text-center">Status</th>
                    <th className="p-4 text-center">Actions</th>
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
                            {s.status}
                          </button>
                        </td>
                        <td className="p-4 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <Button
                              onClick={() => setActiveInvoice(s)}
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-brand-blue hover:bg-brand-blue/10 hover:text-brand-blue rounded-lg"
                              title="Print Invoice / Bill"
                            >
                              <Printer className="h-4 w-4" />
                            </Button>
                            <Button
                              onClick={() => handleDelete(s.id)}
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive rounded-lg"
                              title="Delete record"
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
                        No transactions match the search filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
            /* PRODUCT CATALOG MANAGEMENT UI */
            <div className="mt-6 rounded-3xl border border-border bg-card shadow-sm overflow-hidden animate-fade-in">
              <div className="p-6 border-b border-border bg-secondary/15 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold text-foreground">Product Inventory</h3>
                  <p className="text-xs text-muted-foreground">Manage edible chuna brand catalog, packaging, and minimum orders</p>
                </div>
                <Button
                  onClick={() => {
                    resetProductForm();
                    setShowAddProductModal(true);
                  }}
                  className="bg-primary text-primary-foreground hover:bg-brand-blue shadow-md font-semibold self-start sm:self-center"
                >
                  <Plus className="mr-2 h-5 w-5" /> Add New Product
                </Button>
              </div>

              {/* TABLE */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-border bg-secondary/5 font-semibold text-muted-foreground text-xs uppercase tracking-wider">
                      <th className="p-4 w-20">Photo</th>
                      <th className="p-4">Product Name</th>
                      <th className="p-4">Pack / Variant</th>
                      <th className="p-4 text-center">Color Category</th>
                      <th className="p-4">Description</th>
                      <th className="p-4 text-center">Min Qty</th>
                      <th className="p-4 text-center">Actions</th>
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
                              {p.color}
                            </span>
                          </td>
                          <td className="p-4 text-xs text-muted-foreground max-w-xs truncate" title={p.tag}>{p.tag}</td>
                          <td className="p-4 text-center font-bold text-xs text-foreground">
                            {p.minQuantity !== undefined ? `${p.minQuantity} Boxes` : "None"}
                          </td>
                          <td className="p-4 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <Button
                                onClick={() => handleEditProductClick(p)}
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-brand-blue hover:bg-brand-blue/10 hover:text-brand-blue rounded-lg"
                                title="Edit Product"
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
                                title="Delete Product"
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
                          No products found in catalog. Add a new one to begin.
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
              <h3 className="text-xl font-bold text-foreground">Record Offline Bill / Sale</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Add multiple products, prices, and build invoice</p>
            </div>

            <form onSubmit={handleAddSale} className="mt-4 overflow-y-auto flex-1 pr-1 space-y-4 py-2">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="grid gap-1.5">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                    <Building className="h-3 w-3" /> Company / Buyer Name
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
                    <Calendar className="h-3 w-3" /> Dispatch Date
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
                    <Layers className="h-3.5 w-3.5" /> Items Details (Multiple Products)
                  </span>
                  <Button
                    type="button"
                    onClick={handleAddItemRow}
                    size="sm"
                    className="h-8 bg-brand-blue/10 text-brand-blue hover:bg-brand-blue/20 hover:text-brand-blue text-xs font-semibold"
                  >
                    <Plus className="mr-1 h-3.5 w-3.5" /> Add Product
                  </Button>
                </div>

                <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                  {formItems.map((item, idx) => (
                    <div key={idx} className="flex flex-col sm:flex-row gap-3 border border-border/80 bg-secondary/10 p-3 rounded-xl items-end relative">
                      <div className="flex-1 grid gap-1 w-full">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase">Product</label>
                        <select
                          required
                          value={item.product}
                          onChange={(e) => handleItemChange(idx, "product", e.target.value)}
                          className="h-9 rounded-lg border border-border px-2 text-xs focus:outline-none focus:border-brand-gold/60 bg-background w-full"
                        >
                          <option value="" disabled>Select Product</option>
                          {products.map((p) => (
                            <option key={p.id} value={`${p.name} (${p.variant})`}>
                              {p.name} — {p.variant}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="grid gap-1 w-full sm:w-28">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase">Pack Config</label>
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
                        <label className="text-[10px] font-bold text-muted-foreground uppercase">Qty</label>
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
                        <label className="text-[10px] font-bold text-muted-foreground uppercase">Price (₹)</label>
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
                        <label className="text-[10px] font-bold text-muted-foreground uppercase block text-right">Subtotal</label>
                        <span className="h-9 flex items-center justify-end text-xs font-black text-foreground">
                          ₹{(item.total || 0).toLocaleString("en-IN")}
                        </span>
                      </div>

                      {formItems.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveItemRow(idx)}
                          className="h-9 w-9 border border-destructive/20 text-destructive hover:bg-destructive/10 rounded-lg flex items-center justify-center shrink-0 self-end"
                          title="Remove item"
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
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Status: </label>
                  <label className="flex items-center gap-1.5 cursor-pointer text-sm font-medium">
                    <input
                      type="radio"
                      name="status"
                      value="Pending"
                      checked={formStatus === "Pending"}
                      onChange={() => setFormStatus("Pending")}
                      className="accent-brand-blue"
                    />
                    Pending
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
                    Paid / Done
                  </label>
                </div>

                <div className="text-right">
                  <span className="text-xs font-semibold text-muted-foreground uppercase">Estimated Bill Total</span>
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
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-primary text-primary-foreground hover:bg-brand-blue font-semibold"
                >
                  Save Record & Bill
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
                {editingProduct ? "Edit Product Details" : "Add New Product"}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Define catalog features, upload high-quality product photo, and specify min order limits
              </p>
            </div>

            <form onSubmit={handleAddOrEditProduct} className="mt-4 overflow-y-auto flex-1 pr-1 space-y-4 py-2">
              <div className="grid gap-4">
                
                {/* NAME */}
                <div className="grid gap-1.5">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Product Name
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
                    Pack Size / Variant
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
                      Color Category
                    </label>
                    <select
                      value={prodColor}
                      onChange={(e) => setProdColor(e.target.value)}
                      className="h-10 rounded-lg border border-border px-3 text-sm focus:outline-none focus:border-brand-gold/60 bg-background w-full"
                    >
                      <option value="white">White</option>
                      <option value="yellow">Yellow</option>
                      <option value="other">Other / Custom</option>
                    </select>
                  </div>

                  <div className="grid gap-1.5">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      Min Order Quantity (Boxes)
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
                    Short Description / Tagline
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
                    Product Photo
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
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-primary text-primary-foreground hover:bg-brand-blue font-semibold"
                >
                  {editingProduct ? "Update Product" : "Create Product"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PRINT INVOICE MODAL & TEMPLATE */}
      {activeInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 print:bg-white print:p-0 print:block print:static">
          <style>{`
            @media print {
              body {
                background: white !important;
                color: black !important;
              }
              body * {
                visibility: hidden !important;
              }
              #print-invoice-area, #print-invoice-area * {
                visibility: visible !important;
              }
              #print-invoice-area {
                position: relative !important;
                width: 100% !important;
                height: auto !important;
                background: white !important;
                color: black !important;
                padding: 24px !important;
                border: none !important;
                box-shadow: none !important;
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
              title="Close Preview"
            >
              <X className="h-5 w-5" />
            </button>

            <div>
              {/* Header Info */}
              <div className="flex flex-col sm:flex-row sm:justify-between items-start gap-4 pb-6 border-b border-border">
                <div className="leading-tight">
                  <div className="text-2xl font-black text-foreground">
                    Khodiyar <span className="text-brand-gold">Industry</span>
                  </div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-0.5">
                    Premium Edible Chuna · FSSAI #20726061900143
                  </div>
                  <p className="text-xs text-muted-foreground mt-3 max-w-xs">
                    Kachiyavalo Kuvo, Badarkha,<br />Ahmedabad, Gujarat — 387810
                  </p>
                </div>
                <div className="text-left sm:text-right text-xs text-muted-foreground space-y-1">
                  <div className="font-bold text-foreground uppercase tracking-wider text-sm mb-1">Tax Invoice / Bill</div>
                  <div><strong>Invoice No:</strong> INV-2026-{activeInvoice.id.replace("s_", "")}</div>
                  <div><strong>Date:</strong> {activeInvoice.date}</div>
                  <div><strong>Terms:</strong> {activeInvoice.status === "Done" ? "PAID (Done)" : "PENDING COLLECTION"}</div>
                </div>
              </div>

              {/* Bill To */}
              <div className="py-6 border-b border-border">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">Billed To / Buyer</span>
                <span className="text-base font-bold text-foreground block mt-1">{activeInvoice.company}</span>
                <span className="text-xs text-muted-foreground block mt-0.5">B2B Wholesale Customer</span>
              </div>

              {/* Items Table */}
              <div className="py-6">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-border/85 font-bold text-muted-foreground uppercase text-[10px] tracking-wider">
                      <th className="pb-3 w-8">#</th>
                      <th className="pb-3">Product Description</th>
                      <th className="pb-3 text-center">Pack Size</th>
                      <th className="pb-3 text-right w-16">Qty</th>
                      <th className="pb-3 text-right w-24">Price (₹)</th>
                      <th className="pb-3 text-right w-24">Total (₹)</th>
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
                  <div className="font-bold text-foreground">Declaration & Terms:</div>
                  <p className="leading-relaxed">
                    This bill represents official dispatch records of Khodiyar Industry. Edible chuna products are manufactured under food safety license FSSAI requirements.
                  </p>
                </div>

                {/* Subtotals */}
                <div className="w-full sm:w-64 space-y-1.5 text-xs text-right">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Taxable Value (Subtotal):</span>
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
                    <span>Grand Total (INR):</span>
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
                  Close Preview
                </Button>
                <Button
                  onClick={() => window.print()}
                  className="bg-emerald-700 text-white hover:bg-emerald-800 font-semibold"
                >
                  <Printer className="mr-2 h-4 w-4" /> Print Bill
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
                  <p className="mt-2 text-[10px]">Authorized Signatory</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </SiteLayout>
  );
}
