"use client";

import { useState, useEffect, useRef } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  MapPin, Trash2, Search, ChevronDown,
  PlusCircle, User, Package, Heart, Settings,
  LogOut, ChevronRight, Mail, X, CheckCircle2,
  Loader2, AlertCircle, RefreshCw, Gift
} from "lucide-react";
import { useCartStore } from "@/store/cartStore";

interface SavedAddress {
  _id: string;
  label: string;
  name: string;
  phone: string;
  district: string;
  thana: string;
  homeAddress: string;
  isDefault: boolean;
}

interface OrderItem {
  productId: string | null;
  name: string;
  qty: number;
  unitPrice: number;
}

interface StatusHistoryEntry {
  status: string;
  changedAt: string;
}

interface Order {
  _id: string;
  orderId: string;
  customerPhone: string;
  totalAmount: number;
  deliveryCharge: number;
  paymentStatus: "PAID" | "PENDING" | "FAILED";
  deliveryStatus: string;
  items: OrderItem[];
  statusHistory: StatusHistoryEntry[];
  createdAt: string;
}

interface WishlistProduct {
  _id: string;
  title: string;
  price: number;
  discountPrice: number | null;
  images?: string[];
  slug: string;
}

interface LoyaltyTransaction {
  _id: string;
  type: "earned" | "redeemed" | "refunded";
  points: number;
  description: string;
  createdAt: string;
}

interface UserProfile {
  name: string;
  email: string;
  phone?: string;
  dob?: string;
  gender?: string;
  addresses: SavedAddress[];
}

