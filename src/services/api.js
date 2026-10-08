// Railway Backend API Client
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://sotuv-production-8794.up.railway.app';

export async function checkBackendHealth() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/health`, { signal: AbortSignal.timeout(3000) });
    return res.ok;
  } catch {
    return false;
  }
}

export async function fetchAllServerData() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/all-data`, { signal: AbortSignal.timeout(5000) });
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

export async function updateProductOnServer(product) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/products/${product.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product)
    });
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn('Mahsulot yangilanmadi:', err.message);
  }
  return null;
}

export async function deleteProductOnServer(id) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/products/${id}`, {
      method: 'DELETE'
    });
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn('Mahsulot o\'chirilmadi:', err.message);
  }
  return null;
}

export async function updateDebtOnServer(debt) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/debts/${debt.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(debt)
    });
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn('Nasiya yangilanmadi:', err.message);
  }
  return null;
}

export async function postExpenseToServer(expense) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/expenses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(expense)
    });
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn('Xarajat serverga yuborilmadi:', err.message);
  }
  return null;
}

export async function updateBalancesOnServer(balances) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/balances`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(balances)
    });
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn('Balans yangilanmadi:', err.message);
  }
  return null;
}
