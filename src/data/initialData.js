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
