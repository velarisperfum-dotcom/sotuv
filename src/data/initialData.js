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

export const INITIAL_PRODUCTS = [];

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

export const PAYMENT_METHODS = [
  { id: 'cash', name: 'Naqd pul', icon: 'Banknote', color: '#10b981', badge: '💵 Naqd' },
  { id: 'card', name: 'Plastik karta', icon: 'CreditCard', color: '#3b82f6', badge: '💳 Karta' },
  { id: 'debt', name: 'Qarzga (Nasiya)', icon: 'Clock', color: '#f59e0b', badge: '📝 Qarzga' },
  { id: 'bank', name: 'Bank o\'tkazmasi (Perech)', icon: 'Building2', color: '#8b5cf6', badge: '🏦 Bank perech' },
  { id: 'salary_deduction', name: 'Oyligidan oldi (Xodim)', icon: 'UserCheck', color: '#ec4899', badge: '💼 Oyligidan' }
];

export const INITIAL_STOCK_TRANSFERS = [
  {
    id: 'trf-101',
    transferNumber: 'KRM-00101',
    productName: "Zara Slim Fit Klassik Ko'ylak",
    category: "Ko'ylaklar",
    quantity: 20,
    unit: 'dona',
    costPrice: 210000,
    price: 320000,
    supplier: 'Turkiya Tekstil MCHJ',
    notes: 'Direktor tomonidan skladga partiya yuborildi',
    createdAt: new Date(Date.now() - 3600000 * 5).toLocaleString('uz-UZ'),
    createdBy: 'Direktor (Sardor Alimov)',
    status: 'pending_warehouse' // Skladchi qabul qilishi kutilmoqda
  },
  {
    id: 'trf-100',
    transferNumber: 'KRM-00100',
    productName: "Levi's 501 Original Jinsi Shim",
    category: "Shim & Jinsi",
    quantity: 15,
    unit: 'dona',
    costPrice: 390000,
    price: 580000,
    supplier: 'Denim Global Import',
    notes: 'Yangi fasl kirimi',
    createdAt: new Date(Date.now() - 3600000 * 24).toLocaleString('uz-UZ'),
    createdBy: 'Direktor (Sardor Alimov)',
    status: 'received', // Skladchi qabul qilib bo'lgan
    receivedAt: new Date(Date.now() - 3600000 * 20).toLocaleString('uz-UZ'),
    receivedBy: 'Bobur Rahimov (Sklad Mudiri)'
  }
];

export const INITIAL_SELLER_ORDERS = [
  {
    id: 'ZAY-2001',
    orderNumber: 'ZY-2001',
    sellerId: 'emp-4',
    sellerName: 'Jasur Qodirov',
    sellerPhone: '+998 99 888 77 66',
    customerName: 'Dilshod Ergashev',
    customerPhone: '+998 90 123 45 67',
    paymentMethod: 'bank', // Bank prislaniya
    paymentDetails: 'Bank orqali to\'lov topshirig\'i (№4481)',
    totalAmount: 960000,
    items: [
      { id: 'prd-clt-1', name: "Zara Slim Fit Klassik Ko'ylak", price: 320000, quantity: 3, unit: 'dona', total: 960000 }
    ],
    status: 'pending_accounting', // 1-bosqich: Buxgalter tekshiruvida
    createdAt: new Date(Date.now() - 3600000 * 2).toLocaleString('uz-UZ')
  },
  {
    id: 'ZAY-2002',
    orderNumber: 'ZY-2002',
    sellerId: 'emp-5',
    sellerName: 'Nilufar Karimova',
    sellerPhone: '+998 91 222 33 44',
    customerName: 'Shaxzoda Usmanova',
    customerPhone: '+998 97 765 43 21',
    paymentMethod: 'card', // Karta
    paymentDetails: 'Terminal orqali to\'liq to\'landi',
    totalAmount: 1160000,
    items: [
      { id: 'prd-clt-2', name: "Levi's 501 Original Jinsi Shim", price: 580000, quantity: 2, unit: 'dona', total: 1160000 }
    ],
    status: 'approved_accounting', // 2-bosqich: Buxgalter tasdiqlagan, Skladchida otgruzka kutilmoqda!
    createdAt: new Date(Date.now() - 3600000 * 4).toLocaleString('uz-UZ'),
    accountingApprovedAt: new Date(Date.now() - 3600000 * 3).toLocaleString('uz-UZ')
  },
  {
    id: 'ZAY-2003',
    orderNumber: 'ZY-2003',
    sellerId: 'emp-4',
    sellerName: 'Jasur Qodirov',
    sellerPhone: '+998 99 888 77 66',
    customerName: 'Akmal Zokirov',
    customerPhone: '+998 99 876 54 32',
    paymentMethod: 'debt', // Qarzga / Nasiya
    paymentDetails: '15 kunga nasiyaga berildi, buxgalter tasdiqlagan',
    totalAmount: 640000,
    items: [
      { id: 'prd-clt-1', name: "Zara Slim Fit Klassik Ko'ylak", price: 320000, quantity: 2, unit: 'dona', total: 640000 }
    ],
    status: 'dispatched_warehouse', // 3-bosqich: Skladchi tovarlarni bergan va skladdan yechilgan!
    createdAt: new Date(Date.now() - 3600000 * 10).toLocaleString('uz-UZ'),
    accountingApprovedAt: new Date(Date.now() - 3600000 * 9).toLocaleString('uz-UZ'),
    dispatchedAt: new Date(Date.now() - 3600000 * 8).toLocaleString('uz-UZ')
  }
];

export const INITIAL_DEBTS = [];
export const INITIAL_SALES = [];
export const INITIAL_EXPENSES = [];
export const INITIAL_BALANCES = {
  cash: 12500000,
  card: 8400000,
  bank: 34500000
};

