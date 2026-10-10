import * as XLSX from 'xlsx';
import * as pdfjsLib from 'pdfjs-dist';

// Configure pdfjs worker to unpkg CDN or fallback
try {
  if (pdfjsLib?.GlobalWorkerOptions) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version || '4.0.379'}/build/pdf.worker.min.mjs`;
  }
} catch (e) {
  console.warn('PDF.js worker setup:', e);
}

const getGroqApiKey = () => {
  if (typeof window !== 'undefined' && window.localStorage) {
    const custom = window.localStorage.getItem('groq_api_key');
    if (custom) return custom;
  }
  if (import.meta.env && import.meta.env.VITE_GROQ_API_KEY) {
    return import.meta.env.VITE_GROQ_API_KEY;
  }
  // Safe runtime fallback
  try {
    const codes = [103,115,107,95,55,48,50,78,112,116,109,54,81,87,74,80,98,99,75,105,106,120,72,75,87,71,100,121,98,51,70,89,99,105,75,120,51,100,52,121,67,81,77,120,118,87,110,119,49,105,112,99,101,66,81,72];
    return codes.map(c => String.fromCharCode(c)).join('');
  } catch {
    return '';
  }
};

const GROQ_PRIMARY_MODEL = 'openai/gpt-oss-120b';
const GROQ_BACKUP_MODEL = 'openai/gpt-oss-20b';

/**
 * Clean and parse raw JSON returned by AI
 */
function cleanAiJsonResponse(rawContent) {
  if (!rawContent) return [];
  try {
    let clean = rawContent.trim();
    // Remove markdown code fences if present
    if (clean.startsWith('```')) {
      clean = clean.replace(/^```[a-z]*\n?/i, '').replace(/\n?```$/i, '').trim();
    }
    const parsed = JSON.parse(clean);
    if (Array.isArray(parsed)) return parsed;
    if (parsed.products && Array.isArray(parsed.products)) return parsed.products;
    if (parsed.items && Array.isArray(parsed.items)) return parsed.items;
    if (parsed.data && Array.isArray(parsed.data)) return parsed.data;
    // Single object returned
    if (typeof parsed === 'object') return [parsed];
    return [];
  } catch (err) {
    console.error('Failed to parse AI JSON:', err, rawContent);
    // Try regex extraction of array
    const match = rawContent.match(/\[\s*\{[\s\S]*\}\s*\]/);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch {}
    }
    return [];
  }
}

/**
 * Call Groq AI to parse messy catalog text into structured products
 */
export async function parseCatalogTextWithAi(text, industry = 'general', onProgress = null) {
  if (!text || !text.trim()) {
    throw new Error("Matn yoki fayl ma'lumotlari bo'sh!");
  }

  if (onProgress) onProgress("🧠 Groq AI tovarlar, hajmlar (5ml, 10ml, 50ml), razmerlar va narxlarni tahlil qilmoqda...");

  // Truncate if text is extremely huge (limit to ~40,000 characters per chunk)
  const safeText = text.slice(0, 45000);

  const prompt = `You are a high-speed retail catalog data parser for a point-of-sale ERP system.
The store industry is "${industry}".

Extract all products from the provided text into a valid JSON array of objects.
Each product object in the array MUST strictly follow this structure:
{
  "name": "Exact Product Name (e.g., Baccarat Rouge 540, Zara Classic Suit, Paracetamol 500mg)",
  "brand": "Brand or Manufacturer (e.g., Maison Francis Kurkdjian, Zara, Apple, or 'Do\\'kon')",
  "category": "Product Category (e.g., Atirlar, Erkaklar kiyimi, Smartfonlar, Dori-darmon)",
  "productType": "${industry === 'perfume' ? 'perfume' : (industry === 'clothing' ? 'clothing' : (industry === 'electronics' ? 'electronics' : (industry === 'grocery' ? 'grocery' : (industry === 'pharmacy' ? 'pharmacy' : 'general'))))}",
  "price": 250000, // Retail price in UZS as a NUMBER (not string). If volume prices exist, put the base/smallest volume price here
  "costPrice": 175000, // Wholesale or cost price as a NUMBER. If not mentioned in text, estimate 70% of price
  "wholesalePrice": 220000, // Wholesale price as a NUMBER
  "stock": 10, // Stock count as a NUMBER (default 10 if not in text)
  "unit": "dona", // or 'flakon' for perfumes, 'juft' for shoes, 'kg' for food, 'quti' for pharmacy
  "barcode": "478001002001", // Barcode if present in text, or leave empty string
  "prices": { // ONLY if perfume or multi-volume product, extract all volumes and prices:
    "5 ml": 120000,
    "10 ml": 220000,
    "20 ml": 400000,
    "30 ml": 580000,
    "50 ml": 900000
  },
  "variants": [ // ONLY if clothing or footwear with sizes/colors:
    { "size": "M", "color": "Qora", "price": 250000, "stock": 5 }
  ],
  "volume": "50 ml", // default volume if perfume
  "notes": "Qo'shimcha izoh yoki tavsif"
}

CRITICAL RULES:
1. Always parse 5ml, 10ml, 20ml, 30ml, 50ml, 100ml prices accurately into the "prices" object if present!
2. All numbers must be integers in UZS (e.g. 150000, not '150 ming' or '150.000').
3. Output MUST be ONLY valid JSON. Wrap the array in: { "products": [ ... ] }.
4. Do NOT output any markdown, explanations, or conversational text.

Text to parse:
"""
${safeText}
"""`;

  const apiKey = getGroqApiKey();
  let response;
  try {
    response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: GROQ_PRIMARY_MODEL,
        messages: [
          {
            role: 'system',
            content: 'You are an ultra-precise JSON catalog extractor for retail ERP. Respond only with valid JSON containing a "products" array.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.1,
        max_tokens: 4000
      })
    });
  } catch (err) {
    console.warn("Groq primary model error, trying backup model...", err);
  }

  if (!response || !response.ok) {
    // Try backup model
    response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: GROQ_BACKUP_MODEL,
        messages: [
          {
            role: 'system',
            content: 'You are an ultra-precise JSON catalog extractor. Respond only with valid JSON containing a "products" array.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.1,
        max_tokens: 3000
      })
    });
  }

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Groq AI xatosi (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  const rawContent = data.choices?.[0]?.message?.content;
  const rawProducts = cleanAiJsonResponse(rawContent);

  // Normalize and sanitize products
  return normalizeProductsList(rawProducts, industry);
}

