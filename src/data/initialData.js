import { STORE_INDUSTRIES } from './industriesData';

// Do'kon Yo'nalishlari (STORE_MODES) - 24+ Har qanday savdo sohasiga to'liq moslashish profili
export const STORE_MODES = STORE_INDUSTRIES;
export { STORE_INDUSTRIES };


export const PRODUCT_TYPES = [
  { id: 'all', name: 'Barcha Turlar', icon: 'Layers', emoji: '🛍️' },
  { id: 'clothing', name: 'Kiyim-kechak & Moda', icon: 'Shirt', emoji: '👕' },
  { id: 'shoes', name: 'Poyabzal Butigi', icon: 'Footprints', emoji: '👟' },
  { id: 'grocery', name: 'Oziq-ovqat & Supermarket', icon: 'Apple', emoji: '🛒' },
  { id: 'pharmacy', name: 'Dorixona & Salomatlik', icon: 'Pill', emoji: '💊' },
  { id: 'perfume', name: 'Parfyumeriya & Butik', icon: 'Sparkles', emoji: '💎' },
  { id: 'cosmetics', name: 'Kosmetika & Go\'zallik', icon: 'Sparkles', emoji: '💄' },
  { id: 'electronics', name: 'Smartfonlar & Gadjetlar', icon: 'Smartphone', emoji: '📱' },
  { id: 'appliances', name: 'Maishiy Texnika & PC', icon: 'Laptop', emoji: '💻' },
  { id: 'autoparts', name: 'Avto Ehtiyot Qismlar', icon: 'Car', emoji: '🚗' },
  { id: 'building', name: 'Qurilish Mollari', icon: 'Hammer', emoji: '🧱' },
  { id: 'books', name: 'Kitoblar & Kanselyariya', icon: 'BookOpen', emoji: '📚' },
  { id: 'butchery', name: 'Go\'sht & Qassobxona', icon: 'Beef', emoji: '🥩' },
  { id: 'bakery', name: 'Nonvoyxona & Qandolat', icon: 'Croissant', emoji: '🥖' },
  { id: 'cafe', name: 'Qahvaxona & Fast Food', icon: 'Coffee', emoji: '☕' },
  { id: 'flowers', name: 'Gul Do\'koni & Sovg\'a', icon: 'Flower2', emoji: '💐' },
  { id: 'sport', name: 'Sport Mollari', icon: 'Trophy', emoji: '⚽' },
  { id: 'general', name: 'Umumiy Tovar & Aksessuar', icon: 'Package', emoji: '📦' }
];

export const MEASURE_UNITS = [
  { id: 'dona', label: 'Dona' },
  { id: 'juft', label: 'Juft' },
  { id: 'kg', label: 'Kilogramm (kg)' },
  { id: 'litr', label: 'Litr (l)' },
  { id: 'metr', label: 'Metr (m)' },
  { id: 'pachka', label: 'Pachka' },
  { id: 'quti', label: 'Quti' },
  { id: 'to\'plam', label: 'To\'plam / Komplekt' },
  { id: 'ml', label: 'Millilitr (ml)' }
];

export const INITIAL_CUSTOMERS = [
  { id: 'c-1', name: 'Dilshod Ergashev', phone: '+998 90 123 45 67', bonusBalance: 45000, totalPurchases: 1250000, visitsCount: 5 },
  { id: 'c-2', name: 'Shaxzoda Usmanova', phone: '+998 97 765 43 21', bonusBalance: 62000, totalPurchases: 2840000, visitsCount: 8 },
  { id: 'c-3', name: 'Akmal Zokirov', phone: '+998 99 876 54 32', bonusBalance: 15000, totalPurchases: 540000, visitsCount: 2 },
  { id: 'c-4', name: 'Madina Karimova', phone: '+998 91 345 67 89', bonusBalance: 88000, totalPurchases: 3200000, visitsCount: 11 }
];

