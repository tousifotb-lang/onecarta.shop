"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cartStore";
import { formatPrice } from "@/lib/utils";
import { ShieldCheck, Truck, CreditCard, Search, ChevronDown, Ticket, Percent, MapPin, Plus, X } from "lucide-react";

interface SavedAddress {
  id: string;
  label: string;
  name: string;
  phone: string;
  district: string;
  thana: string;
  homeAddress: string;
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

export default function CheckoutPage() {
  const router = useRouter();
  
  const { getCartItems } = useCartStore();
  const items = getCartItems();
  
  const [mounted, setMounted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [selectedPresentAddress, setSelectedPresentAddress] = useState<string>("");

  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    district: "",
    thana: "",
    homeAddress: "",
  });

  const [newAddressForm, setNewAddressForm] = useState({
    label: "Home",
    name: "",
    phone: "",
    district: "",
    thana: "",
    homeAddress: "",
  });
  
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isDistrictOpen, setIsDistrictOpen] = useState(false);
  const [districtSearch, setDistrictSearch] = useState("");
  const [isThanaOpen, setIsThanaOpen] = useState(false);
  const [thanaSearch, setThanaSearch] = useState("");

  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponError, setCouponError] = useState("");
  const [discount, setDiscount] = useState(0);

  const districtRef = useRef<HTMLDivElement>(null);
  const thanaRef = useRef<HTMLDivElement>(null);

  const getAddressKey = (email: string) => {
    return email ? `userAddresses_${email.trim().toLowerCase()}` : "userAddresses_guest";
  };

  useEffect(() => {
    setMounted(true);
    
    const loggedInStatus = localStorage.getItem("isLoggedIn") === "true";
    const email = localStorage.getItem("userEmail") || "";
    setIsLoggedIn(loggedInStatus);
    setUserEmail(email);

    if (loggedInStatus && email) {
      const targetKey = getAddressKey(email);
      const storedAddresses = localStorage.getItem(targetKey);
      if (storedAddresses) {
        const parsed = JSON.parse(storedAddresses);
        setSavedAddresses(parsed);
        if (parsed.length > 0) {
          setSelectedPresentAddress(parsed[0].id);
          setFormData({
            name: parsed[0].name,
            phone: parsed[0].phone,
            district: parsed[0].district,
            thana: parsed[0].thana,
            homeAddress: parsed[0].homeAddress,
          });
        }
      }
    }

    if (items.length > 0) {
      setSelectedItemIds(items.map(i => i._id));
    }

    const footerElement = document.querySelector("footer");
    if (footerElement) footerElement.style.display = "none";

    const handleClickOutside = (event: MouseEvent) => {
      if (districtRef.current && !districtRef.current.contains(event.target as Node)) setIsDistrictOpen(false);
      if (thanaRef.current && !thanaRef.current.contains(event.target as Node)) setIsThanaOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      if (footerElement) footerElement.style.display = "block";
    };
  }, [items.length]);

  const handleAddressSelect = (addrId: string) => {
    setSelectedPresentAddress(addrId);
    const activeAddr = savedAddresses.find(a => a.id === addrId);
    if (activeAddr) {
      setFormData({
        name: activeAddr.name,
        phone: activeAddr.phone,
        district: activeAddr.district,
        thana: activeAddr.thana,
        homeAddress: activeAddr.homeAddress,
      });
    }
  };

  const handleFieldChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleToggleItemSelection = (id: string) => {
    setSelectedItemIds(prev => 
      prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]
    );
  };

  if (!mounted) {
    return <div className="container-main py-20 text-center text-gray-500">Loading Checkout...</div>;
  }

  if (items.length === 0 && !isSubmitting) {
    return (
      <div className="container-main py-20 text-center">
        <p className="text-5xl mb-4">🛒</p>
        <h2 className="text-xl font-bold text-gray-700">Your cart is empty</h2>
        <button onClick={() => router.push("/products")} className="mt-6 bg-[#2c2769] text-white px-5 py-2.5 rounded-xl text-sm font-bold">Return to Shop</button>
      </div>
    );
  }

  // 🛠️ ফিক্সড লজিক: কোনো প্রোডাক্ট সিলেক্ট না থাকলে (`selectedItemIds.length === 0`) ডেলিভারি চার্জ ০ হবে ভাই
  const getDeliveryCharge = () => {
    if (selectedItemIds.length === 0) return 0;
    if (!formData.district || !formData.thana) return null;
    if (formData.district === "Dhaka") {
      if (formData.thana === "Savar" || formData.thana === "Keranigonj") return 100;
      return 80;
    }
    return 120;
  };

  const selectedItems = items.filter(item => selectedItemIds.includes(item._id));
  const basePrice = selectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryCharge = getDeliveryCharge();
  const grandTotal = deliveryCharge !== null ? basePrice + deliveryCharge - discount : basePrice - discount;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError("");
    const code = couponCode.trim().toUpperCase();
    if (!code) { setCouponError("Please enter a coupon code."); return; }

    if (code === "ONECARTA20") {
      setAppliedCoupon(code); setDiscount(200); setCouponCode("");
    } else if (code === "FREESHIP" && deliveryCharge !== null) {
      setAppliedCoupon(code); setDiscount(deliveryCharge); setCouponCode("");
    } else {
      setCouponError("Invalid coupon code.");
    }
  };

  const handleRemoveCoupon = () => { setAppliedCoupon(null); setDiscount(0); };

  const handleAddNewAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddressForm.name || !newAddressForm.phone || !newAddressForm.district || !newAddressForm.thana || !newAddressForm.homeAddress) return;

    const newAddrItem: SavedAddress = {
      id: `addr_${Date.now()}`, label: newAddressForm.label, name: newAddressForm.name, phone: newAddressForm.phone,
      district: newAddressForm.district, thana: newAddressForm.thana, homeAddress: newAddressForm.homeAddress,
    };

    const targetKey = getAddressKey(userEmail);
    const updated = [...savedAddresses, newAddrItem];
    setSavedAddresses(updated);
    if (isLoggedIn && userEmail) localStorage.setItem(targetKey, JSON.stringify(updated));

    setSelectedPresentAddress(newAddrItem.id);
    setFormData({ name: newAddrItem.name, phone: newAddrItem.phone, district: newAddrItem.district, thana: newAddrItem.thana, homeAddress: newAddrItem.homeAddress });
    setIsAddressModalOpen(false);
    setNewAddressForm({ label: "Home", name: "", phone: "", district: "", thana: "", homeAddress: "" });
  };

  const handleSubmitOrder = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (selectedItemIds.length === 0) { alert("Please select at least one product."); return; }
    if (!formData.name.trim() || !formData.phone || !formData.district || !formData.thana || !formData.homeAddress.trim()) { alert("Please complete address details."); return; }

    setIsSubmitting(true);
    const formattedPhone = formData.phone.startsWith("0") ? `+88${formData.phone}` : `+880${formData.phone}`;

    try {
      const orderData = {
        customer: { name: formData.name, phone: formattedPhone, fullAddress: `${formData.homeAddress}, ${formData.thana}, ${formData.district}` },
        items: selectedItems, paymentMethod, deliveryCharge, discountApplied: discount, totalAmount: grandTotal,
      };
      console.log("Submitting Order:", orderData);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      router.push("/order-success"); 
    } catch (error) { setIsSubmitting(false); }
  };

  const filteredDistricts = districtList.filter((d) => d.toLowerCase().includes(districtSearch.toLowerCase()));
  const filteredThanas = (locationData[formData.district] || []).filter((t) => t.toLowerCase().includes(thanaSearch.toLowerCase()));

  return (
    <div className="container-main py-6 pb-24 md:pb-8">
      <h1 className="text-2xl font-extrabold text-gray-900 mb-6">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left Forms */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* 🛠️ ফিক্সড লজিক ১: রেজিস্টার্ড ইউজারের জন্য শুধু এই সেভ করা অ্যাড্রেস বক্সটি দেখাবে ভাই */}
          {isLoggedIn ? (
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-gray-50">
                <h2 className="text-base font-bold text-gray-800 flex items-center gap-2">
                  <MapPin size={18} className="text-[#2c2769]" />
                  <span>Select Delivery Address</span>
                </h2>
                <button type="button" onClick={() => setIsAddressModalOpen(true)} className="p-1.5 bg-[#eeedf5] text-[#2c2769] hover:bg-[#2c2769] hover:text-white rounded-lg transition-all"><Plus size={16} /></button>
              </div>

              {savedAddresses.length > 0 ? (
                <div className="grid grid-cols-1 gap-2.5">
                  {savedAddresses.map((addr) => (
                    <label key={addr.id} className={`flex items-start gap-3 p-3.5 border rounded-xl cursor-pointer transition-all ${selectedPresentAddress === addr.id ? "border-[#2c2769] bg-[#eeedf5]/20" : "border-gray-100 bg-gray-50/30 hover:bg-gray-50/80"}`}>
                      <input type="radio" name="presentAddress" value={addr.id} checked={selectedPresentAddress === addr.id} onChange={() => handleAddressSelect(addr.id)} className="mt-0.5 accent-[#2c2769]" />
                      <div className="text-xs space-y-0.5">
                        <span className="bg-[#2c2769] text-white text-[9px] font-black px-1.5 py-0.5 rounded uppercase mb-1 inline-block">{addr.label}</span>
                        <p className="font-bold text-gray-800">{addr.name} — <span className="text-gray-500">{addr.phone}</span></p>
                        <p className="text-gray-400 font-semibold">{addr.homeAddress}, {addr.thana}, {addr.district}</p>
                      </div>
                    </label>
                  ))}
                </div>
              ) : (
                <div className="text-xs text-gray-500 font-semibold bg-gray-50 p-4 rounded-xl text-center border border-dashed border-gray-200">No address profiles found. Click the + icon to add a new address!</div>
              )}
            </div>
          ) : (
            /* 🛠️ ফিক্সড লজিক ২: নন-রেজিস্টার্ড (গেস্ট) ইউজারের জন্য সরাসরি ম্যানুয়াল ফর্মটি দেখাবে ভাই */
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4">
              <h2 className="text-base font-bold text-gray-800 flex items-center gap-2 pb-2 border-b border-gray-50">
                <Truck size={18} className="text-[#2c2769]" />
                <span>Shipping Address Details</span>
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-600 uppercase">Full Name *</label>
                  <input type="text" required placeholder="Enter your full name" className="w-full p-3 border border-gray-200 focus:border-[#2c2769] rounded-xl text-sm focus:outline-none" value={formData.name} onChange={(e) => handleFieldChange("name", e.target.value)} />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-600 uppercase">Phone Number *</label>
                  <div className="flex rounded-xl border border-gray-200 focus-within:border-[#2c2769] overflow-hidden bg-white">
                    <span className="bg-gray-100 px-3 py-3 text-sm text-gray-500 font-bold border-r border-gray-200 flex items-center">+88</span>
                    <input type="tel" required placeholder="01XXXXXXXXX" className="w-full p-3 text-sm focus:outline-none bg-transparent" value={formData.phone} onChange={(e) => handleFieldChange("phone", e.target.value.replace(/\D/g, ""))} />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5 relative" ref={districtRef}>
                  <label className="text-xs font-bold text-gray-600 uppercase">District *</label>
                  <div onClick={() => setIsDistrictOpen(!isDistrictOpen)} className="w-full p-3 border border-gray-200 rounded-xl text-sm bg-white flex justify-between items-center cursor-pointer">
                    <span className={formData.district ? "text-gray-800 font-medium" : "text-gray-400"}>{formData.district || "Select District"}</span>
                    <ChevronDown size={16} className="text-gray-400" />
                  </div>
                  {isDistrictOpen && (
                    <div className="absolute left-0 right-0 top-[105%] bg-white border border-gray-100 shadow-xl rounded-xl z-30 max-h-48 flex flex-col overflow-hidden">
                      <div className="p-2 border-b border-gray-50 flex items-center gap-2 bg-gray-50">
                        <Search size={14} className="text-gray-400" />
                        <input type="text" placeholder="Search..." className="w-full bg-transparent text-xs focus:outline-none" value={districtSearch} onChange={(e) => setDistrictSearch(e.target.value)} onClick={(e) => e.stopPropagation()} />
                      </div>
                      <div className="overflow-y-auto flex-1 divide-y divide-gray-50">
                        {districtList.filter(d => d.toLowerCase().includes(districtSearch.toLowerCase())).map(d => (
                          <div key={d} onClick={() => { handleFieldChange("district", d); setFormData(p => ({ ...p, district: d, thana: "" })); setIsDistrictOpen(false); }} className="p-2.5 text-xs text-gray-700 hover:bg-gray-50 cursor-pointer">{d}</div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-1.5 relative" ref={thanaRef}>
                  <label className="text-xs font-bold text-gray-600 uppercase">Thana / Upazila *</label>
                  <div onClick={() => formData.district && setIsThanaOpen(!isThanaOpen)} className={`w-full p-3 border border-gray-200 rounded-xl text-sm flex justify-between items-center ${formData.district ? "bg-white cursor-pointer" : "bg-gray-50 cursor-not-allowed"}`}>
                    <span className={formData.thana ? "text-gray-800 font-medium" : "text-gray-400"}>{formData.thana || "Select Thana"}</span>
                    <ChevronDown size={16} className="text-gray-400" />
                  </div>
                  {isThanaOpen && formData.district && (
                    <div className="absolute left-0 right-0 top-[105%] bg-white border border-gray-100 shadow-xl rounded-xl z-30 max-h-48 flex flex-col overflow-hidden">
                      <div className="p-2 border-b border-gray-50 flex items-center gap-2 bg-gray-50">
                        <Search size={14} className="text-gray-400" />
                        <input type="text" placeholder="Search..." className="w-full bg-transparent text-xs focus:outline-none" value={thanaSearch} onChange={(e) => setThanaSearch(e.target.value)} onClick={(e) => e.stopPropagation()} />
                      </div>
                      <div className="overflow-y-auto flex-1 divide-y divide-gray-50">
                        {(locationData[formData.district] || []).filter(t => t.toLowerCase().includes(thanaSearch.toLowerCase())).map(t => (
                          <div key={t} onClick={() => { handleFieldChange("thana", t); setIsThanaOpen(false); }} className="p-2.5 text-xs text-gray-700 hover:bg-gray-50 cursor-pointer">{t}</div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-600 uppercase">House / Road / Street Details *</label>
                <textarea required rows={2} placeholder="House No. 12, Road No. 4..." className="w-full p-3 border border-gray-200 focus:border-[#2c2769] rounded-xl text-sm focus:outline-none" value={formData.homeAddress} onChange={(e) => handleFieldChange("homeAddress", e.target.value)} />
              </div>
            </div>
          )}

          {/* 💳 Payment Method */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-3">
            <h2 className="text-base font-bold text-gray-800 flex items-center gap-2 pb-2 border-b border-gray-50"><CreditCard size={18} className="text-[#2c2769]" /><span>Payment Method</span></h2>
            <label className="flex items-center justify-between p-3.5 border border-[#2c2769] bg-[#eeedf5]/10 rounded-xl cursor-pointer"><div className="flex items-center gap-3"><input type="radio" checked readOnly className="accent-[#2c2769]" /><div><p className="text-xs font-bold text-gray-800">Cash on Delivery (COD)</p><p className="text-[11px] text-gray-400">Pay with cash upon package receipt.</p></div></div></label>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
            <h2 className="text-base font-bold text-gray-800 pb-2 border-b border-gray-50 mb-3">Cart Products</h2>
            
            <div className="divide-y divide-gray-50 max-h-60 overflow-y-auto pr-1 space-y-2 mb-3">
              {items.map((item) => (
                <div key={item._id} className="flex items-center justify-between py-2.5 gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <input type="checkbox" checked={selectedItemIds.includes(item._id)} onChange={() => handleToggleItemSelection(item._id)} className="w-4 h-4 rounded text-[#2c2769] accent-[#2c2769] cursor-pointer" />
                    <div className="relative w-10 h-10 border border-gray-100 rounded-lg overflow-hidden bg-white flex-shrink-0">
                      <Image src={item.image} alt={item.name} fill className="object-contain p-0.5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-gray-800 truncate">{item.name}</p>
                      <p className="text-[10px] text-gray-400">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-gray-700 whitespace-nowrap">{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            {/* 🎫 Coupon Section */}
            <div className="border-t border-b border-gray-50 py-3 mb-3">
              {!appliedCoupon ? (
                <div className="flex bg-gray-50 border border-gray-200 focus-within:border-[#2c2769] rounded-xl overflow-hidden">
                  <input type="text" placeholder="Coupon Code" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} className="w-full text-xs px-3 py-2 bg-transparent focus:outline-none uppercase font-bold" />
                  <button type="button" onClick={handleApplyCoupon} className="bg-[#2c2769] text-white text-xs font-bold px-4 py-1.5 m-1 rounded-lg">Apply</button>
                </div>
              ) : (
                <div className="flex items-center justify-between bg-green-50 border border-green-100 rounded-xl px-3 py-2 text-xs text-green-700 font-bold">
                  <span>Code {appliedCoupon} Applied!</span>
                  <button type="button" onClick={handleRemoveCoupon} className="text-gray-400 hover:text-red-500 font-bold">Remove</button>
                </div>
              )}
            </div>

            {/* Order Summaries */}
            <div className="space-y-2 text-xs text-gray-600 mb-4">
              <div className="flex justify-between"><span>Subtotal (Selected)</span><span className="font-bold text-gray-800">{formatPrice(basePrice)}</span></div>
              {discount > 0 && <div className="flex justify-between text-green-600 font-bold"><span>Discount</span><span>-{formatPrice(discount)}</span></div>}
              {/* 🛠️ ফিক্সড লজিক ৩: ডেলিভারি চার্জ ভ্যালু রিয়েল-টাইমে ০ অথবা জেলা অনুযায়ী আপডেট হবে ভাই */}
              <div className="flex justify-between">
                <span>Delivery Charge</span>
                {deliveryCharge !== null ? (
                  <span className="font-bold text-gray-800">{formatPrice(deliveryCharge)}</span>
                ) : (
                  <span className="text-[11px] text-orange-500 font-medium">Select area first</span>
                )}
              </div>
              <div className="border-t border-gray-100 pt-2 flex justify-between font-black text-gray-900 text-sm"><span>Total</span><span className="text-[#2c2769]">{formatPrice(grandTotal)}</span></div>
            </div>

            <button type="button" onClick={() => handleSubmitOrder()} disabled={isSubmitting || (selectedItemIds.length > 0 && deliveryCharge === null) || selectedItemIds.length === 0} className="w-full bg-[#2c2769] text-white font-bold py-3 rounded-xl text-xs transition-all hidden md:block disabled:opacity-50">
              {isSubmitting ? "Processing..." : "Place Order Now"}
            </button>
          </div>
        </div>
      </div>

      {/* 📱 Mobile Fixed Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 shadow-2xl p-3 z-[99999] flex items-center justify-between gap-4">
        <div className="flex flex-col">
          <span className="text-[10px] text-gray-400 font-bold uppercase">Grand Total</span>
          <span className="text-base font-black text-[#2c2769] leading-tight">{formatPrice(grandTotal)}</span>
        </div>
        <button type="button" onClick={() => handleSubmitOrder()} disabled={isSubmitting || (selectedItemIds.length > 0 && deliveryCharge === null) || selectedItemIds.length === 0} className="flex-1 bg-[#2c2769] text-white font-black py-3 rounded-xl text-center text-sm disabled:opacity-40">
          {isSubmitting ? "Processing..." : "Place Order Now"}
        </button>
      </div>

      {/* ➕ Add New Address Modal */}
      {isAddressModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-[999999]">
          <div className="bg-white rounded-2xl w-full max-w-md p-5 space-y-4 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-50 pb-2">
              <h3 className="font-extrabold text-gray-900 text-xs">Add New Address Profile</h3>
              <button onClick={() => setIsAddressModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
            </div>
            <form onSubmit={handleAddNewAddress} className="space-y-3 text-xs">
              <div className="space-y-1"><label className="font-bold text-gray-600 uppercase">Address Label</label><input type="text" className="w-full p-2.5 border border-gray-200 rounded-xl outline-none" value={newAddressForm.label} onChange={(e) => setNewAddressForm(p => ({ ...p, label: e.target.value }))} required /></div>
              <div className="space-y-1"><label className="font-bold text-gray-600 uppercase">Full Name</label><input type="text" className="w-full p-2.5 border border-gray-200 rounded-xl outline-none" value={newAddressForm.name} onChange={(e) => setNewAddressForm(p => ({ ...p, name: e.target.value }))} required /></div>
              <div className="space-y-1"><label className="font-bold text-gray-600 uppercase">Phone Number</label><input type="tel" className="w-full p-2.5 border border-gray-200 rounded-xl outline-none" value={newAddressForm.phone} onChange={(e) => setNewAddressForm(p => ({ ...p, phone: e.target.value.replace(/\D/g, "") }))} required /></div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1"><label className="font-bold text-gray-600 uppercase">District</label><select className="w-full p-2.5 border border-gray-200 rounded-xl bg-white" value={newAddressForm.district} onChange={(e) => setNewAddressForm(p => ({ ...p, district: e.target.value, thana: "" }))} required><option value="">Select</option>{districtList.map(d => <option key={d} value={d}>{d}</option>)}</select></div>
                <div className="space-y-1"><label className="font-bold text-gray-600 uppercase">Thana</label><select className="w-full p-2.5 border border-gray-200 rounded-xl bg-white" value={newAddressForm.thana} onChange={(e) => setNewAddressForm(p => ({ ...p, thana: e.target.value }))} disabled={!newAddressForm.district} required><option value="">Select</option>{(locationData[newAddressForm.district] || []).map(t => <option key={t} value={t}>{t}</option>)}</select></div>
              </div>
              <div className="space-y-1"><label className="font-bold text-gray-600 uppercase">Detailed Address</label><textarea rows={2} className="w-full p-2.5 border border-gray-200 rounded-xl outline-none" value={newAddressForm.homeAddress} onChange={(e) => setNewAddressForm(p => ({ ...p, homeAddress: e.target.value }))} required /></div>
              <button type="submit" className="w-full bg-[#2c2769] text-white py-2.5 rounded-xl font-bold text-xs mt-2">Save Address Profile</button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}