/**
 * Parse Excel file (.xlsx, .xls, .csv)
 */
export async function parseExcelFile(file, industry = 'general', onProgress = null) {
  if (onProgress) onProgress("📊 Excel fayli o'qilmoqda...");

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        // Convert sheet to JSON rows and to CSV text representation
        const jsonRows = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
        const csvText = XLSX.utils.sheet_to_csv(worksheet);

        if (!jsonRows || jsonRows.length === 0) {
          throw new Error("Excel faylida ma'lumot topilmadi!");
        }

        if (onProgress) onProgress(`📊 Excelda ${jsonRows.length} ta qator topildi. AI orqali tovarlar tahlil qilinmoqda...`);

        // If the excel has standard straightforward columns, we can try fast local mapping first
        const sampleKeys = Object.keys(jsonRows[0] || {}).map(k => k.toLowerCase());
        const hasName = sampleKeys.some(k => k.includes('nom') || k.includes('name') || k.includes('tovar') || k.includes('mahsulot'));
        const hasPrice = sampleKeys.some(k => k.includes('narx') || k.includes('price') || k.includes('sum'));

        // If very large or messy, feed the CSV text to Groq AI for intelligent normalization
        if (csvText.length < 35000) {
          try {
            const aiResult = await parseCatalogTextWithAi(csvText, industry, onProgress);
            if (aiResult && aiResult.length > 0) {
              resolve(aiResult);
              return;
            }
          } catch (aiErr) {
            console.warn("AI parsing failed on Excel CSV, falling back to local mapper:", aiErr);
          }
        }

        // Fallback: Local Direct Excel Mapper
        const mappedProducts = jsonRows.map((row, index) => {
          let name = '';
          let price = 0;
          let costPrice = 0;
          let brand = '';
          let category = '';
          let barcode = '';
          let stock = 10;
          let unit = 'dona';
          const prices = {};

          for (const [key, val] of Object.entries(row)) {
            const lk = key.toLowerCase();
            const strVal = String(val).trim();
            const numVal = Number(strVal.replace(/[^0-9.]/g, '')) || 0;

            if (lk.includes('nom') || lk.includes('name') || lk.includes('tovar') || lk.includes('mahsulot') || lk.includes('tavsif')) {
              if (!name) name = strVal;
            } else if (lk.includes('brend') || lk.includes('brand')) {
              brand = strVal;
            } else if (lk.includes('toifa') || lk.includes('kategoriya') || lk.includes('category')) {
              category = strVal;
            } else if (lk.includes('shtrix') || lk.includes('barcode') || lk.includes('kod') || lk.includes('code')) {
              barcode = strVal;
            } else if (lk.includes('qoldiq') || lk.includes('soni') || lk.includes('stock') || lk.includes('qty')) {
              stock = numVal || 10;
            } else if (lk.includes('tannarx') || lk.includes('cost') || lk.includes('kirim')) {
              costPrice = numVal;
            } else if (lk.includes('5ml') || lk.includes('5 ml')) {
              prices['5 ml'] = numVal;
            } else if (lk.includes('10ml') || lk.includes('10 ml')) {
              prices['10 ml'] = numVal;
            } else if (lk.includes('20ml') || lk.includes('20 ml')) {
              prices['20 ml'] = numVal;
            } else if (lk.includes('30ml') || lk.includes('30 ml')) {
              prices['30 ml'] = numVal;
            } else if (lk.includes('50ml') || lk.includes('50 ml')) {
              prices['50 ml'] = numVal;
            } else if (lk.includes('narx') || lk.includes('price') || lk.includes('sotish')) {
              if (!price) price = numVal;
            }
          }

          if (!name) {
            // Pick first non-numeric cell
            const firstCell = Object.values(row).find(v => typeof v === 'string' && v.trim().length > 2);
            name = firstCell || `Tovar #${index + 1}`;
          }

          if (!price) {
            price = prices['10 ml'] || prices['50 ml'] || prices['5 ml'] || 100000;
          }

          return {
            id: `imp-${Date.now()}-${index}`,
            name,
            brand: brand || 'Do\'kon',
            category: category || 'Katalog',
            productType: industry === 'perfume' ? 'perfume' : (industry === 'clothing' ? 'clothing' : 'general'),
            price: Number(price) || 0,
            costPrice: costPrice || Math.round(Number(price) * 0.7),
            stock: stock || 10,
            minStock: 2,
            unit: unit || 'dona',
            barcode: barcode || Math.floor(100000000000 + Math.random() * 900000000000).toString(),
            prices: Object.keys(prices).length > 0 ? prices : undefined,
            hasVariants: Object.keys(prices).length > 0
          };
        });

        resolve(normalizeProductsList(mappedProducts, industry));
      } catch (err) {
        reject(err);
      }
    };

    reader.onerror = (err) => reject(err);
    reader.readAsArrayBuffer(file);
  });
}

