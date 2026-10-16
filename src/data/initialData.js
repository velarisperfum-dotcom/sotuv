import { STORE_INDUSTRIES } from './industriesData';

export const STORE_MODES = STORE_INDUSTRIES;
export { STORE_INDUSTRIES };

export const MEASURE_UNITS = [
  { id: 'dona', label: 'Dona' },
  { id: 'juft', label: 'Juft' },
  { id: 'kg', label: 'Kilogramm (kg)' },
  { id: 'litr', label: 'Litr (l)' },
  { id: 'metr', label: 'Metr (m)' },
  { id: 'pachka', label: 'Pachka' },
  { id: 'quti', label: 'Quti' },
  { id: 'to\'plam', label: 'To\'plam / Komplekt' }
];

export const PAYMENT_METHODS = [
  { id: 'cash', name: 'Naqd pul', icon: 'Banknote', color: '#16a34a', badge: 'Naqd' },
  { id: 'card', name: 'Plastik karta', icon: 'CreditCard', color: '#2563eb', badge: 'Karta' },
  { id: 'debt', name: 'Qarzga (Nasiya)', icon: 'Clock', color: '#d97706', badge: 'Qarzga' },
  { id: 'bank', name: 'Bank o\'tkazmasi (Perechisleniye)', icon: 'Building2', color: '#7c3aed', badge: 'Bank perech' },
  { id: 'salary_deduction', name: 'Oyligidan oldi (Xodim maoshidan)', icon: 'UserCheck', color: '#db2777', badge: 'Oyligidan' }
];

// Haqiqiy xodimlar va foydalanuvchilar (Direktor boshqaruvida o'zgartiriladi)
export const SYSTEM_USERS = [
  {
    id: 'user-dir',
    username: 'direktor',
    password: '123',
    role: 'director',
    name: 'Sardor Alimov',
    position: 'Bosh Direktor',
    phone: '+998 90 999 11 00',
    baseSalary: 12000000,
    badge: 'Direktor Kabineti',
    color: '#2563eb'
  },
  {
    id: 'user-acc',
    username: 'buxgalter',
    password: '123',
    role: 'accountant',
    name: 'Malika Rustamova',
    position: 'Bosh Buxgalter',
    phone: '+998 93 456 78 90',
    baseSalary: 7500000,
    badge: 'Buxgalteriya',
    color: '#16a34a'
  },
  {
    id: 'user-wh',
    username: 'sklad',
    password: '123',
    role: 'warehouse',
    name: 'Bobur Rahimov',
    position: 'Sklad Mudiri',
    phone: '+998 94 333 22 11',
    baseSalary: 5500000,
    badge: 'Sklad',
    color: '#0284c7'
  },
  {
    id: 'user-sel',
    username: 'sotuvchi',
    password: '123',
    role: 'seller_mobile',
    name: 'Jasur Qodirov',
    position: 'Sotuvchi-Agent',
    phone: '+998 99 888 77 66',
    baseSalary: 4000000,
    badge: 'Sotuvchi (APK)',
    color: '#4f46e5'
  }
];

export const INITIAL_STAFF = SYSTEM_USERS.map(u => ({
  id: u.id,
  name: u.name,
  role: u.position,
  username: u.username,
  phone: u.phone,
  baseSalary: u.baseSalary,
  paidThisMonth: 0,
  status: 'Faol'
}));

// Hamma mock datalar 0 qilingan toza baza:
export const INITIAL_CUSTOMERS = [];
export const INITIAL_PRODUCTS = [];
export const INITIAL_STOCK_TRANSFERS = [];
export const INITIAL_SELLER_ORDERS = [];
export const INITIAL_DEBTS = [];
export const INITIAL_SALES = [];
export const INITIAL_EXPENSES = [];
export const INITIAL_BALANCES = {
  cash: 0,
  card: 0,
  bank: 0
};
