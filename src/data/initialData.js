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

export const HIERARCHY_ROLES = [
  { id: 'res_manager', label: 'Res. Menejeri', rank: 1, color: '#7c3aed', badgeBg: '#f3e8ff', badgeColor: '#6d28d9', desc: 'Respublika bo\'yicha bosh menejer' },
  { id: 'manager', label: 'Menejer', rank: 2, color: '#2563eb', badgeBg: '#eff6ff', badgeColor: '#1d4ed8', desc: 'Hududiy / Shaxobcha menejeri' },
  { id: 'senior', label: 'Starshi', rank: 3, color: '#0d9488', badgeBg: '#ccfbf1', badgeColor: '#0f766e', desc: 'Katta mutaxassis / Starshiy' },
  { id: 'med_rep', label: 'Med. pres (Med. presta)', rank: 4, color: '#d97706', badgeBg: '#fef3c7', badgeColor: '#b45309', desc: 'Tibbiyot vakili / Medpredstavitel' },
  { id: 'director', label: 'Bosh Direktor', rank: 0, color: '#1e293b', badgeBg: '#f1f5f9', badgeColor: '#0f172a', desc: 'Umumiy rahbar' },
  { id: 'accountant', label: 'Bosh Buxgalter', rank: 0, color: '#16a34a', badgeBg: '#dcfce7', badgeColor: '#15803d', desc: 'Bosh hisobchi' },
  { id: 'warehouse', label: 'Sklad Mudiri', rank: 0, color: '#0284c7', badgeBg: '#e0f2fe', badgeColor: '#0369a1', desc: 'Ombor mudiri' },
];

// Haqiqiy xodimlar va foydalanuvchilar (Direktor boshqaruvida o'zgartiriladi)
export const SYSTEM_USERS = [
  {
    id: 'user-dir',
    username: 'direktor',
    password: '123',
    role: 'director',
    hierarchyRole: 'director',
    name: 'Sardor Alimov',
    position: 'Bosh Direktor',
    phone: '+998 90 999 11 00',
    baseSalary: 12000000,
    bonusRate: 0,
    managerId: null,
    badge: 'Direktor Kabineti',
    color: '#2563eb'
  },
  {
    id: 'user-acc',
    username: 'buxgalter',
    password: '123',
    role: 'accountant',
    hierarchyRole: 'accountant',
    name: 'Malika Rustamova',
    position: 'Bosh Buxgalter',
    phone: '+998 93 456 78 90',
    baseSalary: 7500000,
    bonusRate: 0,
    managerId: 'user-dir',
    badge: 'Buxgalteriya',
    color: '#16a34a'
  },
  {
    id: 'user-wh',
    username: 'sklad',
    password: '123',
    role: 'warehouse',
    hierarchyRole: 'warehouse',
    name: 'Bobur Rahimov',
    position: 'Sklad Mudiri',
    phone: '+998 94 333 22 11',
    baseSalary: 5500000,
    bonusRate: 0,
    managerId: 'user-dir',
    badge: 'Sklad',
    color: '#0284c7'
  },
  // ==========================================
  // XODIMLAR IERARXIYASI (RASM BO'YICHA):
  // Res. Menejeri -> Menejer -> Starshi -> Med. pres
  // ==========================================
  {
    id: 'staff-res',
    username: 'res_menejer',
    password: '123',
    role: 'seller_mobile',
    hierarchyRole: 'res_manager',
    name: 'Sanjar Olimov',
    position: 'Res. Menejeri',
    phone: '+998 97 123 45 67',
    baseSalary: 10000000,
    bonusRate: 3,
    managerId: 'user-dir',
    badge: 'Res. Menejeri',
    color: '#7c3aed'
  },
  {
    id: 'staff-mgr-1',
    username: 'menejer1',
    password: '123',
    role: 'seller_mobile',
    hierarchyRole: 'manager',
    name: 'Farhod Tohirov',
    position: 'Menejer (Markaz & Toshkent)',
    phone: '+998 90 234 56 78',
    baseSalary: 7000000,
    bonusRate: 2.5,
    managerId: 'staff-res',
    badge: 'Menejer',
    color: '#2563eb'
  },
  {
    id: 'staff-mgr-2',
    username: 'menejer2',
    password: '123',
    role: 'seller_mobile',
    hierarchyRole: 'manager',
    name: 'Bekzod Umarov',
    position: 'Menejer (Viloyatlar)',
    phone: '+998 91 345 67 89',
    baseSalary: 7000000,
    bonusRate: 2.5,
    managerId: 'staff-res',
    badge: 'Menejer',
    color: '#2563eb'
  },
  {
    id: 'staff-str-1',
    username: 'starshi1',
    password: '123',
    role: 'seller_mobile',
    hierarchyRole: 'senior',
    name: 'Dilmurod Karimov',
    position: 'Starshi (Chilonzor & Yunusobod)',
    phone: '+998 93 456 78 91',
    baseSalary: 5500000,
    bonusRate: 2,
    managerId: 'staff-mgr-1',
    badge: 'Starshi',
    color: '#0d9488'
  },
  {
    id: 'staff-str-2',
    username: 'starshi2',
    password: '123',
    role: 'seller_mobile',
    hierarchyRole: 'senior',
    name: 'Zafar Salimov',
    position: 'Starshi (Mirzo Ulug\'bek & Sergeli)',
    phone: '+998 94 567 89 01',
    baseSalary: 5500000,
    bonusRate: 2,
    managerId: 'staff-mgr-1',
    badge: 'Starshi',
    color: '#0d9488'
  },
  {
    id: 'user-sel',
    username: 'sotuvchi',
    password: '123',
    role: 'seller_mobile',
    hierarchyRole: 'med_rep',
    name: 'Jasur Qodirov',
    position: 'Med. pres (Med. presta)',
    phone: '+998 99 888 77 66',
    baseSalary: 4000000,
    bonusRate: 2,
    managerId: 'staff-str-1',
    badge: 'Med. pres',
    color: '#d97706'
  },
  {
    id: 'staff-med-2',
    username: 'medpres2',
    password: '123',
    role: 'seller_mobile',
    hierarchyRole: 'med_rep',
    name: 'Nigora Yusupova',
    position: 'Med. pres (Med. presta)',
    phone: '+998 90 678 90 12',
    baseSalary: 4000000,
    bonusRate: 2,
    managerId: 'staff-str-1',
    badge: 'Med. pres',
    color: '#d97706'
  },
  {
    id: 'staff-med-3',
    username: 'medpres3',
    password: '123',
    role: 'seller_mobile',
    hierarchyRole: 'med_rep',
    name: 'Kamron Ergashev',
    position: 'Med. pres (Med. presta)',
    phone: '+998 98 789 01 23',
    baseSalary: 4000000,
    bonusRate: 2,
    managerId: 'staff-str-1',
    badge: 'Med. pres',
    color: '#d97706'
  }
];

export const INITIAL_STAFF = SYSTEM_USERS.map(u => ({
  id: u.id,
  name: u.name,
  role: u.position,
  hierarchyRole: u.hierarchyRole || 'med_rep',
  managerId: u.managerId || null,
  username: u.username,
  password: u.password || '123',
  phone: u.phone,
  baseSalary: u.baseSalary || 4000000,
  bonusRate: u.bonusRate ?? 2,
  paidThisMonth: 0,
  directorApproved: true,
  status: 'Faol',
  paymentHistory: []
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
