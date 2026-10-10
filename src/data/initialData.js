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

export const INITIAL_DEBTS = [];
export const INITIAL_SALES = [];
export const INITIAL_EXPENSES = [];
export const INITIAL_BALANCES = {
  cash: 0,
  card: 0,
  bank: 0
};

