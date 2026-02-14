// ==========================================
// SHARED PRODUCT LOGIC (products.js)
// Source of Truth: localStorage key "products"
// ==========================================

const ENTITY_ID = "products";

// Default Products Data (Merged Temple Items + Mahaprasad + Poojas)
const DEFAULT_PRODUCTS = [
  // --- Prasad ---
  {
    id: "prasad-1",
    name: "ଲଡୁ ପ୍ରସାଦ",
    category: "prasad",
    price: 51,
    description: "ମନ୍ଦିର ଦେବତାଙ୍କ ପବିତ୍ର ଆଶୀର୍ବାଦ ପ୍ରାପ୍ତ ମିଠା ଲଡୁ ଅର୍ପଣ। ଭଗବାନଙ୍କ ଦ୍ୱାରା ଆଶୀର୍ବାଦ ପ୍ରାପ୍ତ ଦିବ୍ୟ ମିଠା।",
    image: "images/Ladoo Prasad.jpg",
    available: true
  },
  {
    id: "prasad-2",
    name: "ପଞ୍ଚାମୃତ",
    category: "prasad",
    price: 31,
    description: "ଦେବତାଙ୍କୁ ଅର୍ପଣ କରାଯାଇଥିବା କ୍ଷୀର, ଦହି, ଘିଅ, ମହୁ ଏବଂ ଚିନିର ଦିବ୍ୟ ମିଶ୍ରଣ।",
    image: "images/Panchamrit.jpg",
    available: true
  },
  {
    id: "prasad-3",
    name: "କଦଳୀ ପ୍ରସାଦ",
    category: "prasad",
    price: 21,
    description: "ଦେବତାଙ୍କୁ ଅର୍ପଣ କରାଯାଇଥିବା ସତେଜ ପବିତ୍ର କଦଳୀ, ସମୃଦ୍ଧି ଏବଂ ଉତ୍ତମ ସ୍ୱାସ୍ଥ୍ୟର ପ୍ରତୀକ।",
    image: "images/Banana Prasad.jpg",
    available: true
  },
  {
    id: "prasad-4",
    name: "ଋତୁକାଳୀନ ଫଳ ପ୍ରସାଦ",
    category: "prasad",
    price: 51,
    description: "ଦେବତାଙ୍କ ଦ୍ୱାରା ଆଶୀର୍ବାଦ ପ୍ରାପ୍ତ ସତେଜ ଋତୁକାଳୀନ ଫଳ, ପ୍ରକୃତିର ଦାନ ଏବଂ ଦିବ୍ୟ ଆଶୀର୍ବାଦର ପ୍ରତୀକ।",
    image: "images/Seasonal Fruit Prasad.jpg",
    available: true
  },

  // --- Temple Items ---
  {
    id: "item-1",
    name: "ରୁଦ୍ରାକ୍ଷ ମାଳା",
    category: "temple-item",
    price: 501,
    description: "ଧ୍ୟାନ ଏବଂ ଆଧ୍ୟାତ୍ମିକ ଅଭ୍ୟାସ ପାଇଁ ପ୍ରକୃତ 108 ମାଳି ବିଶିଷ୍ଟ ରୁଦ୍ରାକ୍ଷ ମାଳା। ମନ୍ଦିର ପୂଜକମାନଙ୍କ ଦ୍ୱାରା ଅଭିମନ୍ତ୍ରିତ।",
    image: "images/Rudraksha Mala.jpg",
    available: true
  },
  {
    id: "item-2",
    name: "ପବିତ୍ର କୁଙ୍କୁମ",
    category: "temple-item",
    price: 21,
    description: "ଦୈନନ୍ଦିନ ପୂଜା ଏବଂ ତିଳକ ପାଇଁ ଦେବତାଙ୍କ ଦ୍ୱାରା ଆଶୀର୍ବାଦ ପ୍ରାପ୍ତ ଶୁଦ୍ଧ ମନ୍ଦିର କୁଙ୍କୁମ।",
    image: "images/Sacred Kumkum.jpg",
    available: true
  },
  {
    id: "item-3",
    name: "ମନ୍ଦିର ଧୂପ କାଠି",
    category: "temple-item",
    price: 51,
    description: "ଦିବ୍ୟ ସୁଗନ୍ଧ ପାଇଁ ପ୍ରାକୃତିକ ଉପାଦାନରେ ତିଆରି ଉନ୍ନତ ମାନର ଧୂପ କାଠି।",
    image: "images/Temple Incense.jpg",
    available: true
  },
  {
    id: "item-4",
    name: "ଭଗବଦ୍ ଗୀତା",
    category: "temple-item",
    price: 251,
    description: "ହିନ୍ଦୀ ଅନୁବାଦ ଏବଂ ଟୀକା ସହିତ ପବିତ୍ର ଭଗବଦ୍ ଗୀତା। ଦୈନନ୍ଦିନ ପାଠ ପାଇଁ ଉତ୍ତମ।",
    image: "images/Bhagavad Gita.jpg",
    available: true
  },
  {
    id: "item-5",
    name: "ନଡ଼ିଆ ଭୋଗ",
    category: "temple-item",
    price: 31,
    description: "ଦେବତାଙ୍କୁ ଅର୍ପଣ ଏବଂ ଭାଙ୍ଗିବା ପାଇଁ ସତେଜ ନଡ଼ିଆ।",
    image: "images/Coconut Offering.jpg",
    available: true
  },

  // --- Mahaprasad ---
  {
    id: "mp-arna",
    name: "ଅର୍ଣ୍ଣ",
    nameEnglish: "Steamed Rice",
    category: "mahaprasad",
    price: 20,
    description: "ଭଗବାନ ଜଗନ୍ନାଥଙ୍କୁ ଅର୍ପଣ କରାଯାଇଥିବା ପବିତ୍ର ଅନ୍ନ",
    image: "images/Mahaprasad.jpg",
    available: true
  },
  {
    id: "mp-dali",
    name: "ଡାଲି",
    nameEnglish: "Lentil Curry",
    category: "mahaprasad",
    price: 15,
    description: "ପାରମ୍ପାରିକ ମନ୍ଦିର ଶୈଳୀରେ ପ୍ରସ୍ତୁତ ଡାଲି",
    image: "images/Mahaprasad.jpg",
    available: true
  },
  {
    id: "mp-khata",
    name: "ଖଟା",
    nameEnglish: "Sweet & Sour Curry",
    category: "mahaprasad",
    price: 18,
    description: "ସ୍ୱତନ୍ତ୍ର ମଧୁର ଏବଂ ଖଟା ପରିବା ତରକାରୀ",
    image: "images/Mahaprasad.jpg",
    available: true
  },
  {
    id: "mp-khiri",
    name: "କ୍ଷୀରି",
    nameEnglish: "Sweet Rice Pudding",
    category: "mahaprasad",
    price: 25,
    description: "କ୍ଷୀର ଏବଂ ଚିନି ସହିତ ପ୍ରସ୍ତୁତ ସୁସ୍ୱାଦୁ ପାୟସ",
    image: "images/Mahaprasad.jpg",
    available: true
  },
  {
    id: "mp-saga",
    name: "ଶାଗ",
    nameEnglish: "Leafy Greens",
    category: "mahaprasad",
    price: 12,
    description: "ମନ୍ଦିର ପରମ୍ପରାରେ ପ୍ରସ୍ତୁତ ସତେଜ ଶାଗ",
    image: "images/Mahaprasad.jpg",
    available: true
  },
  
  // --- Poojas ---
  {
    id: 'archana',
    name: 'ଅର୍ଚ୍ଚନା',
    category: 'pooja',
    description: 'ଦେବତାଙ୍କର 108 ନାମ ଜପ ସହିତ ସରଳ ଫୁଲ ଅର୍ପଣ। ଈଶ୍ୱରଙ୍କ ଆଶୀର୍ବାଦ ପାଇବା ପାଇଁ ଏକ ସୁନ୍ଦର ଉପାୟ।',
    requiredItems: ['ସତେଜ ଫୁଲ', 'ଧୂପ କାଠି', 'କର୍ପୂର', 'ଫଳ'],
    benefits: 'ମନର ଶାନ୍ତି ଆଣେ, ବାଧାବିଘ୍ନ ଦୂର କରେ ଏବଂ ଦୈନନ୍ଦିନ ଜୀବନ ପାଇଁ ଈଶ୍ୱରଙ୍କ ଅନୁଗ୍ରହ ଆମନ୍ତ୍ରଣ କରେ।',
    price: 51,
    duration: '15 ମିନିଟ୍',
    supportedDeities: ['ମା ଦୁର୍ଗା', 'ହନୁମାନ', 'କୃଷ୍ଣ', 'ଜଗନ୍ନାଥ', 'ମହାଦେବ', 'ମା କାଳୀ'],
    image: 'images/archana.jpg',
    available: true
  },
  {
    id: 'abhishekam',
    name: 'ଅଭିଷେକ',
    category: 'pooja',
    description: 'ମନ୍ତ୍ର ଜପ ସହିତ କ୍ଷୀର, ମହୁ, ଘିଅ, ଦହି ଏବଂ ପବିତ୍ର ଜଳ ଦ୍ୱାରା ଦେବତାଙ୍କର ପବିତ୍ର ସ୍ନାନ ରୀତିନୀତି।',
    requiredItems: ['କ୍ଷୀର', 'ମହୁ', 'ଘିଅ', 'ଦହି', 'ପବିତ୍ର ଜଳ', 'ବେଲ ପତ୍ର', 'ଫୁଲ'],
    benefits: 'ମନ ଓ ଆତ୍ମାକୁ ପବିତ୍ର କରେ, ପାପ ଦୂର କରେ, ସମୃଦ୍ଧି ଆଣେ ଏବଂ ଆଧ୍ୟାତ୍ମିକ ଉନ୍ନତି ପ୍ରଦାନ କରେ।',
    price: 501,
    duration: '30 ମିନିଟ୍',
    supportedDeities: ['ମହାଦେବ', 'କୃଷ୍ଣ', 'ଜଗନ୍ନାଥ'],
    image: 'images/abhishekam.jpg',
    available: true
  },
  {
    id: 'satyanarayan',
    name: 'ସତ୍ୟନାରାୟଣ ପୂଜା',
    category: 'pooja',
    description: 'ପରିବାରର ସମୃଦ୍ଧି ଏବଂ ଶାନ୍ତି ପାଇଁ କଥା ପାଠ ସହିତ ଭଗବାନ ବିଷ୍ଣୁଙ୍କର ସମ୍ପୂର୍ଣ୍ଣ ଆରାଧନା।',
    requiredItems: ['କଦଳୀ ପତ୍ର', 'ଫଳ', 'ଫୁଲ', 'ପଞ୍ଚାମୃତ', 'ନଡ଼ିଆ', 'ପାନ ପତ୍ର', 'ପିତା'],
    benefits: 'ଇଚ୍ଛା ପୂରଣ କରେ, ପରିବାରରେ ଶାନ୍ତି ଆଣେ, ପ୍ରୟାସରେ ସଫଳତା ସୁନିଶ୍ଚିତ କରେ ଏବଂ ବାଧାବିଘ୍ନ ଦୂର କରେ।',
    price: 1100,
    duration: '2 ଘଣ୍ଟା',
    supportedDeities: ['କୃଷ୍ଣ', 'ଜଗନ୍ନାଥ'],
    image: 'images/satyanarayan.jpg',
    available: true
  },
  {
    id: 'rudrabhishek',
    name: 'ରୁଦ୍ରାଭିଷେକ',
    category: 'pooja',
    description: 'ରୁଦ୍ରମ ଜପ ସହିତ ଭଗବାନ ଶିବଙ୍କର ଶକ୍ତିଶାଳୀ ଅଭିଷେକ, ମହାଦେବଙ୍କ ଉଗ୍ର ତଥାପି ଦୟାଳୁ ରୂପକୁ ଆମନ୍ତ୍ରଣ କରେ।',
    requiredItems: ['କ୍ଷୀର', 'ମହୁ', 'ବେଲ ପତ୍ର', 'ଧୁତୁରା', 'ବେଲ ପତ୍ର', 'ଗଙ୍ଗାଜଳ', 'ବିଭୂତି'],
    benefits: 'ନକାରାତ୍ମକତା ଦୂର କରେ, ରୋଗ ଭଲ କରେ, ମାନସିକ ଶାନ୍ତି ପ୍ରଦାନ କରେ ଏବଂ ଇଚ୍ଛା ପୂରଣ କରେ।',
    price: 1100,
    duration: '45 ମିନିଟ୍',
    supportedDeities: ['ମହାଦେବ'],
    image: 'images/rudrabhishek.jpg',
    available: true
  },
  {
    id: 'durga-saptashati',
    name: 'ଦୁର୍ଗା ସପ୍ତଶତୀ ପାଠ',
    category: 'pooja',
    description: 'ଦେବୀ ଦୁର୍ଗାଙ୍କୁ ମହିମାନ୍ୱିତ କରୁଥିବା 700 ଶ୍ଳୋକର ସମ୍ପୂର୍ଣ୍ଣ ପାଠ, ଦିବ୍ୟ ନାରୀ ଶକ୍ତିର ସବୁଠାରୁ ଶକ୍ତିଶାଳୀ ଆବାହନ।',
    requiredItems: ['ନାଲି ଫୁଲ', 'କୁଙ୍କୁମ', 'ହଳଦୀ', 'ନଡ଼ିଆ', 'ଧୂପ', 'ଘିଅ ଦୀପ', 'ଫଳ'],
    benefits: 'ଶତ୍ରୁନାଶ କରେ, ଭୟ ଦୂର କରେ, ସାହସ ପ୍ରଦାନ କରେ, ମନ୍ଦ ଶକ୍ତିରୁ ରକ୍ଷା କରେ ଏବଂ ବିଜୟ ସୁନିଶ୍ଚିତ କରେ।',
    price: 2100,
    duration: '3 ଘଣ୍ଟା',
    supportedDeities: ['ମା ଦୁର୍ଗା', 'ମା କାଳୀ'],
    image: 'images/durga-saptashati.jpg',
    available: true
  },
  {
    id: 'hanuman-chalisa',
    name: 'ହନୁମାନ ଚାଳିଶା ପାଠ',
    category: 'pooja',
    description: 'ଭକ୍ତି ଏବଂ ଶକ୍ତିର ପ୍ରତୀକ ଭଗବାନ ହନୁମାନଙ୍କ ପ୍ରଶଂସାରେ 40 ଟି ଶ୍ଳୋକର ଭକ୍ତିମୂଳକ ପାଠ।',
    requiredItems: ['ସିନ୍ଦୂର', 'ଚମେଲି ତେଲ', 'ନାଲି ଫୁଲ', 'ବେସନ ଲଡୁ', 'ଧୂପ'],
    benefits: 'ବାଧାବିଘ୍ନ ଦୂର କରେ, ଶକ୍ତି ଓ ସାହସ ପ୍ରଦାନ କରେ, ନକାରାତ୍ମକ ଶକ୍ତିରୁ ରକ୍ଷା କରେ, ସଫଳତା ସୁନିଶ୍ଚିତ କରେ।',
    price: 251,
    duration: '30 ମିନିଟ୍',
    supportedDeities: ['ହନୁମାନ'],
    image: 'images/hanuman-chalisa.jpg',
    available: true
  }
];