const locationData: Record<string, string[]> = {
  "Norshingdi": ["Sadar", "Monorhordi", "Shibpur", "Palash", "Belab", "Raipura"],
  "Narayangonj": ["Sadar", "Bandor", "Sonargaon", "Arai Hazar", "Rupgonj"],
  "Munshigonj": ["Sadar", "Tungibari", "Louhagonj", "Sree Nagar", "Sirajdi Khan", "Gazaria"],
  "Gazipur": ["Sadar", "Tongi", "kaligonj", "Kaliakoir", "Kapashia", "Sreepur"],
  "Manikgonj": ["Sadar", "Singair", "Daulatpur", "Horirampur", "Gheor", "Shibaloy", "Saturia"],
  "Dhaka": ["Kotwali", "Mohammadpur", "Lalbagh", "Sutrapur", "Motijgil", "Demra", "Sabujbagh", "Mirpur", "Gulshan", "Uttara", "Pallabi", "Cantonment", "Dhanmondi", "Tejgaon", "Ramna", "Keranigonj", "Dohar", "Nawabgonj", "Savar", "Dhamrai"],
  "Faridpur": ["Sadar", "Boalmari", "Sadarpur", "Char Bhadrashon", "Bhanga", "Nagarkanda", "Madhukhali", "Alphadanga", "SalThanaa"],
  "Rajbari": ["Sadar", "Pangsha", "Goalondo", "Kalukhali", "Baliakandi"],
  "Gopalgonj": ["Sadar", "kashiani", "Tongipara", "Muksudpur", "Kotalipara"],
  "Madaripur": ["Sadar", "Kalkini", "Rajoir", "Shibchar"],
  "Sariyatpur": ["Sadar", "Damudda", "Noria", "Jagira", "Vedorgonj", "Goshair Hat"],
  "Borguna": ["Sadar", "Amtoli", "Betagi", "Taltoli", "PaThanaorghata", "Bamna"],
  "Bhola": ["Sadar", "Daulatkhan", "Lalmohon", "Monpura", "Charfassion", "Tajumuddin", "Borhanuddin"],
  "Jhaloka Thanai": ["Sadar", "Nalchiti", "Rajapur", "KaThanaalia"],
  "Barishal": ["Sadar", "Muladi", "Gournadi", "Agoil Jhora", "Hijla", "Ujirpur", "Mehedigonj", "Babugonj", "Bakergonj", "Banaripara"],
  "Patuakhali": ["Sadar", "Golachipa", "Kolapara", "Dosmina", "Bauphal", "Rangabali", "Dumki", "Mirjagonj"],
  "Perojpur": ["Sadar", "Mo Thanabaria", "Nazirpur", "Nesarabad", "Zianagar", "kaukhali", "Bhandaria"],
  "Khulna": ["Sadar Thana", "Sonadanga", "Daulatpur", "Phultola", "Dumuria", "Terokhada", "Degholia", "Rupsha", "Batiaghata", "Dakop", "Koira"],
  "Norail": ["Sadar", "Kalia", "Lohagora"],
  "Magura": ["Sadar", "Sreepur", "Salikha", "Mohammadpur"],
  "Satkhira": ["Sadar", "Shyam nagar", "Assa suni", "Tala", "Kaligonj", "Kolaroa", "Debhata"],
  "Bagerhat": ["Sadar", "Kochua", "Rampal", "Saron Khola", "Morolgonj", "Mollarhat", "Chitolmari", "Fakirhat", "Mongla"],
  "Jhenaidah": ["Sadar", "kaligonj", "Kot Chandpur", "Horina Kundu", "Shyola Kupa", "Moheshpur"],
  "Jessore": ["Sadar", "Keshobpur", "Jhikor gacha", "Monirampur", "Bagharpara", "Chowgacha", "Sharsha", "Avoynagar"],
  "Meherpur": ["Sadar", "Gangni", "Mujib Nagar"],
  "Chuadanga": ["Sadar", "Jibon Nagar", "Damur Huda", "Almdanga"],
  "Kushtia": ["Sadar", "Kumarkhali", "Daulatpur", "Bheramara", "Khoksha", "Mirpur"],
  "Sylhet": ["Sadar", "Gopalgonj", "Biwanibazar", "Jokigonj", "Companigonj", "Jaintapur", "Daxin Surma", "Fenchugonj", "Bishwana Thana", "Balagonj", "Gowainghat", "Kanaighat"],
  "Sunamgonj": ["Sadar", "Jamalgonj", "Jaganna Thanapur", "Sulla", "Dharam Pasha", "Bishwambharpur", "Sou Thana Sunamgonj", "Satok", "Deora Bazar", "Derai", "Tahirpur"],
  "Mowlovibazar": ["Sadar", "Rajnagar", "Kulaura", "Juri", "Boro Lekha", "Komolgonj", "Srimangal"],
  "Hobigonj": ["Sadar", "Bahubal", "Lakhai", "Nobigonj", "Chunarughat", "Madhabpur", "Benia Chang", "Ajmirigonj"],
  "Tangail": ["Sadar", "Delduar", "Mirjapur", "Bhuapur", "Ghatail", "Bashail", "Nagorpur", "Kalihati", "Sokhipur", "Gopalpur", "Dhanbari", "Madhupur"],
  "Keshoregonj": ["Sadar", "Hossainpur", "Karimgonj", "Pakundia", "Nikli", "Bajitpur", "Kuliarchar", "Bhairab", "MeThanaa Moin", "Itna", "Kotiadi", "Osto gram", "Tarail"],
  "Netrokona": ["Sadar", "Atpara", "Barhatta", "Mohongonj", "Kalmakanda", "Durgapur", "Madan", "Kendua", "Purbodhola", "Khalia Juri"],
  "Jamalpur": ["Sadar", "Islampur", "Dewangonj", "Sarisha Bari", "Madargonj", "Bokshigonj", "Melandaha"],
  "Sherpur": ["Sadar", "Nalka", "Nalitabari", "Jhenaigati", "Sribordi"],
  "Mymensingh": ["Sadar", "Muktagacha", "Phulbaria", "Bhaluka", "Trishal", "Gofor gaon", "Nandail", "Ishwargonj", "Dhobaura", "Gouripur", "Phulpur", "Haluaghat", "Tarakanda"],
  "Noakhali": ["Sadar", "Begumgonj", "Companigonj", "Subornocha", "Sunaimuri", "Chatkhil", "Shenbagh", "Kabirhat", "Hatia"],
  "Feni": ["Sadar", "Dagon Bhuiyan", "Fulgazi", "Porshuram", "Sagalnaiya", "Sonagazi"],
  "Laxmipur": ["Sadar", "Raipur", "Ramgoti", "Ramgonj", "Kamalnagar"],
  "Chandpur": ["Sadar", "Matlab Sou Thana", "Faridgonj", "Hajigonj", "Haimchar", "Matlab Nor Thana", "Kochua", "Shaharasti"],
  "B. Baria": ["Sadar", "Sarail", "Kosba", "Bancharampur", "Nabinagar", "Bijoy Nagar", "Ashugonj", "Akhaura", "Nasir Nagar"],
  "Comilla": ["Sadar Adarsho", "Sadar Sou Thana", "Brahman Para", "Daoud Kandi", "Buri Chang", "Choddo Gram", "Laksham", "Monohorgonj", "Meghna", "Homna", "Titas", "Nangolkot", "Muradnagar", "Barura", "Chandina", "Dabidar"],
  "Chittagonj": ["Kotwali", "Panchlaish", "Chandgaon", "Bandor", "Pahartoli", "Double Muring", "Anwara", "Putia", "Boalkhali", "Satkania", "Chanda Naish", "Bash Khali", "Lohagora", "Sandip", "HaThanaajari", "Mirasharai", "Fatik Chari", "Rangunia", "Sitakundu", "Raujan"],
  "Cox's Bazar": ["Sadar", "Moheshkhali", "Kutubdia", "Teknaf", "Ramu", "Ukhia", "Chokoria", "Pekua"],
  "Khagrachari": ["Sadar", "Panchari", "Mohalchari", "Dighinala", "Matiranga", "Laxmichari", "Manikchari", "Ramgarh"],
  "Bandarbon": ["Sadar", "Thanaanchi", "Ruma", "Roang chari", "Alikadam", "Lama", "Naikhang Chari"],
  "Rangamati": ["Sadar", "Barkal", "Longodu", "Baghaichari", "Naniar Char", "Kao Khali", "Rajas Thanaali", "Belaichari", "Jurachari", "kaptai"],
  "Bogra": ["Sadar", "Shajahanpur", "Saria Kandi", "Shibgonj", "Gabtoli", "Dhunot", "Sonatola", "Dupchachia", "Adamdighi", "Nandigram", "Sherpur", "Kahalu"],
  "Pabna": ["Sadar", "Atghoria", "Ishwardi", "Bera", "SaThanaia", "Sujanagar", "Chatmohor", "Bhangura", "Faridpur"],
  "Rajshahi": ["Boalia", "Rajpara", "Poba", "Putia", "Charghat", "Tanor", "Baghmara", "Bagha", "Mohonpur", "Godagri", "Durgapur"],
  "Natore": ["Sadar", "Singra", "Bagatipara", "Boraigram", "Gurudaspur", "Lalpur", "Naldanga"],
  "Chapai N. Gonj": ["Sadar", "Shibgonj", "Gomostapur", "Nachol", "Bholahat"],
  "Nogaon": ["Sadar", "Raninagar", "Atrai", "Niamatpur", "Porsha", "Sapahar", "Manda", "Dhamorhat", "Badalgachi", "Potnitola", "Mohadebpur"],
  "Joipurhat": ["Sadar", "Akkelpur", "Kalai", "Panch bibi", "Khetlal"],
  "Sirajgonj": ["Sadar", "Kamar Khand", "Belkuchi", "Kazipur", "Chowhali", "Shahadpur", "Tarash", "Ullapara", "Roygonj"],
  "Nilphamari": ["Sadar", "Dimla", "Jaldhaka", "Domar", "Keshoregonj", "Saidpur"],
  "Thanaakurgaon": ["Sadar", "Baliadangi", "Pirgonj", "Horipur", "Ranisankail"],
  "Gaibandha": ["Sadar", "Gobindagonj", "Phulchari", "Saghat", "Sundargonj", "Palashbari", "Sadullapur"],
  "Lalmonirhat": ["Sadar", "Aditmari", "Hatibandha", "Kaligonj", "Patgram"],
  "Kurigram": ["Sadar", "Rowmari", "Rajippur", "Chilmari", "Ulipur", "Rajarhat", "Phulbari", "Nageshwori", "Bhurungamari"],
  "Dinajpur": ["Sadar", "Parbotipur", "Phulbari", "Birampur", "Hakimpur", "Nawabgonj", "Ghoraghat", "Bochagonj", "Berol", "Kaharol", "Birgonj", "Khansama", "Chirir Bandor"],
  "Rangpur": ["Sadar", "Gongachora", "Badargonj", "Taragonj", "Kaunia", "Pirgacha", "Me Thanaapukur", "Pirgonj"],
  "Panchagarh": ["Sadar", "Atwori", "Boda", "Debigonj", "Tetulia"]
};
const districtList = Object.keys(locationData).sort();

const NON_CANCELLABLE_STATUSES = ["Delivered", "Completed", "Cancelled", "Returned"];

function getImageUrl(image: unknown): string {
  if (!image) return "";
  if (typeof image === "string") return image;
  if (typeof image === "object" && image !== null && "url" in (image as any)) {
    return (image as any).url;
  }
  return "";
}

