import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const LOCAL_DB_PATH = path.join(__dirname, 'data.json');

const { Pool } = pg;
const databaseUrl = process.env.DATABASE_URL;

let pool = null;

if (databaseUrl) {
  pool = new Pool({
    connectionString: databaseUrl,
    ssl: { rejectUnauthorized: false }
  });
  console.log('✅ PostgreSQL ulashga tayyor (Railway DB)');
} else {
  console.log('ℹ️ DATABASE_URL topilmadi. Mahalliy data.json fayl rejimi ishga tushmoqda.');
}

// Default initial data for Velaris Perfum
const defaultData = {
  products: [
    {
      id: 'prd-1',
      name: 'Aventus',
      brand: 'Creed',
      category: 'Erkaklar',
      volume: '100 ml',
      concentration: 'EDP',
      sku: 'CR-AV-100',
      barcode: '3508441001114',
      costPrice: 2600000,
      price: 3450000,
      stock: 14,
      minStock: 4,
      image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=400&q=80',
      notes: 'Ananas, bergamot, qora smorodina, qayin, mushk'
    },
    {
      id: 'prd-2',
      name: 'Baccarat Rouge 540',
      brand: 'Maison Francis Kurkdjian',
      category: 'Unisex',
      volume: '70 ml',
      concentration: 'Extrait',
      sku: 'MFK-BR540-70',
      barcode: '3700559600024',
      costPrice: 3200000,
      price: 4300000,
      stock: 9,
      minStock: 3,
      image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400&q=80',
      notes: 'Zafaron, yasmin, sadr yog\'ochi, kulrang ambra'
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
    }
  ],
  staff: [
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
    }
  ],
  debts: [
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
    }
  ],
  sales: [
    {
      id: 'SL-1092',
      date: '2026-10-08 18:30',
      cashierName: 'Jasur Qodirov',
      items: [
        { id: 'prd-1', name: 'Creed Aventus', quantity: 1, price: 3450000 }
      ],
      total: 3450000,
      paymentMethod: 'Naqd',
      status: 'Yakunlangan'
    }
  ],
  expenses: [
    { id: 'exp-1', title: 'Do\'kon ijarasi (Oktyabr)', amount: 15000000, category: 'Ijara', date: '2026-10-01' }
  ],
  balances: {
    cash: 18450000,
    card: 34200000,
    bank: 86500000
  }
};

function readLocalData() {
  if (!fs.existsSync(LOCAL_DB_PATH)) {
    fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(defaultData, null, 2), 'utf-8');
    return defaultData;
  }
  try {
    const raw = fs.readFileSync(LOCAL_DB_PATH, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return defaultData;
  }
}

function writeLocalData(data) {
  fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

export async function initDatabase() {
  if (pool) {
    try {
      const client = await pool.connect();
      console.log('🚀 PostgreSQL bazasiga ulandi, jadvallar tekshirilmoqda...');

      await client.query(`
        CREATE TABLE IF NOT EXISTS store_data (
          key VARCHAR(50) PRIMARY KEY,
          value JSONB NOT NULL,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);

      // Seed initial data if table is empty
      const checkRes = await client.query('SELECT count(*) FROM store_data');
      if (parseInt(checkRes.rows[0].count, 10) === 0) {
        console.log('🌱 Boshlangʻich maʼlumotlar PostgreSQL bazasiga yuklanmoqda...');
        for (const [key, value] of Object.entries(defaultData)) {
          await client.query(
            'INSERT INTO store_data (key, value) VALUES ($1, $2)',
            [key, JSON.stringify(value)]
          );
        }
      }
      client.release();
      console.log('✅ PostgreSQL jadvallari muvaffaqiyatli tayyorlandi!');
    } catch (err) {
      console.error('❌ PostgreSQL ulanishida xatolik:', err.message);
    }
  } else {
    readLocalData();
    console.log('✅ Mahalliy JSON maʼlumotlar bazasi tayyor!');
  }
}

export async function getStoreData(key) {
  if (pool) {
    try {
      const res = await pool.query('SELECT value FROM store_data WHERE key = $1', [key]);
      if (res.rows.length > 0) {
        return res.rows[0].value;
      }
      return defaultData[key] || null;
    } catch (err) {
      console.error(`PostgreSQL getStoreData (${key}) xatolik:`, err);
      return defaultData[key] || null;
    }
  } else {
    const data = readLocalData();
    return data[key] || defaultData[key] || null;
  }
}

export async function setStoreData(key, value) {
  if (pool) {
    try {
      await pool.query(
        `INSERT INTO store_data (key, value, updated_at) 
         VALUES ($1, $2, CURRENT_TIMESTAMP)
         ON CONFLICT (key) DO UPDATE SET value = $2, updated_at = CURRENT_TIMESTAMP`,
        [key, JSON.stringify(value)]
      );
      return true;
    } catch (err) {
      console.error(`PostgreSQL setStoreData (${key}) xatolik:`, err);
      return false;
    }
  } else {
    const data = readLocalData();
    data[key] = value;
    writeLocalData(data);
    return true;
  }
}

export async function getAllData() {
  const keys = ['products', 'staff', 'debts', 'sales', 'expenses', 'balances'];
  const result = {};
  for (const k of keys) {
    result[k] = await getStoreData(k);
  }
  return result;
}
