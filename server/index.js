import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDatabase, getStoreData, setStoreData, getAllData } from './db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5050;

app.use(cors());
app.use(express.json());

// Initialize database
await initDatabase();

// Health Check
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    name: 'Velaris Perfum - Sotuv API',
    version: '1.0.0',
    time: new Date().toISOString()
  });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Bulk Get All Data
app.get('/api/all-data', async (req, res) => {
  try {
    const data = await getAllData();
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- Products Endpoints ---
app.get('/api/products', async (req, res) => {
  const products = await getStoreData('products');
  res.json(products || []);
});

app.post('/api/products', async (req, res) => {
  try {
    const newProduct = req.body;
    if (!newProduct.id) {
      newProduct.id = `prd-${Date.now()}`;
    }
    const products = (await getStoreData('products')) || [];
    products.unshift(newProduct);
    await setStoreData('products', products);
    res.status(201).json({ success: true, product: newProduct });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.put('/api/products-bulk', async (req, res) => {
  try {
    const products = req.body;
    if (Array.isArray(products)) {
      await setStoreData('products', products);
      res.json({ success: true, count: products.length });
    } else {
      res.status(400).json({ success: false, error: 'Array kutilmoqda' });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.put('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updated = req.body;
    const products = (await getStoreData('products')) || [];
    const index = products.findIndex(p => p.id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, error: 'Mahsulot topilmadi' });
    }
    products[index] = { ...products[index], ...updated };
    await setStoreData('products', products);
    res.json({ success: true, product: products[index] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    let products = (await getStoreData('products')) || [];
    products = products.filter(p => p.id !== id);
    await setStoreData('products', products);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- Sales Endpoints ---
app.get('/api/sales', async (req, res) => {
  const sales = await getStoreData('sales');
  res.json(sales || []);
});

app.post('/api/sales', async (req, res) => {
  try {
    const newSale = req.body;
    if (!newSale.id) {
      newSale.id = `SL-${Math.floor(1000 + Math.random() * 9000)}`;
    }
    if (!newSale.date) {
      newSale.date = new Date().toLocaleString('uz-UZ');
    }

    // 1. Save Sale
    const sales = (await getStoreData('sales')) || [];
    sales.unshift(newSale);
    await setStoreData('sales', sales);

    // 2. Reduce Stock
    const products = (await getStoreData('products')) || [];
    if (Array.isArray(newSale.items)) {
      for (const item of newSale.items) {
        const prod = products.find(p => p.id === item.id);
        if (prod) {
          prod.stock = Math.max(0, (prod.stock || 0) - (item.quantity || 1));
        }
      }
      await setStoreData('products', products);
    }

    // 3. Update Balances
    const balances = (await getStoreData('balances')) || { cash: 0, card: 0, bank: 0 };
    const amount = Number(newSale.total) || 0;
    if (newSale.paymentMethod === 'Naqd') {
      balances.cash += amount;
    } else if (newSale.paymentMethod === 'Karta') {
      balances.card += amount;
    } else if (newSale.paymentMethod === 'Bank perech') {
      balances.bank += amount;
    }
    await setStoreData('balances', balances);

    res.status(201).json({ success: true, sale: newSale, balances });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- Debts Endpoints ---
app.get('/api/debts', async (req, res) => {
  const debts = await getStoreData('debts');
  res.json(debts || []);
});

app.post('/api/debts', async (req, res) => {
  try {
    const newDebt = req.body;
    if (!newDebt.id) {
      newDebt.id = `dbt-${Date.now()}`;
    }
    const debts = (await getStoreData('debts')) || [];
    debts.unshift(newDebt);
    await setStoreData('debts', debts);
    res.status(201).json({ success: true, debt: newDebt });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.put('/api/debts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updated = req.body;
    const debts = (await getStoreData('debts')) || [];
    const index = debts.findIndex(d => d.id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, error: 'Nasiya topilmadi' });
    }
    debts[index] = { ...debts[index], ...updated };
    await setStoreData('debts', debts);
    res.json({ success: true, debt: debts[index] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- Expenses Endpoints ---
app.get('/api/expenses', async (req, res) => {
  const expenses = await getStoreData('expenses');
  res.json(expenses || []);
});

app.post('/api/expenses', async (req, res) => {
  try {
    const newExp = req.body;
    if (!newExp.id) {
      newExp.id = `exp-${Date.now()}`;
    }
    const expenses = (await getStoreData('expenses')) || [];
    expenses.unshift(newExp);
    await setStoreData('expenses', expenses);

    // Deduct from cash
    const balances = (await getStoreData('balances')) || { cash: 0, card: 0, bank: 0 };
    balances.cash = Math.max(0, balances.cash - (Number(newExp.amount) || 0));
    await setStoreData('balances', balances);

    res.status(201).json({ success: true, expense: newExp, balances });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- Balances Endpoints ---
app.get('/api/balances', async (req, res) => {
  const balances = await getStoreData('balances');
  res.json(balances || { cash: 0, card: 0, bank: 0 });
});

app.put('/api/balances', async (req, res) => {
  try {
    const balances = req.body;
    await setStoreData('balances', balances);
    res.json({ success: true, balances });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- Staff Endpoints ---
app.get('/api/staff', async (req, res) => {
  const staff = await getStoreData('staff');
  res.json(staff || []);
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Velaris Sotuv API http://0.0.0.0:${PORT} portida ishga tushdi!`);
});