// 1. Initialize Products
function initializeProducts() {
  const stored = localStorage.getItem(ENTITY_ID);
  
  // Robust check: invalid JSON, empty array, or null
  let products = [];
  try {
      products = stored ? JSON.parse(stored) : [];
  } catch (e) {
      console.error("Data corruption detected. Resetting to defaults.");
      products = [];
  }

  // If completely empty, restore defaults
  if (products.length === 0) {
      console.log("Initializing Default Products...");
      saveProducts(DEFAULT_PRODUCTS);
      return;
  }

  // Flag to check if we updated anything
  let updated = false;

  // Fix image paths if they still have 'assets/' prefix
  products.forEach(product => {
    if (product.image && product.image.startsWith('assets/')) {
      product.image = product.image.replace('assets/', '');
      updated = true;
    }
  });

  // Check for missing categories and restore if needed
  const hasPoojas = products.some(p => p.category === 'pooja');
  const hasPrasad = products.some(p => p.category === 'prasad');
  const hasItems = products.some(p => p.category === 'temple-item');
  const hasMahaprasad = products.some(p => p.category === 'mahaprasad');

  if (!hasPoojas) {
      products = [...products, ...DEFAULT_PRODUCTS.filter(p => p.category === 'pooja')];
      updated = true;
  }
  if (!hasPrasad) {
      products = [...products, ...DEFAULT_PRODUCTS.filter(p => p.category === 'prasad')];
      updated = true;
  }
  if (!hasItems) {
      products = [...products, ...DEFAULT_PRODUCTS.filter(p => p.category === 'temple-item')];
      updated = true;
  }
  if (!hasMahaprasad) {
      products = [...products, ...DEFAULT_PRODUCTS.filter(p => p.category === 'mahaprasad')];
      updated = true;
  }

  if (updated) {
      console.log("Restored missing default categories.");
      saveProducts(products);
  }
}