export const INITIAL_PRODUCTS = [
  {
    id: "prd-fashion-1",
    name: "Zara Slim Fit Klassik Ko'ylak",
    brand: "Zara",
    category: "Kiyim-kechak",
    productType: "clothing",
    unit: "dona",
    price: 320000,
    costPrice: 210000,
    wholesalePrice: 270000,
    stock: 25,
    minStock: 5,
    barcode: "478000101001",
    image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&q=80",
    notes: "Paxta 100%, oq rang, premium mato",
    hasVariants: true,
    variants: [
      { id: "v-1", name: "S / Oq", size: "S", color: "Oq", price: 320000, costPrice: 210000, stock: 8, barcode: "478000101001-S" },
      { id: "v-2", name: "M / Oq", size: "M", color: "Oq", price: 320000, costPrice: 210000, stock: 10, barcode: "478000101001-M" },
      { id: "v-3", name: "L / Oq", size: "L", color: "Oq", price: 320000, costPrice: 210000, stock: 7, barcode: "478000101001-L" }
    ]
  },
  {
    id: "prd-fashion-2",
    name: "Nike Air Force 1 '07 Krossovka",
    brand: "Nike",
    category: "Poyabzal",
    productType: "clothing",
    unit: "juft",
    price: 1450000,
    costPrice: 1050000,
    wholesalePrice: 1250000,
    stock: 16,
    minStock: 4,
    barcode: "478000101002",
    image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&q=80",
    notes: "Original charm krossovka",
    hasVariants: true,
    variants: [
      { id: "v-4", name: "41 / Oq", size: "41", color: "Oq", price: 1450000, costPrice: 1050000, stock: 5, barcode: "478000101002-41" },
      { id: "v-5", name: "42 / Oq", size: "42", color: "Oq", price: 1450000, costPrice: 1050000, stock: 6, barcode: "478000101002-42" },
      { id: "v-6", name: "43 / Oq", size: "43", color: "Oq", price: 1450000, costPrice: 1050000, stock: 5, barcode: "478000101002-43" }
    ]
  },
  {
    id: "prd-fashion-3",
    name: "Massimo Dutti Charm Kurtka",
    brand: "Massimo Dutti",
    category: "Kiyim-kechak",
    productType: "clothing",
    unit: "dona",
    price: 2800000,
    costPrice: 1950000,
    wholesalePrice: 2400000,
    stock: 8,
    minStock: 2,
    barcode: "478000101003",
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&q=80",
    notes: "Tabiiy teri, mavsumiy kolleksiya",
    hasVariants: true,
    variants: [
      { id: "v-7", name: "L / Jigarrang", size: "L", color: "Jigarrang", price: 2800000, costPrice: 1950000, stock: 4, barcode: "478000101003-L" },
      { id: "v-8", name: "XL / Qora", size: "XL", color: "Qora", price: 2800000, costPrice: 1950000, stock: 4, barcode: "478000101003-XL" }
    ]
  },
  {
    id: "prd-fashion-4",
    name: "LC Waikiki Basic Paxta Futbolka",
    brand: "LC Waikiki",
    category: "Kiyim-kechak",
    productType: "clothing",
    unit: "dona",
    price: 125000,
    costPrice: 75000,
    wholesalePrice: 95000,
    stock: 40,
    minStock: 10,
    barcode: "478000101004",
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=400&q=80",
    notes: "100% organik paxta",
    hasVariants: true,
    variants: [
      { id: "v-9", name: "S / Moviy", size: "S", color: "Moviy", price: 125000, costPrice: 75000, stock: 15, barcode: "478000101004-S" },
      { id: "v-10", name: "M / Moviy", size: "M", color: "Moviy", price: 125000, costPrice: 75000, stock: 15, barcode: "478000101004-M" },
      { id: "v-11", name: "L / Moviy", size: "L", color: "Moviy", price: 125000, costPrice: 75000, stock: 10, barcode: "478000101004-L" }
    ]
  },
  {
    id: "prd-tech-1",
    name: "Apple iPhone 15 Pro Max",
    brand: "Apple",
    category: "Elektronika",
    productType: "electronics",
    unit: "dona",
    price: 14500000,
    costPrice: 12800000,
    wholesalePrice: 13800000,
    stock: 12,
    minStock: 3,
    barcode: "478000201001",
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&q=80",
    notes: "A17 Pro chip, Titanium korpus, 12 oy rasmiy kafolat",
    warranty: "12 oy",
    hasVariants: true,
    variants: [
      { id: "v-12", name: "256GB / Natural Titanium", memory: "256GB", color: "Natural Titanium", price: 14500000, costPrice: 12800000, stock: 7, barcode: "478000201001-256" },
      { id: "v-13", name: "512GB / Black Titanium", memory: "512GB", color: "Black Titanium", price: 16800000, costPrice: 14900000, stock: 5, barcode: "478000201001-512" }
    ]
  },
  {
    id: "prd-tech-2",
    name: "Apple AirPods Pro (2nd Gen)",
    brand: "Apple",
    category: "Elektronika",
    productType: "electronics",
    unit: "dona",
    price: 2750000,
    costPrice: 2200000,
    wholesalePrice: 2500000,
    stock: 18,
    minStock: 4,
    barcode: "478000201002",
    image: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=400&q=80",
    notes: "Faol shovqin so'ndirish, MagSafe USB-C keys",
    warranty: "12 oy"
  },
  {
    id: "prd-tech-3",
    name: "Xiaomi Power Bank 20000mAh (22.5W)",
    brand: "Xiaomi",
    category: "Elektronika",
    productType: "electronics",
    unit: "dona",
    price: 260000,
    costPrice: 180000,
    wholesalePrice: 220000,
    stock: 30,
    minStock: 6,
    barcode: "478000201003",
    image: "https://images.unsplash.com/photo-1609592426868-6c0b396796c9?w=400&q=80",
    notes: "Tezkor zaryadlash Type-C va USB-A portlari",
    warranty: "6 oy"
  },
  {
    id: "prd-tech-4",
    name: "Baseus GaN Tezkor Zaryadlovchi 65W",
    brand: "Baseus",
    category: "Elektronika",
    productType: "electronics",
    unit: "dona",
    price: 290000,
    costPrice: 195000,
    wholesalePrice: 240000,
    stock: 22,
    minStock: 5,
    barcode: "478000201004",
    image: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=400&q=80",
    notes: "GaN Pro texnologiyasi, noutbuk va telefonlar uchun",
    warranty: "3 oy"
  },
  {
    id: "prd-food-1",
    name: "Coca-Cola Classic 1.5L",
    brand: "Coca-Cola",
    category: "Oziq-ovqat",
    productType: "grocery",
    unit: "dona",
    price: 13000,
    costPrice: 10200,
    wholesalePrice: 11500,
    stock: 120,
    minStock: 24,
    barcode: "5449000000996",
    image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&q=80",
    notes: "Gazlangan salqin ichimlik"
  },
  {
    id: "prd-food-2",
    name: "Nestle Nescafe Gold Qahva 190g",
    brand: "Nestle",
    category: "Oziq-ovqat",
    productType: "grocery",
    unit: "dona",
    price: 85000,
    costPrice: 68000,
    wholesalePrice: 75000,
    stock: 45,
    minStock: 10,
    barcode: "7613033568779",
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&q=80",
    notes: "Eruvchan tabiiy qahva shisha bankada"
  },
  {
    id: "prd-food-3",
    name: "Ferrero Rocher Shokolad to'plami 200g",
    brand: "Ferrero",
    category: "Oziq-ovqat",
    productType: "grocery",
    unit: "quti",
    price: 78000,
    costPrice: 58000,
    wholesalePrice: 68000,
    stock: 35,
    minStock: 8,
    barcode: "8000500003787",
    image: "https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=400&q=80",
    notes: "O'rmon yong'oqli premium shokolad"
  },
  {
    id: "prd-gen-1",
    name: "Klassik Charm Kamar (Erkaklar)",
    brand: "Gucci Style",
    category: "Aksessuarlar",
    productType: "general",
    unit: "dona",
    price: 240000,
    costPrice: 150000,
    wholesalePrice: 190000,
    stock: 20,
    minStock: 5,
    barcode: "478000301001",
    image: "https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=400&q=80",
    notes: "Tabiiy charm, mustahkam qisqich"
  },
  {
    id: "prd-fashion-5",
    name: "Adidas Originals Gazelle Krossovka",
    brand: "Adidas",
    category: "Poyabzal",
    productType: "clothing",
    unit: "juft",
    price: 1350000,
    costPrice: 950000,
    wholesalePrice: 1150000,
    stock: 14,
    minStock: 3,
    barcode: "478000101005",
    image: "https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?w=400&q=80",
    notes: "Klassik zamsh matoli zamonaviy krossovka",
    hasVariants: true,
    variants: [
      { id: "v-ad-1", name: "40 / Moviy", size: "40", color: "Moviy", price: 1350000, costPrice: 950000, stock: 4 },
      { id: "v-ad-2", name: "41 / Moviy", size: "41", color: "Moviy", price: 1350000, costPrice: 950000, stock: 5 },
      { id: "v-ad-3", name: "42 / Moviy", size: "42", color: "Moviy", price: 1350000, costPrice: 950000, stock: 5 }
    ]
  },
  {
    id: "prd-fashion-6",
    name: "Levi's 501 Original Jinsi Shim",
    brand: "Levi's",
    category: "Shim & Jinsi",
    productType: "clothing",
    unit: "dona",
    price: 850000,
    costPrice: 580000,
    wholesalePrice: 720000,
    stock: 22,
    minStock: 4,
    barcode: "478000101006",
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&q=80",
    notes: "Klassik to'q ko'k rangli mustahkam denim",
    hasVariants: true,
    variants: [
      { id: "v-lev-1", name: "30 / Ko'k", size: "30", color: "Ko'k", price: 850000, costPrice: 580000, stock: 7 },
      { id: "v-lev-2", name: "32 / Ko'k", size: "32", color: "Ko'k", price: 850000, costPrice: 580000, stock: 8 },
      { id: "v-lev-3", name: "34 / Ko'k", size: "34", color: "Ko'k", price: 850000, costPrice: 580000, stock: 7 }
    ]
  },
  {
    id: "prd-fashion-7",
    name: "Pull&Bear Oversize Qishki Xudi",
    brand: "Pull&Bear",
    category: "Kiyim-kechak",
    productType: "clothing",
    unit: "dona",
    price: 390000,
    costPrice: 250000,
    wholesalePrice: 320000,
    stock: 20,
    minStock: 5,
    barcode: "478000101007",
    image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=400&q=80",
    notes: "Issiq qalin trikotaj xudi kapyushonli",
    hasVariants: true,
    variants: [
      { id: "v-pb-1", name: "M / Qora", size: "M", color: "Qora", price: 390000, costPrice: 250000, stock: 10 },
      { id: "v-pb-2", name: "L / Qora", size: "L", color: "Qora", price: 390000, costPrice: 250000, stock: 10 }
    ]
  },
  {
    id: "prd-food-4",
    name: "Fanta Orange 1.5L",
    brand: "Coca-Cola",
    category: "Salqin Ichimliklar",
    productType: "grocery",
    unit: "dona",
    price: 13000,
    costPrice: 10200,
    wholesalePrice: 11500,
    stock: 90,
    minStock: 20,
    barcode: "5449000011527",
    image: "https://images.unsplash.com/photo-1624517452488-04869289c4ca?w=400&q=80",
    notes: "Apelsin ta'mli gazlangan salqin ichimlik"
  },
  {
    id: "prd-food-5",
    name: "Red Bull Energetik Ichimlik 250ml",
    brand: "Red Bull",
    category: "Salqin Ichimliklar",
    productType: "grocery",
    unit: "dona",
    price: 22000,
    costPrice: 17500,
    wholesalePrice: 19500,
    stock: 80,
    minStock: 15,
    barcode: "9002490100070",
    image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=400&q=80",
    notes: "Energetik salqin ichimlik metall bankada"
  },
  {
    id: "prd-food-6",
    name: "Nutella Shokolad Pastasi 350g",
    brand: "Ferrero",
    category: "Shirinliklar",
    productType: "grocery",
    unit: "dona",
    price: 52000,
    costPrice: 41000,
    wholesalePrice: 46000,
    stock: 40,
    minStock: 10,
    barcode: "8000500179864",
    image: "https://images.unsplash.com/photo-1559598467-f8b76c8155d0?w=400&q=80",
    notes: "O'rmon yong'oqli kakao pastasi shisha bankada"
  },
  {
    id: "prd-food-7",
    name: "Lays Qisqichbaqa Chipsi 140g",
    brand: "Lays",
    category: "Snack & Chips",
    productType: "grocery",
    unit: "pachka",
    price: 17000,
    costPrice: 13200,
    wholesalePrice: 15000,
    stock: 65,
    minStock: 15,
    barcode: "4600648400035",
    image: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400&q=80",
    notes: "Qarsildoq kartoshka chipslari"
  },
  {
    id: "prd-food-8",
    name: "Banan (Ekvador, 1 kg)",
    brand: "Ekvador",
    category: "Meva & Sabzavot",
    productType: "grocery",
    unit: "kg",
    price: 24000,
    costPrice: 18500,
    wholesalePrice: 21000,
    stock: 50,
    minStock: 10,
    barcode: "200000000001",
    image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&q=80",
    notes: "Yangi keltirilgan shirin bananlar (og'irlik bo'yicha tortiladi)"
  },
  {
    id: "prd-food-9",
    name: "Qizil Olma Semirenko (1 kg)",
    brand: "O'zbekiston",
    category: "Meva & Sabzavot",
    productType: "grocery",
    unit: "kg",
    price: 18000,
    costPrice: 13000,
    wholesalePrice: 15500,
    stock: 70,
    minStock: 15,
    barcode: "200000000002",
    image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&q=80",
    notes: "Mahalliy sersuv shirin olma (kg narxi)"
  },
  {
    id: "prd-food-10",
    name: "Toshkent Issiq Non (Patir)",
    brand: "Nonvoyxona",
    category: "Non & Pishiriqlar",
    productType: "grocery",
    unit: "dona",
    price: 7000,
    costPrice: 5000,
    wholesalePrice: 6000,
    stock: 80,
    minStock: 20,
    barcode: "200000000003",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&q=80",
    notes: "Tandirda pishirilgan qaynoq patir non"
  },
  {
    id: "prd-tech-5",
    name: "Samsung Galaxy S24 Ultra 512GB",
    brand: "Samsung",
    category: "Smartfonlar",
    productType: "electronics",
    unit: "dona",
    price: 15200000,
    costPrice: 13400000,
    wholesalePrice: 14400000,
    stock: 8,
    minStock: 2,
    barcode: "478000201005",
    image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&q=80",
    notes: "Snapdragon 8 Gen 3, S-Pen ruchkasi, 200MP kamera, 12 oy kafolat",
    warranty: "12 oy"
  },
  {
    id: "prd-tech-6",
    name: "Apple Watch Series 9 (45mm)",
    brand: "Apple",
    category: "Smart Soatlar",
    productType: "electronics",
    unit: "dona",
    price: 4950000,
    costPrice: 4200000,
    wholesalePrice: 4600000,
    stock: 10,
    minStock: 2,
    barcode: "478000201006",
    image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=400&q=80",
    notes: "S9 chip, Double Tap imo-ishorasi, Always-On Retina displey",
    warranty: "12 oy"
  },
  {
    id: "prd-tech-7",
    name: "JBL Flip 6 Suv o'tkazmaydigan Kolonka",
    brand: "JBL",
    category: "Audio & Naushnik",
    productType: "electronics",
    unit: "dona",
    price: 1350000,
    costPrice: 980000,
    wholesalePrice: 1180000,
    stock: 15,
    minStock: 3,
    barcode: "478000201007",
    image: "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=400&q=80",
    notes: "IP67 chang va suvdan himoya, 12 soat o'ynash vaqti",
    warranty: "6 oy"
  },
  {
    id: "prd-tech-8",
    name: "Anker PowerLine III Type-C Kabel (1.8m)",
    brand: "Anker",
    category: "Kabellar & Aksessuar",
    productType: "electronics",
    unit: "dona",
    price: 140000,
    costPrice: 95000,
    wholesalePrice: 115000,
    stock: 35,
    minStock: 8,
    barcode: "478000201008",
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&q=80",
    notes: "100W Power Delivery, o'ta chidamli matoli qoplama",
    warranty: "12 oy"
  },
  {
    "id": "prd-1",
    "name": "Aventus",
    "brand": "Creed",
    "category": "Erkaklar",
    "prices": {
      "10 ml": 210000,
      "20 ml": 378000,
      "30 ml": 554400,
      "50 ml": 892500
    },
    "volume": "10 ml",
    "price": 210000,
    "costPrice": 151200,
    "stock": 13,
    "minStock": 4,
    "barcode": "200000001",
    "image": "https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=400&q=80",
    "notes": "Erkaklar atir, premium sifat"
  },
  {
    "id": "prd-2",
    "name": "Absolu Aventus",
    "brand": "Creed",
    "category": "Erkaklar",
    "prices": {
      "10 ml": 210000,
      "20 ml": 378000,
      "30 ml": 554400,
      "50 ml": 892500
    },
    "volume": "10 ml",
    "price": 210000,
    "costPrice": 151200,
    "stock": 14,
    "minStock": 4,
    "barcode": "200000002",
    "image": "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400&q=80",
    "notes": "Erkaklar atir, premium sifat"
  },
  {
    "id": "prd-3",
    "name": "Delphinus Creed",
    "brand": "Creed",
    "category": "Unisex",
    "prices": {
      "10 ml": 240000,
      "20 ml": 432000,
      "30 ml": 633600,
      "50 ml": 1020000
    },
    "volume": "10 ml",
    "price": 240000,
    "costPrice": 172800,
    "stock": 15,
    "minStock": 4,
    "barcode": "200000003",
    "image": "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=400&q=80",
    "notes": "Unisex atir, premium sifat"
  },
  {
    "id": "prd-4",
    "name": "Millesime Imperial",
    "brand": "Creed",
    "category": "Unisex",
    "prices": {
      "10 ml": 240000,
      "20 ml": 432000,
      "30 ml": 633600,
      "50 ml": 1020000
    },
    "volume": "10 ml",
    "price": 240000,
    "costPrice": 172800,
    "stock": 16,
    "minStock": 4,
    "barcode": "200000004",
    "image": "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=400&q=80",
    "notes": "Unisex atir, premium sifat"
  },
  {
    "id": "prd-5",
    "name": "Centaurus",
    "brand": "Creed",
    "category": "Unisex",
    "prices": {
      "10 ml": 240000,
      "20 ml": 432000,
      "30 ml": 633600,
      "50 ml": 1020000
    },
    "volume": "10 ml",
    "price": 240000,
    "costPrice": 172800,
    "stock": 17,
    "minStock": 4,
    "barcode": "200000005",
    "image": "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400&q=80",
    "notes": "Unisex atir, premium sifat"
  },
  {
    "id": "prd-6",
    "name": "Oud Zarian",
    "brand": "Creed",
    "category": "Unisex",
    "prices": {
      "10 ml": 240000,
      "20 ml": 432000,
      "30 ml": 633600,
      "50 ml": 1020000
    },
    "volume": "10 ml",
    "price": 240000,
    "costPrice": 172800,
    "stock": 18,
    "minStock": 4,
    "barcode": "200000006",
    "image": "https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=400&q=80",
    "notes": "Unisex atir, premium sifat"
  },
  {
    "id": "prd-7",
    "name": "Silver Mountain Water",
    "brand": "Creed",
    "category": "Unisex",
    "prices": {
      "10 ml": 180000,
      "20 ml": 324000,
      "30 ml": 475200,
      "50 ml": 765000
    },
    "volume": "10 ml",
    "price": 180000,
    "costPrice": 129600,
    "stock": 19,
    "minStock": 4,
    "barcode": "200000007",
    "image": "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400&q=80",
    "notes": "Unisex atir, premium sifat"
  },
  {
    "id": "prd-8",
    "name": "Roja Elysium",
    "brand": "Roja Dove",
    "category": "Erkaklar",
    "prices": {
      "10 ml": 270000,
      "20 ml": 486000,
      "30 ml": 712800,
      "50 ml": 1147500
    },
    "volume": "10 ml",
    "price": 270000,
    "costPrice": 194400,
    "stock": 20,
    "minStock": 4,
    "barcode": "200000008",
    "image": "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=400&q=80",
    "notes": "Erkaklar atir, premium sifat"
  },
  {
    "id": "prd-9",
    "name": "Enigma",
    "brand": "Roja Dove",
    "category": "Ayollar",
    "prices": {
      "10 ml": 240000,
      "20 ml": 432000,
      "30 ml": 633600,
      "50 ml": 1020000
    },
    "volume": "10 ml",
    "price": 240000,
    "costPrice": 172800,
    "stock": 21,
    "minStock": 4,
    "barcode": "200000009",
    "image": "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=400&q=80",
    "notes": "Ayollar atir, premium sifat"
  },
  {
    "id": "prd-10",
    "name": "Gaba",
    "brand": "Hormone Paris",
    "category": "Unisex",
    "prices": {
      "10 ml": 270000,
      "20 ml": 486000,
      "30 ml": 712800,
      "50 ml": 1147500
    },
    "volume": "10 ml",
    "price": 270000,
    "costPrice": 194400,
    "stock": 22,
    "minStock": 4,
    "barcode": "200000010",
    "image": "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400&q=80",
    "notes": "Unisex atir, premium sifat"
  },
  {
    "id": "prd-11",
    "name": "Imagination",
    "brand": "Louis Vuitton",
    "category": "Erkaklar",
    "prices": {
      "10 ml": 240000,
      "20 ml": 432000,
      "30 ml": 633600,
      "50 ml": 1020000
    },
    "volume": "10 ml",
    "price": 240000,
    "costPrice": 172800,
    "stock": 23,
    "minStock": 4,
    "barcode": "200000011",
    "image": "https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=400&q=80",
    "notes": "Erkaklar atir, premium sifat"
  },
  {
    "id": "prd-12",
    "name": "Myriad",
    "brand": "Louis Vuitton",
    "category": "Unisex",
    "prices": {
      "10 ml": 300000,
      "20 ml": 540000,
      "30 ml": 792000,
      "50 ml": 1275000
    },
    "volume": "10 ml",
    "price": 300000,
    "costPrice": 216000,
    "stock": 24,
    "minStock": 4,
    "barcode": "200000012",
    "image": "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400&q=80",
    "notes": "Unisex atir, premium sifat"
  },
  {
    "id": "prd-13",
    "name": "L'Immensite",
    "brand": "Louis Vuitton",
    "category": "Erkaklar",
    "prices": {
      "10 ml": 210000,
      "20 ml": 378000,
      "30 ml": 554400,
      "50 ml": 892500
    },
    "volume": "10 ml",
    "price": 210000,
    "costPrice": 151200,
    "stock": 25,
    "minStock": 4,
    "barcode": "200000013",
    "image": "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=400&q=80",
    "notes": "Erkaklar atir, premium sifat"
  },
  {
    "id": "prd-14",
    "name": "Dancing Blossom",
    "brand": "Loui Vuitton",
    "category": "Unisex",
    "prices": {
      "10 ml": 240000,
      "20 ml": 432000,
      "30 ml": 633600,
      "50 ml": 1020000
    },
    "volume": "10 ml",
    "price": 240000,
    "costPrice": 172800,
    "stock": 26,
    "minStock": 4,
    "barcode": "200000014",
    "image": "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=400&q=80",
    "notes": "Unisex atir, premium sifat"
  },
  {
    "id": "prd-15",
    "name": "Stellar Times",
    "brand": "Loui Vuitton",
    "category": "Unisex",
    "prices": {
      "10 ml": 300000,
      "20 ml": 540000,
      "30 ml": 792000,
      "50 ml": 1275000
    },
    "volume": "10 ml",
    "price": 300000,
    "costPrice": 216000,
    "stock": 12,
    "minStock": 4,
    "barcode": "200000015",
    "image": "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400&q=80",
    "notes": "Unisex atir, premium sifat"
  },
  {
    "id": "prd-16",
    "name": "Ombre Nomade",
    "brand": "Louis Vuitton",
    "category": "Unisex",
    "prices": {
      "10 ml": 300000,
      "20 ml": 540000,
      "30 ml": 792000,
      "50 ml": 1275000
    },
    "volume": "10 ml",
    "price": 300000,
    "costPrice": 216000,
    "stock": 13,
    "minStock": 4,
    "barcode": "200000016",
    "image": "https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=400&q=80",
    "notes": "Unisex atir, premium sifat"
  },
  {
    "id": "prd-17",
    "name": "Symphony",
    "brand": "Louis Vuitton",
    "category": "Unisex",
    "prices": {
      "10 ml": 300000,
      "20 ml": 540000,
      "30 ml": 792000,
      "50 ml": 1275000
    },
    "volume": "10 ml",
    "price": 300000,
    "costPrice": 216000,
    "stock": 14,
    "minStock": 4,
    "barcode": "200000017",
    "image": "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400&q=80",
    "notes": "Unisex atir, premium sifat"
  },
  {
    "id": "prd-18",
    "name": "Myriad",
    "brand": "Louis Vuitton",
    "category": "Unisex",
    "prices": {
      "10 ml": 300000,
      "20 ml": 540000,
      "30 ml": 792000,
      "50 ml": 1275000
    },
    "volume": "10 ml",
    "price": 300000,
    "costPrice": 216000,
    "stock": 15,
    "minStock": 4,
    "barcode": "200000018",
    "image": "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=400&q=80",
    "notes": "Unisex atir, premium sifat"
  },
  {
    "id": "prd-19",
    "name": "California Dream",
    "brand": "Louis Vuitton",
    "category": "Unisex",
    "prices": {
      "10 ml": 240000,
      "20 ml": 432000,
      "30 ml": 633600,
      "50 ml": 1020000
    },
    "volume": "10 ml",
    "price": 240000,
    "costPrice": 172800,
    "stock": 16,
    "minStock": 4,
    "barcode": "200000019",
    "image": "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=400&q=80",
    "notes": "Unisex atir, premium sifat"
  },
  {
    "id": "prd-20",
    "name": "Pacific Chill",
    "brand": "Louis Vuitton",
    "category": "Unisex",
    "prices": {
      "10 ml": 240000,
      "20 ml": 432000,
      "30 ml": 633600,
      "50 ml": 1020000
    },
    "volume": "10 ml",
    "price": 240000,
    "costPrice": 172800,
    "stock": 17,
    "minStock": 4,
    "barcode": "200000020",
    "image": "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400&q=80",
    "notes": "Unisex atir, premium sifat"
  },
  {
    "id": "prd-21",
    "name": "Afternoon Swim",
    "brand": "Louis Vuitton",
    "category": "Unisex",
    "prices": {
      "10 ml": 300000,
      "20 ml": 540000,
      "30 ml": 792000,
      "50 ml": 1275000
    },
    "volume": "10 ml",
    "price": 300000,
    "costPrice": 216000,
    "stock": 18,
    "minStock": 4,
    "barcode": "200000021",
    "image": "https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=400&q=80",
    "notes": "Unisex atir, premium sifat"
  },
  {
    "id": "prd-22",
    "name": "Cosmic Cloude",
    "brand": "Louis Vuitton",
    "category": "Unisex",
    "prices": {
      "10 ml": 300000,
      "20 ml": 540000,
      "30 ml": 792000,
      "50 ml": 1275000
    },
    "volume": "10 ml",
    "price": 300000,
    "costPrice": 216000,
    "stock": 19,
    "minStock": 4,
    "barcode": "200000022",
    "image": "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400&q=80",
    "notes": "Unisex atir, premium sifat"
  },
  {
    "id": "prd-23",
    "name": "Elves",
    "brand": "Louis Vuitton",
    "category": "Ayollar",
    "prices": {
      "10 ml": 300000,
      "20 ml": 540000,
      "30 ml": 792000,
      "50 ml": 1275000
    },
    "volume": "10 ml",
    "price": 300000,
    "costPrice": 216000,
    "stock": 20,
    "minStock": 4,
    "barcode": "200000023",
    "image": "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=400&q=80",
    "notes": "Ayollar atir, premium sifat"
  },
  {
    "id": "prd-24",
    "name": "City of Stars",
    "brand": "Louis Vuitton",
    "category": "Unisex",
    "prices": {
      "10 ml": 300000,
      "20 ml": 540000,
      "30 ml": 792000,
      "50 ml": 1275000
    },
    "volume": "10 ml",
    "price": 300000,
    "costPrice": 216000,
    "stock": 21,
    "minStock": 4,
    "barcode": "200000024",
    "image": "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=400&q=80",
    "notes": "Unisex atir, premium sifat"
  },
  {
    "id": "prd-25",
    "name": "Matiere Noire",
    "brand": "Louis Vuitton",
    "category": "Ayollar",
    "prices": {
      "10 ml": 300000,
      "20 ml": 540000,
      "30 ml": 792000,
      "50 ml": 1275000
    },
    "volume": "10 ml",
    "price": 300000,
    "costPrice": 216000,
    "stock": 22,
    "minStock": 4,
    "barcode": "200000025",
    "image": "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400&q=80",
    "notes": "Ayollar atir, premium sifat"
  },
  {
    "id": "prd-26",
    "name": "Meteore",
    "brand": "Louis Vuitton",
    "category": "Erkaklar",
    "prices": {
      "10 ml": 210000,
      "20 ml": 378000,
      "30 ml": 554400,
      "50 ml": 892500
    },
    "volume": "10 ml",
    "price": 210000,
    "costPrice": 151200,
    "stock": 23,
    "minStock": 4,
    "barcode": "200000026",
    "image": "https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=400&q=80",
    "notes": "Erkaklar atir, premium sifat"
  },
  {
    "id": "prd-27",
    "name": "Lovers",
    "brand": "Louis Vuitton",
    "category": "Erkaklar",
    "prices": {
      "10 ml": 210000,
      "20 ml": 378000,
      "30 ml": 554400,
      "50 ml": 892500
    },
    "volume": "10 ml",
    "price": 210000,
    "costPrice": 151200,
    "stock": 24,
    "minStock": 4,
    "barcode": "200000027",
    "image": "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400&q=80",
    "notes": "Erkaklar atir, premium sifat"
  },
  {
    "id": "prd-28",
    "name": "Sun Song 2025",
    "brand": "Louis Vuitton",
    "category": "Unisex",
    "prices": {
      "10 ml": 210000,
      "20 ml": 378000,
      "30 ml": 554400,
      "50 ml": 892500
    },
    "volume": "10 ml",
    "price": 210000,
    "costPrice": 151200,
    "stock": 25,
    "minStock": 4,
    "barcode": "200000028",
    "image": "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=400&q=80",
    "notes": "Unisex atir, premium sifat"
  },
  {
    "id": "prd-29",
    "name": "Aqua Sapphire",
    "brand": "Boadicea The Victorious",
    "category": "Unisex",
    "prices": {
      "10 ml": 360000,
      "20 ml": 648000,
      "30 ml": 950400,
      "50 ml": 1530000
    },
    "volume": "10 ml",
    "price": 360000,
    "costPrice": 259200,
    "stock": 26,
    "minStock": 4,
    "barcode": "200000029",
    "image": "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=400&q=80",
    "notes": "Unisex atir, premium sifat"
  },
  {
    "id": "prd-30",
    "name": "Aurica",
    "brand": "Boadicea The Victorious",
    "category": "Unisex",
    "prices": {
      "10 ml": 360000,
      "20 ml": 648000,
      "30 ml": 950400,
      "50 ml": 1530000
    },
    "volume": "10 ml",
    "price": 360000,
    "costPrice": 259200,
    "stock": 12,
    "minStock": 4,
    "barcode": "200000030",
    "image": "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400&q=80",
    "notes": "Unisex atir, premium sifat"
  },
  {
    "id": "prd-31",
    "name": "Green Sapphire",
    "brand": "Boadicea The Victorious",
    "category": "Unisex",
    "prices": {
      "10 ml": 360000,
      "20 ml": 648000,
      "30 ml": 950400,
      "50 ml": 1530000
    },
    "volume": "10 ml",
    "price": 360000,
    "costPrice": 259200,
    "stock": 13,
    "minStock": 4,
    "barcode": "200000031",
    "image": "https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=400&q=80",
    "notes": "Unisex atir, premium sifat"
  },
  {
    "id": "prd-32",
    "name": "Valiant",
    "brand": "Boadicea The Victorious",
    "category": "Unisex",
    "prices": {
      "10 ml": 360000,
      "20 ml": 648000,
      "30 ml": 950400,
      "50 ml": 1530000
    },
    "volume": "10 ml",
    "price": 360000,
    "costPrice": 259200,
    "stock": 14,
    "minStock": 4,
    "barcode": "200000032",
    "image": "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400&q=80",
    "notes": "Unisex atir, premium sifat"
  },
  {
    "id": "prd-33",
    "name": "Azrak",
    "brand": "Boadicea The Victorious",
    "category": "Unisex",
    "prices": {
      "10 ml": 360000,
      "20 ml": 648000,
      "30 ml": 950400,
      "50 ml": 1530000
    },
    "volume": "10 ml",
    "price": 360000,
    "costPrice": 259200,
    "stock": 15,
    "minStock": 4,
    "barcode": "200000033",
    "image": "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=400&q=80",
    "notes": "Unisex atir, premium sifat"
  },
  {
    "id": "prd-34",
    "name": "Pioneer",
    "brand": "Boadicea The Victorious",
    "category": "Unisex",
    "prices": {
      "10 ml": 360000,
      "20 ml": 648000,
      "30 ml": 950400,
      "50 ml": 1530000
    },
    "volume": "10 ml",
    "price": 360000,
    "costPrice": 259200,
    "stock": 16,
    "minStock": 4,
    "barcode": "200000034",
    "image": "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=400&q=80",
    "notes": "Unisex atir, premium sifat"
  },
  {
    "id": "prd-35",
    "name": "Pride",
    "brand": "Niche / Premium",
    "category": "Unisex",
    "prices": {
      "10 ml": 360000,
      "20 ml": 648000,
      "30 ml": 950400,
      "50 ml": 1530000
    },
    "volume": "10 ml",
    "price": 360000,
    "costPrice": 259200,
    "stock": 17,
    "minStock": 4,
    "barcode": "200000035",
    "image": "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400&q=80",
    "notes": "Unisex atir, premium sifat"
  },
  {
    "id": "prd-36",
    "name": "Blue Sapphire",
    "brand": "Boadicea The Victorious",
    "category": "Unisex",
    "prices": {
      "10 ml": 360000,
      "20 ml": 648000,
      "30 ml": 950400,
      "50 ml": 1530000
    },
    "volume": "10 ml",
    "price": 360000,
    "costPrice": 259200,
    "stock": 18,
    "minStock": 4,
    "barcode": "200000036",
    "image": "https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=400&q=80",
    "notes": "Unisex atir, premium sifat"
  },
  {
    "id": "prd-37",
    "name": "Hanuman",
    "brand": "Boadicea the Victorious",
    "category": "Unisex",
    "prices": {
      "10 ml": 240000,
      "20 ml": 432000,
      "30 ml": 633600,
      "50 ml": 1020000
    },
    "volume": "10 ml",
    "price": 240000,
    "costPrice": 172800,
    "stock": 19,
    "minStock": 4,
    "barcode": "200000037",
    "image": "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400&q=80",
    "notes": "Unisex atir, premium sifat"
  },
  {
    "id": "prd-38",
    "name": "Blue Talisman",
    "brand": "Ex Nihilo",
    "category": "Unisex",
    "prices": {
      "10 ml": 240000,
      "20 ml": 432000,
      "30 ml": 633600,
      "50 ml": 1020000
    },
    "volume": "10 ml",
    "price": 240000,
    "costPrice": 172800,
    "stock": 20,
    "minStock": 4,
    "barcode": "200000038",
    "image": "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=400&q=80",
    "notes": "Unisex atir, premium sifat"
  },
  {
    "id": "prd-39",
    "name": "Stronger With You Intensely",
    "brand": "Armani",
    "category": "Erkaklar",
    "prices": {
      "10 ml": 150000,
      "20 ml": 270000,
      "30 ml": 396000,
      "50 ml": 637500
    },
    "volume": "10 ml",
    "price": 150000,
    "costPrice": 108000,
    "stock": 21,
    "minStock": 4,
    "barcode": "200000039",
    "image": "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=400&q=80",
    "notes": "Erkaklar atir, premium sifat"
  },
  {
    "id": "prd-40",
    "name": "Stronger With You",
    "brand": "Armani",
    "category": "Erkaklar",
    "prices": {
      "10 ml": 150000,
      "20 ml": 270000,
      "30 ml": 396000,
      "50 ml": 637500
    },
    "volume": "10 ml",
    "price": 150000,
    "costPrice": 108000,
    "stock": 22,
    "minStock": 4,
    "barcode": "200000040",
    "image": "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400&q=80",
    "notes": "Erkaklar atir, premium sifat"
  },
  {
    "id": "prd-41",
    "name": "Stronger with YOU Absolutely",
    "brand": "Armani",
    "category": "Erkaklar",
    "prices": {
      "10 ml": 150000,
      "20 ml": 270000,
      "30 ml": 396000,
      "50 ml": 637500
    },
    "volume": "10 ml",
    "price": 150000,
    "costPrice": 108000,
    "stock": 23,
    "minStock": 4,
    "barcode": "200000041",
    "image": "https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=400&q=80",
    "notes": "Erkaklar atir, premium sifat"
  },
  {
    "id": "prd-42",
    "name": "YOU Sandalwood",
    "brand": "Armani",
    "category": "Unisex",
    "prices": {
      "10 ml": 150000,
      "20 ml": 270000,
      "30 ml": 396000,
      "50 ml": 637500
    },
    "volume": "10 ml",
    "price": 150000,
    "costPrice": 108000,
    "stock": 24,
    "minStock": 4,
    "barcode": "200000042",
    "image": "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400&q=80",
    "notes": "Unisex atir, premium sifat"
  },
  {
    "id": "prd-43",
    "name": "Hibiscus Mahajad",
    "brand": "Maison Crivelli",
    "category": "Unisex",
    "prices": {
      "10 ml": 300000,
      "20 ml": 540000,
      "30 ml": 792000,
      "50 ml": 1275000
    },
    "volume": "10 ml",
    "price": 300000,
    "costPrice": 216000,
    "stock": 25,
    "minStock": 4,
    "barcode": "200000043",
    "image": "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=400&q=80",
    "notes": "Unisex atir, premium sifat"
  },
  {
    "id": "prd-44",
    "name": "Oud Maracuja",
    "brand": "Maison Crivelli",
    "category": "Unisex",
    "prices": {
      "10 ml": 300000,
      "20 ml": 540000,
      "30 ml": 792000,
      "50 ml": 1275000
    },
    "volume": "10 ml",
    "price": 300000,
    "costPrice": 216000,
    "stock": 26,
    "minStock": 4,
    "barcode": "200000044",
    "image": "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=400&q=80",
    "notes": "Unisex atir, premium sifat"
  },
  {
    "id": "prd-45",
    "name": "Oud Stallion",
    "brand": "Maison Crivelli",
    "category": "Unisex",
    "prices": {
      "10 ml": 300000,
      "20 ml": 540000,
      "30 ml": 792000,
      "50 ml": 1275000
    },
    "volume": "10 ml",
    "price": 300000,
    "costPrice": 216000,
    "stock": 12,
    "minStock": 4,
    "barcode": "200000045",
    "image": "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400&q=80",
    "notes": "Unisex atir, premium sifat"
  },
  {
    "id": "prd-46",
    "name": "Safran Secret",
    "brand": "Maison Crivelli",
    "category": "Unisex",
    "prices": {
      "10 ml": 300000,
      "20 ml": 540000,
      "30 ml": 792000,
      "50 ml": 1275000
    },
    "volume": "10 ml",
    "price": 300000,
    "costPrice": 216000,
    "stock": 13,
    "minStock": 4,
    "barcode": "200000046",
    "image": "https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=400&q=80",
    "notes": "Unisex atir, premium sifat"
  },
  {
    "id": "prd-47",
    "name": "Tygar Bvlgari",
    "brand": "Bvlgari",
    "category": "Erkaklar",
    "prices": {
      "10 ml": 240000,
      "20 ml": 432000,
      "30 ml": 633600,
      "50 ml": 1020000
    },
    "volume": "10 ml",
    "price": 240000,
    "costPrice": 172800,
    "stock": 14,
    "minStock": 4,
    "barcode": "200000047",
    "image": "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400&q=80",
    "notes": "Erkaklar atir, premium sifat"
  },
  {
    "id": "prd-48",
    "name": "Amunae",
    "brand": "Bvlgari",
    "category": "Unisex",
    "prices": {
      "10 ml": 240000,
      "20 ml": 432000,
      "30 ml": 633600,
      "50 ml": 1020000
    },
    "volume": "10 ml",
    "price": 240000,
    "costPrice": 172800,
    "stock": 15,
    "minStock": 4,
    "barcode": "200000048",
    "image": "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=400&q=80",
    "notes": "Unisex atir, premium sifat"
  },
  {
    "id": "prd-49",
    "name": "Guidance",
    "brand": "Amouage",
    "category": "Unisex",
    "prices": {
      "10 ml": 210000,
      "20 ml": 378000,
      "30 ml": 554400,
      "50 ml": 892500
    },
    "volume": "10 ml",
    "price": 210000,
    "costPrice": 151200,
    "stock": 16,
    "minStock": 4,
    "barcode": "200000049",
    "image": "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=400&q=80",
    "notes": "Unisex atir, premium sifat"
  },
  {
    "id": "prd-50",
    "name": "Delina",
    "brand": "Parfums de Marly",
    "category": "Ayollar",
    "prices": {
      "10 ml": 210000,
      "20 ml": 378000,
      "30 ml": 554400,
      "50 ml": 892500
    },
    "volume": "10 ml",
    "price": 210000,
    "costPrice": 151200,
    "stock": 17,
    "minStock": 4,
    "barcode": "200000050",
    "image": "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400&q=80",
    "notes": "Ayollar atir, premium sifat"
  },
  {
    "id": "prd-51",
    "name": "Delina Exclusif",
    "brand": "Parfums de Marly",
    "category": "Ayollar",
    "prices": {
      "10 ml": 210000,
      "20 ml": 378000,
      "30 ml": 554400,
      "50 ml": 892500
    },
    "volume": "10 ml",
    "price": 210000,
    "costPrice": 151200,
    "stock": 18,
    "minStock": 4,
    "barcode": "200000051",
    "image": "https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=400&q=80",
    "notes": "Ayollar atir, premium sifat"
  },
  {
    "id": "prd-52",
    "name": "Valaya",
    "brand": "Parfums de Marly",
    "category": "Ayollar",
    "prices": {
      "10 ml": 210000,
      "20 ml": 378000,
      "30 ml": 554400,
      "50 ml": 892500
    },
    "volume": "10 ml",
    "price": 210000,
    "costPrice": 151200,
    "stock": 19,
    "minStock": 4,
    "barcode": "200000052",
    "image": "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400&q=80",
    "notes": "Ayollar atir, premium sifat"
  },
  {
    "id": "prd-53",
    "name": "Valaya Exclusif",
    "brand": "Parfums de Marly",
    "category": "Ayollar",
    "prices": {
      "10 ml": 210000,
      "20 ml": 378000,
      "30 ml": 554400,
      "50 ml": 892500
    },
    "volume": "10 ml",
    "price": 210000,
    "costPrice": 151200,
    "stock": 20,
    "minStock": 4,
    "barcode": "200000053",
    "image": "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=400&q=80",
    "notes": "Ayollar atir, premium sifat"
  },
  {
    "id": "prd-54",
    "name": "Very Sexy",
    "brand": "Victoria's Secret",
    "category": "Ayollar",
    "prices": {
      "10 ml": 150000,
      "20 ml": 270000,
      "30 ml": 396000,
      "50 ml": 637500
    },
    "volume": "10 ml",
    "price": 150000,
    "costPrice": 108000,
    "stock": 21,
    "minStock": 4,
    "barcode": "200000054",
    "image": "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=400&q=80",
    "notes": "Ayollar atir, premium sifat"
  },
  {
    "id": "prd-55",
    "name": "My Way",
    "brand": "Armani",
    "category": "Ayollar",
    "prices": {
      "10 ml": 150000,
      "20 ml": 270000,
      "30 ml": 396000,
      "50 ml": 637500
    },
    "volume": "10 ml",
    "price": 150000,
    "costPrice": 108000,
    "stock": 22,
    "minStock": 4,
    "barcode": "200000055",
    "image": "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400&q=80",
    "notes": "Ayollar atir, premium sifat"
  },
  {
    "id": "prd-56",
    "name": "Chanel Chance eau Fraiche",
    "brand": "Chanel",
    "category": "Ayollar",
    "prices": {
      "10 ml": 150000,
      "20 ml": 270000,
      "30 ml": 396000,
      "50 ml": 637500
    },
    "volume": "10 ml",
    "price": 150000,
    "costPrice": 108000,
    "stock": 23,
    "minStock": 4,
    "barcode": "200000056",
    "image": "https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=400&q=80",
    "notes": "Ayollar atir, premium sifat"
  },
  {
    "id": "prd-57",
    "name": "Chanel Chance eau Tendre",
    "brand": "Chanel",
    "category": "Ayollar",
    "prices": {
      "10 ml": 150000,
      "20 ml": 270000,
      "30 ml": 396000,
      "50 ml": 637500
    },
    "volume": "10 ml",
    "price": 150000,
    "costPrice": 108000,
    "stock": 24,
    "minStock": 4,
    "barcode": "200000057",
    "image": "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400&q=80",
    "notes": "Ayollar atir, premium sifat"
  },
  {
    "id": "prd-58",
    "name": "Chanel Splendide",
    "brand": "Chanel",
    "category": "Ayollar",
    "prices": {
      "10 ml": 150000,
      "20 ml": 270000,
      "30 ml": 396000,
      "50 ml": 637500
    },
    "volume": "10 ml",
    "price": 150000,
    "costPrice": 108000,
    "stock": 25,
    "minStock": 4,
    "barcode": "200000058",
    "image": "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=400&q=80",
    "notes": "Ayollar atir, premium sifat"
  },
  {
    "id": "prd-59",
    "name": "Coco Mademoiselle Chanel",
    "brand": "Chanel",
    "category": "Ayollar",
    "prices": {
      "10 ml": 180000,
      "20 ml": 324000,
      "30 ml": 475200,
      "50 ml": 765000
    },
    "volume": "10 ml",
    "price": 180000,
    "costPrice": 129600,
    "stock": 26,
    "minStock": 4,
    "barcode": "200000059",
    "image": "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=400&q=80",
    "notes": "Ayollar atir, premium sifat"
  },
  {
    "id": "prd-60",
    "name": "Ganymede",
    "brand": "Marc Antoine Barrois",
    "category": "Unisex",
    "prices": {
      "10 ml": 210000,
      "20 ml": 378000,
      "30 ml": 554400,
      "50 ml": 892500
    },
    "volume": "10 ml",
    "price": 210000,
    "costPrice": 151200,
    "stock": 12,
    "minStock": 4,
    "barcode": "200000060",
    "image": "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400&q=80",
    "notes": "Unisex atir, premium sifat"
  },
  {
    "id": "prd-61",
    "name": "Tilia",
    "brand": "Marc Antoine Barrois",
    "category": "Unisex",
    "prices": {
      "10 ml": 210000,
      "20 ml": 378000,
      "30 ml": 554400,
      "50 ml": 892500
    },
    "volume": "10 ml",
    "price": 210000,
    "costPrice": 151200,
    "stock": 13,
    "minStock": 4,
    "barcode": "200000061",
    "image": "https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=400&q=80",
    "notes": "Unisex atir, premium sifat"
  },
  {
    "id": "prd-62",
    "name": "Aldebaran",
    "brand": "Marc-Antoine Barrois",
    "category": "Unisex",
    "prices": {
      "10 ml": 210000,
      "20 ml": 378000,
      "30 ml": 554400,
      "50 ml": 892500
    },
    "volume": "10 ml",
    "price": 210000,
    "costPrice": 151200,
    "stock": 14,
    "minStock": 4,
    "barcode": "200000062",
    "image": "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400&q=80",
    "notes": "Unisex atir, premium sifat"
  },
  {
    "id": "prd-63",
    "name": "Montabaco",
    "brand": "Ormande Jayne",
    "category": "Unisex",
    "prices": {
      "10 ml": 210000,
      "20 ml": 378000,
      "30 ml": 554400,
      "50 ml": 892500
    },
    "volume": "10 ml",
    "price": 210000,
    "costPrice": 151200,
    "stock": 15,
    "minStock": 4,
    "barcode": "200000063",
    "image": "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=400&q=80",
    "notes": "Unisex atir, premium sifat"
  },
  {
    "id": "prd-64",
    "name": "Montabaco Intensivo",
    "brand": "Ormande Jayne",
    "category": "Unisex",
    "prices": {
      "10 ml": 210000,
      "20 ml": 378000,
      "30 ml": 554400,
      "50 ml": 892500
    },
    "volume": "10 ml",
    "price": 210000,
    "costPrice": 151200,
    "stock": 16,
    "minStock": 4,
    "barcode": "200000064",
    "image": "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=400&q=80",
    "notes": "Unisex atir, premium sifat"
  },
  {
    "id": "prd-65",
    "name": "Bois Imperial",
    "brand": "Essential Parfums",
    "category": "Unisex",
    "prices": {
      "10 ml": 210000,
      "20 ml": 378000,
      "30 ml": 554400,
      "50 ml": 892500
    },
    "volume": "10 ml",
    "price": 210000,
    "costPrice": 151200,
    "stock": 17,
    "minStock": 4,
    "barcode": "200000065",
    "image": "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400&q=80",
    "notes": "Unisex atir, premium sifat"
  },
  {
    "id": "prd-66",
    "name": "Althair",
    "brand": "Parfums de Marley",
    "category": "Erkaklar",
    "prices": {
      "10 ml": 240000,
      "20 ml": 432000,
      "30 ml": 633600,
      "50 ml": 1020000
    },
    "volume": "10 ml",
    "price": 240000,
    "costPrice": 172800,
    "stock": 18,
    "minStock": 4,
    "barcode": "200000066",
    "image": "https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=400&q=80",
    "notes": "Erkaklar atir, premium sifat"
  },
  {
    "id": "prd-67",
    "name": "Angels' Share",
    "brand": "by Kilian",
    "category": "Unisex",
    "prices": {
      "10 ml": 210000,
      "20 ml": 378000,
      "30 ml": 554400,
      "50 ml": 892500
    },
    "volume": "10 ml",
    "price": 210000,
    "costPrice": 151200,
    "stock": 19,
    "minStock": 4,
    "barcode": "200000067",
    "image": "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400&q=80",
    "notes": "Unisex atir, premium sifat"
  },
  {
    "id": "prd-68",
    "name": "Angels' Share Paradise",
    "brand": "Kilian",
    "category": "Unisex",
    "prices": {
      "10 ml": 210000,
      "20 ml": 378000,
      "30 ml": 554400,
      "50 ml": 892500
    },
    "volume": "10 ml",
    "price": 210000,
    "costPrice": 151200,
    "stock": 20,
    "minStock": 4,
    "barcode": "200000068",
    "image": "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=400&q=80",
    "notes": "Unisex atir, premium sifat"
  },
  {
    "id": "prd-69",
    "name": "Old Fashioned",
    "brand": "Kilian",
    "category": "Unisex",
    "prices": {
      "10 ml": 210000,
      "20 ml": 378000,
      "30 ml": 554400,
      "50 ml": 892500
    },
    "volume": "10 ml",
    "price": 210000,
    "costPrice": 151200,
    "stock": 21,
    "minStock": 4,
    "barcode": "200000069",
    "image": "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=400&q=80",
    "notes": "Unisex atir, premium sifat"
  },
  {
    "id": "prd-70",
    "name": "Bleu de Chanel",
    "brand": "Chanel",
    "category": "Erkaklar",
    "prices": {
      "10 ml": 150000,
      "20 ml": 270000,
      "30 ml": 396000,
      "50 ml": 637500
    },
    "volume": "10 ml",
    "price": 150000,
    "costPrice": 108000,
    "stock": 22,
    "minStock": 4,
    "barcode": "200000070",
    "image": "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400&q=80",
    "notes": "Erkaklar atir, premium sifat"
  },
  {
    "id": "prd-71",
    "name": "Bleu de Chanel L'Exclusif Chanel",
    "brand": "Chanel",
    "category": "Erkaklar",
    "prices": {
      "10 ml": 180000,
      "20 ml": 324000,
      "30 ml": 475200,
      "50 ml": 765000
    },
    "volume": "10 ml",
    "price": 180000,
    "costPrice": 129600,
    "stock": 23,
    "minStock": 4,
    "barcode": "200000071",
    "image": "https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=400&q=80",
    "notes": "Erkaklar atir, premium sifat"
  },
  {
    "id": "prd-72",
    "name": "Egoiste Platinum",
    "brand": "Chanel",
    "category": "Erkaklar",
    "prices": {
      "10 ml": 150000,
      "20 ml": 270000,
      "30 ml": 396000,
      "50 ml": 637500
    },
    "volume": "10 ml",
    "price": 150000,
    "costPrice": 108000,
    "stock": 24,
    "minStock": 4,
    "barcode": "200000072",
    "image": "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400&q=80",
    "notes": "Erkaklar atir, premium sifat"
  },
  {
    "id": "prd-74",
    "name": "Rock Rose",
    "brand": "Clive Christian",
    "category": "Erkaklar",
    "prices": {
      "10 ml": 300000,
      "20 ml": 540000,
      "30 ml": 792000,
      "50 ml": 1275000
    },
    "volume": "10 ml",
    "price": 300000,
    "costPrice": 216000,
    "stock": 26,
    "minStock": 4,
    "barcode": "200000074",
    "image": "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=400&q=80",
    "notes": "Erkaklar atir, premium sifat"
  },
  {
    "id": "prd-75",
    "name": "Jump up and Kiss me Hedonistic",
    "brand": "Clive Christian",
    "category": "Unisex",
    "prices": {
      "10 ml": 300000,
      "20 ml": 540000,
      "30 ml": 792000,
      "50 ml": 1275000
    },
    "volume": "10 ml",
    "price": 300000,
    "costPrice": 216000,
    "stock": 12,
    "minStock": 4,
    "barcode": "200000075",
    "image": "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400&q=80",
    "notes": "Unisex atir, premium sifat"
  },
  {
    "id": "prd-76",
    "name": "Matsukita",
    "brand": "Clive Christian",
    "category": "Unisex",
    "prices": {
      "10 ml": 300000,
      "20 ml": 540000,
      "30 ml": 792000,
      "50 ml": 1275000
    },
    "volume": "10 ml",
    "price": 300000,
    "costPrice": 216000,
    "stock": 13,
    "minStock": 4,
    "barcode": "200000076",
    "image": "https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=400&q=80",
    "notes": "Unisex atir, premium sifat"
  },
  {
    "id": "prd-77",
    "name": "1872 For Men",
    "brand": "Clive Christian",
    "category": "Unisex",
    "prices": {
      "10 ml": 300000,
      "20 ml": 540000,
      "30 ml": 792000,
      "50 ml": 1275000
    },
    "volume": "10 ml",
    "price": 300000,
    "costPrice": 216000,
    "stock": 14,
    "minStock": 4,
    "barcode": "200000077",
    "image": "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400&q=80",
    "notes": "Unisex atir, premium sifat"
  },
  {
    "id": "prd-78",
    "name": "Miss Dior Blooming Bouquet",
    "brand": "Dior",
    "category": "Ayollar",
    "prices": {
      "10 ml": 150000,
      "20 ml": 270000,
      "30 ml": 396000,
      "50 ml": 637500
    },
    "volume": "10 ml",
    "price": 150000,
    "costPrice": 108000,
    "stock": 15,
    "minStock": 4,
    "barcode": "200000078",
    "image": "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=400&q=80",
    "notes": "Ayollar atir, premium sifat"
  },
  {
    "id": "prd-79",
    "name": "Baccarat Rouge 540",
    "brand": "Maison Francis Kurkdjan",
    "category": "Unisex",
    "prices": {
      "10 ml": 180000,
      "20 ml": 324000,
      "30 ml": 475200,
      "50 ml": 765000
    },
    "volume": "10 ml",
    "price": 180000,
    "costPrice": 129600,
    "stock": 16,
    "minStock": 4,
    "barcode": "200000079",
    "image": "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=400&q=80",
    "notes": "Unisex atir, premium sifat"
  },
  {
    "id": "prd-80",
    "name": "Escentric Molecule 02",
    "brand": "Escentric Molecules",
    "category": "Unisex",
    "prices": {
      "10 ml": 150000,
      "20 ml": 270000,
      "30 ml": 396000,
      "50 ml": 637500
    },
    "volume": "10 ml",
    "price": 150000,
    "costPrice": 108000,
    "stock": 17,
    "minStock": 4,
    "barcode": "200000080",
    "image": "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400&q=80",
    "notes": "Unisex atir, premium sifat"
  },
  {
    "id": "prd-81",
    "name": "Molecule 04",
    "brand": "Escentric Molecules",
    "category": "Unisex",
    "prices": {
      "10 ml": 150000,
      "20 ml": 270000,
      "30 ml": 396000,
      "50 ml": 637500
    },
    "volume": "10 ml",
    "price": 150000,
    "costPrice": 108000,
    "stock": 18,
    "minStock": 4,
    "barcode": "200000081",
    "image": "https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=400&q=80",
    "notes": "Unisex atir, premium sifat"
  },
  {
    "id": "prd-82",
    "name": "Oud Satin Mood",
    "brand": "Maison Francis Kurkdjan",
    "category": "Unisex",
    "prices": {
      "10 ml": 210000,
      "20 ml": 378000,
      "30 ml": 554400,
      "50 ml": 892500
    },
    "volume": "10 ml",
    "price": 210000,
    "costPrice": 151200,
    "stock": 19,
    "minStock": 4,
    "barcode": "200000082",
    "image": "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400&q=80",
    "notes": "Unisex atir, premium sifat"
  },
  {
    "id": "prd-83",
    "name": "Arabians Tonka",
    "brand": "Montale",
    "category": "Unisex",
    "prices": {
      "10 ml": 150000,
      "20 ml": 270000,
      "30 ml": 396000,
      "50 ml": 637500
    },
    "volume": "10 ml",
    "price": 150000,
    "costPrice": 108000,
    "stock": 20,
    "minStock": 4,
    "barcode": "200000083",
    "image": "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=400&q=80",
    "notes": "Unisex atir, premium sifat"
  },
  {
    "id": "prd-84",
    "name": "Megamare",
    "brand": "Orto Parisi",
    "category": "Unisex",
    "prices": {
      "10 ml": 300000,
      "20 ml": 540000,
      "30 ml": 792000,
      "50 ml": 1275000
    },
    "volume": "10 ml",
    "price": 300000,
    "costPrice": 216000,
    "stock": 21,
    "minStock": 4,
    "barcode": "200000084",
    "image": "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=400&q=80",
    "notes": "Unisex atir, premium sifat"
  },
  {
    "id": "prd-85",
    "name": "Bergamask",
    "brand": "Orto Parisi",
    "category": "Unisex",
    "prices": {
      "10 ml": 240000,
      "20 ml": 432000,
      "30 ml": 633600,
      "50 ml": 1020000
    },
    "volume": "10 ml",
    "price": 240000,
    "costPrice": 172800,
    "stock": 22,
    "minStock": 4,
    "barcode": "200000085",
    "image": "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400&q=80",
    "notes": "Unisex atir, premium sifat"
  },
  {
    "id": "prd-86",
    "name": "ather",
    "brand": "Tom Ford",
    "category": "Unisex",
    "prices": {
      "10 ml": 210000,
      "20 ml": 378000,
      "30 ml": 554400,
      "50 ml": 892500
    },
    "volume": "10 ml",
    "price": 210000,
    "costPrice": 151200,
    "stock": 23,
    "minStock": 4,
    "barcode": "200000086",
    "image": "https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=400&q=80",
    "notes": "Unisex atir, premium sifat"
  },
  {
    "id": "prd-87",
    "name": "eau d'Ombré Leather Tom Ford",
    "brand": "Tom Ford",
    "category": "Erkaklar",
    "prices": {
      "10 ml": 210000,
      "20 ml": 378000,
      "30 ml": 554400,
      "50 ml": 892500
    },
    "volume": "10 ml",
    "price": 210000,
    "costPrice": 151200,
    "stock": 24,
    "minStock": 4,
    "barcode": "200000087",
    "image": "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400&q=80",
    "notes": "Erkaklar atir, premium sifat"
  },
  {
    "id": "prd-88",
    "name": "Cherry Smoke",
    "brand": "Tom Ford",
    "category": "Unisex",
    "prices": {
      "10 ml": 150000,
      "20 ml": 270000,
      "30 ml": 396000,
      "50 ml": 637500
    },
    "volume": "10 ml",
    "price": 150000,
    "costPrice": 108000,
    "stock": 25,
    "minStock": 4,
    "barcode": "200000088",
    "image": "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=400&q=80",
    "notes": "Unisex atir, premium sifat"
  },
  {
    "id": "prd-89",
    "name": "Oud Wood",
    "brand": "Tom Ford",
    "category": "Unisex",
    "prices": {
      "10 ml": 240000,
      "20 ml": 432000,
      "30 ml": 633600,
      "50 ml": 1020000
    },
    "volume": "10 ml",
    "price": 240000,
    "costPrice": 172800,
    "stock": 26,
    "minStock": 4,
    "barcode": "200000089",
    "image": "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=400&q=80",
    "notes": "Unisex atir, premium sifat"
  },
  {
    "id": "prd-90",
    "name": "Black Orchid",
    "brand": "Tom Ford",
    "category": "Ayollar",
    "prices": {
      "10 ml": 150000,
      "20 ml": 270000,
      "30 ml": 396000,
      "50 ml": 637500
    },
    "volume": "10 ml",
    "price": 150000,
    "costPrice": 108000,
    "stock": 12,
    "minStock": 4,
    "barcode": "200000090",
    "image": "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400&q=80",
    "notes": "Ayollar atir, premium sifat"
  },
  {
    "id": "prd-91",
    "name": "Lost Cherry",
    "brand": "Tom Ford",
    "category": "Unisex",
    "prices": {
      "10 ml": 210000,
      "20 ml": 378000,
      "30 ml": 554400,
      "50 ml": 892500
    },
    "volume": "10 ml",
    "price": 210000,
    "costPrice": 151200,
    "stock": 13,
    "minStock": 4,
    "barcode": "200000091",
    "image": "https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=400&q=80",
    "notes": "Unisex atir, premium sifat"
  },
  {
    "id": "prd-92",
    "name": "Tobacco Vanille",
    "brand": "Tom Ford",
    "category": "Unisex",
    "prices": {
      "10 ml": 210000,
      "20 ml": 378000,
      "30 ml": 554400,
      "50 ml": 892500
    },
    "volume": "10 ml",
    "price": 210000,
    "costPrice": 151200,
    "stock": 14,
    "minStock": 4,
    "barcode": "200000092",
    "image": "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400&q=80",
    "notes": "Unisex atir, premium sifat"
  },
  {
    "id": "prd-93",
    "name": "Tuscan Leather",
    "brand": "Tom Ford",
    "category": "Unisex",
    "prices": {
      "10 ml": 210000,
      "20 ml": 378000,
      "30 ml": 554400,
      "50 ml": 892500
    },
    "volume": "10 ml",
    "price": 210000,
    "costPrice": 151200,
    "stock": 15,
    "minStock": 4,
    "barcode": "200000093",
    "image": "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=400&q=80",
    "notes": "Unisex atir, premium sifat"
  },
  {
    "id": "prd-94",
    "name": "Vanilla Sex",
    "brand": "Tom Ford",
    "category": "Unisex",
    "prices": {
      "10 ml": 250000,
      "20 ml": 450000,
      "30 ml": 660000,
      "50 ml": 1062500
    },
    "volume": "10 ml",
    "price": 250000,
    "costPrice": 180000,
    "stock": 16,
    "minStock": 4,
    "barcode": "200000094",
    "image": "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=400&q=80",
    "notes": "Unisex atir, premium sifat"
  },
  {
    "id": "prd-95",
    "name": "Kirke",
    "brand": "Tiziana Terenzi",
    "category": "Unisex",
    "prices": {
      "10 ml": 150000,
      "20 ml": 270000,
      "30 ml": 396000,
      "50 ml": 637500
    },
    "volume": "10 ml",
    "price": 150000,
    "costPrice": 108000,
    "stock": 17,
    "minStock": 4,
    "barcode": "200000095",
    "image": "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400&q=80",
    "notes": "Unisex atir, premium sifat"
  },
  {
    "id": "prd-96",
    "name": "Black Afgano",
    "brand": "Nasomatto",
    "category": "Unisex",
    "prices": {
      "10 ml": 250000,
      "20 ml": 450000,
      "30 ml": 660000,
      "50 ml": 1062500
    },
    "volume": "10 ml",
    "price": 250000,
    "costPrice": 180000,
    "stock": 18,
    "minStock": 4,
    "barcode": "200000096",
    "image": "https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=400&q=80",
    "notes": "Unisex atir, premium sifat"
  },
  {
    "id": "prd-97",
    "name": "Devil's Intrigue",
    "brand": "HFC-Haute Fragrance Company",
    "category": "Ayollar",
    "prices": {
      "10 ml": 210000,
      "20 ml": 378000,
      "30 ml": 554400,
      "50 ml": 892500
    },
    "volume": "10 ml",
    "price": 210000,
    "costPrice": 151200,
    "stock": 19,
    "minStock": 4,
    "barcode": "200000097",
    "image": "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400&q=80",
    "notes": "Ayollar atir, premium sifat"
  },
  {
    "id": "prd-98",
    "name": "Gucci Flora",
    "brand": "Gucci",
    "category": "Ayollar",
    "prices": {
      "10 ml": 150000,
      "20 ml": 270000,
      "30 ml": 396000,
      "50 ml": 637500
    },
    "volume": "10 ml",
    "price": 150000,
    "costPrice": 108000,
    "stock": 20,
    "minStock": 4,
    "barcode": "200000098",
    "image": "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=400&q=80",
    "notes": "Ayollar atir, premium sifat"
  },
  {
    "id": "prd-99",
    "name": "Terre d'Hermes",
    "brand": "Hermes",
    "category": "Erkaklar",
    "prices": {
      "10 ml": 150000,
      "20 ml": 270000,
      "30 ml": 396000,
      "50 ml": 637500
    },
    "volume": "10 ml",
    "price": 150000,
    "costPrice": 108000,
    "stock": 21,
    "minStock": 4,
    "barcode": "200000099",
    "image": "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=400&q=80",
    "notes": "Erkaklar atir, premium sifat"
  },
  {
    "id": "prd-100",
    "name": "Black Opium",
    "brand": "Yves Saint Laurent",
    "category": "Ayollar",
    "prices": {
      "10 ml": 150000,
      "20 ml": 270000,
      "30 ml": 396000,
      "50 ml": 637500
    },
    "volume": "10 ml",
    "price": 150000,
    "costPrice": 108000,
    "stock": 22,
    "minStock": 4,
    "barcode": "200000100",
    "image": "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400&q=80",
    "notes": "Ayollar atir, premium sifat"
  },
  {
    "id": "prd-101",
    "name": "Good Girl",
    "brand": "Carolina Herrera",
    "category": "Ayollar",
    "prices": {
      "10 ml": 150000,
      "20 ml": 270000,
      "30 ml": 396000,
      "50 ml": 637500
    },
    "volume": "10 ml",
    "price": 150000,
    "costPrice": 108000,
    "stock": 23,
    "minStock": 4,
    "barcode": "200000101",
    "image": "https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=400&q=80",
    "notes": "Ayollar atir, premium sifat"
  },
  {
    "id": "prd-102",
    "name": "Sunkissed Goddes",
    "brand": "by Kilian",
    "category": "Unisex",
    "prices": {
      "10 ml": 200000,
      "20 ml": 360000,
      "30 ml": 528000,
      "50 ml": 850000
    },
    "volume": "10 ml",
    "price": 200000,
    "costPrice": 144000,
    "stock": 24,
    "minStock": 4,
    "barcode": "200000102",
    "image": "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400&q=80",
    "notes": "Unisex atir, premium sifat"
  },
  {
    "id": "prd-103",
    "name": "Good Girl Gone Bad",
    "brand": "by Kilian",
    "category": "Ayollar",
    "prices": {
      "10 ml": 210000,
      "20 ml": 378000,
      "30 ml": 554400,
      "50 ml": 892500
    },
    "volume": "10 ml",
    "price": 210000,
    "costPrice": 151200,
    "stock": 25,
    "minStock": 4,
    "barcode": "200000103",
    "image": "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=400&q=80",
    "notes": "Ayollar atir, premium sifat"
  },
  {
    "id": "prd-104",
    "name": "212 Men",
    "brand": "Carolina Herrera",
    "category": "Erkaklar",
    "prices": {
      "10 ml": 150000,
      "20 ml": 270000,
      "30 ml": 396000,
      "50 ml": 637500
    },
    "volume": "10 ml",
    "price": 150000,
    "costPrice": 108000,
    "stock": 26,
    "minStock": 4,
    "barcode": "200000104",
    "image": "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=400&q=80",
    "notes": "Erkaklar atir, premium sifat"
  },
  {
    "id": "prd-105",
    "name": "212 Sexy",
    "brand": "Carolina Herrera",
    "category": "Ayollar",
    "prices": {
      "10 ml": 150000,
      "20 ml": 270000,
      "30 ml": 396000,
      "50 ml": 637500
    },
    "volume": "10 ml",
    "price": 150000,
    "costPrice": 108000,
    "stock": 12,
    "minStock": 4,
    "barcode": "200000105",
    "image": "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400&q=80",
    "notes": "Ayollar atir, premium sifat"
  },
  {
    "id": "prd-106",
    "name": "Santal 33",
    "brand": "Le Labo",
    "category": "Unisex",
    "prices": {
      "10 ml": 200000,
      "20 ml": 360000,
      "30 ml": 528000,
      "50 ml": 850000
    },
    "volume": "10 ml",
    "price": 200000,
    "costPrice": 144000,
    "stock": 13,
    "minStock": 4,
    "barcode": "200000106",
    "image": "https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=400&q=80",
    "notes": "Unisex atir, premium sifat"
  },
  {
    "id": "prd-107",
    "name": "Another 13",
    "brand": "Le Labo",
    "category": "Unisex",
    "prices": {
      "10 ml": 210000,
      "20 ml": 378000,
      "30 ml": 554400,
      "50 ml": 892500
    },
    "volume": "10 ml",
    "price": 210000,
    "costPrice": 151200,
    "stock": 14,
    "minStock": 4,
    "barcode": "200000107",
    "image": "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400&q=80",
    "notes": "Unisex atir, premium sifat"
  },
  {
    "id": "prd-108",
    "name": "Le Beau Le Parfum",
    "brand": "Jean Paul Gaultier",
    "category": "Erkaklar",
    "prices": {
      "10 ml": 150000,
      "20 ml": 270000,
      "30 ml": 396000,
      "50 ml": 637500
    },
    "volume": "10 ml",
    "price": 150000,
    "costPrice": 108000,
    "stock": 15,
    "minStock": 4,
    "barcode": "200000108",
    "image": "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=400&q=80",
    "notes": "Erkaklar atir, premium sifat"
  },
  {
    "id": "prd-109",
    "name": "Le Male Le Parfum",
    "brand": "Jean Paul Gauiltier",
    "category": "Erkaklar",
    "prices": {
      "10 ml": 150000,
      "20 ml": 270000,
      "30 ml": 396000,
      "50 ml": 637500
    },
    "volume": "10 ml",
    "price": 150000,
    "costPrice": 108000,
    "stock": 16,
    "minStock": 4,
    "barcode": "200000109",
    "image": "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=400&q=80",
    "notes": "Erkaklar atir, premium sifat"
  },
  {
    "id": "prd-110",
    "name": "Le Male Elixir",
    "brand": "JPG",
    "category": "Erkaklar",
    "prices": {
      "10 ml": 150000,
      "20 ml": 270000,
      "30 ml": 396000,
      "50 ml": 637500
    },
    "volume": "10 ml",
    "price": 150000,
    "costPrice": 108000,
    "stock": 17,
    "minStock": 4,
    "barcode": "200000110",
    "image": "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400&q=80",
    "notes": "Erkaklar atir, premium sifat"
  },
  {
    "id": "prd-111",
    "name": "Explorer",
    "brand": "Montblanc",
    "category": "Erkaklar",
    "prices": {
      "10 ml": 150000,
      "20 ml": 270000,
      "30 ml": 396000,
      "50 ml": 637500
    },
    "volume": "10 ml",
    "price": 150000,
    "costPrice": 108000,
    "stock": 18,
    "minStock": 4,
    "barcode": "200000111",
    "image": "https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=400&q=80",
    "notes": "Erkaklar atir, premium sifat"
  },
  {
    "id": "prd-112",
    "name": "Cedrat Boise",
    "brand": "Mancera",
    "category": "Unisex",
    "prices": {
      "10 ml": 150000,
      "20 ml": 270000,
      "30 ml": 396000,
      "50 ml": 637500
    },
    "volume": "10 ml",
    "price": 150000,
    "costPrice": 108000,
    "stock": 19,
    "minStock": 4,
    "barcode": "200000112",
    "image": "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400&q=80",
    "notes": "Unisex atir, premium sifat"
  },
  {
    "id": "prd-113",
    "name": "Perseus",
    "brand": "Parfums de Marley",
    "category": "Erkaklar",
    "prices": {
      "10 ml": 150000,
      "20 ml": 270000,
      "30 ml": 396000,
      "50 ml": 637500
    },
    "volume": "10 ml",
    "price": 150000,
    "costPrice": 108000,
    "stock": 20,
    "minStock": 4,
    "barcode": "200000113",
    "image": "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=400&q=80",
    "notes": "Erkaklar atir, premium sifat"
  },
  {
    "id": "prd-114",
    "name": "Bright Crystal",
    "brand": "Versace",
    "category": "Ayollar",
    "prices": {
      "10 ml": 150000,
      "20 ml": 270000,
      "30 ml": 396000,
      "50 ml": 637500
    },
    "volume": "10 ml",
    "price": 150000,
    "costPrice": 108000,
    "stock": 21,
    "minStock": 4,
    "barcode": "200000114",
    "image": "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=400&q=80",
    "notes": "Ayollar atir, premium sifat"
  },
  {
    "id": "prd-115",
    "name": "Man eau Fraiche",
    "brand": "Versace",
    "category": "Erkaklar",
    "prices": {
      "10 ml": 150000,
      "20 ml": 270000,
      "30 ml": 396000,
      "50 ml": 637500
    },
    "volume": "10 ml",
    "price": 150000,
    "costPrice": 108000,
    "stock": 22,
    "minStock": 4,
    "barcode": "200000115",
    "image": "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400&q=80",
    "notes": "Erkaklar atir, premium sifat"
  },
  {
    "id": "prd-116",
    "name": "Pour Homme",
    "brand": "Versace",
    "category": "Erkaklar",
    "prices": {
      "10 ml": 150000,
      "20 ml": 270000,
      "30 ml": 396000,
      "50 ml": 637500
    },
    "volume": "10 ml",
    "price": 150000,
    "costPrice": 108000,
    "stock": 23,
    "minStock": 4,
    "barcode": "200000116",
    "image": "https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=400&q=80",
    "notes": "Erkaklar atir, premium sifat"
  },
  {
    "id": "prd-117",
    "name": "Eros",
    "brand": "Versace",
    "category": "Erkaklar",
    "prices": {
      "10 ml": 150000,
      "20 ml": 270000,
      "30 ml": 396000,
      "50 ml": 637500
    },
    "volume": "10 ml",
    "price": 150000,
    "costPrice": 108000,
    "stock": 24,
    "minStock": 4,
    "barcode": "200000117",
    "image": "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400&q=80",
    "notes": "Erkaklar atir, premium sifat"
  },
  {
    "id": "prd-118",
    "name": "Bombshell",
    "brand": "Victoria's Secret",
    "category": "Ayollar",
    "prices": {
      "10 ml": 150000,
      "20 ml": 270000,
      "30 ml": 396000,
      "50 ml": 637500
    },
    "volume": "10 ml",
    "price": 150000,
    "costPrice": 108000,
    "stock": 25,
    "minStock": 4,
    "barcode": "200000118",
    "image": "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=400&q=80",
    "notes": "Ayollar atir, premium sifat"
  },
  {
    "id": "prd-119",
    "name": "Legend eau de parfum",
    "brand": "Mo",
    "category": "Erkaklar",
    "prices": {
      "10 ml": 150000,
      "20 ml": 270000,
      "30 ml": 396000,
      "50 ml": 637500
    },
    "volume": "10 ml",
    "price": 150000,
    "costPrice": 108000,
    "stock": 26,
    "minStock": 4,
    "barcode": "200000119",
    "image": "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=400&q=80",
    "notes": "Erkaklar atir, premium sifat"
  },
  {
    "id": "prd-120",
    "name": "Blackberry & Bay",
    "brand": "Jo Malone London",
    "category": "Ayollar",
    "prices": {
      "10 ml": 150000,
      "20 ml": 270000,
      "30 ml": 396000,
      "50 ml": 637500
    },
    "volume": "10 ml",
    "price": 150000,
    "costPrice": 108000,
    "stock": 12,
    "minStock": 4,
    "barcode": "200000120",
    "image": "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400&q=80",
    "notes": "Ayollar atir, premium sifat"
  },
  {
    "id": "prd-121",
    "name": "Cherry Cherry",
    "brand": "Mancera",
    "category": "Unisex",
    "prices": {
      "10 ml": 150000,
      "20 ml": 270000,
      "30 ml": 396000,
      "50 ml": 637500
    },
    "volume": "10 ml",
    "price": 150000,
    "costPrice": 108000,
    "stock": 13,
    "minStock": 4,
    "barcode": "200000121",
    "image": "https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=400&q=80",
    "notes": "Unisex atir, premium sifat"
  },
  {
    "id": "prd-122",
    "name": "Rose N'Roses",
    "brand": "Dior",
    "category": "Ayollar",
    "prices": {
      "10 ml": 150000,
      "20 ml": 270000,
      "30 ml": 396000,
      "50 ml": 637500
    },
    "volume": "10 ml",
    "price": 150000,
    "costPrice": 108000,
    "stock": 14,
    "minStock": 4,
    "barcode": "200000122",
    "image": "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400&q=80",
    "notes": "Ayollar atir, premium sifat"
  },
  {
    "id": "prd-123",
    "name": "Blanche",
    "brand": "Byredo",
    "category": "Ayollar",
    "prices": {
      "10 ml": 150000,
      "20 ml": 270000,
      "30 ml": 396000,
      "50 ml": 637500
    },
    "volume": "10 ml",
    "price": 150000,
    "costPrice": 108000,
    "stock": 15,
    "minStock": 4,
    "barcode": "200000123",
    "image": "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=400&q=80",
    "notes": "Ayollar atir, premium sifat"
  },
  {
    "id": "prd-124",
    "name": "Valentino Stravaganza",
    "brand": "Valentino",
    "category": "Ayollar",
    "prices": {
      "10 ml": 150000,
      "20 ml": 270000,
      "30 ml": 396000,
      "50 ml": 637500
    },
    "volume": "10 ml",
    "price": 150000,
    "costPrice": 108000,
    "stock": 16,
    "minStock": 4,
    "barcode": "200000124",
    "image": "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=400&q=80",
    "notes": "Ayollar atir, premium sifat"
  },
  {
    "id": "prd-125",
    "name": "Valentino Extradose",
    "brand": "Valentino",
    "category": "Ayollar",
    "prices": {
      "10 ml": 150000,
      "20 ml": 270000,
      "30 ml": 396000,
      "50 ml": 637500
    },
    "volume": "10 ml",
    "price": 150000,
    "costPrice": 108000,
    "stock": 17,
    "minStock": 4,
    "barcode": "200000125",
    "image": "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400&q=80",
    "notes": "Ayollar atir, premium sifat"
  },
  {
    "id": "prd-126",
    "name": "Gypsy Water",
    "brand": "Byredo",
    "category": "Unisex",
    "prices": {
      "10 ml": 150000,
      "20 ml": 270000,
      "30 ml": 396000,
      "50 ml": 637500
    },
    "volume": "10 ml",
    "price": 150000,
    "costPrice": 108000,
    "stock": 18,
    "minStock": 4,
    "barcode": "200000126",
    "image": "https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=400&q=80",
    "notes": "Unisex atir, premium sifat"
  },
  {
    "id": "prd-127",
    "name": "Y  Le Parfum",
    "brand": "Yves Saint Laurent",
    "category": "Erkaklar",
    "prices": {
      "10 ml": 150000,
      "20 ml": 270000,
      "30 ml": 396000,
      "50 ml": 637500
    },
    "volume": "10 ml",
    "price": 150000,
    "costPrice": 108000,
    "stock": 19,
    "minStock": 4,
    "barcode": "200000127",
    "image": "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400&q=80",
    "notes": "Erkaklar atir, premium sifat"
  },
  {
    "id": "prd-128",
    "name": "Greenley",
    "brand": "Parfums de Marley",
    "category": "Unisex",
    "prices": {
      "10 ml": 210000,
      "20 ml": 378000,
      "30 ml": 554400,
      "50 ml": 892500
    },
    "volume": "10 ml",
    "price": 210000,
    "costPrice": 151200,
    "stock": 20,
    "minStock": 4,
    "barcode": "200000128",
    "image": "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=400&q=80",
    "notes": "Unisex atir, premium sifat"
  },
  {
    "id": "prd-129",
    "name": "A La Rose",
    "brand": "Maison Francis Kurkdjian",
    "category": "Ayollar",
    "prices": {
      "10 ml": 250000,
      "20 ml": 450000,
      "30 ml": 660000,
      "50 ml": 1062500
    },
    "volume": "10 ml",
    "price": 250000,
    "costPrice": 180000,
    "stock": 21,
    "minStock": 4,
    "barcode": "200000129",
    "image": "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=400&q=80",
    "notes": "Ayollar atir, premium sifat"
  },
  {
    "id": "prd-130",
    "name": "L'Homme À la Rose",
    "brand": "Maison Francis Kurkdjian",
    "category": "Erkaklar",
    "prices": {
      "10 ml": 250000,
      "20 ml": 450000,
      "30 ml": 660000,
      "50 ml": 1062500
    },
    "volume": "10 ml",
    "price": 250000,
    "costPrice": 180000,
    "stock": 22,
    "minStock": 4,
    "barcode": "200000130",
    "image": "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400&q=80",
    "notes": "Erkaklar atir, premium sifat"
  },
  {
    "id": "prd-131",
    "name": "Acqua Di Gio Absolu",
    "brand": "Giorgio Armani",
    "category": "Erkaklar",
    "prices": {
      "10 ml": 150000,
      "20 ml": 270000,
      "30 ml": 396000,
      "50 ml": 637500
    },
    "volume": "10 ml",
    "price": 150000,
    "costPrice": 108000,
    "stock": 23,
    "minStock": 4,
    "barcode": "200000131",
    "image": "https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=400&q=80",
    "notes": "Erkaklar atir, premium sifat"
  },
  {
    "id": "prd-132",
    "name": "Grand Soir",
    "brand": "Maison Francis Kurkdjian",
    "category": "Unisex",
    "prices": {
      "10 ml": 250000,
      "20 ml": 450000,
      "30 ml": 660000,
      "50 ml": 1062500
    },
    "volume": "10 ml",
    "price": 250000,
    "costPrice": 180000,
    "stock": 24,
    "minStock": 4,
    "barcode": "200000132",
    "image": "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400&q=80",
    "notes": "Unisex atir, premium sifat"
  },
  {
    "id": "prd-133",
    "name": "The Blazing Mr Sam",
    "brand": "Penhaligon's",
    "category": "Erkaklar",
    "prices": {
      "10 ml": 200000,
      "20 ml": 360000,
      "30 ml": 528000,
      "50 ml": 850000
    },
    "volume": "10 ml",
    "price": 200000,
    "costPrice": 144000,
    "stock": 25,
    "minStock": 4,
    "barcode": "200000133",
    "image": "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=400&q=80",
    "notes": "Erkaklar atir, premium sifat"
  },
  {
    "id": "prd-134",
    "name": "The Hedonist Extrait de Parfum",
    "brand": "Ex Nihilo",
    "category": "Unisex",
    "prices": {
      "10 ml": 250000,
      "20 ml": 450000,
      "30 ml": 660000,
      "50 ml": 1062500
    },
    "volume": "10 ml",
    "price": 250000,
    "costPrice": 180000,
    "stock": 26,
    "minStock": 4,
    "barcode": "200000134",
    "image": "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=400&q=80",
    "notes": "Unisex atir, premium sifat"
  },
  {
    "id": "prd-135",
    "name": "Eros Energy",
    "brand": "Versace",
    "category": "Erkaklar",
    "prices": {
      "10 ml": 150000,
      "20 ml": 270000,
      "30 ml": 396000,
      "50 ml": 637500
    },
    "volume": "10 ml",
    "price": 150000,
    "costPrice": 108000,
    "stock": 12,
    "minStock": 4,
    "barcode": "200000135",
    "image": "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400&q=80",
    "notes": "Erkaklar atir, premium sifat"
  },
  {
    "id": "prd-136",
    "name": "Coco Chanel",
    "brand": "Chanel",
    "category": "Ayollar",
    "prices": {
      "10 ml": 150000,
      "20 ml": 270000,
      "30 ml": 396000,
      "50 ml": 637500
    },
    "volume": "10 ml",
    "price": 150000,
    "costPrice": 108000,
    "stock": 13,
    "minStock": 4,
    "barcode": "200000136",
    "image": "https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=400&q=80",
    "notes": "Ayollar atir, premium sifat"
  },
  {
    "id": "prd-137",
    "name": "Molecule 020",
    "brand": "Escentric Molecules",
    "category": "Unisex",
    "prices": {
      "10 ml": 150000,
      "20 ml": 270000,
      "30 ml": 396000,
      "50 ml": 637500
    },
    "volume": "10 ml",
    "price": 150000,
    "costPrice": 108000,
    "stock": 14,
    "minStock": 4,
    "barcode": "200000137",
    "image": "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400&q=80",
    "notes": "Unisex atir, premium sifat"
  },
  {
    "id": "prd-138",
    "name": "Outcast Blue Extrait",
    "brand": "Ex Nihilo",
    "category": "Unisex",
    "prices": {
      "10 ml": 250000,
      "20 ml": 450000,
      "30 ml": 660000,
      "50 ml": 1062500
    },
    "volume": "10 ml",
    "price": 250000,
    "costPrice": 180000,
    "stock": 15,
    "minStock": 4,
    "barcode": "200000138",
    "image": "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=400&q=80",
    "notes": "Unisex atir, premium sifat"
  },
  {
    "id": "prd-139",
    "name": "Frederic Malle Promice",
    "brand": "Frederic Malle",
    "category": "Unisex",
    "prices": {
      "10 ml": 200000,
      "20 ml": 360000,
      "30 ml": 528000,
      "50 ml": 850000
    },
    "volume": "10 ml",
    "price": 200000,
    "costPrice": 144000,
    "stock": 16,
    "minStock": 4,
    "barcode": "200000139",
    "image": "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=400&q=80",
    "notes": "Unisex atir, premium sifat"
  },
  {
    "id": "prd-140",
    "name": "Gorgeous Gardenia",
    "brand": "Gucci",
    "category": "Ayollar",
    "prices": {
      "10 ml": 150000,
      "20 ml": 270000,
      "30 ml": 396000,
      "50 ml": 637500
    },
    "volume": "10 ml",
    "price": 150000,
    "costPrice": 108000,
    "stock": 17,
    "minStock": 4,
    "barcode": "200000140",
    "image": "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400&q=80",
    "notes": "Ayollar atir, premium sifat"
  },
  {
    "id": "prd-142",
    "name": "Le Male Elixir",
    "brand": "JPG",
    "category": "Erkaklar",
    "prices": {
      "10 ml": 150000,
      "20 ml": 270000,
      "30 ml": 396000,
      "50 ml": 637500
    },
    "volume": "10 ml",
    "price": 150000,
    "costPrice": 108000,
    "stock": 19,
    "minStock": 4,
    "barcode": "200000142",
    "image": "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400&q=80",
    "notes": "Erkaklar atir, premium sifat"
  },
  {
    "id": "prd-143",
    "name": "Mango Skin",
    "brand": "Vilhelm Parfumerie",
    "category": "Unisex",
    "prices": {
      "10 ml": 150000,
      "20 ml": 270000,
      "30 ml": 396000,
      "50 ml": 637500
    },
    "volume": "10 ml",
    "price": 150000,
    "costPrice": 108000,
    "stock": 20,
    "minStock": 4,
    "barcode": "200000143",
    "image": "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=400&q=80",
    "notes": "Unisex atir, premium sifat"
  },
  {
    "id": "prd-144",
    "name": "Hugo Boss Bottled Elixir",
    "brand": "Hugo Boss",
    "category": "Erkaklar",
    "prices": {
      "10 ml": 150000,
      "20 ml": 270000,
      "30 ml": 396000,
      "50 ml": 637500
    },
    "volume": "10 ml",
    "price": 150000,
    "costPrice": 108000,
    "stock": 21,
    "minStock": 4,
    "barcode": "200000144",
    "image": "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=400&q=80",
    "notes": "Erkaklar atir, premium sifat"
  },
  {
    "id": "prd-145",
    "name": "Bottled Absolu Hugo Boss",
    "brand": "Hugo Boss",
    "category": "Erkaklar",
    "prices": {
      "10 ml": 150000,
      "20 ml": 270000,
      "30 ml": 396000,
      "50 ml": 637500
    },
    "volume": "10 ml",
    "price": 150000,
    "costPrice": 108000,
    "stock": 22,
    "minStock": 4,
    "barcode": "200000145",
    "image": "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400&q=80",
    "notes": "Erkaklar atir, premium sifat"
  },
  {
    "id": "prd-146",
    "name": "Oud Satin Mood",
    "brand": "MFK",
    "category": "Unisex",
    "prices": {
      "10 ml": 200000,
      "20 ml": 360000,
      "30 ml": 528000,
      "50 ml": 850000
    },
    "volume": "10 ml",
    "price": 200000,
    "costPrice": 144000,
    "stock": 23,
    "minStock": 4,
    "barcode": "200000146",
    "image": "https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=400&q=80",
    "notes": "Unisex atir, premium sifat"
  },
  {
    "id": "prd-147",
    "name": "Hacivat Nishane",
    "brand": "Nishane",
    "category": "Unisex",
    "prices": {
      "10 ml": 200000,
      "20 ml": 360000,
      "30 ml": 528000,
      "50 ml": 850000
    },
    "volume": "10 ml",
    "price": 200000,
    "costPrice": 144000,
    "stock": 24,
    "minStock": 4,
    "barcode": "200000147",
    "image": "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400&q=80",
    "notes": "Unisex atir, premium sifat"
  },
  {
    "id": "prd-148",
    "name": "Megamare",
    "brand": "Orto Parisi",
    "category": "Unisex",
    "prices": {
      "10 ml": 250000,
      "20 ml": 450000,
      "30 ml": 660000,
      "50 ml": 1062500
    },
    "volume": "10 ml",
    "price": 250000,
    "costPrice": 180000,
    "stock": 25,
    "minStock": 4,
    "barcode": "200000148",
    "image": "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=400&q=80",
    "notes": "Unisex atir, premium sifat"
  },
  {
    "id": "prd-149",
    "name": "Lord George",
    "brand": "Penhaligons",
    "category": "Erkaklar",
    "prices": {
      "10 ml": 200000,
      "20 ml": 360000,
      "30 ml": 528000,
      "50 ml": 850000
    },
    "volume": "10 ml",
    "price": 200000,
    "costPrice": 144000,
    "stock": 26,
    "minStock": 4,
    "barcode": "200000149",
    "image": "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=400&q=80",
    "notes": "Erkaklar atir, premium sifat"
  },
  {
    "id": "prd-150",
    "name": "Layton",
    "brand": "Parfums de Marley",
    "category": "Erkaklar",
    "prices": {
      "10 ml": 200000,
      "20 ml": 360000,
      "30 ml": 528000,
      "50 ml": 850000
    },
    "volume": "10 ml",
    "price": 200000,
    "costPrice": 144000,
    "stock": 12,
    "minStock": 4,
    "barcode": "200000150",
    "image": "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400&q=80",
    "notes": "Erkaklar atir, premium sifat"
  },
  {
    "id": "prd-151",
    "name": "Libre",
    "brand": "Yves Saint Laurent",
    "category": "Ayollar",
    "prices": {
      "10 ml": 150000,
      "20 ml": 270000,
      "30 ml": 396000,
      "50 ml": 637500
    },
    "volume": "10 ml",
    "price": 150000,
    "costPrice": 108000,
    "stock": 13,
    "minStock": 4,
    "barcode": "200000151",
    "image": "https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=400&q=80",
    "notes": "Ayollar atir, premium sifat"
  },
  {
    "id": "prd-152",
    "name": "Versace Fraiche",
    "brand": "Versace",
    "category": "Erkaklar",
    "prices": {
      "10 ml": 150000,
      "20 ml": 270000,
      "30 ml": 396000,
      "50 ml": 637500
    },
    "volume": "10 ml",
    "price": 150000,
    "costPrice": 108000,
    "stock": 14,
    "minStock": 4,
    "barcode": "200000152",
    "image": "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400&q=80",
    "notes": "Erkaklar atir, premium sifat"
  },
  {
    "id": "prd-153",
    "name": "Bal d’Afrique",
    "brand": "Byredo",
    "category": "Unisex",
    "prices": {
      "10 ml": 150000,
      "20 ml": 270000,
      "30 ml": 396000,
      "50 ml": 637500
    },
    "volume": "10 ml",
    "price": 150000,
    "costPrice": 108000,
    "stock": 15,
    "minStock": 4,
    "barcode": "200000153",
    "image": "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=400&q=80",
    "notes": "Unisex atir, premium sifat"
  },
  {
    "id": "prd-154",
    "name": "guerlain mon guerlain",
    "brand": "Byredo",
    "category": "Unisex",
    "prices": {
      "10 ml": 150000,
      "20 ml": 270000,
      "30 ml": 396000,
      "50 ml": 637500
    },
    "volume": "10 ml",
    "price": 150000,
    "costPrice": 108000,
    "stock": 16,
    "minStock": 4,
    "barcode": "200000154",
    "image": "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=400&q=80",
    "notes": "Unisex atir, premium sifat"
  },
  {
    "id": "prd-155",
    "name": "Halley Tiziana terenzi",
    "brand": "Initio",
    "category": "Unisex",
    "prices": {
      "10 ml": 210000,
      "20 ml": 378000,
      "30 ml": 554400,
      "50 ml": 892500
    },
    "volume": "10 ml",
    "price": 210000,
    "costPrice": 151200,
    "stock": 17,
    "minStock": 4,
    "barcode": "200000155",
    "image": "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400&q=80",
    "notes": "Unisex atir, premium sifat"
  },
  {
    "id": "prd-156",
    "name": "Pure Musc For Her Narciso Rodriguez",
    "brand": "Yves Saint Laurent",
    "category": "Erkaklar",
    "prices": {
      "10 ml": 150000,
      "20 ml": 270000,
      "30 ml": 396000,
      "50 ml": 637500
    },
    "volume": "10 ml",
    "price": 150000,
    "costPrice": 108000,
    "stock": 18,
    "minStock": 4,
    "barcode": "200000156",
    "image": "https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=400&q=80",
    "notes": "Erkaklar atir, premium sifat"
  },
  {
    "id": "prd-157",
    "name": "Milion Gold Elixir",
    "brand": "Paco Rabbane",
    "category": "Erkaklar",
    "prices": {
      "10 ml": 150000,
      "20 ml": 270000,
      "30 ml": 396000,
      "50 ml": 637500
    },
    "volume": "10 ml",
    "price": 150000,
    "costPrice": 108000,
    "stock": 19,
    "minStock": 4,
    "barcode": "200000157",
    "image": "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400&q=80",
    "notes": "Erkaklar atir, premium sifat"
  },
  {
    "id": "prd-158",
    "name": "Flora Gorgeous Gardenia Intense",
    "brand": "Gucci",
    "category": "Erkaklar",
    "prices": {
      "10 ml": 150000,
      "20 ml": 270000,
      "30 ml": 396000,
      "50 ml": 637500
    },
    "volume": "10 ml",
    "price": 150000,
    "costPrice": 108000,
    "stock": 20,
    "minStock": 4,
    "barcode": "200000158",
    "image": "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=400&q=80",
    "notes": "Erkaklar atir, premium sifat"
  },
  {
    "id": "prd-159",
    "name": "Flora Gorgeous Orchid",
    "brand": "Gucci",
    "category": "Ayollar",
    "prices": {
      "10 ml": 150000,
      "20 ml": 270000,
      "30 ml": 396000,
      "50 ml": 637500
    },
    "volume": "10 ml",
    "price": 150000,
    "costPrice": 108000,
    "stock": 21,
    "minStock": 4,
    "barcode": "200000159",
    "image": "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=400&q=80",
    "notes": "Ayollar atir, premium sifat"
  },
  {
    "id": "prd-160",
    "name": "Safran Musk",
    "brand": "Narciso Radriguez",
    "category": "Unisex",
    "prices": {
      "10 ml": 150000,
      "20 ml": 270000,
      "30 ml": 396000,
      "50 ml": 637500
    },
    "volume": "10 ml",
    "price": 150000,
    "costPrice": 108000,
    "stock": 22,
    "minStock": 4,
    "barcode": "200000160",
    "image": "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400&q=80",
    "notes": "Unisex atir, premium sifat"
  },
  {
    "id": "prd-161",
    "name": "Beast Love",
    "brand": "Montale",
    "category": "Unisex",
    "prices": {
      "10 ml": 150000,
      "20 ml": 270000,
      "30 ml": 396000,
      "50 ml": 637500
    },
    "volume": "10 ml",
    "price": 150000,
    "costPrice": 108000,
    "stock": 23,
    "minStock": 4,
    "barcode": "200000161",
    "image": "https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=400&q=80",
    "notes": "Unisex atir, premium sifat"
  },
  {
    "id": "prd-162",
    "name": "Bois Talisman",
    "brand": "Dior",
    "category": "Ayollar",
    "prices": {
      "10 ml": 150000,
      "20 ml": 270000,
      "30 ml": 396000,
      "50 ml": 637500
    },
    "volume": "10 ml",
    "price": 150000,
    "costPrice": 108000,
    "stock": 24,
    "minStock": 4,
    "barcode": "200000162",
    "image": "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400&q=80",
    "notes": "Ayollar atir, premium sifat"
  },
  {
    "id": "prd-163",
    "name": "Erba Pura",
    "brand": "Sospiro",
    "category": "Unisex",
    "prices": {
      "10 ml": 250000,
      "20 ml": 450000,
      "30 ml": 660000,
      "50 ml": 1062500
    },
    "volume": "10 ml",
    "price": 250000,
    "costPrice": 180000,
    "stock": 25,
    "minStock": 4,
    "barcode": "200000163",
    "image": "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=400&q=80",
    "notes": "Unisex atir, premium sifat"
  },
  {
    "id": "prd-164",
    "name": "Widian London",
    "brand": "Widian",
    "category": "Unisex",
    "prices": {
      "10 ml": 150000,
      "20 ml": 270000,
      "30 ml": 396000,
      "50 ml": 637500
    },
    "volume": "10 ml",
    "price": 150000,
    "costPrice": 108000,
    "stock": 26,
    "minStock": 4,
    "barcode": "200000164",
    "image": "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=400&q=80",
    "notes": "Unisex atir, premium sifat"
  },
  {
    "id": "prd-165",
    "name": "Spicebomb Viktor&Rolf",
    "brand": "Viktor&Rolf",
    "category": "Erkaklar",
    "prices": {
      "10 ml": 150000,
      "20 ml": 270000,
      "30 ml": 396000,
      "50 ml": 637500
    },
    "volume": "10 ml",
    "price": 150000,
    "costPrice": 108000,
    "stock": 12,
    "minStock": 4,
    "barcode": "200000165",
    "image": "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400&q=80",
    "notes": "Erkaklar atir, premium sifat"
  },
  {
    "id": "prd-166",
    "name": "Spicebomb Extreme Viktor&Rolf",
    "brand": "Viktor&Rolf",
    "category": "Erkaklar",
    "prices": {
      "10 ml": 150000,
      "20 ml": 270000,
      "30 ml": 396000,
      "50 ml": 637500
    },
    "volume": "10 ml",
    "price": 150000,
    "costPrice": 108000,
    "stock": 13,
    "minStock": 4,
    "barcode": "200000166",
    "image": "https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=400&q=80",
    "notes": "Erkaklar atir, premium sifat"
  },
  {
    "id": "prd-167",
    "name": "Hero Parfum Burberry",
    "brand": "Burberry",
    "category": "Erkaklar",
    "prices": {
      "10 ml": 150000,
      "20 ml": 270000,
      "30 ml": 396000,
      "50 ml": 637500
    },
    "volume": "10 ml",
    "price": 150000,
    "costPrice": 108000,
    "stock": 14,
    "minStock": 4,
    "barcode": "200000167",
    "image": "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400&q=80",
    "notes": "Erkaklar atir, premium sifat"
  },
  {
    "id": "prd-168",
    "name": "Guilty Elixir de Parfum pour Homme",
    "brand": "Gucci",
    "category": "Erkaklar",
    "prices": {
      "10 ml": 150000,
      "20 ml": 270000,
      "30 ml": 396000,
      "50 ml": 637500
    },
    "volume": "10 ml",
    "price": 150000,
    "costPrice": 108000,
    "stock": 15,
    "minStock": 4,
    "barcode": "200000168",
    "image": "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=400&q=80",
    "notes": "Erkaklar atir, premium sifat"
  },
  {
    "id": "prd-169",
    "name": "Pink Molecule 090.09",
    "brand": "Zarkoperfume",
    "category": "Unisex",
    "prices": {
      "10 ml": 150000,
      "20 ml": 270000,
      "30 ml": 396000,
      "50 ml": 637500
    },
    "volume": "10 ml",
    "price": 150000,
    "costPrice": 108000,
    "stock": 16,
    "minStock": 4,
    "barcode": "200000169",
    "image": "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=400&q=80",
    "notes": "Unisex atir, premium sifat"
  },
  {
    "id": "prd-170",
    "name": "Allure Homme Sport",
    "brand": "Chanel",
    "category": "Erkaklar",
    "prices": {
      "10 ml": 150000,
      "20 ml": 270000,
      "30 ml": 396000,
      "50 ml": 637500
    },
    "volume": "10 ml",
    "price": 150000,
    "costPrice": 108000,
    "stock": 17,
    "minStock": 4,
    "barcode": "200000170",
    "image": "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400&q=80",
    "notes": "Erkaklar atir, premium sifat"
  },
  {
    "id": "prd-171",
    "name": "Interlude Amouage",
    "brand": "Amouage",
    "category": "Erkaklar",
    "prices": {
      "10 ml": 200000,
      "20 ml": 360000,
      "30 ml": 528000,
      "50 ml": 850000
    },
    "volume": "10 ml",
    "price": 200000,
    "costPrice": 144000,
    "stock": 18,
    "minStock": 4,
    "barcode": "200000171",
    "image": "https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=400&q=80",
    "notes": "Erkaklar atir, premium sifat"
  },
  {
    "id": "prd-172",
    "name": "Legend",
    "brand": "Mont Blanc",
    "category": "Erkaklar",
    "prices": {
      "10 ml": 150000,
      "20 ml": 270000,
      "30 ml": 396000,
      "50 ml": 637500
    },
    "volume": "10 ml",
    "price": 150000,
    "costPrice": 108000,
    "stock": 19,
    "minStock": 4,
    "barcode": "200000172",
    "image": "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400&q=80",
    "notes": "Erkaklar atir, premium sifat"
  },
  {
    "id": "prd-173",
    "name": "Purpose",
    "brand": "Amouage",
    "category": "Unisex",
    "prices": {
      "10 ml": 200000,
      "20 ml": 360000,
      "30 ml": 528000,
      "50 ml": 850000
    },
    "volume": "10 ml",
    "price": 200000,
    "costPrice": 144000,
    "stock": 20,
    "minStock": 4,
    "barcode": "200000173",
    "image": "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=400&q=80",
    "notes": "Unisex atir, premium sifat"
  },
  {
    "id": "prd-174",
    "name": "Power Self",
    "brand": "Initio",
    "category": "Unisex",
    "prices": {
      "10 ml": 210000,
      "20 ml": 378000,
      "30 ml": 554400,
      "50 ml": 892500
    },
    "volume": "10 ml",
    "price": 210000,
    "costPrice": 151200,
    "stock": 21,
    "minStock": 4,
    "barcode": "200000174",
    "image": "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=400&q=80",
    "notes": "Unisex atir, premium sifat"
  },
  {
    "id": "prd-175",
    "name": "Forever Wanted Elixir",
    "brand": "Azzaro",
    "category": "Erkaklar",
    "prices": {
      "10 ml": 210000,
      "20 ml": 378000,
      "30 ml": 554400,
      "50 ml": 892500
    },
    "volume": "10 ml",
    "price": 210000,
    "costPrice": 151200,
    "stock": 22,
    "minStock": 4,
    "barcode": "200000175",
    "image": "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400&q=80",
    "notes": "Erkaklar atir, premium sifat"
  },
  {
    "id": "prd-176",
    "name": "Flora Gorgeous Gardenia Intense",
    "brand": "Gucci",
    "category": "Ayollar",
    "prices": {
      "10 ml": 150000,
      "20 ml": 270000,
      "30 ml": 396000,
      "50 ml": 637500
    },
    "volume": "10 ml",
    "price": 150000,
    "costPrice": 108000,
    "stock": 23,
    "minStock": 4,
    "barcode": "200000176",
    "image": "https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=400&q=80",
    "notes": "Ayollar atir, premium sifat"
  },
  {
    "id": "prd-177",
    "name": "Le Male Elixir Absolu",
    "brand": "Jean Paul Gaultier",
    "category": "Erkaklar",
    "prices": {
      "10 ml": 150000,
      "20 ml": 270000,
      "30 ml": 396000,
      "50 ml": 637500
    },
    "volume": "10 ml",
    "price": 150000,
    "costPrice": 108000,
    "stock": 24,
    "minStock": 4,
    "barcode": "200000177",
    "image": "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400&q=80",
    "notes": "Erkaklar atir, premium sifat"
  },
  {
    "id": "prd-178",
    "name": "Erba Pura",
    "brand": "Sospiro",
    "category": "Unisex",
    "prices": {
      "10 ml": 250000,
      "20 ml": 450000,
      "30 ml": 660000,
      "50 ml": 1062500
    },
    "volume": "10 ml",
    "price": 250000,
    "costPrice": 180000,
    "stock": 25,
    "minStock": 4,
    "barcode": "200000178",
    "image": "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=400&q=80",
    "notes": "Unisex atir, premium sifat"
  },
  {
    "id": "prd-179",
    "name": "Eclat",
    "brand": "Lanvin",
    "category": "Ayollar",
    "prices": {
      "10 ml": 150000,
      "20 ml": 270000,
      "30 ml": 396000,
      "50 ml": 637500
    },
    "volume": "10 ml",
    "price": 150000,
    "costPrice": 108000,
    "stock": 26,
    "minStock": 4,
    "barcode": "200000179",
    "image": "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=400&q=80",
    "notes": "Ayollar atir, premium sifat"
  },
  {
    "id": "prd-180",
    "name": "Fleur Narcotique",
    "brand": "Ex Nihilo",
    "category": "Unisex",
    "prices": {
      "10 ml": 150000,
      "20 ml": 270000,
      "30 ml": 396000,
      "50 ml": 637500
    },
    "volume": "10 ml",
    "price": 150000,
    "costPrice": 108000,
    "stock": 12,
    "minStock": 4,
    "barcode": "200000180",
    "image": "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400&q=80",
    "notes": "Unisex atir, premium sifat"
  },
  {
    "id": "prd-181",
    "name": "Lacoste Sport",
    "brand": "Lacoste",
    "category": "Erkaklar",
    "prices": {
      "10 ml": 150000,
      "20 ml": 270000,
      "30 ml": 396000,
      "50 ml": 637500
    },
    "volume": "10 ml",
    "price": 150000,
    "costPrice": 108000,
    "stock": 13,
    "minStock": 4,
    "barcode": "200000181",
    "image": "https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=400&q=80",
    "notes": "Erkaklar atir, premium sifat"
  },
  {
    "id": "prd-182",
    "name": "Lacoste Femme",
    "brand": "Lacoste",
    "category": "Ayollar",
    "prices": {
      "10 ml": 150000,
      "20 ml": 270000,
      "30 ml": 396000,
      "50 ml": 637500
    },
    "volume": "10 ml",
    "price": 150000,
    "costPrice": 108000,
    "stock": 14,
    "minStock": 4,
    "barcode": "200000182",
    "image": "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400&q=80",
    "notes": "Ayollar atir, premium sifat"
  },
  {
    "id": "prd-183",
    "name": "Lacoste White",
    "brand": "Lacoste",
    "category": "Erkaklar",
    "prices": {
      "10 ml": 150000,
      "20 ml": 270000,
      "30 ml": 396000,
      "50 ml": 637500
    },
    "volume": "10 ml",
    "price": 150000,
    "costPrice": 108000,
    "stock": 15,
    "minStock": 4,
    "barcode": "200000183",
    "image": "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=400&q=80",
    "notes": "Erkaklar atir, premium sifat"
  },
  {
    "id": "prd-184",
    "name": "Spiky Muse",
    "brand": "Ex Nihilo",
    "category": "Unisex",
    "prices": {
      "10 ml": 250000,
      "20 ml": 450000,
      "30 ml": 660000,
      "50 ml": 1062500
    },
    "volume": "10 ml",
    "price": 250000,
    "costPrice": 180000,
    "stock": 16,
    "minStock": 4,
    "barcode": "200000184",
    "image": "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=400&q=80",
    "notes": "Unisex atir, premium sifat"
  },
  {
    "id": "prd-185",
    "name": "Castley",
    "brand": "PDM",
    "category": "Erkaklar",
    "prices": {
      "10 ml": 240000,
      "20 ml": 432000,
      "30 ml": 633600,
      "50 ml": 1020000
    },
    "volume": "10 ml",
    "price": 240000,
    "costPrice": 172800,
    "stock": 17,
    "minStock": 4,
    "barcode": "200000185",
    "image": "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400&q=80",
    "notes": "Erkaklar atir, premium sifat"
  },
  {
    "id": "prd-186",
    "name": "French Riviera",
    "brand": "MANCERA",
    "category": "Unisex",
    "prices": {
      "10 ml": 150000,
      "20 ml": 270000,
      "30 ml": 396000,
      "50 ml": 637500
    },
    "volume": "10 ml",
    "price": 150000,
    "costPrice": 108000,
    "stock": 18,
    "minStock": 4,
    "barcode": "200000186",
    "image": "https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=400&q=80",
    "notes": "Unisex atir, premium sifat"
  },
  {
    "id": "prd-187",
    "name": "Sauvage",
    "brand": "Dior",
    "category": "Erkaklar",
    "prices": {
      "10 ml": 150000,
      "20 ml": 270000,
      "30 ml": 396000,
      "50 ml": 637500
    },
    "volume": "10 ml",
    "price": 150000,
    "costPrice": 108000,
    "stock": 19,
    "minStock": 4,
    "barcode": "200000187",
    "image": "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400&q=80",
    "notes": "Erkaklar atir, premium sifat"
  },
  {
    "id": "prd-188",
    "name": "L'Impératrice",
    "brand": "Dolce&Gabbana",
    "category": "Ayollar",
    "prices": {
      "10 ml": 150000,
      "20 ml": 270000,
      "30 ml": 396000,
      "50 ml": 637500
    },
    "volume": "10 ml",
    "price": 150000,
    "costPrice": 108000,
    "stock": 20,
    "minStock": 4,
    "barcode": "200000188",
    "image": "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=400&q=80",
    "notes": "Ayollar atir, premium sifat"
  },
  {
    "id": "prd-189",
    "name": "Light Blue Woman",
    "brand": "Dolce&Gabbana",
    "category": "Ayollar",
    "prices": {
      "10 ml": 150000,
      "20 ml": 270000,
      "30 ml": 396000,
      "50 ml": 637500
    },
    "volume": "10 ml",
    "price": 150000,
    "costPrice": 108000,
    "stock": 21,
    "minStock": 4,
    "barcode": "200000189",
    "image": "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=400&q=80",
    "notes": "Ayollar atir, premium sifat"
  },
  {
    "id": "prd-190",
    "name": "Blue Seduction",
    "brand": "Antonio Banderas",
    "category": "Erkaklar",
    "prices": {
      "10 ml": 150000,
      "20 ml": 270000,
      "30 ml": 396000,
      "50 ml": 637500
    },
    "volume": "10 ml",
    "price": 150000,
    "costPrice": 108000,
    "stock": 22,
    "minStock": 4,
    "barcode": "200000190",
    "image": "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400&q=80",
    "notes": "Erkaklar atir, premium sifat"
  },
  {
    "id": "prd-191",
    "name": "Invictus",
    "brand": "Paco Rabbane",
    "category": "Erkaklar",
    "prices": {
      "10 ml": 150000,
      "20 ml": 270000,
      "30 ml": 396000,
      "50 ml": 637500
    },
    "volume": "10 ml",
    "price": 150000,
    "costPrice": 108000,
    "stock": 23,
    "minStock": 4,
    "barcode": "200000191",
    "image": "https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=400&q=80",
    "notes": "Erkaklar atir, premium sifat"
  },
  {
    "id": "prd-192",
    "name": "Euphoria Men",
    "brand": "Calvin Klein",
    "category": "Erkaklar",
    "prices": {
      "10 ml": 150000,
      "20 ml": 270000,
      "30 ml": 396000,
      "50 ml": 637500
    },
    "volume": "10 ml",
    "price": 150000,
    "costPrice": 108000,
    "stock": 24,
    "minStock": 4,
    "barcode": "200000192",
    "image": "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400&q=80",
    "notes": "Erkaklar atir, premium sifat"
  },
  {
    "id": "prd-193",
    "name": "CK One",
    "brand": "Calvin Klein",
    "category": "Unisex",
    "prices": {
      "10 ml": 150000,
      "20 ml": 270000,
      "30 ml": 396000,
      "50 ml": 637500
    },
    "volume": "10 ml",
    "price": 150000,
    "costPrice": 108000,
    "stock": 25,
    "minStock": 4,
    "barcode": "200000193",
    "image": "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=400&q=80",
    "notes": "Unisex atir, premium sifat"
  },
  {
    "id": "prd-194",
    "name": "Amber Wood",
    "brand": "Ajmal",
    "category": "Unisex",
    "prices": {
      "10 ml": 150000,
      "20 ml": 270000,
      "30 ml": 396000,
      "50 ml": 637500
    },
    "volume": "10 ml",
    "price": 150000,
    "costPrice": 108000,
    "stock": 26,
    "minStock": 4,
    "barcode": "200000194",
    "image": "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=400&q=80",
    "notes": "Unisex atir, premium sifat"
  },
  {
    "id": "prd-195",
    "name": "Il Podrino",
    "brand": "Sospiro",
    "category": "Unisex",
    "prices": {
      "10 ml": 250000,
      "20 ml": 450000,
      "30 ml": 660000,
      "50 ml": 1062500
    },
    "volume": "10 ml",
    "price": 250000,
    "costPrice": 180000,
    "stock": 12,
    "minStock": 4,
    "barcode": "200000195",
    "image": "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400&q=80",
    "notes": "Unisex atir, premium sifat"
  },
  {
    "id": "prd-196",
    "name": "Acqua di Gio",
    "brand": "Armani",
    "category": "Erkaklar",
    "prices": {
      "10 ml": 150000,
      "20 ml": 270000,
      "30 ml": 396000,
      "50 ml": 637500
    },
    "volume": "10 ml",
    "price": 150000,
    "costPrice": 108000,
    "stock": 13,
    "minStock": 4,
    "barcode": "200000196",
    "image": "https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=400&q=80",
    "notes": "Erkaklar atir, premium sifat"
  },
  {
    "id": "prd-197",
    "name": "K by D&G",
    "brand": "Dolce&Gabbana",
    "category": "Erkaklar",
    "prices": {
      "10 ml": 150000,
      "20 ml": 270000,
      "30 ml": 396000,
      "50 ml": 637500
    },
    "volume": "10 ml",
    "price": 150000,
    "costPrice": 108000,
    "stock": 14,
    "minStock": 4,
    "barcode": "200000197",
    "image": "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400&q=80",
    "notes": "Erkaklar atir, premium sifat"
  },
  {
    "id": "prd-198",
    "name": "Power Self",
    "brand": "Initio",
    "category": "Unisex",
    "prices": {
      "10 ml": 250000,
      "20 ml": 450000,
      "30 ml": 660000,
      "50 ml": 1062500
    },
    "volume": "10 ml",
    "price": 250000,
    "costPrice": 180000,
    "stock": 15,
    "minStock": 4,
    "barcode": "200000198",
    "image": "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=400&q=80",
    "notes": "Unisex atir, premium sifat"
  },
  {
    "id": "prd-199",
    "name": "Be Delicious",
    "brand": "DKNY",
    "category": "Ayollar",
    "prices": {
      "10 ml": 150000,
      "20 ml": 270000,
      "30 ml": 396000,
      "50 ml": 637500
    },
    "volume": "10 ml",
    "price": 150000,
    "costPrice": 108000,
    "stock": 16,
    "minStock": 4,
    "barcode": "200000199",
    "image": "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=400&q=80",
    "notes": "Ayollar atir, premium sifat"
  },
  {
    "id": "prd-200",
    "name": "Cool water",
    "brand": "Davidoff",
    "category": "Ayollar",
    "prices": {
      "10 ml": 150000,
      "20 ml": 270000,
      "30 ml": 396000,
      "50 ml": 637500
    },
    "volume": "10 ml",
    "price": 150000,
    "costPrice": 108000,
    "stock": 17,
    "minStock": 4,
    "barcode": "200000200",
    "image": "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400&q=80",
    "notes": "Ayollar atir, premium sifat"
  },
  {
    "id": "prd-201",
    "name": "H24",
    "brand": "Hermès",
    "category": "Erkaklar",
    "prices": {
      "10 ml": 150000,
      "20 ml": 270000,
      "30 ml": 396000,
      "50 ml": 637500
    },
    "volume": "10 ml",
    "price": 150000,
    "costPrice": 108000,
    "stock": 18,
    "minStock": 4,
    "barcode": "200000201",
    "image": "https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=400&q=80",
    "notes": "Erkaklar atir, premium sifat"
  },
  {
    "id": "prd-202",
    "name": "Aqva Pour Homme",
    "brand": "Bvlgari",
    "category": "Erkaklar",
    "prices": {
      "10 ml": 150000,
      "20 ml": 270000,
      "30 ml": 396000,
      "50 ml": 637500
    },
    "volume": "10 ml",
    "price": 150000,
    "costPrice": 108000,
    "stock": 19,
    "minStock": 4,
    "barcode": "200000202",
    "image": "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400&q=80",
    "notes": "Erkaklar atir, premium sifat"
  },
  {
    "id": "prd-203",
    "name": "Rouge Trafalgar Dior",
    "brand": "Dior",
    "category": "Erkaklar",
    "prices": {
      "10 ml": 240000,
      "20 ml": 432000,
      "30 ml": 633600,
      "50 ml": 1020000
    },
    "volume": "10 ml",
    "price": 240000,
    "costPrice": 172800,
    "stock": 20,
    "minStock": 4,
    "barcode": "200000203",
    "image": "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=400&q=80",
    "notes": "Erkaklar atir, premium sifat"
  },
  {
    "id": "prd-204",
    "name": "Coeur Battant",
    "brand": "Louis Vuitton",
    "category": "Erkaklar",
    "prices": {
      "10 ml": 210000,
      "20 ml": 378000,
      "30 ml": 554400,
      "50 ml": 892500
    },
    "volume": "10 ml",
    "price": 210000,
    "costPrice": 151200,
    "stock": 21,
    "minStock": 4,
    "barcode": "200000204",
    "image": "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=400&q=80",
    "notes": "Erkaklar atir, premium sifat"
  },
  {
    "id": "prd-205",
    "name": "Coeur Battant",
    "brand": "Louis Vuitton",
    "category": "Erkaklar",
    "prices": {
      "10 ml": 210000,
      "20 ml": 378000,
      "30 ml": 554400,
      "50 ml": 892500
    },
    "volume": "10 ml",
    "price": 210000,
    "costPrice": 151200,
    "stock": 22,
    "minStock": 4,
    "barcode": "200000205",
    "image": "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400&q=80",
    "notes": "Erkaklar atir, premium sifat"
  },
  {
    "id": "prd-206",
    "name": "Les Sables Roses",
    "brand": "Louis Vuitton",
    "category": "Unisex",
    "prices": {
      "10 ml": 240000,
      "20 ml": 432000,
      "30 ml": 633600,
      "50 ml": 1020000
    },
    "volume": "10 ml",
    "price": 240000,
    "costPrice": 172800,
    "stock": 23,
    "minStock": 4,
    "barcode": "200000206",
    "image": "https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=400&q=80",
    "notes": "Unisex atir, premium sifat"
  },
  {
    "id": "prd-207",
    "name": "Shaik No 77",
    "brand": "Shaik",
    "category": "Erkaklar",
    "prices": {
      "10 ml": 150000,
      "20 ml": 270000,
      "30 ml": 396000,
      "50 ml": 637500
    },
    "volume": "10 ml",
    "price": 150000,
    "costPrice": 108000,
    "stock": 24,
    "minStock": 4,
    "barcode": "200000207",
    "image": "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400&q=80",
    "notes": "Erkaklar atir, premium sifat"
  },
  {
    "id": "prd-208",
    "name": "Paragon",
    "brand": "Initio Parfums Prives",
    "category": "Unisex",
    "prices": {
      "10 ml": 240000,
      "20 ml": 432000,
      "30 ml": 633600,
      "50 ml": 1020000
    },
    "volume": "10 ml",
    "price": 240000,
    "costPrice": 172800,
    "stock": 25,
    "minStock": 4,
    "barcode": "200000208",
    "image": "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=400&q=80",
    "notes": "Unisex atir, premium sifat"
  },
  {
    "id": "prd-209",
    "name": "Tony Iommi Monkey",
    "brand": "Xerjoff",
    "category": "Unisex",
    "prices": {
      "10 ml": 150000,
      "20 ml": 270000,
      "30 ml": 396000,
      "50 ml": 637500
    },
    "volume": "10 ml",
    "price": 150000,
    "costPrice": 108000,
    "stock": 26,
    "minStock": 4,
    "barcode": "200000209",
    "image": "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=400&q=80",
    "notes": "Unisex atir, premium sifat"
  },
  {
    "id": "prd-210",
    "name": "Italian Leather",
    "brand": "Memo Paris",
    "category": "Unisex",
    "prices": {
      "10 ml": 150000,
      "20 ml": 270000,
      "30 ml": 396000,
      "50 ml": 637500
    },
    "volume": "10 ml",
    "price": 150000,
    "costPrice": 108000,
    "stock": 12,
    "minStock": 4,
    "barcode": "200000210",
    "image": "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400&q=80",
    "notes": "Unisex atir, premium sifat"
  },
  {
    "id": "prd-211",
    "name": "1 million",
    "brand": "Paco Rabbane",
    "category": "Erkaklar",
    "prices": {
      "10 ml": 150000,
      "20 ml": 270000,
      "30 ml": 396000,
      "50 ml": 637500
    },
    "volume": "10 ml",
    "price": 150000,
    "costPrice": 108000,
    "stock": 13,
    "minStock": 4,
    "barcode": "200000211",
    "image": "https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=400&q=80",
    "notes": "Erkaklar atir, premium sifat"
  },
  {
    "id": "prd-212",
    "name": "Lady million",
    "brand": "Paco Rabbane",
    "category": "Ayollar",
    "prices": {
      "10 ml": 150000,
      "20 ml": 270000,
      "30 ml": 396000,
      "50 ml": 637500
    },
    "volume": "10 ml",
    "price": 150000,
    "costPrice": 108000,
    "stock": 14,
    "minStock": 4,
    "barcode": "200000212",
    "image": "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400&q=80",
    "notes": "Ayollar atir, premium sifat"
  }
];

