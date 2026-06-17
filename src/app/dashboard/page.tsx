"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { 
  MapPin, Trash2, Search, ChevronDown, Home, Briefcase, 
  PlusCircle, User, Phone, Package, Heart, Settings, 
  LogOut, ChevronRight, Mail, Calendar, Users, X, CheckCircle2, ArrowUpRight
} from "lucide-react";

interface SavedAddress {
  id: string;
  label: string;
  name: string;
  phone: string;
  district: string;
  thana: string;
  homeAddress: string;
  isDefault: boolean;
}

const initialOrders = [
  {
    id: "3668101",
    date: "17 Nov 2025",
    total: "৳৫৯৯",
    status: "Processing",
    isPaid: true,
    items: "Men's Casual Polo Shirt - Rich Man (Qty: 1)",
    productUrl: "/products?category=fashion&sub=mens-polo",
    timeline: [
      { title: "Order Placed", time: "17 Nov 2025 09:06 pm", desc: "Your order is successfully placed to Onecarta.", done: true },
      { title: "Processing", time: "17 Nov 2025 09:06 pm", desc: "We have received your order, our team will check and confirm shortly.", done: true },
      { title: "Confirmed", time: "Pending", desc: "Waiting for confirmation.", done: false },
      { title: "Packing", time: "Pending", desc: "We are currently packing your order.", done: false },
      { title: "Delivered", time: "Pending", desc: "You have received your order.", done: false }
    ]
  },
  {
    id: "3654200",
    date: "12 Nov 2025",
    total: "৳৪,৫০০",
    status: "Delivered",
    isPaid: true,
    items: "LEGO Classic Creative Bricks (Qty: 1)",
    productUrl: "/products?category=toys",
    timeline: [
      { title: "Order Placed", time: "12 Nov 2025 10:15 am", desc: "Your order is successfully placed.", done: true },
      { title: "Processing", time: "12 Nov 2025 11:00 am", desc: "Order processed successfully.", done: true },
      { title: "Confirmed", time: "12 Nov 2025 02:30 pm", desc: "Order confirmed.", done: true },
      { title: "Packing", time: "12 Nov 2025 05:00 pm", desc: "Your order is packed now.", done: true },
      { title: "Delivered", time: "14 Nov 2025 04:20 pm", desc: "You have received your order. Thank you!", done: true }
    ]
  }
];

const locationData: Record<string, string[]> = {
  "Dhaka": ["Dhanmondi", "Mirpur", "Gulshan", "Uttara", "Mohammadpur", "Motijheel", "Savar"],
  "Chittagonj": ["Kotwali", "Panchlaish", "Halishahar", "Nasirabad"],
  "Rajshahi": ["Boalia", "Rajpara", "Poba", "Motihar"]
};