export default function DashboardPage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");

  const { addItem, openCart } = useCartStore();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [wishlist, setWishlist] = useState<WishlistProduct[]>([]);
  const [loyaltyBalance, setLoyaltyBalance] = useState(0);
  const [loyaltyTransactions, setLoyaltyTransactions] = useState<LoyaltyTransaction[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [dataError, setDataError] = useState("");

  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [label, setLabel] = useState("Home");
  const [customLabel, setCustomLabel] = useState("");
  const [addrName, setAddrName] = useState("");
  const [addrPhone, setAddrPhone] = useState("");
  const [district, setDistrict] = useState("");
  const [thana, setThana] = useState("");
  const [homeAddress, setHomeAddress] = useState("");
  const [isSubmittingAddress, setIsSubmittingAddress] = useState(false);

  const [isDistrictOpen, setIsDistrictOpen] = useState(false);
  const [districtSearch, setDistrictSearch] = useState("");
  const [isThanaOpen, setIsThanaOpen] = useState(false);
  const [thanaSearch, setThanaSearch] = useState("");
  const [addressError, setAddressError] = useState("");

  const districtRef = useRef<HTMLDivElement>(null);
  const thanaRef = useRef<HTMLDivElement>(null);

  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [cancelTargetId, setCancelTargetId] = useState<string | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelError, setCancelError] = useState("");
  const [deleteAddressTargetId, setDeleteAddressTargetId] = useState<string | null>(null);

  const [reorderingId, setReorderingId] = useState<string | null>(null);
  const [reorderResult, setReorderResult] = useState<{ added: number; unavailable: string[] } | null>(null);

  const [settingsName, setSettingsName] = useState("");
  const [settingsPhone, setSettingsPhone] = useState("");
  const [settingsDob, setSettingsDob] = useState("");
  const [settingsGender, setSettingsGender] = useState("");
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileSavedMsg, setProfileSavedMsg] = useState("");
  const [profileSavedOk, setProfileSavedOk] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  const loadDashboardData = async () => {
    setLoadingData(true);
    setDataError("");
    try {
      const [meRes, ordersRes, wishlistRes, loyaltyRes] = await Promise.all([
        fetch("/api/users/me"),
        fetch("/api/orders/my-orders"),
        fetch("/api/users/wishlist"),
        fetch("/api/loyalty/me"),
      ]);

      if (!meRes.ok) throw new Error("Failed to load profile");

      const meData = await meRes.json();
      const ordersData = ordersRes.ok ? await ordersRes.json() : [];
      const wishlistData = wishlistRes.ok ? await wishlistRes.json() : [];
      const loyaltyData = loyaltyRes.ok ? await loyaltyRes.json() : { balance: 0, transactions: [] };

      setProfile(meData);
      setOrders(Array.isArray(ordersData) ? ordersData : []);
      setWishlist(Array.isArray(wishlistData) ? wishlistData : []);
      setLoyaltyBalance(loyaltyData.balance || 0);
      setLoyaltyTransactions(Array.isArray(loyaltyData.transactions) ? loyaltyData.transactions : []);

      setSettingsName(meData.name || "");
      setSettingsPhone(meData.phone || "");
      setSettingsDob(meData.dob || "");
      setSettingsGender(meData.gender || "");
    } catch (err) {
      console.error(err);
      setDataError("Dashboard data load করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।");
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      loadDashboardData();
    }
  }, [status]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (districtRef.current && !districtRef.current.contains(event.target as Node)) setIsDistrictOpen(false);
      if (thanaRef.current && !thanaRef.current.contains(event.target as Node)) setIsThanaOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (status === "loading" || (status === "authenticated" && loadingData)) {
    return (
      <div className="min-h-screen flex items-center justify-center gap-2 text-gray-500 font-semibold text-sm">
        <Loader2 size={18} className="animate-spin text-[#1f4294]" /> Loading your dashboard...
      </div>
    );
  }

  if (status === "unauthenticated" || !profile) {
    return null;
  }

  const toggleOrderExpand = (id: string) => {
    setExpandedOrderId(expandedOrderId === id ? null : id);
  };

  const handleCancelOrder = async () => {
    if (!cancelTargetId) return;
    setIsCancelling(true);
    setCancelError("");
    try {
      const res = await fetch(`/api/orders/${cancelTargetId}/cancel`, { method: "PATCH" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Cancel failed");

      setOrders((prev) => prev.map((o) => (o._id === cancelTargetId ? data : o)));
      setCancelTargetId(null);
    } catch (err: any) {
      setCancelError(err.message);
    } finally {
      setIsCancelling(false);
    }
  };

  const handleReorder = async (order: Order) => {
    setReorderingId(order._id);
    setReorderResult(null);

    try {
      const productIds = order.items
        .map((item) => item.productId)
        .filter((id): id is string => !!id);

      const productsById: Record<string, any> = {};

      if (productIds.length > 0) {
        const res = await fetch("/api/products/batch", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ids: productIds }),
        });
        if (res.ok) {
          const data = await res.json();
          (data.products || []).forEach((p: any) => {
            productsById[String(p._id)] = p;
          });
        }
      }

      let addedCount = 0;
      const unavailable: string[] = [];

      order.items.forEach((item) => {
        const product = item.productId ? productsById[item.productId] : null;

        if (!product || product.isActive === false || !product.stock || product.stock <= 0) {
          unavailable.push(item.name);
          return;
        }

        const displayPrice =
          product.isFlashSale && product.flashSalePrice ? product.flashSalePrice : product.price;
        const qtyToAdd = Math.min(item.qty, product.stock);

        addItem(
          {
            _id: product._id,
            name: product.name || product.title || item.name,
            slug: product.slug,
            image: getImageUrl(product.images?.[0]),
            price: displayPrice,
            originalPrice: product.originalPrice ?? displayPrice,
            category: product.category || "",
            brand: product.brand || "",
            stock: product.stock,
          },
          qtyToAdd
        );
        addedCount += 1;
      });

      setReorderResult({ added: addedCount, unavailable });
      if (addedCount > 0) {
        openCart();
      }
    } catch (err) {
      console.error("Reorder failed:", err);
      setReorderResult({ added: 0, unavailable: order.items.map((i) => i.name) });
    } finally {
      setReorderingId(null);
    }
  };

  const handleSetPrimaryAddress = async (addressId: string) => {
    const res = await fetch("/api/users/addresses", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ addressId }),
    });
    if (res.ok) {
      const updatedAddresses = await res.json();
      setProfile((prev) => (prev ? { ...prev, addresses: updatedAddresses } : prev));
    }
  };

  const handleDeleteAddress = async () => {
    if (!deleteAddressTargetId) return;
    const res = await fetch("/api/users/addresses", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ addressId: deleteAddressTargetId }),
    });
    if (res.ok) {
      const updatedAddresses = await res.json();
      setProfile((prev) => (prev ? { ...prev, addresses: updatedAddresses } : prev));
    }
    setDeleteAddressTargetId(null);
  };

  const handlePhoneChange = (val: string) => {
    setAddrPhone(val.replace(/\D/g, ""));
  };

  const handleAddAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddressError("");

    if (!addrName.trim() || !addrPhone.trim() || !district || !thana || !homeAddress.trim()) {
      setAddressError("Please fill out all mandatory fields.");
      return;
    }
    if (!addrPhone.startsWith("0") || addrPhone.length !== 11) {
      setAddressError("Phone number must be exactly 11 digits.");
      return;
    }

    const finalLabel = label === "Others" ? (customLabel.trim() || "Others") : label;

    setIsSubmittingAddress(true);
    try {
      const res = await fetch("/api/users/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          label: finalLabel,
          name: addrName.trim(),
          phone: addrPhone.trim(),
          district, thana,
          homeAddress: homeAddress.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Address save failed");

      setProfile((prev) => (prev ? { ...prev, addresses: data } : prev));
      setIsAddressModalOpen(false);
      setAddrName(""); setAddrPhone(""); setDistrict(""); setThana(""); setHomeAddress(""); setLabel("Home");
    } catch (err: any) {
      setAddressError(err.message);
    } finally {
      setIsSubmittingAddress(false);
    }
  };

  const handleRemoveFromWishlist = async (productId: string) => {
    setWishlist((prev) => prev.filter((p) => p._id !== productId));
    await fetch("/api/users/wishlist", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId }),
    });
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    setProfileSavedMsg("");
    try {
      const res = await fetch("/api/users/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: settingsName,
          phone: settingsPhone,
          dob: settingsDob,
          gender: settingsGender,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed");

      setProfile((prev) => (prev ? { ...prev, ...data } : prev));

      await update({ name: data.name, phone: data.phone });

      setProfileSavedOk(true);
      setProfileSavedMsg("Profile updated successfully!");
      setTimeout(() => setProfileSavedMsg(""), 3000);
    } catch (err) {
      setProfileSavedOk(false);
      setProfileSavedMsg("Something went wrong. Please try again.");
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleLogout = () => {
    signOut({ callbackUrl: "/" });
  };

  const filteredDistricts = districtList.filter((d) =>
    d.toLowerCase().includes(districtSearch.toLowerCase())
  );
  const filteredThanas = (locationData[district] || []).filter((t) =>
    t.toLowerCase().includes(thanaSearch.toLowerCase())
  );

  const activeOrdersCount = orders.filter((o) => o.deliveryStatus !== "Cancelled").length;

  return (
    <div className="min-h-screen bg-gray-50/60 py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 md:px-6">

        {dataError && (
          <div className="mb-6 bg-red-50 border border-red-100 text-red-600 text-sm font-semibold p-4 rounded-xl flex items-center gap-2">
            <AlertCircle size={16} /> {dataError}
          </div>
        )}

        <div className="mb-10 bg-white border border-gray-100 rounded-2xl p-6 md:p-8 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-gray-800 flex items-center gap-2 capitalize tracking-tight">
              Welcome back, {profile.name}!
            </h1>
            <p className="text-sm text-gray-500 mt-1 font-medium">
              Manage your profile, track shipments, and control your saved defaults.
            </p>
          </div>
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="bg-blue-50/80 border border-blue-100 rounded-xl px-5 py-3 text-center flex-1 md:flex-none">
              <p className="text-[11px] font-black text-gray-400 uppercase tracking-wider">Total Orders</p>
              <p className="text-xl font-black text-[#1f4294] mt-0.5">{activeOrdersCount}</p>
            </div>
            <div className="bg-red-50/60 border border-red-100 rounded-xl px-5 py-3 text-center flex-1 md:flex-none">
              <p className="text-[11px] font-black text-gray-400 uppercase tracking-wider">Wishlist</p>
              <p className="text-xl font-black text-red-500 mt-0.5">{wishlist.length}</p>
            </div>
            <div className="bg-amber-50/70 border border-amber-100 rounded-xl px-5 py-3 text-center flex-1 md:flex-none">
              <p className="text-[11px] font-black text-gray-400 uppercase tracking-wider">Points</p>
              <p className="text-xl font-black text-amber-600 mt-0.5">{loyaltyBalance}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">

          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-1.5 lg:sticky lg:top-24">

            <div className="flex flex-col items-center text-center p-5 border-b border-gray-100 mb-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#1a1a2e] to-[#2c2769] text-white flex items-center justify-center text-2xl font-black shadow-md uppercase mb-3">
                {profile.name[0]}
              </div>
              <h4 className="text-base font-black text-gray-800 capitalize truncate w-full tracking-tight">{profile.name}</h4>
              <p className="text-xs text-gray-400 mt-1 truncate w-full font-medium flex items-center justify-center gap-1">
                <Mail size={12} /> {profile.email}
              </p>
            </div>

            <p className="px-3 py-1 text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1">Navigation Menu</p>

            {[
              { id: "overview", label: "Overview Status", icon: <User size={16} /> },
              { id: "orders", label: "My Order History", icon: <Package size={16} /> },
              { id: "wishlist", label: "My Wishlist", icon: <Heart size={16} /> },
              { id: "loyalty", label: "Loyalty Points", icon: <Gift size={16} /> },
              { id: "addresses", label: "Manage Addresses", icon: <MapPin size={16} /> },
              { id: "settings", label: "Profile Information", icon: <Settings size={16} /> },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center justify-between px-4 py-3.5 text-sm font-bold rounded-xl transition-all cursor-pointer relative group ${
                    isActive ? "bg-[#eeedf5] text-[#1f4294] font-black shadow-sm" : "text-gray-600 hover:bg-gray-50/80"
                  }`}
                >
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-7 bg-[#1f4294] rounded-r-full" />
                  )}
                  <div className={`flex items-center gap-3.5 ${isActive ? 'pl-2' : ''} transition-all`}>
                    <span className={isActive ? "text-[#1f4294]" : "text-gray-400"}>{tab.icon}</span>
                    <span>{tab.label}</span>
                  </div>
                  <ChevronRight size={14} className={isActive ? "text-[#1f4294]" : "text-gray-300 group-hover:translate-x-0.5 transition-transform"} />
                </button>
              );
            })}

            <div className="pt-3 border-t border-gray-100 mt-3">
              <button onClick={handleLogout} className="w-full flex items-center gap-3.5 px-4 py-3.5 text-sm font-bold text-red-500 hover:bg-red-50/60 rounded-xl text-left cursor-pointer transition-colors">
                <LogOut size={16} /> <span>Log Out</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-3 bg-white border border-gray-100 rounded-2xl p-6 md:p-8 shadow-sm min-h-[560px]">

            {activeTab === "overview" && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="border-b border-gray-100 pb-4">
                  <h2 className="text-lg font-black text-gray-800 tracking-tight">Account Overview</h2>
                  <p className="text-xs text-gray-400 mt-0.5 font-medium">Your registered account profile details.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="bg-gray-50/50 border border-gray-100 p-5 rounded-xl">
                    <p className="text-[11px] font-black text-gray-400 uppercase tracking-wider">Full Name</p>
                    <p className="text-sm font-bold text-gray-800 capitalize mt-1.5">{profile.name}</p>
                  </div>
                  <div className="bg-gray-50/50 border border-gray-100 p-5 rounded-xl">
                    <p className="text-[11px] font-black text-gray-400 uppercase tracking-wider">Phone Number</p>
                    <p className="text-sm font-bold text-gray-800 mt-1.5">{profile.phone || "Not Configured Yet"}</p>
                  </div>
                  <div className="bg-gray-50/50 border border-gray-100 p-5 rounded-xl sm:col-span-2">
                    <p className="text-[11px] font-black text-gray-400 uppercase tracking-wider">Email Address</p>
                    <p className="text-sm font-bold text-gray-800 mt-1.5 break-all">{profile.email}</p>
                  </div>
                  <div className="bg-gray-50/50 border border-gray-100 p-5 rounded-xl">
                    <p className="text-[11px] font-black text-gray-400 uppercase tracking-wider">Date of Birth</p>
                    <p className="text-sm font-bold text-gray-800 mt-1.5">{profile.dob || "Unspecified"}</p>
                  </div>
                  <div className="bg-gray-50/50 border border-gray-100 p-5 rounded-xl">
                    <p className="text-[11px] font-black text-gray-400 uppercase tracking-wider">Gender</p>
                    <p className="text-sm font-bold text-gray-800 mt-1.5">{profile.gender || "Unspecified"}</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "orders" && (
              <div className="space-y-5 animate-in fade-in duration-200">
                <div className="border-b border-gray-100 pb-4">
                  <h2 className="text-lg font-black text-gray-800 tracking-tight">Order History ({orders.length})</h2>
                  <p className="text-xs text-gray-400 mt-0.5 font-medium">Expand any order to see its live tracking timeline.</p>
                </div>

                {reorderResult && (
                  <div
                    className={`text-xs font-bold p-3.5 rounded-xl flex items-start justify-between gap-3 ${
                      reorderResult.added > 0
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                        : "bg-red-50 text-red-600 border border-red-100"
                    }`}
                  >
                    <span>
                      {reorderResult.added > 0 && `${reorderResult.added} item(s) added to your cart. `}
                      {reorderResult.unavailable.length > 0 &&
                        `${reorderResult.unavailable.length} item(s) no longer available: ${reorderResult.unavailable.join(", ")}.`}
                      {reorderResult.added === 0 && reorderResult.unavailable.length === 0 &&
                        "None of the items in this order could be re-added."}
                    </span>
                    <button onClick={() => setReorderResult(null)} className="shrink-0 hover:opacity-70 cursor-pointer">
                      <X size={14} />
                    </button>
                  </div>
                )}

                {orders.length === 0 ? (
                  <div className="text-center py-16 text-gray-400 text-sm font-medium italic border border-dashed border-gray-200 rounded-xl bg-gray-50/40">
                    You haven't placed any orders yet.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => {
                      const isExpanded = expandedOrderId === order._id;
                      const isPaid = order.paymentStatus === "PAID";
                      const canCancel = !NON_CANCELLABLE_STATUSES.includes(order.deliveryStatus);
                      const itemsLabel = order.items.map((i) => `${i.name} (x${i.qty})`).join(", ");
                      const isReordering = reorderingId === order._id;

                      return (
                        <div key={order._id} className="border border-gray-100 rounded-xl overflow-hidden shadow-sm bg-white">
                          <div
                            onClick={() => toggleOrderExpand(order._id)}
                            className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-50/30 hover:bg-gray-50/60 transition-colors cursor-pointer select-none"
                          >
                            <div className="space-y-1.5 min-w-0 flex-1">
                              <div className="flex items-center gap-2.5">
                                <span className="text-sm font-black text-gray-800">Order #{order.orderId}</span>
                                <span className="text-xs text-gray-400 font-semibold">
                                  {new Date(order.createdAt).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}
                                </span>
                              </div>
                              <div className="text-xs font-bold text-[#1f4294] truncate">{itemsLabel}</div>
                            </div>

                            <div className="flex items-center justify-between md:justify-end gap-6 flex-shrink-0">
                              <div className="text-left md:text-right">
                                <p className="text-sm font-black text-gray-800">৳{order.totalAmount.toFixed(2)}</p>
                                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded border ${
                                  isPaid ? "text-emerald-600 bg-emerald-50 border-emerald-100" : "text-amber-600 bg-amber-50 border-amber-100"
                                }`}>
                                  {isPaid ? "PAID" : "UNPAID"}
                                </span>
                              </div>

                              <div className="flex items-center gap-3">
                                <span className={`text-[11px] font-black uppercase px-3 py-1 rounded-full tracking-wider ${
                                  order.deliveryStatus === "Delivered" || order.deliveryStatus === "Completed" ? "bg-green-50 text-green-600" :
                                  order.deliveryStatus === "Cancelled" || order.deliveryStatus === "Returned" ? "bg-red-50 text-red-600" : "bg-blue-50 text-blue-600"
                                }`}>
                                  {order.deliveryStatus}
                                </span>

                                <button
                                  onClick={(e) => { e.stopPropagation(); handleReorder(order); }}
                                  disabled={isReordering}
                                  className="text-xs font-bold bg-[#1f4294] hover:bg-[#16337a] text-white px-3 py-1.5 rounded-lg transition-all cursor-pointer disabled:opacity-60 flex items-center gap-1.5"
                                >
                                  {isReordering ? <Loader2 size={12} className="animate-spin" /> : <RefreshCw size={12} />}
                                  {isReordering ? "Adding..." : "Reorder"}
                                </button>

                                {canCancel && (
                                  <button
                                    onClick={(e) => { e.stopPropagation(); setCancelError(""); setCancelTargetId(order._id); }}
                                    className="text-xs font-bold bg-white text-red-500 border border-red-200 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-all cursor-pointer"
                                  >
                                    Cancel
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>

                          {isExpanded && (
                            <div className="p-6 bg-white border-t border-gray-100 animate-in slide-in-from-top-3 duration-300">
                              <p className="text-xs font-black text-gray-400 uppercase tracking-wider mb-5">Tracking Timeline</p>

                              <div className="space-y-0.5 pl-1.5">
                                {order.statusHistory.map((step, idx) => {
                                  const isLast = idx === order.statusHistory.length - 1;
                                  return (
                                    <div key={idx} className="flex gap-4">
                                      <div className="flex flex-col items-center flex-shrink-0 relative">
                                        <div className="w-5 h-5 rounded-full flex items-center justify-center z-10 bg-[#1f4294] text-white shadow-sm">
                                          <CheckCircle2 size={13} />
                                        </div>
                                        {!isLast && <div className="w-0.5 h-14 -my-0.5 bg-[#1f4294]" />}
                                      </div>
                                      <div className="pb-6 pt-0.5 flex-1">
                                        <div className="flex items-center justify-between gap-3">
                                          <h5 className="text-sm font-bold text-gray-800">{step.status}</h5>
                                          <span className="text-xs text-gray-400 font-medium">
                                            {new Date(step.changedAt).toLocaleString("en-US", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {activeTab === "wishlist" && (
              <div className="space-y-5 animate-in fade-in duration-200">
                <div className="border-b border-gray-100 pb-4">
                  <h2 className="text-lg font-black text-gray-800 tracking-tight">Saved Wishlist ({wishlist.length})</h2>
                  <p className="text-xs text-gray-400 mt-0.5 font-medium">Products you've bookmarked for later.</p>
                </div>

                {wishlist.length === 0 ? (
                  <div className="text-center py-16 text-gray-400 text-sm font-medium italic border border-dashed border-gray-200 rounded-xl bg-gray-50/40">
                    Your wishlist is empty.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {wishlist.map((p) => {
                      const price = p.discountPrice && p.discountPrice > 0 ? p.discountPrice : p.price;
                      return (
                        <div key={p._id} className="border border-gray-100 rounded-2xl p-4 flex gap-4 items-center bg-white">
                          <Link href={`/products/${p.slug}`} className="w-16 h-16 bg-gray-50 border border-gray-100 rounded-xl overflow-hidden shrink-0">
                            {p.images?.[0] ? (
                              <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover" />
                            ) : null}
                          </Link>
                          <div className="flex-1 min-w-0">
                            <Link href={`/products/${p.slug}`} className="text-sm font-bold text-gray-800 line-clamp-1 hover:text-[#1f4294]">{p.title}</Link>
                            <p className="text-sm font-black text-[#1f4294] mt-1">৳{price}</p>
                          </div>
                          <button onClick={() => handleRemoveFromWishlist(p._id)} className="text-gray-300 hover:text-red-500 p-1.5 rounded-md transition-colors cursor-pointer">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {activeTab === "loyalty" && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="border-b border-gray-100 pb-4">
                  <h2 className="text-lg font-black text-gray-800 tracking-tight">Loyalty Points</h2>
                  <p className="text-xs text-gray-400 mt-0.5 font-medium">
                    Earn points on delivered orders, redeem them for discounts at checkout.
                  </p>
                </div>

                <div className="bg-gradient-to-br from-[#1f4294] to-[#16337a] rounded-2xl p-6 text-white flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-black uppercase tracking-wider text-white/70">Current Balance</p>
                    <p className="text-3xl font-black mt-1">{loyaltyBalance} <span className="text-base font-bold text-white/70">points</span></p>
                  </div>
                  <Gift size={40} className="text-white/30" />
                </div>

                <div>
                  <p className="text-xs font-black text-gray-400 uppercase tracking-wider mb-3">Points History</p>
                  {loyaltyTransactions.length === 0 ? (
                    <div className="text-center py-16 text-gray-400 text-sm font-medium italic border border-dashed border-gray-200 rounded-xl bg-gray-50/40">
                      No points activity yet.
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {loyaltyTransactions.map((tx) => (
                        <div key={tx._id} className="flex items-center justify-between border border-gray-100 rounded-xl px-4 py-3">
                          <div>
                            <p className="text-xs font-bold text-gray-800">{tx.description}</p>
                            <p className="text-[10px] text-gray-400 font-medium mt-0.5">
                              {new Date(tx.createdAt).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}
                            </p>
                          </div>
                          <span className={`text-sm font-black ${tx.type === "redeemed" ? "text-red-500" : "text-emerald-600"}`}>
                            {tx.type === "redeemed" ? "-" : "+"}{tx.points} pts
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "addresses" && (
              <div className="space-y-5 animate-in fade-in duration-200">
                <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                  <div>
                    <h2 className="text-lg font-black text-gray-800 tracking-tight">Saved Addresses</h2>
                    <p className="text-xs text-gray-400 mt-0.5 font-medium">Manage your delivery locations.</p>
                  </div>
                  <button
                    onClick={() => setIsAddressModalOpen(true)}
                    className="flex items-center gap-2 bg-[#1f4294] text-white font-bold text-xs px-4 py-2.5 rounded-xl hover:bg-[#16337a] transition-all shadow-md uppercase tracking-wider cursor-pointer"
                  >
                    <PlusCircle size={15} /> <span>Add New Address</span>
                  </button>
                </div>

                {profile.addresses.length === 0 ? (
                  <div className="text-center py-16 text-gray-400 text-sm font-medium italic border border-dashed border-gray-200 rounded-xl bg-gray-50/40">
                    No saved addresses yet.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {profile.addresses.map((addr) => (
                      <div key={addr._id} className={`border p-6 rounded-2xl relative transition-all ${
                        addr.isDefault ? "border-[#1f4294] bg-[#1f4294]/5 shadow-sm" : "border-gray-100 bg-white"
                      }`}>
                        <div className="flex justify-between items-start">
                          <span className={`text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider ${
                            addr.isDefault ? "bg-[#1f4294] text-white" : "bg-gray-100 text-gray-500"
                          }`}>
                            {addr.label} {addr.isDefault && "(Default)"}
                          </span>
                          <div className="flex items-center gap-3">
                            {!addr.isDefault && (
                              <button onClick={() => handleSetPrimaryAddress(addr._id)} className="text-xs font-bold text-[#1f4294] hover:underline cursor-pointer bg-transparent">
                                Set Default
                              </button>
                            )}
                            <button onClick={() => setDeleteAddressTargetId(addr._id)} className="text-gray-300 hover:text-red-500 p-1.5 rounded-md transition-colors cursor-pointer">
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                        <div className="mt-4 text-xs space-y-1.5">
                          <p className="font-bold text-gray-800 text-sm capitalize">{addr.name}</p>
                          <p className="font-semibold text-gray-500">{addr.phone}</p>
                          <p className="text-gray-400 font-medium leading-relaxed mt-2">
                            {addr.homeAddress}, <span className="text-gray-600 font-bold">{addr.thana}, {addr.district}</span>
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "settings" && (
              <div className="space-y-5 animate-in fade-in duration-200">
                <div className="border-b border-gray-100 pb-4">
                  <h2 className="text-lg font-black text-gray-800 tracking-tight">Profile Settings</h2>
                  <p className="text-xs text-gray-400 mt-0.5 font-medium">Update your account information.</p>
                </div>

                {profileSavedMsg && (
                  <div className={`text-xs font-bold p-3 rounded-xl text-center ${
                    profileSavedOk ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-red-50 text-red-600 border border-red-100"
                  }`}>
                    {profileSavedMsg}
                  </div>
                )}

                <form className="space-y-5 max-w-xl" onSubmit={handleSaveSettings}>
                  <div className="relative group bg-white border border-gray-200 focus-within:border-[#1f4294] rounded-xl transition-all">
                    <input
                      type="text" placeholder=" " value={settingsName}
                      onChange={(e) => setSettingsName(e.target.value)}
                      className="peer w-full text-xs text-gray-800 px-4 py-3.5 bg-transparent focus:outline-none relative z-10 font-bold"
                    />
                    <label className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 bg-white px-1 pointer-events-none transition-all duration-200 origin-left peer-focus:-top-0.5 peer-focus:-translate-y-1/2 peer-focus:text-[11px] peer-focus:text-[#1f4294] peer-focus:font-bold z-20 peer-[:not(:placeholder-shown)]:-top-0.5 peer-[:not(:placeholder-shown)]:-translate-y-1/2 peer-[:not(:placeholder-shown)]:text-[11px]">Full Name</label>
                  </div>

                  <div className="relative group bg-white border border-gray-200 focus-within:border-[#1f4294] rounded-xl transition-all">
                    <input
                      type="tel" placeholder=" " value={settingsPhone}
                      onChange={(e) => setSettingsPhone(e.target.value.replace(/\D/g, ""))}
                      maxLength={11}
                      className="peer w-full text-xs text-gray-800 px-4 py-3.5 bg-transparent focus:outline-none relative z-10 font-bold"
                    />
                    <label className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 bg-white px-1 pointer-events-none transition-all duration-200 origin-left peer-focus:-top-0.5 peer-focus:-translate-y-1/2 peer-focus:text-[11px] peer-focus:text-[#1f4294] peer-focus:font-bold z-20 peer-[:not(:placeholder-shown)]:-top-0.5 peer-[:not(:placeholder-shown)]:-translate-y-1/2 peer-[:not(:placeholder-shown)]:text-[11px]">Phone Number</label>
                  </div>

                  <div className="relative group bg-gray-50 border border-gray-200 rounded-xl">
                    <input
                      type="email" value={profile.email} disabled
                      className="w-full text-xs text-gray-400 px-4 py-3.5 bg-transparent font-bold cursor-not-allowed"
                    />
                    <span className="absolute -top-2 left-3 bg-gray-50 px-1 text-[10px] font-bold text-gray-400">Email (cannot be changed)</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative group bg-white border border-gray-200 focus-within:border-[#1f4294] rounded-xl transition-all">
                      <input type="date" value={settingsDob} onChange={(e) => setSettingsDob(e.target.value)} className="w-full text-xs text-gray-800 px-4 py-3.5 bg-transparent focus:outline-none relative z-10 font-bold" />
                    </div>
                    <div className="relative group bg-white border border-gray-200 focus-within:border-[#1f4294] rounded-xl transition-all">
                      <select value={settingsGender} onChange={(e) => setSettingsGender(e.target.value)} className="w-full text-xs text-gray-800 px-4 py-3.5 bg-transparent focus:outline-none relative z-10 font-bold bg-white">
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Others">Others</option>
                      </select>
                    </div>
                  </div>

                  <button type="submit" disabled={isSavingProfile} className="bg-[#1f4294] hover:bg-[#16337a] text-white font-bold text-xs px-6 py-3.5 rounded-xl transition-colors cursor-pointer shadow-sm disabled:opacity-60 flex items-center gap-2">
                    {isSavingProfile && <Loader2 size={14} className="animate-spin" />}
                    {isSavingProfile ? "Saving..." : "Save Changes"}
                  </button>
                </form>
              </div>
            )}

          </div>
        </div>
      </div>

      {isAddressModalOpen && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsAddressModalOpen(false)} />
          <div className="bg-white border border-gray-100 rounded-2xl p-6 md:p-8 w-full max-w-lg shadow-2xl relative z-10 animate-in fade-in zoom-in-95 duration-250">
            <button onClick={() => setIsAddressModalOpen(false)} className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-all cursor-pointer">
              <X size={16} />
            </button>

            <h3 className="text-base font-black text-gray-800 uppercase tracking-wide border-b border-gray-100 pb-3.5 mb-5 flex items-center gap-2">
              <MapPin size={16} className="text-[#1f4294]" />
              <span>Add Delivery Address</span>
            </h3>

            {addressError && (
              <div className="bg-red-50 text-red-600 text-xs font-bold p-3 mb-4 border border-red-100 rounded-xl text-center">{addressError}</div>
            )}

            <form onSubmit={handleAddAddressSubmit} className="space-y-4">
              <div>
                <label className="text-[11px] font-black text-gray-400 uppercase block mb-1.5">Address Label</label>
                <div className="grid grid-cols-3 gap-3">
                  {["Home", "Office", "Others"].map((item) => (
                    <button
                      key={item} type="button" onClick={() => setLabel(item)}
                      className={`p-2.5 rounded-xl text-xs font-bold border transition-all text-center cursor-pointer ${
                        label === item ? "border-[#1f4294] bg-[#eeedf5] text-[#1f4294]" : "border-gray-200 text-gray-500 hover:bg-gray-50"
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              {label === "Others" && (
                <input type="text" placeholder="Specify custom label..." value={customLabel} onChange={(e) => setCustomLabel(e.target.value)} className="w-full p-3 border border-gray-200 rounded-xl text-xs text-gray-800 font-medium" />
              )}

              <div className="relative group bg-white border border-gray-200 focus-within:border-[#1f4294] rounded-xl transition-all">
                <input type="text" required value={addrName} onChange={(e) => setAddrName(e.target.value)} placeholder=" " className="peer w-full text-xs text-gray-800 px-4 py-3.5 bg-transparent focus:outline-none relative z-10" />
                <label className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 bg-white px-1 pointer-events-none transition-all duration-200 origin-left peer-focus:-top-0.5 peer-focus:-translate-y-1/2 peer-focus:text-[11px] peer-focus:text-[#1f4294] peer-focus:font-bold z-20 peer-[:not(:placeholder-shown)]:-top-0.5 peer-[:not(:placeholder-shown)]:-translate-y-1/2 peer-[:not(:placeholder-shown)]:text-[11px]">Receiver's Full Name</label>
              </div>

              <div className="relative group bg-white border border-gray-200 focus-within:border-[#1f4294] rounded-xl transition-all">
                <input type="tel" required maxLength={11} value={addrPhone} onChange={(e) => handlePhoneChange(e.target.value)} placeholder=" " className="peer w-full text-xs text-gray-800 px-4 py-3.5 bg-transparent focus:outline-none relative z-10" />
                <label className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 bg-white px-1 pointer-events-none transition-all duration-200 origin-left peer-focus:-top-0.5 peer-focus:-translate-y-1/2 peer-focus:text-[11px] peer-focus:text-[#1f4294] peer-focus:font-bold z-20 peer-[:not(:placeholder-shown)]:-top-0.5 peer-[:not(:placeholder-shown)]:-translate-y-1/2 peer-[:not(:placeholder-shown)]:text-[11px]">Phone Number</label>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="relative" ref={districtRef}>
                  <div onClick={() => setIsDistrictOpen(!isDistrictOpen)} className="p-3 border border-gray-200 rounded-xl text-xs bg-white flex justify-between items-center cursor-pointer text-gray-700 font-bold select-none">
                    <span>{district || "Select District"}</span> <ChevronDown size={14} className="text-gray-400" />
                  </div>
                  {isDistrictOpen && (
                    <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-100 shadow-xl rounded-xl z-50 max-h-40 flex flex-col overflow-hidden">
                      <div className="p-2 border-b border-gray-50 flex items-center gap-1.5 bg-gray-50">
                        <Search size={12} className="text-gray-400" />
                        <input type="text" placeholder="Filter..." className="w-full bg-transparent text-xs focus:outline-none text-gray-700" value={districtSearch} onChange={(e) => setDistrictSearch(e.target.value)} onClick={(e) => e.stopPropagation()} />
                      </div>
                      <div className="overflow-y-auto flex-1 divide-y divide-gray-50">
                        {filteredDistricts.map(d => <div key={d} onClick={() => { setDistrict(d); setThana(""); setIsDistrictOpen(false); }} className="p-2.5 text-xs text-gray-700 hover:bg-gray-50 cursor-pointer">{d}</div>)}
                      </div>
                    </div>
                  )}
                </div>

                <div className="relative" ref={thanaRef}>
                  <div onClick={() => district && setIsThanaOpen(!isThanaOpen)} className={`p-3 border border-gray-200 rounded-xl text-xs flex justify-between items-center cursor-pointer select-none ${!district ? 'bg-gray-50 text-gray-300' : 'text-gray-700 font-bold'}`}>
                    <span>{thana || "Select Thana"}</span> <ChevronDown size={14} className="text-gray-400" />
                  </div>
                  {isThanaOpen && district && (
                    <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-100 shadow-xl rounded-xl z-50 max-h-40 flex flex-col overflow-hidden">
                      <div className="p-2 border-b border-gray-50 flex items-center gap-1.5 bg-gray-50">
                        <Search size={12} className="text-gray-400" />
                        <input type="text" placeholder="Filter..." className="w-full bg-transparent text-xs focus:outline-none text-gray-700" value={thanaSearch} onChange={(e) => setThanaSearch(e.target.value)} onClick={(e) => e.stopPropagation()} />
                      </div>
                      <div className="overflow-y-auto flex-1 divide-y divide-gray-50">
                        {filteredThanas.map(t => <div key={t} onClick={() => { setThana(t); setIsThanaOpen(false); }} className="p-2.5 text-xs text-gray-700 hover:bg-gray-50 cursor-pointer">{t}</div>)}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="relative group bg-white border border-gray-200 focus-within:border-[#1f4294] rounded-xl transition-all">
                <textarea required rows={2} value={homeAddress} onChange={(e) => setHomeAddress(e.target.value)} placeholder=" " className="peer w-full text-xs text-gray-800 px-4 py-3 bg-transparent focus:outline-none relative z-10 resize-none" />
                <label className="absolute left-3 top-4 -translate-y-1/2 text-xs text-gray-400 bg-white px-1 pointer-events-none transition-all duration-200 origin-left z-20 peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:text-[11px] peer-focus:text-[#1f4294] peer-focus:font-bold peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:-translate-y-1/2 peer-[:not(:placeholder-shown)]:text-[11px]">House, Street/Road Address</label>
              </div>

              <button type="submit" disabled={isSubmittingAddress} className="w-full bg-[#1f4294] hover:bg-[#16337a] text-white py-3 rounded-xl font-bold text-xs transition-all shadow-md cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2">
                {isSubmittingAddress && <Loader2 size={14} className="animate-spin" />}
                {isSubmittingAddress ? "Saving..." : "Save Address"}
              </button>
            </form>
          </div>
        </div>
      )}

      {cancelTargetId && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => !isCancelling && setCancelTargetId(null)} />
          <div className="bg-white border border-gray-100 rounded-2xl p-6 w-full max-w-sm shadow-2xl relative z-10 text-center">
            <h3 className="text-base font-black text-gray-800">Cancel this order?</h3>
            <p className="text-xs text-gray-400 mt-2">This action cannot be undone.</p>
            {cancelError && (
              <p className="text-xs text-red-500 font-semibold mt-3">{cancelError}</p>
            )}
            <div className="flex gap-3 mt-6">
              <button onClick={() => setCancelTargetId(null)} disabled={isCancelling} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50 cursor-pointer disabled:opacity-60">
                Keep Order
              </button>
              <button onClick={handleCancelOrder} disabled={isCancelling} className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-xs font-bold cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2">
                {isCancelling && <Loader2 size={14} className="animate-spin" />}
                {isCancelling ? "Cancelling..." : "Yes, Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteAddressTargetId && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setDeleteAddressTargetId(null)} />
          <div className="bg-white border border-gray-100 rounded-2xl p-6 w-full max-w-sm shadow-2xl relative z-10 text-center">
            <h3 className="text-base font-black text-gray-800">Delete this address?</h3>
            <p className="text-xs text-gray-400 mt-2">This action cannot be undone.</p>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setDeleteAddressTargetId(null)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50 cursor-pointer">
                Keep
              </button>
              <button onClick={handleDeleteAddress} className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-xs font-bold cursor-pointer">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}