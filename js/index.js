



// ==========================================
// USER PAGE LOGIC (index.js)
// Renders products on offerings.html
// Uses functions from products.js
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    console.log("Loading User Page with NEW Product Logic...");
    renderUserProducts();
    
    // Listen for bfcache
    window.addEventListener('pageshow', (event) => {
        if (event.persisted) {
            renderUserProducts();
        }
    });
});

function renderUserProducts() {
    const products = getProducts();
    
    // Category Containers
    const prasadList = document.getElementById('prasad-list');
    const templeList = document.getElementById('temple-items-list');
    const mahaprasadList = document.getElementById('mahaprasad-items-list');

    // 1. Render Prasad
    if (prasadList) {
        const items = products.filter(p => p.category === 'prasad');
        prasadList.innerHTML = items.map(p => renderCard(p, 'prasad')).join('');
    }

    // 2. Render Temple Items
    if (templeList) {
        const items = products.filter(p => p.category === 'temple-item');
        templeList.innerHTML = items.map(p => renderCard(p, 'temple')).join('');
    }

    // 3. Render Mahaprasad
    if (mahaprasadList) {
        const items = products.filter(p => p.category === 'mahaprasad');
        mahaprasadList.innerHTML = items.map(p => renderMahaprasadRow(p)).join('');
    }
}

// Generic Card Renderer
function renderCard(product, type) {
    const isAvailable = product.available;
    const btnHtml = isAvailable 
        ? `<button onclick="addToCart('${product.id}', '${product.name}', ${product.price})" class="btn-divine w-full py-3 rounded-lg font-bold flex items-center justify-center gap-2 text-sm uppercase tracking-wide">
             🛒 Add to Cart
           </button>`
        : `<button disabled class="w-full py-3 rounded-lg font-semibold bg-gray-400 cursor-not-allowed text-white shadow-inner">
             🚫 Out of Stock
           </button>`;

    return `
    <div class="card-premium rounded-xl overflow-hidden fade-in-up ${!isAvailable ? 'opacity-75' : ''}">
        <div class="h-56 relative overflow-hidden">
            <img src="${product.image}" alt="${product.name}" class="w-full h-full object-cover">
            ${isAvailable 
                ? '<div class="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">Available</div>' 
                : '<div class="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">Out of Stock</div>'}
        </div>
        <div class="p-6 relative z-10">
            <h3 class="text-2xl font-bold mb-2" style="color: var(--maroon);">${product.name}</h3>
            <p class="text-gray-600 mb-4 h-12 overflow-hidden">${product.description}</p>
            <div class="flex items-center justify-between mb-4">
                <span class="text-2xl font-bold" style="color: var(--saffron);">₹${product.price}</span>
            </div>
            ${btnHtml}
        </div>
    </div>
    `;
}

// Mahaprasad Row Renderer
function renderMahaprasadRow(item) {
    const isAvailable = item.available;
    
    return `
    <div class="flex items-center justify-between p-4 rounded-lg border-2 transition-all ${isAvailable ? 'bg-white hover:shadow-md' : 'bg-gray-50'}" style="border-color: ${isAvailable ? 'var(--gold)' : '#e5e7eb'};">
        <div class="flex-1">
            <div class="flex items-center gap-2 mb-1">
                <span class="font-bold text-lg" style="color: var(--maroon);">${item.name}</span>
                ${item.nameEnglish ? `<span class="text-gray-600">(${item.nameEnglish})</span>` : ''}
                ${!isAvailable ? '<span class="ml-2 text-red-500 text-sm font-bold">OUT OF STOCK</span>' : ''}
            </div>
            <p class="text-sm text-gray-500 mb-2">${item.description}</p>
            <div class="flex items-center gap-4">
                <span class="text-lg font-bold" style="color: var(--saffron);">₹${item.price}</span>
            </div>
        </div>
        
        ${isAvailable ? `
        <div class="flex items-center gap-3 bg-gray-100 rounded-lg p-2">
            <button onclick="updateMahaprasadQty('${item.id}', -1)" class="w-10 h-10 rounded-lg bg-white border-2 border-gray-300 hover:border-orange-500 font-bold text-xl transition-all" style="color: var(--saffron);">−</button>
            <span id="mp-qty-${item.id}" data-price="${item.price}" class="text-xl font-bold w-12 text-center">0</span>
            <button onclick="updateMahaprasadQty('${item.id}', 1)" class="w-10 h-10 rounded-lg bg-white border-2 border-gray-300 hover:border-orange-500 font-bold text-xl transition-all" style="color: var(--saffron);">+</button>
        </div>
        ` : `
        <span class="px-4 py-2 bg-gray-200 text-gray-500 rounded-lg text-sm font-bold">Unavailable</span>
        `}
    </div>
    `;
}
