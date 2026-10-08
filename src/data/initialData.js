// Boshlang'ich namunaviy ma'lumotlar (Atir & Parfyumeriya savdo platformasi)

export const INITIAL_PRODUCTS = [
  {
    id: 'prd-1',
    name: 'Creed Aventus',
    brand: 'Creed',
    category: 'Erkaklar',
    volume: '100 ml',
    concentration: 'EDP',
    sku: 'CRD-AV-100',
    barcode: '3508441104617',
    costPrice: 2600000,
    price: 3450000,
    stock: 14,
    minStock: 4,
    image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400&q=80',
    notes: 'Qora smorodina, bergamot, eman moxi, pachuli'
  },
  {
    id: 'prd-2',
    name: 'Baccarat Rouge 540',
    brand: 'Maison Francis Kurkdjian',
    category: 'Unisex',
    volume: '70 ml',
    concentration: 'Extrait',
    sku: 'MFK-BR540-70',
    barcode: '3700559600021',
    costPrice: 3200000,
    price: 4300000,
    stock: 8,
    minStock: 3,
    image: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=400&q=80',
    notes: 'Za’faron, yasmin, amberwood, archa qatroni'
  },
  {
    id: 'prd-3',
    name: 'Lost Cherry',
    brand: 'Tom Ford',
    category: 'Unisex',
    volume: '50 ml',
    concentration: 'EDP',
    sku: 'TF-LC-50',
    barcode: '888066089273',
    costPrice: 2850000,
    price: 3900000,
    stock: 6,
    minStock: 3,
    image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400&q=80',
    notes: 'Qora olcha, achchiq bodom, tonka loviyasi, vanil'
  },
  {
    id: 'prd-4',
    name: 'Coco Mademoiselle',
    brand: 'Chanel',
    category: 'Ayollar',
    volume: '100 ml',
    concentration: 'EDP',
    sku: 'CH-CM-100',
    barcode: '3145891165203',
    costPrice: 1600000,
    price: 2200000,
    stock: 18,
    minStock: 5,
    image: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=400&q=80',
    notes: 'Apelsin, mandarin, turk atirgul, oq mushk'
  },
  {
    id: 'prd-5',
    name: 'Sauvage Elixir',
    brand: 'Dior',
    category: 'Erkaklar',
    volume: '60 ml',
    concentration: 'Parfum',
    sku: 'CD-SE-60',
    barcode: '3348901567572',
    costPrice: 1750000,
    price: 2350000,
    stock: 22,
    minStock: 5,
    image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=400&q=80',
    notes: 'Kardamon, dolchin, muskat, lavanda, sandallik'
  },
  {
    id: 'prd-6',
    name: "Bal d'Afrique",
    brand: 'Byredo',
    category: 'Unisex',
    volume: '100 ml',
    concentration: 'EDP',
    sku: 'BYR-BDA-100',
    barcode: '7340032806038',
    costPrice: 2150000,
    price: 2950000,
    stock: 5,
    minStock: 3,
    image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400&q=80',
    notes: 'Qora smorodina, afrika tog\' guli, vetiver, sadr'
  },
  {
    id: 'prd-7',
    name: 'Erba Pura',
    brand: 'Xerjoff',
    category: 'Unisex',
    volume: '100 ml',
    concentration: 'EDP',
    sku: 'XER-EP-100',
    barcode: '8033488155148',
    costPrice: 2000000,
    price: 2790000,
    stock: 7,
    minStock: 3,
    image: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=400&q=80',
    notes: 'Sitsiliya apelsini, limon, kalabriya bergamoti, mushk'
  },
  {
    id: 'prd-8',
    name: 'Libre Intense',
    brand: 'Yves Saint Laurent',
    category: 'Ayollar',
    volume: '90 ml',
    concentration: 'EDP',
    sku: 'YSL-LIB-90',
    barcode: '3614273069557',
    costPrice: 1450000,
    price: 2050000,
    stock: 12,
    minStock: 4,
    image: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=400&q=80',
    notes: 'Lavanda, mandarin, orxideya, vanil, ambra'
  },
  {
    id: 'prd-9',
    name: 'Angels\' Share',
    brand: 'Kilian Paris',
    category: 'Unisex',
    volume: '50 ml',
    concentration: 'EDP',
    sku: 'KIL-AS-50',
    barcode: '3700550000000',
    costPrice: 2450000,
    price: 3400000,
    stock: 3,
    minStock: 4,
    image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400&q=80',
    notes: 'Konyak, dolchin, eman daraxti, tonka loviyasi, praline'
  },
  {
    id: 'prd-10',
    name: 'Delina',
    brand: 'Parfums de Marly',
    category: 'Ayollar',
    volume: '75 ml',
    concentration: 'EDP',
    sku: 'PDM-DEL-75',
    barcode: '3700578521008',
    costPrice: 2400000,
    price: 3250000,
    stock: 4,
    minStock: 3,
    image: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=400&q=80',
    notes: 'Rovoch, lichi, turk atirguli, piyon, vanil, mushk'
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
    bonusRate: 2, // 2% savdodan
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
    productSummary: 'Baccarat Rouge 540 (70ml)',
    totalAmount: 4300000,
    paidAmount: 1800000,
    remainingAmount: 2500000,
    dueDate: '2026-10-25',
    createdAt: '2026-10-02',
    status: 'Faol'
  },
  {
    id: 'dbt-2',
    customerName: 'Shaxzoda Usmanova',
    phone: '+998 97 765 43 21',
    productSummary: 'Lost Cherry (50ml)',
    totalAmount: 3900000,
    paidAmount: 2000000,
    remainingAmount: 1900000,
    dueDate: '2026-10-18',
    createdAt: '2026-10-04',
    status: 'Muddati yaqin'
  },
  {
    id: 'dbt-3',
    customerName: 'Grand Elita MCHJ',
    phone: '+998 71 200 11 22',
    productSummary: 'Korporativ sovg\'alar (4 dona Creed Aventus)',
    totalAmount: 13800000,
    paidAmount: 8800000,
    remainingAmount: 5000000,
    dueDate: '2026-11-01',
    createdAt: '2026-09-28',
    status: 'Faol'
  }
];