// 2. Get Products
function getProducts() {
  const data = localStorage.getItem(ENTITY_ID);
  try {
      return data ? JSON.parse(data) : [];
  } catch (e) {
      return [];
  }
}

// 3. Save Products
function saveProducts(products) {
  localStorage.setItem(ENTITY_ID, JSON.stringify(products));
}

// 4. Update Product
function updateProduct(id, updates) {
  const products = getProducts();
  const index = products.findIndex(p => p.id === id);
  
  if (index !== -1) {
    products[index] = { ...products[index], ...updates };
    saveProducts(products);
    console.log(`Product ${id} updated.`);
    return true;
  }
  return false;
}

// 5. Delete Product
function deleteProductData(id) {
  const products = getProducts();
  const initialLength = products.length;
  const filtered = products.filter(p => p.id !== id);
  
  if (filtered.length < initialLength) {
    saveProducts(filtered);
    console.log(`Product ${id} deleted.`);
    return true;
  }
  return false;
}

// 6. Reset to Defaults
function resetProducts() {
  if(confirm("ଆପଣ ନିଶ୍ଚିତ କି ଆପଣ ସମସ୍ତ ଡାଟା ଡିଫଲ୍ଟକୁ ରିସେଟ୍ କରିବାକୁ ଚାହୁଁଛନ୍ତି? ଏହା ପୁନର୍ବାର ଫେରାଯାଇପାରିବ ନାହିଁ।")) {
      localStorage.setItem(ENTITY_ID, JSON.stringify(DEFAULT_PRODUCTS));
      alert("ସାମଗ୍ରୀଗୁଡିକ ଡିଫଲ୍ଟକୁ ରିସେଟ୍ ହୋଇଗଲା!");
      location.reload();
  }
}

// 7. Getters for Specific Categories
function getPoojas() {
    return getProducts().filter(p => p.category === 'pooja' && p.available !== false);
}

function getItems() {
    return getProducts().filter(p => (p.category === 'prasad' || p.category === 'temple-item') && p.available !== false);
}

function getMahaprasadItems() {
    return getProducts().filter(p => p.category === 'mahaprasad' && p.available !== false);
}

// Auto-initialize on load
initializeProducts();