const districtList = Object.keys(locationData).sort();

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [mounted, setMounted] = useState(false);

  // User States (Overview & Settings Data Matrix)
  const [userInfo, setUserInfo] = useState({
    name: "Customer",
    phone: "",
    email: "", // Shurute empty thakbe
    dob: "",
    gender: ""
  });

  // Address Modal States
  const [addresses, setAddresses] = useState<SavedAddress[]>([]);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [label, setLabel] = useState("Home");
  const [customLabel, setCustomLabel] = useState("");
  const [addrName, setAddrName] = useState("");
  const [addrPhone, setAddrPhone] = useState("");
  const [district, setDistrict] = useState("");
  const [thana, setThana] = useState("");
  const [homeAddress, setHomeAddress] = useState("");

  const [isDistrictOpen, setIsDistrictOpen] = useState(false);
  const [districtSearch, setDistrictSearch] = useState("");
  const [isThanaOpen, setIsThanaOpen] = useState(false);
  const [thanaSearch, setThanaSearch] = useState("");
  const [addressError, setAddressError] = useState("");

  const districtRef = useRef<HTMLDivElement>(null);
  const thanaRef = useRef<HTMLDivElement>(null);

  // Order List & Accordion Timeline Tracker States
  const [orders, setOrders] = useState(initialOrders);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  const getAddressKey = (email: string) => {
    const safeEmail = email && email.trim() !== "" ? email.trim().toLowerCase() : "guest";
    return `userAddresses_${safeEmail}`;
  };

  useEffect(() => {
    setMounted(true);
    const storedName = localStorage.getItem("userName");
    const storedEmail = localStorage.getItem("userEmail"); 
    const storedPhone = localStorage.getItem("userPhone");

    let currentEmail = "";
    // User jodi nijer real email add kore shudhu tokhon e show korbe, auto backend placeholder thakle hide hobe
    if (storedEmail && !storedEmail.includes("onecarta.com") && storedEmail !== "Not Available") {
      currentEmail = storedEmail;
    }

    setUserInfo(prev => ({
      ...prev,
      name: storedName || "Customer",
      email: currentEmail,
      phone: storedPhone || ""
    }));

    const targetKey = getAddressKey(currentEmail);
    const storedAddresses = localStorage.getItem(targetKey);
    if (storedAddresses) {
      setAddresses(JSON.parse(storedAddresses));
    } else {
      const defaultAddr = [{ id: "addr_default", label: "Home", name: storedName || "Customer", phone: storedPhone || "01XXXXXXXXX", district: "Dhaka", thana: "Dhanmondi", homeAddress: "House 24, Road 4", isDefault: true }];
      setAddresses(defaultAddr);
      localStorage.setItem(targetKey, JSON.stringify(defaultAddr));
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (districtRef.current && !districtRef.current.contains(event.target as Node)) setIsDistrictOpen(false);
      if (thanaRef.current && !thanaRef.current.contains(event.target as Node)) setIsThanaOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!mounted) return null;

  const toggleOrderExpand = (id: string) => {
    setExpandedOrderId(expandedOrderId === id ? null : id);
  };

  const handleCancelOrder = (id: string) => {
    if (confirm("Are you sure you want to cancel this order?")) {
      setOrders(orders.map(o => o.id === id ? { ...o, status: "Cancelled" } : o));
    }
  };

  const handleSetPrimaryAddress = (id: string) => {
    const updated = addresses.map(addr => ({ ...addr, isDefault: addr.id === id }));
    setAddresses(updated);
    localStorage.setItem(getAddressKey(userInfo.email), JSON.stringify(updated));
  };

  const handlePhoneChange = (val: string) => {
    setAddrPhone(val.replace(/\D/g, ""));
  };

  const handleAddAddressSubmit = (e: React.FormEvent) => {
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
    const newAddr: SavedAddress = {
      id: `addr_${Date.now()}`,
      label: finalLabel,
      name: addrName.trim(),
      phone: addrPhone.trim(),
      district,
      thana,
      homeAddress: homeAddress.trim(),
      isDefault: addresses.length === 0
    };

    const updated = [...addresses, newAddr];
    setAddresses(updated);
    localStorage.setItem(getAddressKey(userInfo.email), JSON.stringify(updated));
    setIsAddressModalOpen(false);

    setAddrName(""); setAddrPhone(""); setDistrict(""); setThana(""); setHomeAddress(""); setLabel("Home");
  };

  const handleDeleteAddress = (id: string) => {
    const updated = addresses.filter(a => a.id !== id);
    if (addresses.find(a => a.id === id)?.isDefault && updated.length > 0) {
      updated[0].isDefault = true;
    }
    setAddresses(updated);
    localStorage.setItem(getAddressKey(userInfo.email), JSON.stringify(updated));
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  const filteredDistricts = districtList.filter((d) =>
    d.toLowerCase().includes(districtSearch.toLowerCase())
  );

  const filteredThanas = (locationData[district] || []).filter((t) =>
    t.toLowerCase().includes(thanaSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50/60 py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 md:px-6">

        {/* Welcome Header */}
        <div className="mb-10 bg-white border border-gray-100 rounded-2xl p-6 md:p-8 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-gray-800 flex items-center gap-2 capitalize tracking-tight">
              Welcome back, {userInfo.name}! 👋
            </h1>
            <p className="text-sm text-gray-500 mt-1 font-medium">
              Manage your profile parameters, track shipment logs, and control defaults.
            </p>
          </div>
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="bg-blue-50/80 border border-blue-100 rounded-xl px-5 py-3 text-center flex-1 md:flex-none">
              <p className="text-[11px] font-black text-gray-400 uppercase tracking-wider">Total Orders</p>
              <p className="text-xl font-black text-[#1f4294] mt-0.5">{orders.filter(o => o.status !== "Cancelled").length}</p>
            </div>
            <div className="bg-red-50/60 border border-red-100 rounded-xl px-5 py-3 text-center flex-1 md:flex-none">
              <p className="text-[11px] font-black text-gray-400 uppercase tracking-wider">Wishlist</p>
              <p className="text-xl font-black text-red-500 mt-0.5">0</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          
          {/* 🔘 LEFT SIDEBAR SUITE */}
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-1.5 lg:sticky lg:top-24">
            
            <div className="flex flex-col items-center text-center p-5 border-b border-gray-100 mb-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#1a1a2e] to-[#2c2769] text-white flex items-center justify-center text-2xl font-black shadow-md uppercase mb-3">
                {userInfo.name[0]}
              </div>
              <h4 className="text-base font-black text-gray-800 capitalize truncate w-full tracking-tight">{userInfo.name}</h4>
              
              {/* Conditional Email Hide Logic */}
              {userInfo.email && (
                <p className="text-xs text-gray-400 mt-1 truncate w-full font-medium flex items-center justify-center gap-1">
                  <Mail size={12} /> {userInfo.email}
                </p>
              )}
            </div>

            <p className="px-3 py-1 text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1">Navigation Menu</p>
            
            {[
              { id: "overview", label: "Overview Status", icon: <User size={16} /> },
              { id: "orders", label: "My Order History", icon: <Package size={16} /> },
              { id: "wishlist", label: "My Wishlist", icon: <Heart size={16} /> },
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
                <LogOut size={16} /> <span>Log Out Account</span>
              </button>
            </div>
          </div>

          {/* 📊 RIGHT PANEL CONTENT CONTAINER */}
          <div className="lg:col-span-3 bg-white border border-gray-100 rounded-2xl p-6 md:p-8 shadow-sm min-h-[560px]">
            
            {/* ================= OVERVIEW PANEL ================= */}
            {activeTab === "overview" && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="border-b border-gray-100 pb-4 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-black text-gray-800 tracking-tight">Account Overview</h2>
                    <p className="text-xs text-gray-400 mt-0.5 font-medium">Verify your registered account profile details matrices.</p>
                  </div>
                  <span className="bg-blue-50 border border-blue-100 text-[#1f4294] text-[11px] font-black uppercase px-3 py-1 rounded-full tracking-wider">Premium Member</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="bg-gray-50/50 border border-gray-100 p-5 rounded-xl">
                    <p className="text-[11px] font-black text-gray-400 uppercase tracking-wider">Full Legal Name</p>
                    <p className="text-sm font-bold text-gray-800 capitalize mt-1.5">{userInfo.name}</p>
                  </div>
                  <div className="bg-gray-50/50 border border-gray-100 p-5 rounded-xl">
                    <p className="text-[11px] font-black text-gray-400 uppercase tracking-wider">Active Phone Line</p>
                    <p className="text-sm font-bold text-gray-800 mt-1.5">{userInfo.phone || "Not Configured Yet"}</p>
                  </div>
                  <div className="bg-gray-50/50 border border-gray-100 p-5 rounded-xl sm:col-span-2">
                    <p className="text-[11px] font-black text-gray-400 uppercase tracking-wider">Email Communication Address</p>
                    <p className="text-sm font-bold text-gray-800 mt-1.5 break-all">
                      {userInfo.email || "No email address linked yet. Update from configurations."}
                    </p>
                  </div>
                  <div className="bg-gray-50/50 border border-gray-100 p-5 rounded-xl">
                    <p className="text-[11px] font-black text-gray-400 uppercase tracking-wider">Date of Birth</p>
                    <p className="text-sm font-bold text-gray-800 mt-1.5">{userInfo.dob || "Unspecified"}</p>
                  </div>
                  <div className="bg-gray-50/50 border border-gray-100 p-5 rounded-xl">
                    <p className="text-[11px] font-black text-gray-400 uppercase tracking-wider">Gender Orientation</p>
                    <p className="text-sm font-bold text-gray-800 mt-1.5">{userInfo.gender || "Unspecified"}</p>
                  </div>
                </div>
              </div>
            )}

            {/* ================= MY ORDERS PANEL ================= */}
            {activeTab === "orders" && (
              <div className="space-y-5 animate-in fade-in duration-200">
                <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                  <div>
                    <h2 className="text-lg font-black text-gray-800 tracking-tight">Order Logs & Statements ({orders.length})</h2>
                    <p className="text-xs text-gray-400 mt-0.5 font-medium">Expand tracking milestone logs parameters real-time.</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {orders.map((order) => {
                    const isExpanded = expandedOrderId === order.id;
                    return (
                      <div key={order.id} className="border border-gray-100 rounded-xl overflow-hidden shadow-sm bg-white">
                        
                        <div 
                          onClick={() => toggleOrderExpand(order.id)}
                          className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-50/30 hover:bg-gray-50/60 transition-colors cursor-pointer select-none"
                        >
                          <div className="space-y-1.5 min-w-0 flex-1">
                            <div className="flex items-center gap-2.5">
                              <span className="text-sm font-black text-gray-800">Invoice ID: #{order.id}</span>
                              <span className="text-xs text-gray-400 font-semibold">{order.date}</span>
                            </div>
                            <div className="text-xs font-bold text-[#1f4294] flex items-center gap-1.5 truncate">
                              <span>{order.items}</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between md:justify-end gap-6 flex-shrink-0">
                            <div className="text-left md:text-right">
                              <p className="text-sm font-black text-gray-800">{order.total}</p>
                              <span className="text-[10px] font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                                {order.isPaid ? "PAID" : "UNPAID"}
                              </span>
                            </div>

                            <div className="flex items-center gap-3">
                              <span className={`text-[11px] font-black uppercase px-3 py-1 rounded-full tracking-wider ${
                                order.status === "Delivered" ? "bg-green-50 text-green-600" :
                                order.status === "Cancelled" ? "bg-red-50 text-red-600" : "bg-blue-50 text-blue-600"
                              }`}>
                                {order.status}
                              </span>

                              {order.status !== "Delivered" && order.status !== "Cancelled" && (
                                <button 
                                  onClick={(e) => { e.stopPropagation(); handleCancelOrder(order.id); }}
                                  className="text-xs font-bold bg-white text-red-500 border border-red-200 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-all cursor-pointer"
                                >
                                  Cancel
                                </button>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Arogga Timeline Look Tracker */}
                        {isExpanded && (
                          <div className="p-6 bg-white border-t border-gray-100 animate-in slide-in-from-top-3 duration-300">
                            <p className="text-xs font-black text-gray-400 uppercase tracking-wider mb-5">Realtime Processing Status Milestones</p>
                            
                            <div className="space-y-0.5 pl-1.5">
                              {order.timeline.map((step, idx) => {
                                const isLast = idx === order.timeline.length - 1;
                                return (
                                  <div key={idx} className="flex gap-4">
                                    <div className="flex flex-col items-center flex-shrink-0 relative">
                                      <div className={`w-5 h-5 rounded-full flex items-center justify-center z-10 ${
                                        step.done ? "bg-[#1f4294] text-white shadow-sm" : "bg-gray-100 text-gray-300"
                                      }`}>
                                        <CheckCircle2 size={13} />
                                      </div>
                                      {!isLast && (
                                        <div className={`w-0.5 h-14 -my-0.5 ${
                                          step.done && order.timeline[idx + 1]?.done ? "bg-[#1f4294]" : "bg-gray-200"
                                        }`} />
                                      )}
                                    </div>
                                    <div className="pb-6 pt-0.5 flex-1">
                                      <div className="flex items-center justify-between gap-3">
                                        <h5 className={`text-sm font-bold ${step.done ? "text-gray-800" : "text-gray-400"}`}>{step.title}</h5>
                                        <span className="text-xs text-gray-400 font-medium">{step.time}</span>
                                      </div>
                                      <p className="text-xs text-gray-400 mt-1 leading-relaxed">{step.desc}</p>
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
              </div>
            )}

            {/* ================= WISHLIST PANEL ================= */}
            {activeTab === "wishlist" && (
              <div className="space-y-5 animate-in fade-in duration-200">
                <div className="border-b border-gray-100 pb-4">
                  <h2 className="text-lg font-black text-gray-800 tracking-tight">Saved Wishlist Index</h2>
                  <p className="text-xs text-gray-400 mt-0.5 font-medium">Your absolute bookmarked targets logs collection.</p>
                </div>
                <div className="text-center py-16 text-gray-400 text-sm font-medium italic border border-dashed border-gray-200 rounded-xl bg-gray-50/40">
                  Your wish matrix registry is empty.
                </div>
              </div>
            )}

            {/* ================= ADDRESS BOOK PANEL ================= */}
            {activeTab === "addresses" && (
              <div className="space-y-5 animate-in fade-in duration-200">
                <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                  <div>
                    <h2 className="text-lg font-black text-gray-800 tracking-tight">Saved Address Index</h2>
                    <p className="text-xs text-gray-400 mt-0.5 font-medium">Configure primary delivery coordinates configurations.</p>
                  </div>
                  <button 
                    onClick={() => setIsAddressModalOpen(true)}
                    className="flex items-center gap-2 bg-[#1f4294] text-white font-bold text-xs px-4 py-2.5 rounded-xl hover:bg-[#16337a] transition-all shadow-md uppercase tracking-wider cursor-pointer"
                  >
                    <PlusCircle size={15} /> <span>Add New Address</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {addresses.map((addr) => (
                    <div key={addr.id} className={`border p-6 rounded-2xl relative transition-all ${
                      addr.isDefault ? "border-[#1f4294] bg-[#1f4294]/5 shadow-sm" : "border-gray-100 bg-white"
                    }`}>
                      <div className="flex justify-between items-start">
                        <span className={`text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider ${
                          addr.isDefault ? "bg-[#1f4294] text-white" : "bg-gray-100 text-gray-500"
                        }`}>
                          {addr.label} {addr.isDefault && "(Default Gateway)"}
                        </span>
                        
                        <div className="flex items-center gap-3">
                          {!addr.isDefault && (
                            <button 
                              onClick={() => handleSetPrimaryAddress(addr.id)}
                              className="text-xs font-bold text-[#1f4294] hover:underline cursor-pointer bg-transparent"
                            >
                              Set Default
                            </button>
                          )}
                          <button onClick={() => handleDeleteAddress(addr.id)} className="text-gray-300 hover:text-red-500 p-1.5 rounded-md transition-colors cursor-pointer">
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
              </div>
            )}

            {/* ================= ACCOUNT SETTINGS PANEL ================= */}
            {activeTab === "settings" && (
              <div className="space-y-5 animate-in fade-in duration-200">
                <div className="border-b border-gray-100 pb-4">
                  <h2 className="text-lg font-black text-gray-800 tracking-tight">Profile Configurations</h2>
                  <p className="text-xs text-gray-400 mt-0.5 font-medium">Update account fields manually to synchronize database state values.</p>
                </div>

                <form className="space-y-5 max-w-xl" onSubmit={(e) => { e.preventDefault(); alert("Profile cached successfully!"); setActiveTab("overview"); }}>
                  <div className="relative group bg-white border border-gray-200 focus-within:border-[#1f4294] rounded-xl transition-all">
                    <input 
                      type="text" id="editName" placeholder=" " value={userInfo.name} 
                      onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
                      className="peer w-full text-xs text-gray-800 px-4 py-3.5 bg-transparent focus:outline-none relative z-10 font-bold"
                    />
                    <label htmlFor="editName" className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 bg-white px-1 pointer-events-none transition-all duration-200 origin-left peer-focus:-top-0.5 peer-focus:-translate-y-1/2 peer-focus:text-[11px] peer-focus:text-[#1f4294] peer-focus:font-bold z-20 peer-[:not(:placeholder-shown)]:-top-0.5 peer-[:not(:placeholder-shown)]:-translate-y-1/2 peer-[:not(:placeholder-shown)]:text-[11px]">Customer Structural Name</label>
                  </div>

                  <div className="relative group bg-white border border-gray-200 focus-within:border-[#1f4294] rounded-xl transition-all">
                    <input 
                      type="tel" id="editPhone" placeholder=" " value={userInfo.phone} 
                      onChange={(e) => setUserInfo({ ...userInfo, phone: e.target.value })}
                      className="peer w-full text-xs text-gray-800 px-4 py-3.5 bg-transparent focus:outline-none relative z-10 font-bold"
                    />
                    <label htmlFor="editPhone" className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 bg-white px-1 pointer-events-none transition-all duration-200 origin-left peer-focus:-top-0.5 peer-focus:-translate-y-1/2 peer-focus:text-[11px] peer-focus:text-[#1f4294] peer-focus:font-bold z-20 peer-[:not(:placeholder-shown)]:-top-0.5 peer-[:not(:placeholder-shown)]:-translate-y-1/2 peer-[:not(:placeholder-shown)]:text-[11px]">Phone Identity Number</label>
                  </div>

                  <div className="relative group bg-white border border-gray-200 focus-within:border-[#1f4294] rounded-xl transition-all">
                    <input 
                      type="email" id="editEmail" placeholder=" " value={userInfo.email} 
                      onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
                      className="peer w-full text-xs text-gray-800 px-4 py-3.5 bg-transparent focus:outline-none relative z-10 font-bold"
                    />
                    <label htmlFor="editEmail" className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 bg-white px-1 pointer-events-none transition-all duration-200 origin-left peer-focus:-top-0.5 peer-focus:-translate-y-1/2 peer-focus:text-[11px] peer-focus:text-[#1f4294] peer-focus:font-bold z-20 peer-[:not(:placeholder-shown)]:-top-0.5 peer-[:not(:placeholder-shown)]:-translate-y-1/2 peer-[:not(:placeholder-shown)]:text-[11px]">Customer Email Address (Showcased when input)</label>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative group bg-white border border-gray-200 focus-within:border-[#1f4294] rounded-xl transition-all">
                      <input type="date" value={userInfo.dob} onChange={(e) => setUserInfo({ ...userInfo, dob: e.target.value })} className="w-full text-xs text-gray-800 px-4 py-3.5 bg-transparent focus:outline-none relative z-10 font-bold" />
                    </div>
                    <div className="relative group bg-white border border-gray-200 focus-within:border-[#1f4294] rounded-xl transition-all">
                      <select value={userInfo.gender} onChange={(e) => setUserInfo({ ...userInfo, gender: e.target.value })} className="w-full text-xs text-gray-800 px-4 py-3.5 bg-transparent focus:outline-none relative z-10 font-bold bg-white">
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Others">Others</option>
                      </select>
                    </div>
                  </div>

                  <button type="submit" className="bg-[#1f4294] hover:bg-[#16337a] text-white font-bold text-xs px-6 py-3.5 rounded-xl transition-colors cursor-pointer shadow-sm">
                    Save Structural Meta Variations
                  </button>
                </form>
              </div>
            )}

          </div>
        </div>

      </div>

      {/* 📥 POPUP ADDRESS BOX EXTENSION MODAL */}
      {isAddressModalOpen && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsAddressModalOpen(false)} />
          
          <div className="bg-white border border-gray-100 rounded-2xl p-6 md:p-8 w-full max-w-lg shadow-2xl relative z-10 animate-in fade-in zoom-in-95 duration-250">
            <button onClick={() => setIsAddressModalOpen(false)} className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-all cursor-pointer">
              <X size={16} />
            </button>
            
            <h3 className="text-base font-black text-gray-800 uppercase tracking-wide border-b border-gray-100 pb-3.5 mb-5 flex items-center gap-2">
              <MapPin size={16} className="text-[#1f4294]" />
              <span>Add Terminal Delivery Destination</span>
            </h3>

            {addressError && (
              <div className="bg-red-50 text-red-600 text-xs font-bold p-3 mb-4 border border-red-100 rounded-xl text-center">{addressError}</div>
            )}

            <form onSubmit={handleAddAddressSubmit} className="space-y-4">
              <div>
                <label className="text-[11px] font-black text-gray-400 uppercase block mb-1.5">Destination Tag Mode</label>
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
                <input type="text" placeholder="Specify custom reference node..." value={customLabel} onChange={(e) => setCustomLabel(e.target.value)} className="w-full p-3 border border-gray-200 rounded-xl text-xs text-gray-800 font-medium" />
              )}

              <div className="relative group bg-white border border-gray-200 focus-within:border-[#1f4294] rounded-xl transition-all">
                <input type="text" required value={addrName} onChange={(e) => setAddrName(e.target.value)} placeholder=" " className="peer w-full text-xs text-gray-800 px-4 py-3.5 bg-transparent focus:outline-none relative z-10" />
                <label className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 bg-white px-1 pointer-events-none transition-all duration-200 origin-left peer-focus:-top-0.5 peer-focus:-translate-y-1/2 peer-focus:text-[11px] peer-focus:text-[#1f4294] peer-focus:font-bold z-20 peer-[:not(:placeholder-shown)]:-top-0.5 peer-[:not(:placeholder-shown)]:-translate-y-1/2 peer-[:not(:placeholder-shown)]:text-[11px]">Receiver's Full Name</label>
              </div>

              <div className="relative group bg-white border border-gray-200 focus-within:border-[#1f4294] rounded-xl transition-all">
                <input type="tel" required maxLength={11} value={addrPhone} onChange={(e) => handlePhoneChange(e.target.value)} placeholder=" " className="peer w-full text-xs text-gray-800 px-4 py-3.5 bg-transparent focus:outline-none relative z-10" />
                <label className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 bg-white px-1 pointer-events-none transition-all duration-200 origin-left peer-focus:-top-0.5 peer-focus:-translate-y-1/2 peer-focus:text-[11px] peer-focus:text-[#1f4294] peer-focus:font-bold z-20 peer-[:not(:placeholder-shown)]:-top-0.5 peer-[:not(:placeholder-shown)]:-translate-y-1/2 peer-[:not(:placeholder-shown)]:text-[11px]">Phone Identity String</label>
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
                <label className="absolute left-3 top-4 -translate-y-1/2 text-xs text-gray-400 bg-white px-1 pointer-events-none transition-all duration-200 origin-left z-20 peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:text-[11px] peer-focus:text-[#1f4294] peer-focus:font-bold peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:-translate-y-1/2 peer-[:not(:placeholder-shown)]:text-[11px]">Holding, Street/Road Coordinates</label>
              </div>

              <button type="submit" className="w-full bg-[#1f4294] hover:bg-[#16337a] text-white py-3 rounded-xl font-bold text-xs transition-all shadow-md cursor-pointer">
                Save Shipping Address Coordinate
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}