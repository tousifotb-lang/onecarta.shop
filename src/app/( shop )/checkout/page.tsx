"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cartStore";
import { formatPrice } from "@/lib/utils";
import { ShieldCheck, Truck, CreditCard, Search, ChevronDown, Ticket, Percent, MapPin } from "lucide-react";

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
  
  // 🔑 কার্ট স্টোর থেকে ফিল্টারড মেথড নেওয়া হলো অনুপাত ঠিক রাখতে
  const { getCartItems, totalPrice } = useCartStore();
  const items = getCartItems(); // 🔒 শুধুমাত্র বর্তমান অ্যাকাউন্টের আইটেম লোড হবে
  
  const [mounted, setMounted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [selectedPresentAddress, setSelectedPresentAddress] = useState<string>("");
  const [saveCustomAddress, setSaveCustomAddress] = useState(false);
  const [isDataModified, setIsDataModified] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    district: "",
    thana: "",
    homeAddress: "",
  });
  
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [nameTouched, setNameTouched] = useState(false);
  const [addressTouched, setAddressTouched] = useState(false);

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

  // 🔑 ইউনিক এড্রেস বুক কী
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
        setSavedAddresses(JSON.parse(storedAddresses));
      }
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (districtRef.current && !districtRef.current.contains(event.target as Node)) {
        setIsDistrictOpen(false);
      }
      if (thanaRef.current && !thanaRef.current.contains(event.target as Node)) {
        setIsThanaOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAddressSelect = (addrId: string) => {
    setSelectedPresentAddress(addrId);
    setIsDataModified(false); 
    setSaveCustomAddress(false);

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
    if (selectedPresentAddress) {
      setIsDataModified(true); 
    }
  };

  if (!mounted) {
    return <div className="container-main py-20 text-center text-gray-500">Loading Checkout...</div>;
  }

  if (items.length === 0 && !isSubmitting) {
    return (
      <div className="container-main py-20 text-center">
        <p className="text-5xl mb-4">🛒</p>
        <h2 className="text-xl font-bold text-gray-700">Your cart is empty</h2>
        <p className="text-sm text-gray-500 mt-1">Add some products before checking out.</p>
        <button onClick={() => router.push("/products")} className="mt-6 btn-primary">
          Return to Shop
        </button>
      </div>
    );
  }

  const getDeliveryCharge = () => {
    if (!formData.district || !formData.thana) return null;

    if (formData.district === "Dhaka") {
      if (formData.thana === "Savar" || formData.thana === "Keranigonj") {
        return 100;
      }
      return 80;
    }
    return 120;
  };

  const deliveryCharge = getDeliveryCharge();
  const basePrice = totalPrice();
  const grandTotal = deliveryCharge !== null ? basePrice + deliveryCharge - discount : basePrice - discount;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError("");

    const code = couponCode.trim().toUpperCase();
    if (!code) {
      setCouponError("Please enter a coupon code.");
      return;
    }

    if (code === "ONECARTA20") {
      setAppliedCoupon(code);
      setDiscount(200); 
      setCouponCode("");
    } else if (code === "FREESHIP" && deliveryCharge !== null) {
      setAppliedCoupon(code);
      setDiscount(deliveryCharge); 
      setCouponCode("");
    } else {
      setCouponError("Invalid coupon code.");
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setDiscount(0);
  };

  const handlePhoneChange = (value: string) => {
    const cleanedValue = value.replace(/\D/g, ""); 
    handleFieldChange("phone", cleanedValue);
  };

  const getPhoneMaxLength = () => {
    if (formData.phone.startsWith("0")) return 11;
    return 10;
  };

  const isPhoneValid = () => {
    const num = formData.phone;
    if (num.length === 0) return false;
    if (num.startsWith("0")) return num.length === 11;
    if (num.startsWith("1")) return num.length === 10;
    return false;
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      alert("Please enter your full name.");
      return;
    }
    if (!isPhoneValid()) {
      alert("Please enter a valid phone number.");
      return;
    }
    if (!formData.district) {
      alert("Please select your district.");
      return;
    }
    if (!formData.thana) {
      alert("Please select your Thana / Upazila.");
      return;
    }
    if (!formData.homeAddress.trim()) {
      alert("Please enter your detailed house/road address.");
      return;
    }

    setIsSubmitting(true);
    const formattedPhone = formData.phone.startsWith("0") 
      ? `+88${formData.phone}` 
      : `+880${formData.phone}`;

    // 💾 নির্দিষ্ট ইউজারের আইডিতে ডাইনামিক অটো-সেভ লজিক 
    if (isLoggedIn && userEmail && (selectedPresentAddress === "" || isDataModified) && saveCustomAddress) {
      try {
        const targetKey = getAddressKey(userEmail);
        const storedAddresses = localStorage.getItem(targetKey);
        const currentAddresses: SavedAddress[] = storedAddresses ? JSON.parse(storedAddresses) : [];
        
        const newAddressItem: SavedAddress = {
          id: `addr_${Date.now()}`,
          label: isDataModified ? "Modified Address" : `Saved Address ${currentAddresses.length + 1}`,
          name: formData.name,
          phone: formData.phone,
          district: formData.district,
          thana: formData.thana,
          homeAddress: formData.homeAddress,
        };

        localStorage.setItem(targetKey, JSON.stringify([...currentAddresses, newAddressItem]));
      } catch (err) {
        console.error(err);
      }
    }

    try {
      const orderData = {
        customer: {
          name: formData.name,
          phone: formattedPhone,
          fullAddress: `${formData.homeAddress}, Thana/Area: ${formData.thana}, District: ${formData.district}`
        },
        items: items,
        paymentMethod,
        deliveryCharge,
        discountApplied: discount,
        couponUsed: appliedCoupon,
        totalAmount: grandTotal,
      };

      console.log("Submitting Order:", orderData);
      await new Promise((resolve) => setTimeout(resolve, 800));
      router.push("/order-success"); 
    } catch (error) {
      setIsSubmitting(false);
    }
  };

  const getNameBorderClass = () => {
    if (formData.name.trim().length > 0) return "border-green-500 focus:border-green-500";
    if (nameTouched && formData.name.trim().length === 0) return "border-red-500 focus:border-red-500";
    return "border-gray-200 focus:border-[#2c2769]";
  };

  const getPhoneBorderClass = () => {
    if (formData.phone.length === 0) return "border-gray-200 focus-within:border-[#2c2769]";
    if (isPhoneValid()) return "border-green-500 focus-within:border-green-500";
    return "border-red-500 focus-within:border-red-500";
  };

  const getAddressBorderClass = () => {
    if (formData.homeAddress.trim().length > 0) return "border-green-500 focus:border-green-500";
    if (addressTouched && formData.homeAddress.trim().length === 0) return "border-red-500 focus:border-red-500";
    return "border-gray-200 focus:border-[#2c2769]";
  };

  const filteredDistricts = districtList.filter((d) =>
    d.toLowerCase().includes(districtSearch.toLowerCase())
  );

  const filteredThanas = (locationData[formData.district] || []).filter((t) =>
    t.toLowerCase().includes(thanaSearch.toLowerCase())
  );

  const shouldShowSaveBox = selectedPresentAddress === "" || isDataModified;

  return (
    <div className="container-main py-8">
      <h1 className="text-2xl font-extrabold text-gray-900 mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          
          {/* 🏠 Saved Address Book Section */}
          {isLoggedIn && (
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4 animate-in fade-in duration-200">
              <h2 className="text-base font-bold text-gray-800 flex items-center gap-2 pb-2 border-b border-gray-50">
                <MapPin size={18} className="text-[#2c2769]" />
                <span>Select From Saved Address Book</span>
              </h2>

              {savedAddresses.length > 0 ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-2.5">
                    {savedAddresses.map((addr) => (
                      <label 
                        key={addr.id} 
                        className={`flex items-start gap-3 p-3.5 border rounded-xl cursor-pointer transition-all ${
                          selectedPresentAddress === addr.id ? "border-[#2c2769] bg-[#eeedf5]/20" : "border-gray-100 bg-gray-50/30 hover:bg-gray-50/80"
                        }`}
                      >
                        <input 
                          type="radio" 
                          name="presentAddress" 
                          value={addr.id}
                          checked={selectedPresentAddress === addr.id}
                          onChange={() => handleAddressSelect(addr.id)}
                          className="mt-0.5 accent-[#2c2769]"
                        />
                        <div className="text-xs space-y-0.5">
                          <span className="bg-[#2c2769] text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider mb-1 inline-flex items-center gap-1">
                            {addr.label}
                          </span>
                          <p className="font-bold text-gray-800">{addr.name} — <span className="text-gray-500">{addr.phone}</span></p>
                          <p className="text-gray-400 font-medium">{addr.homeAddress}, {addr.thana}, {addr.district}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-4 border border-dashed border-gray-200 rounded-xl text-center">
                  <p className="text-xs text-gray-400 font-semibold">No saved address profiles discovered in your book.</p>
                  <button 
                    type="button"
                    onClick={() => router.push("/dashboard")}
                    className="text-xs text-[#2c2769] font-bold underline mt-1"
                  >
                    Manage Address Book inside Dashboard
                  </button>
                </div>
              )}
            </div>
          )}

          {/* 🚚 Shipping Address Inputs Form */}
          <form onSubmit={handleSubmitOrder} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2 pb-2 border-b border-gray-50">
              <Truck size={20} className="text-[#2c2769]" />
              <span>Shipping Address</span>
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-600 uppercase">Full Name *</label>
                <input 
                  type="text"
                  required
                  placeholder="Enter your full name"
                  className={`w-full p-3 border rounded-xl text-sm focus:outline-none transition-colors ${getNameBorderClass()}`}
                  value={formData.name}
                  onChange={(e) => {
                    handleFieldChange("name", e.target.value);
                    if (!nameTouched) setNameTouched(true);
                  }}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-600 uppercase">Phone Number *</label>
                <div className={`flex rounded-xl border overflow-hidden transition-colors ${getPhoneBorderClass()}`}>
                  <span className="bg-gray-100 px-3 py-3 text-sm text-gray-500 font-semibold border-r border-gray-200 select-none flex items-center">
                    +88
                  </span>
                  <input 
                    type="tel"
                    required
                    maxLength={getPhoneMaxLength()}
                    placeholder="01XXXXXXXXX"
                    className="w-full p-3 text-sm focus:outline-none bg-transparent"
                    value={formData.phone}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div className="space-y-1.5 relative" ref={districtRef}>
                <label className="text-xs font-bold text-gray-600 uppercase">District *</label>
                <div 
                  onClick={() => setIsDistrictOpen(!isDistrictOpen)}
                  className={`w-full p-3 border border-gray-200 rounded-xl text-sm bg-white flex justify-between items-center cursor-pointer select-none ${
                    formData.district ? "text-gray-800 font-medium" : "text-gray-400"
                  }`}
                >
                  <span>{formData.district || "Select District"}</span>
                  <ChevronDown size={16} className={`text-gray-400 transition-transform ${isDistrictOpen ? "rotate-180" : ""}`} />
                </div>

                {isDistrictOpen && (
                  <div className="absolute left-0 right-0 top-[105%] bg-white border border-gray-100 shadow-xl rounded-xl z-30 max-h-60 flex flex-col overflow-hidden">
                    <div className="p-2 border-b border-gray-50 flex items-center gap-2 bg-gray-50/50">
                      <Search size={14} className="text-gray-400" />
                      <input 
                        type="text" 
                        placeholder="Search district..." 
                        className="w-full bg-transparent text-sm focus:outline-none text-gray-700"
                        value={districtSearch}
                        onChange={(e) => setDistrictSearch(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                    <div className="overflow-y-auto flex-1 divide-y divide-gray-50">
                      {filteredDistricts.length > 0 ? (
                        filteredDistricts.map((district) => (
                          <div 
                            key={district}
                            onClick={() => {
                              handleFieldChange("district", district);
                              setFormData(prev => ({ ...prev, district: district, thana: "" }));
                              setDistrictSearch("");
                              setIsDistrictOpen(false);
                            }}
                            className="p-3 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors"
                          >
                            {district}
                          </div>
                        ))
                      ) : (
                        <div className="p-3 text-xs text-gray-400 text-center">No district found</div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-1.5 relative" ref={thanaRef}>
                <label className="text-xs font-bold text-gray-600 uppercase">Thana / Upazila *</label>
                <div 
                  onClick={() => formData.district && setIsThanaOpen(!isThanaOpen)}
                  className={`w-full p-3 border border-gray-200 rounded-xl text-sm flex justify-between items-center select-none ${
                    !formData.district ? "bg-gray-50 cursor-not-allowed text-gray-300" : "bg-white cursor-pointer text-gray-800"
                  } ${formData.thana ? "font-medium" : "text-gray-400"}`}
                >
                  <span>{formData.thana || "Select Thana"}</span>
                  <ChevronDown size={16} className={`text-gray-400 transition-transform ${isThanaOpen ? "rotate-180" : ""}`} />
                </div>

                {isThanaOpen && formData.district && (
                  <div className="absolute left-0 right-0 top-[105%] bg-white border border-gray-100 shadow-xl rounded-xl z-30 max-h-60 flex flex-col overflow-hidden">
                    <div className="p-2 border-b border-gray-50 flex items-center gap-2 bg-gray-50/50">
                      <Search size={14} className="text-gray-400" />
                      <input 
                        type="text" 
                        placeholder="Search Thana..." 
                        className="w-full bg-transparent text-sm focus:outline-none text-gray-700"
                        value={thanaSearch}
                        onChange={(e) => setThanaSearch(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                    <div className="overflow-y-auto flex-1 divide-y divide-gray-50">
                      {filteredThanas.length > 0 ? (
                        filteredThanas.map((thana) => (
                          <div 
                            key={thana}
                            onClick={() => {
                              handleFieldChange("thana", thana);
                              setThanaSearch("");
                              setIsThanaOpen(false);
                            }}
                            className="p-3 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors"
                          >
                            {thana}
                          </div>
                        ))
                      ) : (
                        <div className="p-3 text-xs text-gray-400 text-center">No Thana found</div>
                      )}
                    </div>
                  </div>
                )}
              </div>

            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-600 uppercase">House / Road / Street Details *</label>
              <textarea 
                required
                rows={2}
                placeholder="House No. 12, Road No. 4, Block A, Area Details..."
                className={`w-full p-3 border rounded-xl text-sm focus:outline-none transition-colors ${getAddressBorderClass()}`}
                value={formData.homeAddress}
                onChange={(e) => {
                  handleFieldChange("homeAddress", e.target.value);
                  if (!addressTouched) setAddressTouched(true);
                }}
              />
            </div>

            {/* 💾 নতুন বা পরিবর্তিত অ্যাড্রেস ড্যাশবোর্ডে সেভ করার স্মার্ট চেকবক্স */}
            {isLoggedIn && shouldShowSaveBox && (
              <label className="flex items-center gap-2 bg-green-50/40 border border-green-100/70 p-3 rounded-xl cursor-pointer select-none animate-in font-medium duration-200 mt-2">
                <input 
                  type="checkbox"
                  checked={saveCustomAddress}
                  onChange={(e) => setSaveCustomAddress(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-500 accent-green-600"
                />
                <span className="text-xs font-bold text-gray-700">
                  {isDataModified ? "Save these changes to your profile for future use?" : "Save this new address to your profile for future use?"}
                </span>
              </label>
            )}
          </form>

          {/* 💳 Payment Selection */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2 pb-2 border-b border-gray-50">
              <CreditCard size={20} className="text-[#2c2769]" />
              <span>Payment Method</span>
            </h2>

            <div className="space-y-3">
              <label className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-all ${
                paymentMethod === "cod" ? "border-[#2c2769] bg-[#eeedf5]/20" : "border-gray-100"
              }`}>
                <div className="flex items-center gap-3">
                  <input 
                    type="radio" 
                    name="payment" 
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={() => setPaymentMethod("cod")}
                    className="accent-[#2c2769]"
                  />
                  <div>
                    <p className="text-sm font-bold text-gray-800">Cash on Delivery (COD)</p>
                    <p className="text-xs text-gray-400 mt-0.5">Pay with cash upon delivery to your home.</p>
                  </div>
                </div>
              </label>

              <label className={`flex items-center justify-between p-4 border rounded-xl cursor-not-allowed opacity-60 transition-all ${
                paymentMethod === "online" ? "border-[#2c2769] bg-[#eeedf5]/20" : "border-gray-100"
              }`}>
                <div className="flex items-center gap-3">
                  <input 
                    type="radio" 
                    name="payment" 
                    value="online"
                    disabled
                    className="accent-[#2c2769]"
                  />
                  <div>
                    <p className="text-sm font-bold text-gray-800">bKash / Nagad / Cards</p>
                    <p className="text-xs text-gray-400 mt-0.5">Online payment integration coming soon.</p>
                  </div>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* 📋 Summary Sidebar */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col h-fit">
            <h2 className="text-lg font-bold text-gray-800 pb-2 border-b border-gray-50 mb-4">Order Summary</h2>
            
            <div className="divide-y divide-gray-50 overflow-y-auto max-h-64 pr-1 mb-4">
              {items.map((item) => (
                <div key={item._id} className="flex items-center justify-between py-3 gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative w-12 h-12 border border-gray-100 rounded-lg overflow-hidden bg-white flex-shrink-0">
                      <Image src={item.image} alt={item.name} fill className="object-contain p-0.5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-gray-800 truncate">{item.name}</p>
                      <p className="text-[11px] text-gray-400 mt-0.5">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-gray-700 whitespace-nowrap">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Coupon Entry Component */}
            <div className="border-t border-b border-gray-100 py-4 mb-4">
              {!appliedCoupon ? (
                <div className="space-y-2">
                  <div className="relative flex items-center bg-gray-50 border border-gray-200 focus-within:border-[#2c2769] rounded-xl overflow-hidden transition-all">
                    <span className="pl-3.5 text-gray-400">
                      <Ticket size={15} />
                    </span>
                    <input
                      type="text"
                      placeholder="Enter Coupon Code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="w-full text-xs text-gray-800 px-2.5 py-2.5 bg-transparent focus:outline-none uppercase tracking-wider font-semibold"
                    />
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      className="bg-[#2c2769] hover:bg-[#1f1b4d] text-white text-xs font-bold px-4 py-2 m-1 rounded-lg transition-colors cursor-pointer"
                    >
                      Apply
                    </button>
                  </div>
                  {couponError && (
                    <p className="text-[10px] font-semibold text-red-500 pl-1">
                      {couponError}
                    </p>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-between bg-green-50/60 border border-green-100 rounded-xl px-3.5 py-2.5 text-xs animate-in fade-in duration-200">
                  <div className="flex items-center gap-2 text-green-700 font-semibold">
                    <Percent size={14} />
                    <span>Code <span className="font-extrabold">{appliedCoupon}</span> Applied!</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveCoupon}
                    className="text-gray-400 hover:text-red-500 font-bold px-1 transition-colors text-[11px]"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-gray-800">{formatPrice(totalPrice())}</span>
              </div>
              
              {discount > 0 && (
                <div className="flex justify-between items-center text-green-600 font-medium animate-in fade-in duration-150">
                  <span>Coupon Discount</span>
                  <span className="font-bold">-{formatPrice(discount)}</span>
                </div>
              )}

              <div className="flex justify-between items-center">
                <span>Delivery Charge</span>
                {deliveryCharge !== null ? (
                  <span className="font-semibold text-gray-800">{formatPrice(deliveryCharge)}</span>
                ) : (
                  <span className="text-xs text-orange-500 font-medium">Select Thana first</span>
                )}
              </div>
              <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-gray-900 text-base">
                <span>Total</span>
                <span className="text-[#2c2769]">{formatPrice(grandTotal)}</span>
              </div>
            </div>

            <button
              type="submit"
              onClick={handleSubmitOrder}
              disabled={isSubmitting || deliveryCharge === null}
              className="w-full bg-[#2c2769] hover:bg-[#1f1b4d] text-white font-bold py-3.5 rounded-xl text-sm transition-all mt-6 shadow-lg shadow-[#2c2769]/10 hover:shadow-[#2c2769]/20 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
            >
              {isSubmitting ? "Processing Order..." : "Place Order Now"}
            </button>

            <div className="flex items-center justify-center gap-1.5 text-gray-400 text-[11px] mt-4 font-medium">
              <ShieldCheck size={14} className="text-green-500" />
              <span>Secure checkout guarantee</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}