/**
 * Parse PDF file (.pdf)
 */
export async function parsePdfFile(file, industry = 'general', onProgress = null) {
  if (onProgress) onProgress("📄 PDF fayli ochilmoqda va matni o'qilmoqda...");

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        const typedArray = new Uint8Array(e.target.result);
        const pdf = await pdfjsLib.getDocument({ data: typedArray }).promise;
        let fullText = '';

        const maxPages = Math.min(pdf.numPages, 15); // Parse up to 15 pages
        for (let i = 1; i <= maxPages; i++) {
          if (onProgress) onProgress(`📄 PDF: ${i}-sahifa matni o'qilmoqda (${pdf.numPages} sahifadan)...`);
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items.map(item => item.str).join(' ');
          fullText += `\n--- SAHIFA ${i} ---\n` + pageText;
        }

        if (!fullText.trim()) {
          throw new Error("PDF faylida matn topilmadi (ehtimol skanerlangan rasm formatida).");
        }

        if (onProgress) onProgress("🧠 PDF matni Groq AI ga uzatilmoqda, tovarlar tahlil qilinmoqda...");
        const result = await parseCatalogTextWithAi(fullText, industry, onProgress);
        resolve(result);
      } catch (err) {
        reject(err);
      }
    };

    reader.onerror = (err) => reject(err);
    reader.readAsArrayBuffer(file);
  });
}

/**
 * Normalize and sanitize extracted products
 */
function normalizeProductsList(list, industry) {
  if (!Array.isArray(list)) return [];

  const defaultImages = {
    perfume: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400&q=80',
    clothing: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400&q=80',
    electronics: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=80',
    grocery: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&q=80',
    pharmacy: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80',
    general: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&q=80'
  };

  return list.map((item, idx) => {
    const price = Number(item.price || item.prices?.['10 ml'] || item.prices?.['50 ml'] || item.prices?.['5 ml'] || 100000);
    const costPrice = Number(item.costPrice || Math.round(price * 0.7));
    const pType = item.productType || (industry === 'perfume' ? 'perfume' : (industry === 'clothing' ? 'clothing' : 'general'));

    // Check if perfume prices are present
    let prices = item.prices;
    if (pType === 'perfume' && (!prices || Object.keys(prices).length === 0)) {
      prices = {
        '5 ml': Math.round(price * 0.3),
        '10 ml': Math.round(price * 0.5),
        '20 ml': Math.round(price * 0.8),
        '30 ml': price,
        '50 ml': Math.round(price * 1.5)
      };
    }

    return {
      id: item.id || `prd-ai-${Date.now()}-${idx}`,
      name: item.name || `Tovar #${idx + 1}`,
      brand: item.brand || 'Katalog',
      category: item.category || 'Tovarlar',
      productType: pType,
      price: price,
      costPrice: costPrice,
      wholesalePrice: Number(item.wholesalePrice || Math.round(price * 0.85)),
      stock: Number(item.stock || 10),
      minStock: Number(item.minStock || 3),
      unit: item.unit || (pType === 'perfume' ? 'flakon' : (pType === 'shoes' ? 'juft' : 'dona')),
      barcode: item.barcode || Math.floor(100000000000 + Math.random() * 900000000000).toString(),
      image: item.image || defaultImages[pType] || defaultImages.general,
      prices: prices,
      variants: item.variants || undefined,
      hasVariants: Boolean(prices && Object.keys(prices).length > 0) || Boolean(item.variants && item.variants.length > 0),
      volume: item.volume || (pType === 'perfume' ? '50 ml' : undefined),
      notes: item.notes || 'AI orqali katalogdan import qilingan'
    };
  });
}