export const INITIAL_STAFF = [
  {
    id: 'emp-1',
    name: 'Sardor Alimov',
    role: 'Direktor',
    phone: '+998 90 999 11 00',
    baseSalary: 12000000,
    bonusRate: 0,
    paidThisMonth: 12000000,
    status: 'To\'langan'
  },
  {
    id: 'emp-2',
    name: 'Malika Rustamova',
    role: 'Bosh Buxgalter',
    phone: '+998 93 456 78 90',
    baseSalary: 7500000,
    bonusRate: 0,
    paidThisMonth: 7500000,
    status: 'To\'langan'
  },
  {
    id: 'emp-3',
    name: 'Bobur Rahimov',
    role: 'Sklad Mudiri',
    phone: '+998 94 333 22 11',
    baseSalary: 5500000,
    bonusRate: 0,
    paidThisMonth: 3000000,
    status: 'Qisman to\'langan'
  },
  {
    id: 'emp-4',
    name: 'Jasur Qodirov',
    role: 'Katta Sotuvchi',
    phone: '+998 99 888 77 66',
    baseSalary: 4000000,
    bonusRate: 2,
    paidThisMonth: 2000000,
    status: 'Qisman to\'langan'
  },
  {
    id: 'emp-5',
    name: 'Nilufar Karimova',
    role: 'Sotuvchi-Kassir',
    phone: '+998 91 222 33 44',
    baseSalary: 3500000,
    bonusRate: 2,
    paidThisMonth: 0,
    status: 'Kutilmoqda'
  }
];

