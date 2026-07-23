"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useCartStore } from "@/store/cartStore";
import { useAuthModalStore } from "@/store/authModalStore";
import { formatPrice } from "@/lib/utils";
import { Truck, CreditCard, Search, ChevronDown, MapPin, Plus, Minus, X, Loader2, Gift } from "lucide-react";

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

// Integer-cent math helpers — every point/money calculation on this page
// uses these instead of raw float arithmetic, so decimal prices (e.g.
// ৳151.50) never produce the classic JS floating-point rounding bug.
const toCents = (amount: number) => Math.round(amount * 100);
const fromCents = (cents: number) => cents / 100;

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
  const { data: session, status } = useSession();
  const { openModal } = useAuthModalStore();

  const { getCartItems, updateQuantity, clearCart } = useCartStore();
  const items = getCartItems();

  const [mounted, setMounted] = useState(false);
  const isLoggedIn = status === "authenticated";

  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [selectedPresentAddress, setSelectedPresentAddress] = useState<string>("");
  const [loadingAddresses, setLoadingAddresses] = useState(false);

  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    district: "",
    thana: "",
    homeAddress: "",
  });

  const [saveAddressToProfile, setSaveAddressToProfile] = useState(true);
  const [isSavingProfileAddress, setIsSavingProfileAddress] = useState(false);

  const [newAddressForm, setNewAddressForm] = useState({
    label: "Home",
    name: "",
    phone: "",
    district: "",
    thana: "",
    homeAddress: "",
  });
  const [isSavingNewAddress, setIsSavingNewAddress] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const [isDistrictOpen, setIsDistrictOpen] = useState(false);
  const [districtSearch, setDistrictSearch] = useState("");
  const [isThanaOpen, setIsThanaOpen] = useState(false);
  const [thanaSearch, setThanaSearch] = useState("");

  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponError, setCouponError] = useState("");
  const [discount, setDiscount] = useState(0);
  const [freeDeliveryApplied, setFreeDeliveryApplied] = useState(false);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  const [autoAppliedAttempted, setAutoAppliedAttempted] = useState(false);

  const [deliveryRates, setDeliveryRates] = useState({ insideDhaka: 80, specialZone: 100, outsideDhaka: 120 });

  // Loyalty Points — admin-controlled rates, this customer's live balance,
  // and a free-text "how many points do you want to use" input (replaces
  // the old all-or-nothing checkbox).
  const [loyaltyBalance, setLoyaltyBalance] = useState(0);
  const [loyaltySettings, setLoyaltySettings] = useState({
    isActive: false,
    earnRateAmount: 100,
    earnRatePoints: 1,
    redeemPointsAmount: 100,
    redeemValueAmount: 10,
    minRedeemPoints: 100,
  });
  const [customPointsInput, setCustomPointsInput] = useState("");

  const districtRef = useRef<HTMLDivElement>(null);
  const thanaRef = useRef<HTMLDivElement>(null);
  const reapplyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cartSyncTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (session?.user?.email && !formData.email) {
      setFormData((prev) => ({ ...prev, email: session.user!.email! }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  useEffect(() => {
    if (items.length === 0) return;

    const userEmail = session?.user?.email || formData.email || null;
    const hasEnoughContact = !!userEmail || formData.phone.length >= 10;
    if (!hasEnoughContact) return;

    if (cartSyncTimerRef.current) clearTimeout(cartSyncTimerRef.current);
    cartSyncTimerRef.current = setTimeout(() => {
      fetch("/api/cart/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: userEmail,
          phone: formData.phone,
          name: formData.name,
          items: items.map((item) => ({
            productId: item._id,
            name: item.name,
            slug: item.slug,
            image: item.image,
            price: item.price,
            originalPrice: item.originalPrice,
            quantity: item.quantity,
          })),
          totalAmount: items.reduce((sum, i) => sum + i.price * i.quantity, 0),
        }),
      }).catch(() => {});
    }, 1500);

    return () => {
      if (cartSyncTimerRef.current) clearTimeout(cartSyncTimerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, formData.phone, formData.name, formData.email, session]);

  useEffect(() => {
    fetch("/api/settings/delivery")
      .then((r) => r.json())
      .then((d) => { if (d.rates) setDeliveryRates(d.rates); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetch("/api/settings/loyalty")
      .then((r) => r.json())
      .then((d) => setLoyaltySettings(d))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (status !== "authenticated") return;
    fetch("/api/loyalty/me")
      .then((r) => r.json())
      .then((d) => setLoyaltyBalance(d.balance || 0))
      .catch(() => {});
  }, [status]);

  const loadUserAddresses = async () => {
    setLoadingAddresses(true);
    try {
      const res = await fetch("/api/users/me");
      if (!res.ok) return;
      const data = await res.json();
      const addresses: SavedAddress[] = data.addresses || [];
      setSavedAddresses(addresses);

      const defaultAddr = addresses.find((a) => a.isDefault) || addresses[0];
      if (defaultAddr) {
        setSelectedPresentAddress(defaultAddr._id);
        setFormData((prev) => ({
          ...prev,
          name: defaultAddr.name,
          phone: defaultAddr.phone,
          district: defaultAddr.district,
          thana: defaultAddr.thana,
          homeAddress: defaultAddr.homeAddress,
        }));
      } else if (data.name || data.phone) {
        setFormData((prev) => ({ ...prev, name: data.name || "", phone: data.phone || "" }));
      }
    } catch (err) {
      console.error("Failed to load saved addresses:", err);
    } finally {
      setLoadingAddresses(false);
    }
  };

  useEffect(() => {
    setMounted(true);

    if (items.length > 0) {
      setSelectedItemIds(items.map((i) => i._id));
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

  useEffect(() => {
    if (status === "authenticated") {
      loadUserAddresses();
    }
  }, [status]);

  const handleAddressSelect = (addrId: string) => {
    setSelectedPresentAddress(addrId);
    const activeAddr = savedAddresses.find((a) => a._id === addrId);
    if (activeAddr) {
      setFormData((prev) => ({
        ...prev,
        name: activeAddr.name,
        phone: activeAddr.phone,
        district: activeAddr.district,
        thana: activeAddr.thana,
        homeAddress: activeAddr.homeAddress,
      }));
    }
  };

  const handleFieldChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleToggleItemSelection = (id: string) => {
    setSelectedItemIds((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  const getDeliveryCharge = () => {
    if (selectedItemIds.length === 0) return 0;
    if (!formData.district || !formData.thana) return null;
    if (freeDeliveryApplied) return 0;
    if (formData.district === "Dhaka") {
      if (formData.thana === "Savar" || formData.thana === "Keranigonj") return deliveryRates.specialZone;
      return deliveryRates.insideDhaka;
    }
    return deliveryRates.outsideDhaka;
  };

  const selectedItems = items.filter((item) => selectedItemIds.includes(item._id));
  const basePrice = selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const originalSubtotal = selectedItems.reduce(
    (sum, item) => sum + (item.originalPrice ?? item.price) * item.quantity,
    0
  );
  const productSavings = Math.max(0, originalSubtotal - basePrice);

  const deliveryCharge = getDeliveryCharge();

  // ── Loyalty points: cent-safe custom redemption ──────────────────────────
  const valuePerPointCents =
    loyaltySettings.redeemPointsAmount > 0
      ? (loyaltySettings.redeemValueAmount * 100) / loyaltySettings.redeemPointsAmount
      : 0;

  const maxPointsDiscountAllowedCents = Math.max(0, toCents(basePrice) - toCents(discount));
  const maxPointsFromCap =
    valuePerPointCents > 0 ? Math.floor(maxPointsDiscountAllowedCents / valuePerPointCents) : 0;
  const maxRedeemablePoints = Math.max(0, Math.min(loyaltyBalance, maxPointsFromCap));

  const rawCustomPoints = Math.max(0, Math.min(parseInt(customPointsInput) || 0, maxRedeemablePoints));
  const meetsMinimum = rawCustomPoints === 0 || rawCustomPoints >= loyaltySettings.minRedeemPoints;
  const pointsToRedeem = meetsMinimum ? rawCustomPoints : 0;
  const pointsDiscountAmount = fromCents(Math.round(pointsToRedeem * valuePerPointCents));

  // "Round off" quick option — figures out exactly how many points are
  // needed to cover just the decimal (paisa) remainder of the total, so the
  // final payable amount comes out to a clean whole number.
  const totalBeforePointsCents =
    deliveryCharge !== null
      ? toCents(basePrice) - toCents(discount) + toCents(deliveryCharge)
      : toCents(basePrice) - toCents(discount);
  const decimalRemainderCents = ((totalBeforePointsCents % 100) + 100) % 100;
  const roundOffPointsNeeded =
    valuePerPointCents > 0 && decimalRemainderCents > 0
      ? Math.min(maxRedeemablePoints, Math.ceil(decimalRemainderCents / valuePerPointCents))
      : 0;

  const grandTotal =
    deliveryCharge !== null
      ? basePrice + deliveryCharge - discount - pointsDiscountAmount
      : basePrice - discount - pointsDiscountAmount;

  // Preview of how many points this order will earn — mirrors the exact
  // formula the server locks in at order creation.
  const pointsToEarnPreview = (() => {
    if (!isLoggedIn || !loyaltySettings.isActive || loyaltySettings.earnRateAmount <= 0 || loyaltySettings.earnRatePoints <= 0) {
      return 0;
    }
    const basisCents = Math.max(0, toCents(basePrice) - toCents(discount) - toCents(pointsDiscountAmount));
    const basis = fromCents(basisCents);
    return Math.floor(basis / loyaltySettings.earnRateAmount) * loyaltySettings.earnRatePoints;
  })();

  const validateCoupon = async (
    code: string,
    currentSubtotal: number,
    currentDeliveryCharge: number | null,
    phone: string,
    isDhaka: boolean
  ) => {
    const res = await fetch("/api/promo-codes/validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code,
        subtotal: currentSubtotal,
        deliveryCharge: currentDeliveryCharge ?? 0,
        phone,
        isDhaka,
      }),
    });
    return res.json() as Promise<{ valid: boolean; code?: string; discount?: number; freeDelivery?: boolean; error?: string }>;
  };

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError("");
    const code = couponCode.trim().toUpperCase();
    if (!code) {
      setCouponError("Please enter a coupon code.");
      return;
    }
    if (basePrice <= 0) {
      setCouponError("Select at least one product before applying a coupon.");
      return;
    }

    setIsApplyingCoupon(true);
    try {
      const isDhaka = formData.district === "Dhaka";
      const data = await validateCoupon(code, basePrice, deliveryCharge, formData.phone, isDhaka);
      if (data.valid && data.code && typeof data.discount === "number") {
        setAppliedCoupon(data.code);
        setDiscount(data.discount);
        setFreeDeliveryApplied(!!data.freeDelivery);
        setCouponCode("");
      } else {
        setCouponError(data.error || "Invalid coupon code.");
      }
    } catch (err) {
      setCouponError("Something went wrong while applying the coupon.");
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  useEffect(() => {
    if (!appliedCoupon) return;

    if (basePrice <= 0) {
      setAppliedCoupon(null);
      setDiscount(0);
      setFreeDeliveryApplied(false);
      return;
    }

    if (reapplyTimerRef.current) clearTimeout(reapplyTimerRef.current);
    reapplyTimerRef.current = setTimeout(async () => {
      try {
        const isDhaka = formData.district === "Dhaka";
        const data = await validateCoupon(appliedCoupon, basePrice, deliveryCharge, formData.phone, isDhaka);
        if (data.valid && typeof data.discount === "number") {
          setDiscount(data.discount);
          setFreeDeliveryApplied(!!data.freeDelivery);
        } else {
          setAppliedCoupon(null);
          setDiscount(0);
          setFreeDeliveryApplied(false);
          setCouponError(data.error || "Coupon removed — it no longer applies to your order.");
        }
      } catch {
        // network hiccup — discount আগের মতই রেখে দেওয়া হলো
      }
    }, 400);

    return () => {
      if (reapplyTimerRef.current) clearTimeout(reapplyTimerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [basePrice, formData.district]);

  useEffect(() => {
    if (!isLoggedIn || autoAppliedAttempted || appliedCoupon || basePrice <= 0) return;

    const tryAutoApplyNewUserDiscount = async () => {
      setAutoAppliedAttempted(true);
      try {
        const ordersRes = await fetch("/api/orders/my-orders");
        if (!ordersRes.ok) return;
        const ordersData = await ordersRes.json();
        const hasPriorOrders = Array.isArray(ordersData) && ordersData.length > 0;
        if (hasPriorOrders) return;

        const isDhaka = formData.district === "Dhaka";
        const data = await validateCoupon("NEW10", basePrice, deliveryCharge, formData.phone, isDhaka);
        if (data.valid && data.code && typeof data.discount === "number") {
          setAppliedCoupon(data.code);
          setDiscount(data.discount);
          setFreeDeliveryApplied(!!data.freeDelivery);
        }
      } catch (err) {
        console.error("Auto-apply new-user discount failed:", err);
      }
    };

    tryAutoApplyNewUserDiscount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn, basePrice]);

  if (!mounted || status === "loading") {
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

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setDiscount(0);
    setFreeDeliveryApplied(false);
    setCouponError("");
  };

  const handleAddNewAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddressForm.name || !newAddressForm.phone || !newAddressForm.district || !newAddressForm.thana || !newAddressForm.homeAddress) return;

    setIsSavingNewAddress(true);
    try {
      const res = await fetch("/api/users/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAddressForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Address save failed");

      setSavedAddresses(data);
      const justAdded = data[data.length - 1];
      if (justAdded) {
        setSelectedPresentAddress(justAdded._id);
        setFormData((prev) => ({
          ...prev,
          name: justAdded.name,
          phone: justAdded.phone,
          district: justAdded.district,
          thana: justAdded.thana,
          homeAddress: justAdded.homeAddress,
        }));
      }

      setIsAddressModalOpen(false);
      setNewAddressForm({ label: "Home", name: "", phone: "", district: "", thana: "", homeAddress: "" });
    } catch (err: any) {
      alert(err.message || "Address save করতে সমস্যা হয়েছে।");
    } finally {
      setIsSavingNewAddress(false);
    }
  };

  const trySaveAddressToProfile = async () => {
    if (!isLoggedIn || savedAddresses.length > 0 || !saveAddressToProfile) return;

    setIsSavingProfileAddress(true);
    try {
      await fetch("/api/users/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          label: "Home",
          name: formData.name,
          phone: formData.phone,
          district: formData.district,
          thana: formData.thana,
          homeAddress: formData.homeAddress,
        }),
      });
    } catch (err) {
      console.error("Failed to save address to profile:", err);
    } finally {
      setIsSavingProfileAddress(false);
    }
  };

  const handleSubmitOrder = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSubmitError("");

    if (selectedItemIds.length === 0) {
      setSubmitError("Please select at least one product.");
      return;
    }
    if (!formData.name.trim() || !formData.phone || !formData.district || !formData.thana || !formData.homeAddress.trim()) {
      setSubmitError("Please complete address details.");
      return;
    }

    setIsSubmitting(true);

    await trySaveAddressToProfile();

    try {
      const payload = {
        customerName: formData.name,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        customerAddress: `${formData.homeAddress}, ${formData.thana}, ${formData.district}`,
        items: selectedItems.map((item) => ({
          productId: item._id,
          name: item.name,
          qty: item.quantity,
          unitPrice: item.price,
          originalUnitPrice: item.originalPrice ?? item.price,
        })),
        deliveryCharge: deliveryCharge || 0,
        productSavings,
        discountAmount: discount,
        couponCode: appliedCoupon,
        pointsToRedeem,
        paymentMethod: "Cash on Delivery (COD)",
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Order placement failed");

        clearCart?.();
        router.push(`/order-success?orderId=${encodeURIComponent(data.orderId)}`);
    } catch (err: any) {
      setSubmitError(err.message || "Something went wrong while placing your order.");
      setIsSubmitting(false);
    }
  };

  const filteredDistricts = districtList.filter((d) => d.toLowerCase().includes(districtSearch.toLowerCase()));
  const filteredThanas = (locationData[formData.district] || []).filter((t) => t.toLowerCase().includes(thanaSearch.toLowerCase()));

  const renderAddressInputForm = () => (
    <>
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

      <div className="space-y-1.5">
        <label className="text-xs font-bold text-gray-600 uppercase">Email (Optional)</label>
        <input type="email" placeholder="you@example.com" className="w-full p-3 border border-gray-200 focus:border-[#2c2769] rounded-xl text-sm focus:outline-none" value={formData.email} onChange={(e) => handleFieldChange("email", e.target.value)} />
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
                {filteredDistricts.map((d) => (
                  <div key={d} onClick={() => { setFormData((p) => ({ ...p, district: d, thana: "" })); setIsDistrictOpen(false); }} className="p-2.5 text-xs text-gray-700 hover:bg-gray-50 cursor-pointer">{d}</div>
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
                {filteredThanas.map((t) => (
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
    </>
  );

  return (
    <div className="container-main py-6 pb-24 md:pb-8">
      <h1 className="text-2xl font-extrabold text-gray-900 mb-6">Checkout</h1>

      {submitError && (
        <div className="mb-4 bg-red-50 border border-red-100 text-red-600 text-xs font-semibold p-3 rounded-xl">
          {submitError}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

        <div className="lg:col-span-2 space-y-6">

          {isLoggedIn && loadingAddresses ? (
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
              <div className="text-xs text-gray-400 font-semibold p-4 text-center flex items-center justify-center gap-2">
                <Loader2 size={14} className="animate-spin" /> Loading addresses...
              </div>
            </div>
          ) : isLoggedIn && savedAddresses.length > 0 ? (

            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-gray-50">
                <h2 className="text-base font-bold text-gray-800 flex items-center gap-2">
                  <MapPin size={18} className="text-[#2c2769]" />
                  <span>Select Delivery Address</span>
                </h2>
                <button type="button" onClick={() => setIsAddressModalOpen(true)} className="p-1.5 bg-[#eeedf5] text-[#2c2769] hover:bg-[#2c2769] hover:text-white rounded-lg transition-all"><Plus size={16} /></button>
              </div>

              <div className="grid grid-cols-1 gap-2.5">
                {savedAddresses.map((addr) => (
                  <label key={addr._id} className={`flex items-start gap-3 p-3.5 border rounded-xl cursor-pointer transition-all ${selectedPresentAddress === addr._id ? "border-[#2c2769] bg-[#eeedf5]/20" : "border-gray-100 bg-gray-50/30 hover:bg-gray-50/80"}`}>
                    <input type="radio" name="presentAddress" value={addr._id} checked={selectedPresentAddress === addr._id} onChange={() => handleAddressSelect(addr._id)} className="mt-0.5 accent-[#2c2769]" />
                    <div className="text-xs space-y-0.5">
                      <span className="bg-[#2c2769] text-white text-[9px] font-black px-1.5 py-0.5 rounded uppercase mb-1 inline-block">{addr.label}</span>
                      <p className="font-bold text-gray-800">{addr.name} — <span className="text-gray-500">{addr.phone}</span></p>
                      <p className="text-gray-400 font-semibold">{addr.homeAddress}, {addr.thana}, {addr.district}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

          ) : isLoggedIn && savedAddresses.length === 0 ? (

            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4">
              <h2 className="text-base font-bold text-gray-800 flex items-center gap-2 pb-2 border-b border-gray-50">
                <Truck size={18} className="text-[#2c2769]" />
                <span>Shipping Address Details</span>
              </h2>

              {renderAddressInputForm()}

              <label className="flex items-start gap-2.5 bg-[#eeedf5]/30 border border-[#2c2769]/10 rounded-xl p-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={saveAddressToProfile}
                  onChange={(e) => setSaveAddressToProfile(e.target.checked)}
                  className="mt-0.5 accent-[#2c2769] cursor-pointer"
                />
                <span className="text-xs text-gray-600 font-semibold leading-relaxed">
                  Save this address to my profile for faster checkout next time.
                </span>
              </label>
            </div>

          ) : (

            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4">
              <h2 className="text-base font-bold text-gray-800 flex items-center gap-2 pb-2 border-b border-gray-50">
                <Truck size={18} className="text-[#2c2769]" />
                <span>Shipping Address Details</span>
              </h2>

              <div className="bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold p-3 rounded-xl flex items-center justify-between gap-3">
                <span>Have an account? Sign in to use your saved addresses.</span>
                <button type="button" onClick={() => openModal()} className="font-black underline shrink-0">Sign In</button>
              </div>

              {renderAddressInputForm()}
            </div>
          )}

          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-3">
            <h2 className="text-base font-bold text-gray-800 flex items-center gap-2 pb-2 border-b border-gray-50"><CreditCard size={18} className="text-[#2c2769]" /><span>Payment Method</span></h2>
            <label className="flex items-center justify-between p-3.5 border border-[#2c2769] bg-[#eeedf5]/10 rounded-xl cursor-pointer"><div className="flex items-center gap-3"><input type="radio" checked readOnly className="accent-[#2c2769]" /><div><p className="text-xs font-bold text-gray-800">Cash on Delivery (COD)</p><p className="text-[11px] text-gray-400">Pay with cash upon package receipt.</p></div></div></label>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
            <h2 className="text-base font-bold text-gray-800 pb-2 border-b border-gray-50 mb-3">Cart Products</h2>

            <div className="divide-y divide-gray-50 max-h-60 overflow-y-auto pr-1 space-y-2 mb-3">
              {items.map((item) => {
                const originalUnitPrice = item.originalPrice ?? item.price;
                const hasCutPrice = originalUnitPrice > item.price;

                return (
                  <div key={item._id} className="flex items-center justify-between py-2.5 gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <input type="checkbox" checked={selectedItemIds.includes(item._id)} onChange={() => handleToggleItemSelection(item._id)} className="w-4 h-4 rounded text-[#2c2769] accent-[#2c2769] cursor-pointer" />
                      <div className="relative w-10 h-10 border border-gray-100 rounded-lg overflow-hidden bg-white flex-shrink-0">
                        <Image src={item.image} alt={item.name} fill className="object-contain p-0.5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-gray-800 truncate">{item.name}</p>
                        <div className="flex items-center gap-1.5 mt-1">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item._id, item.quantity - 1)}
                            className="w-5 h-5 flex items-center justify-center rounded-md border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-[#2c2769] transition-colors cursor-pointer"
                          >
                            <Minus size={10} />
                          </button>
                          <span className="text-[10px] font-bold text-gray-700 min-w-[16px] text-center">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item._id, item.quantity + 1)}
                            disabled={item.quantity >= item.stock}
                            className="w-5 h-5 flex items-center justify-center rounded-md border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-[#2c2769] transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            <Plus size={10} />
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-baseline gap-1.5 whitespace-nowrap flex-shrink-0">
                      {hasCutPrice && (
                        <span className="text-[10px] text-gray-400 line-through font-medium">
                          {formatPrice(originalUnitPrice * item.quantity)}
                        </span>
                      )}
                      <span className="text-xs font-bold text-gray-700">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="border-t border-b border-gray-50 py-3 mb-3 space-y-2">
              {!appliedCoupon ? (
                <>
                  <div className="flex bg-gray-50 border border-gray-200 focus-within:border-[#2c2769] rounded-xl overflow-hidden">
                    <input
                      type="text"
                      placeholder="Coupon Code"
                      value={couponCode}
                      onChange={(e) => { setCouponCode(e.target.value); if (couponError) setCouponError(""); }}
                      disabled={isApplyingCoupon}
                      className="w-full text-xs px-3 py-2 bg-transparent focus:outline-none uppercase font-bold disabled:opacity-60"
                    />
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      disabled={isApplyingCoupon}
                      className="bg-[#2c2769] text-white text-xs font-bold px-4 py-1.5 m-1 rounded-lg flex items-center gap-1.5 disabled:opacity-60"
                    >
                      {isApplyingCoupon && <Loader2 size={12} className="animate-spin" />}
                      {isApplyingCoupon ? "Checking..." : "Apply"}
                    </button>
                  </div>
                  {couponError && (
                    <p className="text-[11px] text-red-500 font-semibold px-1">{couponError}</p>
                  )}
                </>
              ) : (
                <div className="flex items-center justify-between bg-green-50 border border-green-100 rounded-xl px-3 py-2 text-xs text-green-700 font-bold">
                  <span className="flex items-center gap-1.5 flex-wrap">
                    {appliedCoupon === "NEW10" ? "🎉 New User 10% OFF Applied!" : `Code ${appliedCoupon} Applied!`}
                    {freeDeliveryApplied && (
                      <span className="text-[9px] bg-green-600 text-white px-1.5 py-0.5 rounded-full uppercase tracking-wide">Free Delivery</span>
                    )}
                  </span>
                  <button type="button" onClick={handleRemoveCoupon} className="text-gray-400 hover:text-red-500 font-bold">Remove</button>
                </div>
              )}
            </div>

            {/* Loyalty Points — custom amount entry + round-off quick option */}
            {isLoggedIn && loyaltySettings.isActive && (
              <div className="border-b border-gray-50 pb-3 mb-3 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                    <Gift size={13} className="text-[#2c2769]" /> Loyalty Points
                  </span>
                  <span className="text-xs font-bold text-gray-500">{loyaltyBalance} pts available</span>
                </div>

                {pointsToEarnPreview > 0 && (
                  <div className="bg-emerald-50/60 border border-emerald-100 rounded-xl px-3 py-2 text-[11px] font-bold text-emerald-700 flex items-center gap-1.5">
                    <Gift size={12} /> You'll earn {pointsToEarnPreview} points on this order (credited after delivery)
                  </div>
                )}

                {maxRedeemablePoints > 0 ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min={0}
                        max={maxRedeemablePoints}
                        value={customPointsInput}
                        onChange={(e) => setCustomPointsInput(e.target.value)}
                        placeholder="Enter points to use"
                        className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-xs font-bold outline-none focus:border-[#2c2769] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                      <button
                        type="button"
                        onClick={() => setCustomPointsInput(String(maxRedeemablePoints))}
                        className="text-[11px] font-bold text-[#2c2769] bg-[#eeedf5] hover:bg-[#e0ddf2] px-3 py-2 rounded-lg transition-colors whitespace-nowrap shrink-0"
                      >
                        Use Max
                      </button>
                    </div>

                    {roundOffPointsNeeded > 0 && customPointsInput !== String(roundOffPointsNeeded) && (
                      <button
                        type="button"
                        onClick={() => setCustomPointsInput(String(roundOffPointsNeeded))}
                        className="w-full text-left text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        Round off ৳{fromCents(decimalRemainderCents).toFixed(2)} using {roundOffPointsNeeded} points
                      </button>
                    )}

                    {rawCustomPoints > 0 && !meetsMinimum && (
                      <p className="text-[11px] text-red-500 font-semibold px-1">
                        Minimum {loyaltySettings.minRedeemPoints} points required to redeem.
                      </p>
                    )}

                    {pointsToRedeem > 0 && (
                      <div className="flex items-center justify-between">
                        <p className="text-[11px] text-emerald-600 font-bold px-1">
                          Using {pointsToRedeem} points → {formatPrice(pointsDiscountAmount)} discount
                        </p>
                        <button
                          type="button"
                          onClick={() => setCustomPointsInput("")}
                          className="text-[10px] text-gray-400 hover:text-red-500 font-semibold underline shrink-0"
                        >
                          Clear
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-[11px] text-gray-400 font-medium">
                    {loyaltyBalance < loyaltySettings.minRedeemPoints
                      ? `Earn at least ${loyaltySettings.minRedeemPoints} points to redeem a discount (you have ${loyaltyBalance}).`
                      : "No points can be redeemed on this order right now."}
                  </p>
                )}
              </div>
            )}

            <div className="space-y-2 text-xs text-gray-600 mb-4">
              <div className="flex justify-between">
                <span>Total Price</span>
                <span className="font-bold text-gray-800">{formatPrice(originalSubtotal)}</span>
              </div>

              {productSavings > 0 && (
                <div className="flex justify-between text-green-600 font-bold">
                  <span>Product Savings</span>
                  <span>-{formatPrice(productSavings)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-gray-800">{formatPrice(basePrice)}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-green-600 font-bold">
                  <span>{appliedCoupon === "NEW10" ? "New User Discount" : "Coupon Discount"}</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}

              {pointsDiscountAmount > 0 && (
                <div className="flex justify-between text-green-600 font-bold">
                  <span>Points Discount</span>
                  <span>-{formatPrice(pointsDiscountAmount)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Delivery Charge</span>
                {deliveryCharge !== null ? (
                  freeDeliveryApplied ? (
                    <span className="font-bold text-green-600">FREE</span>
                  ) : (
                    <span className="font-bold text-gray-800">{formatPrice(deliveryCharge)}</span>
                  )
                ) : (
                  <span className="text-[11px] text-orange-500 font-medium">Select area first</span>
                )}
              </div>

              <div className="border-t border-gray-100 pt-2 flex justify-between font-black text-gray-900 text-sm">
                <span>Payable Amount</span>
                <span className="text-[#2c2769]">{formatPrice(grandTotal)}</span>
              </div>

              <div className="flex justify-between items-center pt-1 text-[11px] text-gray-500">
                <span>Payment Method</span>
                <span className="font-bold text-gray-700">Cash on Delivery (COD)</span>
              </div>
            </div>

            <button type="button" onClick={() => handleSubmitOrder()} disabled={isSubmitting || (selectedItemIds.length > 0 && deliveryCharge === null) || selectedItemIds.length === 0} className="w-full bg-[#2c2769] text-white font-bold py-3 rounded-xl text-xs transition-all hidden md:block disabled:opacity-50">
              {isSubmitting ? "Processing..." : "Place Order Now"}
            </button>
          </div>
        </div>
      </div>

      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 shadow-2xl p-3 z-[99999] flex items-center justify-between gap-4">
        <div className="flex flex-col">
          <span className="text-[10px] text-gray-400 font-bold uppercase">Payable Amount</span>
          <span className="text-base font-black text-[#2c2769] leading-tight">{formatPrice(grandTotal)}</span>
        </div>
        <button type="button" onClick={() => handleSubmitOrder()} disabled={isSubmitting || (selectedItemIds.length > 0 && deliveryCharge === null) || selectedItemIds.length === 0} className="flex-1 bg-[#2c2769] text-white font-black py-3 rounded-xl text-center text-sm disabled:opacity-40">
          {isSubmitting ? "Processing..." : "Place Order Now"}
        </button>
      </div>

      {isAddressModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-[999999]">
          <div className="bg-white rounded-2xl w-full max-w-md p-5 space-y-4 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-50 pb-2">
              <h3 className="font-extrabold text-gray-900 text-xs">Add New Address Profile</h3>
              <button onClick={() => setIsAddressModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
            </div>
            <form onSubmit={handleAddNewAddress} className="space-y-3 text-xs">
              <div className="space-y-1"><label className="font-bold text-gray-600 uppercase">Address Label</label><input type="text" className="w-full p-2.5 border border-gray-200 rounded-xl outline-none" value={newAddressForm.label} onChange={(e) => setNewAddressForm((p) => ({ ...p, label: e.target.value }))} required /></div>
              <div className="space-y-1"><label className="font-bold text-gray-600 uppercase">Full Name</label><input type="text" className="w-full p-2.5 border border-gray-200 rounded-xl outline-none" value={newAddressForm.name} onChange={(e) => setNewAddressForm((p) => ({ ...p, name: e.target.value }))} required /></div>
              <div className="space-y-1"><label className="font-bold text-gray-600 uppercase">Phone Number</label><input type="tel" maxLength={11} className="w-full p-2.5 border border-gray-200 rounded-xl outline-none" value={newAddressForm.phone} onChange={(e) => setNewAddressForm((p) => ({ ...p, phone: e.target.value.replace(/\D/g, "") }))} required /></div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1"><label className="font-bold text-gray-600 uppercase">District</label><select className="w-full p-2.5 border border-gray-200 rounded-xl bg-white" value={newAddressForm.district} onChange={(e) => setNewAddressForm((p) => ({ ...p, district: e.target.value, thana: "" }))} required><option value="">Select</option>{districtList.map((d) => <option key={d} value={d}>{d}</option>)}</select></div>
                <div className="space-y-1"><label className="font-bold text-gray-600 uppercase">Thana</label><select className="w-full p-2.5 border border-gray-200 rounded-xl bg-white" value={newAddressForm.thana} onChange={(e) => setNewAddressForm((p) => ({ ...p, thana: e.target.value }))} disabled={!newAddressForm.district} required><option value="">Select</option>{(locationData[newAddressForm.district] || []).map((t) => <option key={t} value={t}>{t}</option>)}</select></div>
              </div>
              <div className="space-y-1"><label className="font-bold text-gray-600 uppercase">Detailed Address</label><textarea rows={2} className="w-full p-2.5 border border-gray-200 rounded-xl outline-none" value={newAddressForm.homeAddress} onChange={(e) => setNewAddressForm((p) => ({ ...p, homeAddress: e.target.value }))} required /></div>
              <button type="submit" disabled={isSavingNewAddress} className="w-full bg-[#2c2769] text-white py-2.5 rounded-xl font-bold text-xs mt-2 disabled:opacity-60 flex items-center justify-center gap-2">
                {isSavingNewAddress && <Loader2 size={14} className="animate-spin" />}
                {isSavingNewAddress ? "Saving..." : "Save Address Profile"}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}