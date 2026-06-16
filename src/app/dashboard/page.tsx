"use client";

import { useState, useEffect, useRef } from "react";
import { MapPin, Trash2, Search, ChevronDown, Home, Briefcase, PlusCircle, User, Phone } from "lucide-react";

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

export default function DashboardPage() {
  const [userName, setUserName] = useState("Customer");
  const [userEmail, setUserEmail] = useState("Not Available");
  const [mounted, setMounted] = useState(false);

  // 🏠 Address Book State management
  const [addresses, setAddresses] = useState<SavedAddress[]>([]);
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

  // 🔑 কারেন্ট ইউজারের জন্য ইউনিক লোকালস্টোরেজ কী (Key) জেনারেট করার ফাংশন
  const getAddressKey = (email: string) => {
    return email && email !== "Not Available" ? `userAddresses_${email.trim().toLowerCase()}` : "userAddresses_guest";
  };

  useEffect(() => {
    setMounted(true);
    const storedName = localStorage.getItem("userName");
    const storedEmail = localStorage.getItem("userEmail"); 

    if (storedName) setUserName(storedName);
    
    // ইমেল যদি অবজেক্ট বা অন্য কিছু স্টোর হয়ে থাকে সেটিকে স্ট্রিং হ্যান্ডেল করা হচ্ছে
    const currentEmail = storedEmail || "Not Available";
    setUserEmail(currentEmail);

    // 🔒 ডাইনামিক কী থেকে কারেন্ট ইউজারের অ্যাড্রেস প্রোফাইল রিট্রিভ করা হচ্ছে
    const targetKey = getAddressKey(currentEmail);
    const storedAddresses = localStorage.getItem(targetKey);
    if (storedAddresses) {
      setAddresses(JSON.parse(storedAddresses));
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

  if (!mounted) return null;

  const handlePhoneChange = (val: string) => {
    setAddrPhone(val.replace(/\D/g, ""));
  };

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    setAddressError("");

    if (!addrName.trim() || !addrPhone.trim() || !district || !thana || !homeAddress.trim()) {
      setAddressError("Please fill out all mandatory fields.");
      return;
    }

    if (!addrPhone.startsWith("0") || addrPhone.length !== 11) {
      setAddressError("Phone number must start with 0 and be exactly 11 digits long.");
      return;
    }

    const finalLabel = label === "Others" ? (customLabel.trim() || "Others") : label;

    const newAddress: SavedAddress = {
      id: `addr_${Date.now()}`,
      label: finalLabel,
      name: addrName.trim(),
      phone: addrPhone.trim(),
      district,
      thana,
      homeAddress: homeAddress.trim(),
    };

    const updatedAddresses = [...addresses, newAddress];
    setAddresses(updatedAddresses);

    // 🔒 কারেন্ট ইউজারের নিজস্ব ইউনিক ডাইনামিক কী-তে ডাটা সেভ হচ্ছে
    localStorage.setItem(getAddressKey(userEmail), JSON.stringify(updatedAddresses));

    // Reset Inputs
    setAddrName("");
    setAddrPhone("");
    setDistrict("");
    setThana("");
    setHomeAddress("");
    setCustomLabel("");
    setLabel("Home");
  };

  const handleDeleteAddress = (id: string) => {
    const updated = addresses.filter((a) => a.id !== id);
    setAddresses(updated);
    
    // 🔒 ডিলিট করার পর ওই ইউজারের কী-তেই ডাটা আপডেট করা হচ্ছে
    localStorage.setItem(getAddressKey(userEmail), JSON.stringify(updated));
  };

  const filteredDistricts = districtList.filter((d) =>
    d.toLowerCase().includes(districtSearch.toLowerCase())
  );

  const filteredThanas = (locationData[district] || []).filter((t) =>
    t.toLowerCase().includes(thanaSearch.toLowerCase())
  );

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto animate-in fade-in duration-300">
      
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-800 flex items-center gap-2 capitalize">
          Welcome back, {userName}! 👋
        </h1>
        <p className="text-xs md:text-sm text-gray-400 mt-1">
          Manage your account, track orders, and update details
        </p>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex items-center gap-4">
          <div className="bg-purple-50 p-3 rounded-xl text-xl">📦</div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase">Total Orders</p>
            <p className="text-xl font-black text-gray-800">0</p>
          </div>
        </div>
        
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex items-center gap-4">
          <div className="bg-pink-50 p-3 rounded-xl text-xl">❤️</div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase">Wishlist Items</p>
            <p className="text-xl font-black text-gray-800">0</p>
          </div>
        </div>
      </div>

      {/* Main Bottom Dashboard Split Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Hand: Profile Data + Address Book Editor Container */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Account Details */}
          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
            <h2 className="text-base font-bold text-gray-800 mb-6 pb-2 border-b border-gray-50">
              Account Details
            </h2>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between items-center py-1">
                <span className="font-semibold text-gray-400">Name</span>
                <span className="font-bold text-gray-700 capitalize">{userName}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="font-semibold text-gray-400">Email</span>
                <span className="font-medium text-gray-700">{userEmail}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="font-semibold text-gray-400">Role</span>
                <span className="bg-gray-50 border border-gray-100 text-xs font-bold text-gray-600 px-3 py-1 rounded-full">
                  User
                </span>
              </div>
            </div>
          </div>

          {/* 🎟️ Add Address Book Form Subcard */}
          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-gray-800 flex items-center gap-2 pb-2 border-b border-gray-50">
              <PlusCircle size={17} className="text-[#2c2769]" />
              <span>Add New Address</span>
            </h2>

            {addressError && (
              <div className="bg-red-50 text-red-600 text-[11px] font-bold p-2.5 border border-red-100 rounded-xl text-center">
                {addressError}
              </div>
            )}

            <form onSubmit={handleAddAddress} className="space-y-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Address Tag</label>
                <div className="grid grid-cols-3 gap-2">
                  {["Home", "Office", "Others"].map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setLabel(item)}
                      className={`p-2 rounded-xl text-xs font-bold border transition-all text-center cursor-pointer ${
                        label === item ? "border-[#2c2769] bg-[#eeedf5]/40 text-[#2c2769]" : "border-gray-200 text-gray-500 hover:bg-gray-50"
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              {label === "Others" && (
                <input 
                  type="text"
                  placeholder="E.g., Gym, Friend's house"
                  className="w-full p-2.5 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#2c2769] text-gray-800 font-medium"
                  value={customLabel}
                  onChange={(e) => setCustomLabel(e.target.value)}
                />
              )}

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Full Name</label>
                <input 
                  type="text"
                  placeholder="Receiver name"
                  className="w-full p-2.5 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#2c2769] text-gray-800 font-medium"
                  value={addrName}
                  onChange={(e) => setAddrName(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Phone Number</label>
                <input 
                  type="tel"
                  maxLength={11}
                  placeholder="01XXXXXXXXX"
                  className="w-full p-2.5 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#2c2769] text-gray-800 font-medium"
                  value={addrPhone}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                />
              </div>

              <div className="space-y-1 relative" ref={districtRef}>
                <label className="text-[10px] font-bold text-gray-400 uppercase">District</label>
                <div 
                  onClick={() => setIsDistrictOpen(!isDistrictOpen)}
                  className="w-full p-2.5 border border-gray-200 rounded-xl text-xs bg-white flex justify-between items-center cursor-pointer select-none text-gray-700 font-medium"
                >
                  <span>{district || "Select District"}</span>
                  <ChevronDown size={14} className="text-gray-400" />
                </div>

                {isDistrictOpen && (
                  <div className="absolute left-0 right-0 bottom-[105%] bg-white border border-gray-100 shadow-xl rounded-xl z-30 max-h-44 flex flex-col overflow-hidden">
                    <div className="p-2 border-b border-gray-50 flex items-center gap-2 bg-gray-50">
                      <Search size={12} className="text-gray-400" />
                      <input 
                        type="text" 
                        placeholder="Search district..." 
                        className="w-full bg-transparent text-xs focus:outline-none text-gray-700"
                        value={districtSearch}
                        onChange={(e) => setDistrictSearch(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                    <div className="overflow-y-auto flex-1 divide-y divide-gray-50">
                      {filteredDistricts.map((d) => (
                        <div 
                          key={d}
                          onClick={() => { setDistrict(d); setThana(""); setIsDistrictOpen(false); }}
                          className="p-2.5 text-xs text-gray-700 hover:bg-gray-50 cursor-pointer"
                        >
                          {d}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-1 relative" ref={thanaRef}>
                <label className="text-[10px] font-bold text-gray-400 uppercase">Thana / Upazila</label>
                <div 
                  onClick={() => district && setIsThanaOpen(!isThanaOpen)}
                  className={`w-full p-2.5 border border-gray-200 rounded-xl text-xs flex justify-between items-center cursor-pointer select-none ${
                    !district ? 'bg-gray-50 text-gray-300' : 'text-gray-700 font-medium'
                  }`}
                >
                  <span>{thana || "Select Thana"}</span>
                  <ChevronDown size={14} className="text-gray-400" />
                </div>

                {isThanaOpen && district && (
                  <div className="absolute left-0 right-0 bottom-[105%] bg-white border border-gray-100 shadow-xl rounded-xl z-30 max-h-44 flex flex-col overflow-hidden">
                    <div className="p-2 border-b border-gray-50 flex items-center gap-2 bg-gray-50">
                      <Search size={12} className="text-gray-400" />
                      <input 
                        type="text" 
                        placeholder="Search Thana..." 
                        className="w-full bg-transparent text-xs focus:outline-none text-gray-700"
                        value={thanaSearch}
                        onChange={(e) => setThanaSearch(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                    <div className="overflow-y-auto flex-1 divide-y divide-gray-50">
                      {filteredThanas.map((t) => (
                        <div 
                          key={t}
                          onClick={() => { setThana(t); setIsThanaOpen(false); }}
                          className="p-2.5 text-xs text-gray-700 hover:bg-gray-50 cursor-pointer"
                        >
                          {t}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Detailed Address</label>
                <textarea 
                  rows={2}
                  placeholder="House/Road numbers, block, area..."
                  className="w-full p-2.5 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#2c2769] text-gray-800 font-medium resize-none"
                  value={homeAddress}
                  onChange={(e) => setHomeAddress(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#2c2769] hover:bg-[#1f1b4d] text-white py-2.5 font-bold text-xs rounded-xl transition-colors cursor-pointer mt-2"
              >
                Save to Address Book
              </button>
            </form>
          </div>

        </div>

        {/* Right Hand Side: Active Address Grid Profiles Viewer */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-base font-bold text-gray-800 flex items-center gap-2 pb-1">
            <MapPin size={18} className="text-[#2c2769]" />
            <span>Saved Address Book ({addresses.length})</span>
          </h2>

          {addresses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {addresses.map((addr) => (
                <div key={addr.id} className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm flex flex-col justify-between relative hover:border-gray-200 transition-all">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="bg-[#2c2769] text-white text-[9px] font-extrabold px-2 py-0.5 rounded-lg uppercase tracking-wider flex items-center gap-1">
                        {addr.label.toLowerCase() === "home" && <Home size={9} />}
                        {addr.label.toLowerCase() === "office" && <Briefcase size={9} />}
                        {addr.label}
                      </span>
                      <button
                        onClick={() => handleDeleteAddress(addr.id)}
                        className="text-gray-300 hover:text-red-500 transition-colors p-1 rounded-lg cursor-pointer"
                        title="Delete Address"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    <div className="text-xs space-y-1.5 pt-0.5">
                      <p className="font-bold text-gray-800 flex items-center gap-2">
                        <User size={13} className="text-gray-400" />
                        {addr.name}
                      </p>
                      <p className="font-semibold text-gray-500 flex items-center gap-2">
                        <Phone size={13} className="text-gray-400" />
                        {addr.phone}
                      </p>
                      <p className="text-gray-400 font-medium leading-relaxed pl-5">
                        {addr.homeAddress}, <br />
                        <span className="text-gray-600 font-bold">{addr.thana}, {addr.district}</span>
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white border border-gray-100 border-dashed rounded-3xl p-12 text-center text-gray-400">
              <MapPin size={32} className="mx-auto text-gray-200 mb-2" />
              <p className="text-xs font-bold">Your Address Book is currently empty.</p>
              <p className="text-[11px] text-gray-400/80 mt-0.5">Fill out the form on the left to add your first delivery location.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}