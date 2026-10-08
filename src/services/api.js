// Railway Backend API Client
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5050';

export async function checkBackendHealth() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/health`);
    return res.ok;
  } catch {
    return false;
  }
}

export async function fetchAllServerData() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/all-data`);
    if (!res.ok) throw new Error('Server error');
    const json = await res.json();
    return json.data;
  } catch (err) {
    console.warn('Backend ulanmadi, mahalliy rejim ishlatilmoqda:', err.message);
    return null;
  }
}

export async function postSaleToServer(saleData) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/sales`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(saleData)
    });
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn('Sotuv serverga yuborilmadi:', err.message);
  }
  return null;
}

export async function postProductToServer(product) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product)
    });
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn('Mahsulot serverga yuborilmadi:', err.message);
  }
  return null;
}