export const INITIAL_SALES = [
  {
    id: 'SL-1092',
    date: '2026-10-08 18:30',
    cashierName: 'Jasur Qodirov',
    items: [
      { id: 'prd-1', name: 'Creed Aventus', quantity: 1, price: 3450000 }
    ],
    total: 3450000,
    paymentMethod: 'Naqd', // Naqd, Karta, Bank perech, Qarz, Aralash
    status: 'Yakunlangan'
  },
  {
    id: 'SL-1091',
    date: '2026-10-08 16:15',
    cashierName: 'Nilufar Karimova',
    items: [
      { id: 'prd-5', name: 'Sauvage Elixir', quantity: 1, price: 2350000 },
      { id: 'prd-8', name: 'Libre Intense', quantity: 1, price: 2050000 }
    ],
    total: 4400000,
    paymentMethod: 'Karta',
    status: 'Yakunlangan'
  },
  {
    id: 'SL-1090',
    date: '2026-10-08 14:00',
    cashierName: 'Jasur Qodirov',
    items: [
      { id: 'prd-3', name: 'Lost Cherry', quantity: 1, price: 3900000 }
    ],
    total: 3900000,
    paymentMethod: 'Bank perech',
    status: 'Yakunlangan'
  },
  {
    id: 'SL-1089',
    date: '2026-10-08 11:20',
    cashierName: 'Nilufar Karimova',
    items: [
      { id: 'prd-2', name: 'Baccarat Rouge 540', quantity: 1, price: 4300000 }
    ],
    total: 4300000,
    paymentMethod: 'Qarz',
    status: 'Nasiya'
  },
  {
    id: 'SL-1088',
    date: '2026-10-07 19:40',
    cashierName: 'Jasur Qodirov',
    items: [
      { id: 'prd-4', name: 'Coco Mademoiselle', quantity: 2, price: 2200000 }
    ],
    total: 4400000,
    paymentMethod: 'Karta',
    status: 'Yakunlangan'
  },
  {
    id: 'SL-1087',
    date: '2026-10-07 15:10',
    cashierName: 'Nilufar Karimova',
    items: [
      { id: 'prd-7', name: 'Erba Pura', quantity: 1, price: 2790000 }
    ],
    total: 2790000,
    paymentMethod: 'Naqd',
    status: 'Yakunlangan'
  }
];

export const INITIAL_EXPENSES = [
  { id: 'exp-1', title: 'Do\'kon ijarasi (Oktyabr)', amount: 15000000, category: 'Ijara', date: '2026-10-01' },
  { id: 'exp-2', title: 'Instagram va SMM reklama', amount: 3500000, category: 'Marketing', date: '2026-10-03' },
  { id: 'exp-3', title: 'Kommunal va elektr to\'lovlari', amount: 1200000, category: 'Kommunal', date: '2026-10-05' },
  { id: 'exp-4', title: 'Brendli qadoq va paketlar', amount: 2400000, category: 'Qadoqlash', date: '2026-10-06' }
];

export const INITIAL_BALANCES = {
  cash: 18450000, // Naqd pul kassa
  card: 34200000, // Terminal / Karta
  bank: 86500000  // Bank hisob raqami (Perechisleniye)
};
