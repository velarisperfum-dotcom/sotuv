// Har bir soha uchun namunaviy boy tovarlar to'plami (24 ta soha)
export const INDUSTRY_SAMPLE_PRODUCTS = {
  clothing: [
    {
      id: "prd-clt-1",
      name: "Zara Slim Fit Klassik Ko'ylak",
      brand: "Zara",
      category: "Ko'ylaklar",
      productType: "clothing",
      unit: "dona",
      price: 320000,
      costPrice: 210000,
      stock: 25,
      minStock: 5,
      barcode: "47800101001",
      image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&q=80",
      notes: "100% paxta, oq rang, premium mato",
      hasVariants: true,
      variants: [
        { id: "v-clt-1-s", name: "S / Oq", size: "S", color: "Oq", price: 320000, stock: 8 },
        { id: "v-clt-1-m", name: "M / Oq", size: "M", color: "Oq", price: 320000, stock: 10 },
        { id: "v-clt-1-l", name: "L / Oq", size: "L", color: "Oq", price: 320000, stock: 7 }
      ]
    },
    {
      id: "prd-clt-2",
      name: "Levi's 501 Original Jinsi Shim",
      brand: "Levi's",
      category: "Shim & Jinsi",
      productType: "clothing",
      unit: "dona",
      price: 580000,
      costPrice: 390000,
      stock: 18,
      minStock: 4,
      barcode: "47800101002",
      image: "https://images.unsplash.com/photo-1542272604-780c96856592?w=400&q=80",
      notes: "Klassik ko'k rang, mustahkam denima",
      hasVariants: true,
      variants: [
        { id: "v-clt-2-30", name: "W30 / Ko'k", size: "W30", color: "Ko'k", price: 580000, stock: 6 },
        { id: "v-clt-2-32", name: "W32 / Ko'k", size: "W32", color: "Ko'k", price: 580000, stock: 7 },
        { id: "v-clt-2-34", name: "W34 / Ko'k", size: "W34", color: "Ko'k", price: 580000, stock: 5 }
      ]
    },
    {
      id: "prd-clt-3",
      name: "Massimo Dutti Bahorgi Kurtka",
      brand: "Massimo Dutti",
      category: "Kurtka & Palto",
      productType: "clothing",
      unit: "dona",
      price: 1250000,
      costPrice: 850000,
      stock: 12,
      minStock: 2,
      barcode: "47800101003",
      image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&q=80",
      notes: "Shamol va suv o'tkazmaydigan zamonaviy kurtka"
    },
    {
      id: "prd-clt-4",
      name: "Tommy Hilfiger Klassik Polo Futbolka",
      brand: "Tommy Hilfiger",
      category: "Futbolka & Polo",
      productType: "clothing",
      unit: "dona",
      price: 290000,
      costPrice: 190000,
      stock: 30,
      minStock: 5,
      barcode: "47800101004",
      image: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=400&q=80",
      notes: "Nafas oluvchi paxta matosi"
    }
  ],

  pharmacy: [
    {
      id: "prd-phm-1",
      name: "Paratsetamol 500mg (10 tabletka)",
      brand: "Dori-Darmon",
      category: "Og'riq qoldiruvchi",
      productType: "pharmacy",
      unit: "quti",
      price: 6000,
      costPrice: 4200,
      stock: 120,
      minStock: 20,
      barcode: "47800201001",
      image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80",
      expiryDate: "2027-11-01",
      dosage: "500 mg",
      batch: "SER-2024-88",
      notes: "Tana harorati va og'riqqa qarshi vosita"
    },
    {
      id: "prd-phm-2",
      name: "Tsitramon P (10 tabletka)",
      brand: "Farmak",
      category: "Og'riq qoldiruvchi",
      productType: "pharmacy",
      unit: "pachka",
      price: 5000,
      costPrice: 3500,
      stock: 150,
      minStock: 25,
      barcode: "47800201002",
      image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80",
      expiryDate: "2027-08-15",
      dosage: "Standart",
      batch: "SER-2024-12",
      notes: "Bosh og'rig'i va qon bosimi uchun"
    },
    {
      id: "prd-phm-3",
      name: "Amoksitsillin 500mg Kapsula",
      brand: "Sandoz",
      category: "Antibiotiklar",
      productType: "pharmacy",
      unit: "quti",
      price: 32000,
      costPrice: 24000,
      stock: 45,
      minStock: 8,
      barcode: "47800201003",
      image: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&q=80",
      expiryDate: "2026-12-30",
      dosage: "500 mg x 20 dona",
      batch: "AMX-994",
      notes: "Keng ta'sir doirasidagi antibakterial dori"
    },
    {
      id: "prd-phm-4",
      name: "Vitamin C 1000mg Eruvchan Shishasimon",
      brand: "Doppelherz",
      category: "Vitaminlar & BAD",
      productType: "pharmacy",
      unit: "tubik",
      price: 48000,
      costPrice: 36000,
      stock: 60,
      minStock: 10,
      barcode: "47800201004",
      image: "https://images.unsplash.com/photo-1550572017-edd951aa8f72?w=400&q=80",
      expiryDate: "2028-03-01",
      dosage: "1000 mg",
      notes: "Immunitetni mustahkamlovchi limon ta'mli eruvchan tabletkalar"
    },
    {
      id: "prd-phm-5",
      name: "Mezim Forte Oshqozon Fermenti",
      brand: "Berlin-Chemie",
      category: "Oshqozon & Hazm",
      productType: "pharmacy",
      unit: "quti",
      price: 38000,
      costPrice: 29000,
      stock: 75,
      minStock: 12,
      barcode: "47800201005",
      image: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400&q=80",
      expiryDate: "2027-05-20",
      dosage: "10000 TB",
      notes: "Hazm qilish jarayonini yaxshilash uchun ferment"
    }
  ],

  grocery: [
    {
      id: "prd-grc-1",
      name: "Coca-Cola Classic 1.5L Gazlangan Ichimlik",
      brand: "Coca-Cola",
      category: "Ichimliklar",
      productType: "grocery",
      unit: "dona",
      price: 14000,
      costPrice: 10800,
      stock: 80,
      minStock: 15,
      barcode: "5449000000996",
      image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&q=80",
      notes: "Salqin saqlang"
    },
    {
      id: "prd-grc-2",
      name: "Nestle Nescafe Gold Qahva 190g Bankada",
      brand: "Nestle",
      category: "Choy, Qahva",
      productType: "grocery",
      unit: "dona",
      price: 85000,
      costPrice: 68000,
      stock: 45,
      minStock: 8,
      barcode: "7613033568779",
      image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&q=80",
      notes: "Eruvchan tabiiy qahva"
    },
    {
      id: "prd-grc-3",
      name: "Banan Ekvador (Tarozi / 1 kg)",
      brand: "Ekvador Fresh",
      category: "Meva & Sabzavot",
      productType: "grocery",
      unit: "kg",
      price: 23000,
      costPrice: 17500,
      stock: 65,
      minStock: 15,
      barcode: "200000100234",
      image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&q=80",
      notes: "Yangi keltirilgan shirin banan"
    },
    {
      id: "prd-grc-4",
      name: "Barilla Spaghetti #5 Makaron 500g",
      brand: "Barilla",
      category: "Yorma & Makaron",
      productType: "grocery",
      unit: "pachka",
      price: 24000,
      costPrice: 18000,
      stock: 50,
      minStock: 10,
      barcode: "8076809513753",
      image: "https://images.unsplash.com/photo-1621996346565-e3d5d6281720?w=400&q=80",
      notes: "Italiya bug'doyidan tayyorlangan spagetti"
    },
    {
      id: "prd-grc-5",
      name: "Oila Tanlovi Pista Yog'i 1L",
      brand: "Oila Tanlovi",
      category: "Yog' & Konserva",
      productType: "grocery",
      unit: "dona",
      price: 18500,
      costPrice: 15500,
      stock: 70,
      minStock: 12,
      barcode: "47800301005",
      image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&q=80",
      notes: "Tozalangan tabiiy kungaboqar yog'i"
    }
  ],

  electronics: [
    {
      id: "prd-elc-1",
      name: "Apple iPhone 15 Pro Max 256GB",
      brand: "Apple",
      category: "Apple iPhone",
      productType: "electronics",
      unit: "dona",
      price: 14500000,
      costPrice: 12900000,
      stock: 10,
      minStock: 2,
      barcode: "19594901001",
      image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&q=80",
      warranty: "12 oy",
      notes: "Titanium korpus, A17 Pro chip"
    },
    {
      id: "prd-elc-2",
      name: "Samsung Galaxy S24 Ultra 512GB",
      brand: "Samsung",
      category: "Samsung Galaxy",
      productType: "electronics",
      unit: "dona",
      price: 13800000,
      costPrice: 12100000,
      stock: 8,
      minStock: 2,
      barcode: "880609501002",
      image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&q=80",
      warranty: "12 oy",
      notes: "AI imkoniyatlari, S-Pen ruchkasi"
    },
    {
      id: "prd-elc-3",
      name: "Apple AirPods Pro (2nd Gen)",
      brand: "Apple",
      category: "Naushniklar & AirPods",
      productType: "electronics",
      unit: "dona",
      price: 2750000,
      costPrice: 2200000,
      stock: 22,
      minStock: 4,
      barcode: "19594901003",
      image: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=400&q=80",
      warranty: "12 oy",
      notes: "Shovqin so'ndirish, USB-C keys"
    },
    {
      id: "prd-elc-4",
      name: "Xiaomi Power Bank 20000mAh (22.5W)",
      brand: "Xiaomi",
      category: "Quvvatlagich & Powerbank",
      productType: "electronics",
      unit: "dona",
      price: 260000,
      costPrice: 185000,
      stock: 35,
      minStock: 6,
      barcode: "6934177701004",
      image: "https://images.unsplash.com/photo-1609592426868-6c0b396796c9?w=400&q=80",
      warranty: "6 oy",
      notes: "Tezkor zaryadlash Type-C"
    }
  ],

  autoparts: [
    {
      id: "prd-aut-1",
      name: "Shell Helix Ultra 5W-40 Motor Moyi 4L",
      brand: "Shell",
      category: "Motor Moyi & Antifriz",
      productType: "autoparts",
      unit: "kanistra",
      price: 460000,
      costPrice: 370000,
      stock: 20,
      minStock: 4,
      barcode: "501198701001",
      image: "https://images.unsplash.com/photo-1615906655593-ad0386982a0f?w=400&q=80",
      notes: "Sintetik original motor moyi (Cobalt, Gentra, Nexia)"
    },
    {
      id: "prd-aut-2",
      name: "Mann Filter Yog' Filtri W67/2",
      brand: "Mann Filter",
      category: "Filtrlar (Moy, Havo, Salon)",
      productType: "autoparts",
      unit: "dona",
      price: 65000,
      costPrice: 48000,
      stock: 45,
      minStock: 10,
      barcode: "401155801002",
      image: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&q=80",
      notes: "OEM sifatli tozalash filtri"
    },
    {
      id: "prd-aut-3",
      name: "Brembo Old Tormoz Kolodkalari (Gentra)",
      brand: "Brembo",
      category: "Tormoz kolodkalari",
      productType: "autoparts",
      unit: "to'plam",
      price: 280000,
      costPrice: 205000,
      stock: 16,
      minStock: 3,
      barcode: "802058401003",
      image: "https://images.unsplash.com/photo-1558441719-813c9e638bb2?w=400&q=80",
      notes: "Yuqori tormozlash kuchi, shovqinsiz"
    }
  ],

  building: [
    {
      id: "prd-bld-1",
      name: "Knauf Gipsokarton 9.5mm (1.2m x 2.5m)",
      brand: "Knauf",
      category: "Gipsokarton & Profil",
      productType: "building",
      unit: "dona",
      price: 62000,
      costPrice: 51000,
      stock: 120,
      minStock: 25,
      barcode: "47800501001",
      image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&q=80",
      notes: "Shift va devorlar uchun qoplama"
    },
    {
      id: "prd-bld-2",
      name: "Sement M-500 Ohangaron (50 kg qop)",
      brand: "Ohangaron Sement",
      category: "Sement & Quruq qorishmalar",
      productType: "building",
      unit: "qop",
      price: 68000,
      costPrice: 58000,
      stock: 200,
      minStock: 40,
      barcode: "47800501002",
      image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400&q=80",
      notes: "Mustahkam poydevor va quyish ishlari uchun"
    },
    {
      id: "prd-bld-3",
      name: "Tikkurila Oq Fasura Bo'yoq 10L",
      brand: "Tikkurila",
      category: "Bo'yoq & Laklar",
      productType: "building",
      unit: "chelak",
      price: 420000,
      costPrice: 330000,
      stock: 30,
      minStock: 5,
      barcode: "64080701003",
      image: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=400&q=80",
      notes: "Yuviladigan yuqori qoplovchi oq bo'yoq"
    }
  ],

  perfume: [
    {
      id: "prd-prf-1",
      name: "Baccarat Rouge 540 Extrait de Parfum",
      brand: "Maison Francis Kurkdjian",
      category: "Niche & Selektiv",
      productType: "perfume",
      unit: "flakon",
      price: 4500000,
      costPrice: 3200000,
      stock: 12,
      minStock: 2,
      barcode: "370055960001",
      image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400&q=80",
      notes: "Qahrabo, za'faron va shirin yog'ochli kompozitsiya",
      prices: { "10 ml": 450000, "20 ml": 850000, "30 ml": 1250000, "50 ml": 2100000 }
    },
    {
      id: "prd-prf-2",
      name: "Creed Aventus Eau de Parfum",
      brand: "Creed",
      category: "Erkaklar atirlari",
      productType: "perfume",
      unit: "flakon",
      price: 4200000,
      costPrice: 3000000,
      stock: 15,
      minStock: 3,
      barcode: "350844110002",
      image: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=400&q=80",
      notes: "Ananas, bergamot va qora smorodina notalari",
      prices: { "10 ml": 420000, "20 ml": 800000, "30 ml": 1180000, "50 ml": 1950000 }
    },
    {
      id: "prd-prf-3",
      name: "Tom Ford Tobacco Vanille",
      brand: "Tom Ford",
      category: "Unisex",
      productType: "perfume",
      unit: "flakon",
      price: 3900000,
      costPrice: 2800000,
      stock: 14,
      minStock: 2,
      barcode: "88806601003",
      image: "https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=400&q=80",
      notes: "Tamaki barglari, vanil va kakao boy akkordlari",
      prices: { "10 ml": 390000, "20 ml": 740000, "30 ml": 1100000, "50 ml": 1850000 }
    }
  ]
};

// Funksiya: Berilgan soha uchun tovarlarni qaytarish
export function getSampleProductsForIndustry(industryId) {
  if (INDUSTRY_SAMPLE_PRODUCTS[industryId]) {
    return INDUSTRY_SAMPLE_PRODUCTS[industryId];
  }
  
  // Agar soha bo'lmasa, umumiy universal namunaviy tovarlar
  const combined = [
    ...INDUSTRY_SAMPLE_PRODUCTS.clothing.slice(0, 2),
    ...INDUSTRY_SAMPLE_PRODUCTS.grocery.slice(0, 3),
    ...INDUSTRY_SAMPLE_PRODUCTS.electronics.slice(0, 2),
    ...INDUSTRY_SAMPLE_PRODUCTS.pharmacy.slice(0, 2)
  ];
  return combined;
}