export const INITIAL_DEBTS = [
  {
    id: 'dbt-1',
    customerName: 'Dilshod Ergashev',
    phone: '+998 90 123 45 67',
    productSummary: 'Creed Aventus (50 ml)',
    totalAmount: 892500,
    paidAmount: 400000,
    remainingAmount: 492500,
    dueDate: '2026-10-25',
    createdAt: '2026-10-02',
    status: 'Faol'
  },
  {
    id: 'dbt-2',
    customerName: 'Shaxzoda Usmanova',
    phone: '+998 97 765 43 21',
    productSummary: 'Imagination Louis Vuitton (30 ml)',
    totalAmount: 633600,
    paidAmount: 300000,
    remainingAmount: 333600,
    dueDate: '2026-10-18',
    createdAt: '2026-10-04',
    status: 'Muddati yaqin'
  }
];

export const INITIAL_SALES = [
  {
    id: 'SL-1092',
    date: '2026-10-08 18:30',
    cashierName: 'Jasur Qodirov',
    items: [
      { id: 'prd-1', name: 'Aventus (Creed)', volume: '20 ml', quantity: 1, price: 378000 }
    ],
    total: 378000,
    paymentMethod: 'Naqd',
    status: 'Yakunlangan'
  },
  {
    id: 'SL-1091',
    date: '2026-10-08 16:15',
    cashierName: 'Nilufar Karimova',
    items: [
      { id: 'prd-11', name: 'Imagination (Louis Vuitton)', volume: '30 ml', quantity: 1, price: 633600 },
      { id: 'prd-2', name: 'Absolu Aventus (Creed)', volume: '10 ml', quantity: 1, price: 210000 }
    ],
    total: 843600,
    paymentMethod: 'Karta',
    status: 'Yakunlangan'
  }
];

export const INITIAL_EXPENSES = [
  { id: 'exp-1', title: 'Do\'kon ijarasi (Oktyabr)', amount: 15000000, category: 'Ijara', date: '2026-10-01' },
  { id: 'exp-2', title: 'Instagram reklama', amount: 3500000, category: 'Marketing', date: '2026-10-03' },
  { id: 'exp-3', title: 'Flakon va atomayzerlar xaridi', amount: 2800000, category: 'Qadoqlash', date: '2026-10-05' }
];

export const INITIAL_BALANCES = {
  cash: 18450000,
  card: 34200000,
  bank: 86500000
};
