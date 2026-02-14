// ==========================================
// ADMIN PANEL LOGIC (admin.js)
// Uses functions from products.js
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    try {
        renderAllAdminTabs();
    } catch (e) {
        console.error("Initial Render Error:", e);
    }
    setupAllAdminForms();
    
    // Initial Render for new modules
    renderBookingControl();
});

// =======================
// RENDER LOGIC
// =======================
function renderAllAdminTabs() {
    const products = getProducts();
    
    // Admin sees ALL products, including unavailable ones
    const poojas = products.filter(p => p.category === 'pooja');
    const items = products.filter(p => p.category === 'temple-item' || p.category === 'prasad');
    const mahaprasad = products.filter(p => p.category === 'mahaprasad');

    renderList('poojas-list', poojas, 'pooja');
    renderList('items-list', items, 'item');
    renderList('mahaprasad-items-admin', mahaprasad, 'mahaprasad');
}

function renderList(containerId, items, type) {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (items.length === 0) {
        container.innerHTML = `<p class="text-gray-500 text-center py-4">କୌଣସି ସାମଗ୍ରୀ ମିଳିଲା ନାହିଁ।</p>`;
        return;
    }

    container.innerHTML = items.map(item => `
        <div class="card-premium rounded-lg p-4 mb-4 flex justify-between items-start">
            <div class="flex-1">
                <h3 class="font-bold text-lg mb-1" style="color: var(--maroon);">${item.name}</h3>
                <p class="text-sm text-gray-600 mb-2">${item.description}</p>
                <div class="flex gap-4 items-center flex-wrap">
                    <span class="font-semibold">₹${item.price}</span>
                    <span class="px-2 py-1 rounded text-xs ${item.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}">
                        ${item.available ? 'ଉପଲବ୍ଧ' : 'ଅନୁପଲବ୍ଧ'}
                    </span>
                    <span class="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded capitalize">${item.category}</span>
                    ${item.duration ? `<span class="text-xs text-gray-500">⏱ ${item.duration}</span>` : ''}
                </div>
            </div>
            <div class="flex flex-col gap-2 ml-4">
                <button onclick="openEditModal('${item.id}')" class="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm shadow-sm transition-all hover:-translate-y-0.5">
                    ସମ୍ପାଦନ
                </button>
                <button onclick="toggleAvailability('${item.id}')" class="px-3 py-1 text-white rounded text-sm shadow-sm transition-all hover:-translate-y-0.5 ${item.available ? 'bg-[var(--saffron)] hover:opacity-90' : 'bg-green-500 hover:bg-green-600'}">
                    ${item.available ? 'ନିଷ୍କ୍ରିୟ' : 'ସକ୍ରିୟ'}
                </button>
                <button onclick="deleteProduct('${item.id}')" class="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm shadow-sm transition-all hover:-translate-y-0.5">
                    ଡିଲିଟ୍
                </button>
            </div>
        </div>
    `).join('');
}

// =======================
// FORM HANDLERS
// =======================
function setupAllAdminForms() {
    setupForm('add-pooja-form', 'pooja');
    setupForm('add-item-form', 'item');
    setupForm('add-mahaprasad-form', 'mahaprasad');
}

function setupForm(formId, type) {
    const form = document.getElementById(formId);
    if (!form) return;

    // Use onsubmit to overwrite any previous listeners and ensure no duplication
    form.onsubmit = (e) => {
        e.preventDefault();
        
        try {
            const formData = new FormData(e.target);
            const id = formData.get('id').trim();
            const isEdit = form.getAttribute('data-is-edit') === 'true'; 
            
            // Construct Product Object
            const product = {
                id: id,
                name: formData.get('name').trim(),
                price: parseInt(formData.get('price')),
                description: formData.get('description'),
                available: formData.get('status') ? formData.get('status') === 'available' : true,
                image: `assets/images/${type}/${id}.jpg` // Default path
            };

            // Type Specific Fields
            if (type === 'pooja') {
                product.category = 'pooja';
                product.duration = formData.get('duration');
                product.benefits = formData.get('benefits');
                
                const requiredItemsStr = formData.get('requiredItems') || '';
                product.requiredItems = requiredItemsStr.split(',').map(s => s.trim()).filter(Boolean);

                const supportedDeitiesStr = formData.get('supportedDeities') || '';
                product.supportedDeities = supportedDeitiesStr.split(',').map(s => s.trim()).filter(Boolean);

            } else if (type === 'mahaprasad') {
                product.category = 'mahaprasad';
                product.nameEnglish = formData.get('nameEnglish');
            } else {
                product.category = formData.get('category'); 
            }

            // Save Logic
            const products = getProducts();
            const existingIndex = products.findIndex(p => p.id === id);

            if (existingIndex !== -1) {
                // UPDATE
                // Preserve image if not changing
                const existing = products[existingIndex];
                product.image = existing.image; 
                
                if(updateProduct(id, product)){
                    showNotification('ସଫଳତାର ସହ ଅପଡେଟ୍ ହୋଇଛି', 'success');
                } else {
                    showNotification('ଅପଡେଟ୍ ବିଫଳ ହୋଇଛି!', 'error');
                }
            } else {
                // CREATE
                if (isEdit) {
                     showNotification('ତ୍ରୁଟି: ଅପଡେଟ୍ ପାଇଁ ସାମଗ୍ରୀ ଆଇଡି ମିଳିଲା ନାହିଁ।', 'error');
                     return false;
                }
                if(products.some(p => p.id === id)) {
                     showNotification('ତ୍ରୁଟି: ସାମଗ୍ରୀ ଆଇଡି ପୂର୍ବରୁ ଅଛି!', 'error');
                     return false;
                }
                products.push(product);
                saveProducts(products);
                showNotification('ସଫଳତାର ସହ ତିଆରି ହୋଇଛି', 'success');
            }

            // Reset Form & UI
            resetForm(formId); 
            renderAllAdminTabs();

        } catch (err) {
            console.error("Form Processing Error:", err);
            showNotification('ଫର୍ମ ପ୍ରକ୍ରିୟାକରଣରେ ତ୍ରୁଟି', 'error');
        }
        return false; // Force stop propagation
    };
}

// =======================
// ACTIONS
// =======================

window.deleteProduct = function(id) {
    if (confirm('ଏହି ସାମଗ୍ରୀକୁ ଡିଲିଟ୍ କରିବେ କି?')) {
        if (deleteProductData(id)) {
            renderAllAdminTabs();
            showNotification('ଡିଲିଟ୍ ହୋଇଛି', 'success');
        } else {
            showNotification('ଡିଲିଟ୍ କରିବାରେ ତ୍ରୁଟି', 'error');
        }
    }
};

window.toggleAvailability = function(id) {
    const products = getProducts();
    const product = products.find(p => p.id === id);
    if (product) {
        updateProduct(id, { available: !product.available });
        renderAllAdminTabs();
    }
};

window.openEditModal = function(id) {
    const products = getProducts();
    const product = products.find(p => p.id === id);
    if (!product) return;

    let formId, tabId, submitBtnId, cancelBtnId;

    if (product.category === 'pooja') {
        formId = 'add-pooja-form';
        tabId = 'poojas-tab';
        submitBtnId = 'pooja-submit-btn';
        cancelBtnId = 'pooja-cancel-btn';
    } else if (product.category === 'mahaprasad') {
        formId = 'add-mahaprasad-form';
        tabId = 'mahaprasad-tab';
        submitBtnId = 'mahaprasad-submit-btn';
        cancelBtnId = 'mahaprasad-cancel-btn';
    } else {
        formId = 'add-item-form';
        tabId = 'items-tab';
        submitBtnId = 'item-submit-btn';
        cancelBtnId = 'item-cancel-btn';
    }

    // Switch Tab
    if(window.switchTab) {
        switchTab(tabId.replace('-tab', '')); 
    }

    // Populate Form
    const form = document.getElementById(formId);
    if (!form) return;

    // Set Edit Mode Flag
    form.setAttribute('data-is-edit', 'true');

    // Update Buttons
    const submitBtn = document.getElementById(submitBtnId);
    const cancelBtn = document.getElementById(cancelBtnId);
    
    if (submitBtn) {
        submitBtn.textContent = 'ବିବରଣୀ ଅପଡେଟ୍ କରନ୍ତୁ'; 
        submitBtn.classList.add('bg-blue-600', 'hover:bg-blue-700');
        // Remove Divine Classes
        submitBtn.classList.remove('btn-divine'); 
    }
    if (cancelBtn) cancelBtn.classList.remove('hidden');

    // Common fields
    setVal(form, 'id', product.id);
    setVal(form, 'name', product.name);
    setVal(form, 'price', product.price);
    setVal(form, 'description', product.description);
    setVal(form, 'status', product.available ? 'available' : 'unavailable');

    if (product.category === 'pooja') {
        setVal(form, 'duration', product.duration);
        setVal(form, 'benefits', product.benefits);
        const reqItems = product.requiredItems ? product.requiredItems.join(', ') : '';
        setVal(form, 'requiredItems', reqItems);
        const deities = product.supportedDeities ? product.supportedDeities.join(', ') : '';
        setVal(form, 'supportedDeities', deities);
    } else if (product.category === 'mahaprasad') {
        setVal(form, 'nameEnglish', product.nameEnglish);
    } else {
        setVal(form, 'category', product.category);
    }

    if (form.elements['id']) form.elements['id'].readOnly = true;
    form.scrollIntoView({ behavior: 'smooth' });
};

function setVal(form, name, value) {
    if (form.elements[name]) form.elements[name].value = value;
}

window.resetPoojaForm = function() { resetForm('add-pooja-form', 'pooja-submit-btn', 'pooja-cancel-btn', 'ପୂଜା ଯୋଡନ୍ତୁ'); }
window.resetItemForm = function() { resetForm('add-item-form', 'item-submit-btn', 'item-cancel-btn', 'ସାମଗ୍ରୀ ଯୋଡନ୍ତୁ'); }
window.resetMahaprasadForm = function() { resetForm('add-mahaprasad-form', 'mahaprasad-submit-btn', 'mahaprasad-cancel-btn', 'ମହାପ୍ରସାଦ ଯୋଡନ୍ତୁ'); }

function resetForm(formId, submitBtnId, cancelBtnId, defaultBtnText) {
    const form = document.getElementById(formId);
    if(form) {
        form.reset();
        form.removeAttribute('data-is-edit');
        if (form.elements['id']) form.elements['id'].readOnly = false;
        
        // Find buttons if IDs not passed (helper logic)
        if(!submitBtnId) { 
             // Infer from form Id
             if(formId.includes('pooja')) { submitBtnId = 'pooja-submit-btn'; cancelBtnId = 'pooja-cancel-btn'; defaultBtnText = 'ପୂଜା ଯୋଡନ୍ତୁ'; }
             else if(formId.includes('mahaprasad')) { submitBtnId = 'mahaprasad-submit-btn'; cancelBtnId = 'mahaprasad-cancel-btn'; defaultBtnText = 'ମହାପ୍ରସାଦ ଯୋଡନ୍ତୁ'; }
             else { submitBtnId = 'item-submit-btn'; cancelBtnId = 'item-cancel-btn'; defaultBtnText = 'ସାମଗ୍ରୀ ଯୋଡନ୍ତୁ'; }
        }

        const submitBtn = document.getElementById(submitBtnId);
        const cancelBtn = document.getElementById(cancelBtnId);

        if(submitBtn) {
            submitBtn.textContent = defaultBtnText;
            submitBtn.classList.remove('bg-blue-600', 'hover:bg-blue-700'); 
            // Add back Divine Classes
            submitBtn.classList.add('btn-divine');
        }
        if(cancelBtn) cancelBtn.classList.add('hidden');
    }
}

// Tab Switching logic helper (used if not defined globally)
window.switchTab = function(tabName) {
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
        if(content.id === tabName + '-tab') content.classList.add('active');
    });
    
    // Update Tab Buttons - assuming they have onclick matching the tab name
    document.querySelectorAll('button[onclick*="switchTab"]').forEach(btn => {
        btn.classList.remove('active');
        if(btn.getAttribute('onclick').includes(tabName)) btn.classList.add('active');
    });
};

// =======================
// BOOKING CONTROL LOGIC
// =======================

// Mock Data Generator
function generateMockBookings() {
    if (localStorage.getItem('templeBookings')) return;

    const mockBookings = [
        { id: 'BK-1001', date: '2023-10-25', devoteeName: 'Ramesh Kumar', mobile: '9876543210', email: 'ramesh@example.com', address: 'Bhubaneswar, Odisha', poojaName: 'Rudrabhishek', deity: 'Mahadev', price: 1100, gotra: 'Kashyap', status: 'confirmed' },
        { id: 'BK-1002', date: '2023-10-26', devoteeName: 'Sita Devi', mobile: '8765432109', email: 'sita@example.com', address: 'Cuttack, Odisha', poojaName: 'Archana', deity: 'Maa Durga', price: 51, gotra: 'Bharadwaj', status: 'pending' },
        { id: 'BK-1003', date: '2023-10-24', devoteeName: 'Gopal Das', mobile: '7654321098', email: 'gopal@example.com', address: 'Puri, Odisha', poojaName: 'Satyanarayan Pooja', deity: 'Vishnu', price: 1100, gotra: 'Atri', status: 'completed' },
        { id: 'BK-1004', date: '2023-10-27', devoteeName: 'Anita Mohanty', mobile: '6543210987', email: 'anita@example.com', address: 'Rourkela, Odisha', poojaName: 'Abhishekam', deity: 'Mahadev', price: 501, gotra: 'Nagesh', status: 'pending' },
        { id: 'BK-1005', date: '2023-10-25', devoteeName: 'Rajesh Singh', mobile: '9988776655', email: 'spam@test.com', address: 'Unknown', poojaName: 'Test Pooja', deity: 'None', price: 0, gotra: 'None', status: 'pending' }
    ];
    localStorage.setItem('templeBookings', JSON.stringify(mockBookings));
    console.log("Mock bookings generated.");
}

// Ensure mock data exists
generateMockBookings();

function getBookings() {
    try {
        return JSON.parse(localStorage.getItem('templeBookings') || '[]');
    } catch (e) {
        return [];
    }
}

function saveBookings(bookings) {
    localStorage.setItem('templeBookings', JSON.stringify(bookings));
}

function renderBookingControl() {
    const bookings = getBookings();
    const tableBody = document.getElementById('bookings-table-body');
    
    // Stats
    const totalEl = document.getElementById('total-bookings-count');
    const pendingEl = document.getElementById('pending-bookings-count');
    const completedEl = document.getElementById('completed-bookings-count');

    if(totalEl) totalEl.textContent = bookings.length;
    if(pendingEl) pendingEl.textContent = bookings.filter(b => b.status === 'pending').length;
    if(completedEl) completedEl.textContent = bookings.filter(b => b.status === 'completed').length;

    // Populate Pooja Filter Options (Unique)
    const poojaFilterSelect = document.getElementById('booking-pooja-filter');
    if (poojaFilterSelect) {
        const uniquePoojas = [...new Set(bookings.map(b => b.poojaName))];
        const currentVal = poojaFilterSelect.value;
        // Keep 'all' option
        let options = `<option value="all">ସମସ୍ତ ପୂଜା (All Poojas)</option>`;
        uniquePoojas.forEach(p => {
            options += `<option value="${p}" ${currentVal === p ? 'selected' : ''}>${p}</option>`;
        });
        // Only update if options changed to avoid flicker/reset, or just update always for simplicity in this context
        // Better: check if number of options is different or force update.
        // For simplicity: We will re-render options if they are different from current children count - 1
        if(poojaFilterSelect.children.length !== uniquePoojas.length + 1) {
             poojaFilterSelect.innerHTML = options;
             poojaFilterSelect.value = currentVal; // Restore selection
        }
    }

    // Filter Logic
    const dateInput = document.getElementById('booking-date-filter');
    const statusInput = document.getElementById('booking-status-filter');
    
    const dateFilter = dateInput ? dateInput.value : '';
    const statusFilter = statusInput ? statusInput.value : 'all';
    const poojaFilter = poojaFilterSelect ? poojaFilterSelect.value : 'all';

    let filteredBookings = bookings.sort((a, b) => new Date(b.date) - new Date(a.date));

    if (dateFilter) {
        filteredBookings = filteredBookings.filter(b => b.date === dateFilter);
    }
    if (statusFilter !== 'all') {
        filteredBookings = filteredBookings.filter(b => b.status === statusFilter);
    }
    if (poojaFilter !== 'all') {
        filteredBookings = filteredBookings.filter(b => b.poojaName === poojaFilter);
    }

    if (!tableBody) return;

    if (filteredBookings.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="7" class="px-6 py-4 text-center text-gray-500">କୌଣସି ବୁକିଂ ମିଳିଲା ନାହିଁ।</td></tr>`;
        return;
    }

    tableBody.innerHTML = filteredBookings.map(b => {
        let statusColor = 'bg-gray-100 text-gray-700';
        if (b.status === 'confirmed') statusColor = 'bg-green-100 text-green-700';
        else if (b.status === 'pending') statusColor = 'bg-yellow-100 text-yellow-700';
        else if (b.status === 'completed') statusColor = 'bg-blue-100 text-blue-700';
        else if (b.status === 'cancelled') statusColor = 'bg-red-100 text-red-700';

        const canDelete = b.status === 'completed' || b.status === 'cancelled';
        const deleteClass = canDelete ? 'text-red-600 hover:bg-red-50' : 'text-gray-300 cursor-not-allowed';
        const deleteAction = canDelete ? `deleteBooking('${b.id}')` : '';

        return `
        <tr class="hover:bg-gray-50 transition-colors">
            <td class="px-6 py-4 font-medium text-gray-900">${b.id}</td>
            <td class="px-6 py-4">${b.date}</td>
            <td class="px-6 py-4">${b.devoteeName}</td>
            <td class="px-6 py-4">${b.poojaName}</td>
            <td class="px-6 py-4">₹${b.price}</td>
            <td class="px-6 py-4">
                <select onchange="updateBookingStatus('${b.id}', this.value)" class="px-2 py-1 rounded-full text-xs font-semibold uppercase ${statusColor} border-none focus:ring-0 cursor-pointer">
                    <option value="pending" ${b.status === 'pending' ? 'selected' : ''}>Pending</option>
                    <option value="confirmed" ${b.status === 'confirmed' ? 'selected' : ''}>Confirmed</option>
                    <option value="completed" ${b.status === 'completed' ? 'selected' : ''}>Completed</option>
                    <option value="cancelled" ${b.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
                </select>
            </td>
            <td class="px-6 py-4 text-center">
                <div class="flex justify-center gap-2">
                    <button onclick="viewBookingDetails('${b.id}')" class="p-1 text-blue-600 hover:bg-blue-50 rounded" title="View Details">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                    </button>
                    <button onclick="${deleteAction}" class="p-1 ${deleteClass} rounded" title="${canDelete ? 'Delete Booking' : 'Complete or Cancel to delete'}">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                </div>
            </td>
        </tr>
        `;
    }).join('');
}

// Add event listeners for filters - wait for DOM
setTimeout(() => {
    document.getElementById('booking-date-filter')?.addEventListener('change', renderBookingControl);
    document.getElementById('booking-status-filter')?.addEventListener('change', renderBookingControl);
    document.getElementById('booking-pooja-filter')?.addEventListener('change', renderBookingControl);
}, 1000);

// Actions
window.updateBookingStatus = function(id, newStatus) {
    let bookings = getBookings();
    const index = bookings.findIndex(b => b.id === id);
    if (index !== -1) {
        bookings[index].status = newStatus;
        saveBookings(bookings);
        renderBookingControl();
        showNotification(`Booking status updated to ${newStatus}`, 'success');
        
        // Trigger WhatsApp Notification
        sendWhatsAppUpdate(bookings[index], newStatus);
    }
}

function sendWhatsAppUpdate(booking, status) {
    if (!booking.mobile) return;
    
    // Ensure mobile number has country code (assuming India +91 if length is 10)
    let mobile = booking.mobile.replace(/\D/g, ''); // Remove non-digits
    if (mobile.length === 10) mobile = '91' + mobile;
    
    let message = "";
    const date = booking.date; // Date string
    const pooja = booking.poojaName; // Pooja Name
    
    // Construct Message based on Status
    switch(status) {
        case 'confirmed':
            message = `Jay Mahadev! 🙏\n\nDear Devotee,\nYour booking for *${pooja}* on *${date}* has been *CONFIRMED*.\n\nPlease arrive 15 minutes prior to the scheduled time.\n\n- Mahakaleswar Temple Administration`;
            break;
        case 'cancelled':
            message = `Jay Mahadev. 🙏\n\nDear Devotee,\nWe regret to inform you that your booking for *${pooja}* on *${date}* has been *CANCELLED* due to unavoidable circumstances.\n\nPlease contact the temple office for more details.\n\n- Mahakaleswar Temple Administration`;
            break;
        case 'completed':
            message = `Jay Mahadev! 🙏\n\nDear Devotee,\nYour *${pooja}* on *${date}* has been successfully *COMPLETED*.\n\nMay Mahaprabhu bless you and your family.\n\n- Mahakaleswar Temple Administration`;
            break;
        default:
            return; // No message for other statuses like 'pending'
    }
    
    const encodedMsg = encodeURIComponent(message);
    const url = `https://wa.me/${mobile}?text=${encodedMsg}`;
    
    // Open WhatsApp in new tab
    window.open(url, '_blank');
}

window.deleteBooking = function(id) {
    let bookings = getBookings();
    const booking = bookings.find(b => b.id === id);
    
    if (booking && (booking.status === 'completed' || booking.status === 'cancelled')) {
        if(confirm('Are you sure you want to delete this booking? This action cannot be undone.')) {
            bookings = bookings.filter(b => b.id !== id);
            saveBookings(bookings);
            renderBookingControl();
            showNotification('Booking deleted successfully', 'success');
        }
    } else {
        showNotification('Only Completed or Cancelled bookings can be deleted.', 'error');
    }
};

let currentViewingBookingId = null;

window.viewBookingDetails = function(id) {
    const bookings = getBookings();
    const booking = bookings.find(b => b.id === id);
    if (!booking) return;

    currentViewingBookingId = id;

    // Populate Modal
    document.getElementById('modal-booking-id').textContent = booking.id;
    document.getElementById('modal-devotee-name').textContent = booking.devoteeName;
    document.getElementById('modal-mobile').textContent = booking.mobile;
    document.getElementById('modal-email').textContent = booking.email;
    document.getElementById('modal-address').textContent = booking.address;
    document.getElementById('modal-pooja-name').textContent = booking.poojaName;
    document.getElementById('modal-deity').textContent = booking.deity;
    document.getElementById('modal-date').textContent = booking.date;
    document.getElementById('modal-gotra').textContent = booking.gotra;
    document.getElementById('modal-price').textContent = `₹${booking.price}`;
    
    const badge = document.getElementById('modal-status-badge');
    badge.textContent = booking.status.toUpperCase();
    badge.className = `px-3 py-1 rounded-full text-sm font-bold ${booking.status === 'confirmed' ? 'bg-green-100 text-green-700' : booking.status === 'completed' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}`;

    // Show Modal
    document.getElementById('view-booking-modal').classList.remove('hidden');
};

window.closeBookingModal = function() {
    document.getElementById('view-booking-modal').classList.add('hidden');
    currentViewingBookingId = null;
};

window.updateBookingStatusModal = function(newStatus) {
    if (!currentViewingBookingId) return;
    
    let bookings = getBookings();
    const index = bookings.findIndex(b => b.id === currentViewingBookingId);
    
    if (index !== -1) {
        bookings[index].status = newStatus;
        saveBookings(bookings);
        
        // Refresh UI
        viewBookingDetails(currentViewingBookingId); // Update modal badge
        renderBookingControl(); // Update table
        showNotification(`Status updated to ${newStatus}`, 'success');
    }
};

window.exportBookingsCSV = function() {
    const bookings = getBookings();
    if (bookings.length === 0) {
        showNotification('No data to export', 'error');
        return;
    }

    const headers = ["Booking ID", "Date", "Devotee Name", "Mobile", "Email", "Address", "Pooja", "Deity", "Price", "Gotra", "Status"];
    const rows = bookings.map(b => [
        b.id, b.date, b.devoteeName, b.mobile, b.email, b.address, b.poojaName, b.deity, b.price, b.gotra, b.status
    ]);

    let csvContent = "data:text/csv;charset=utf-8," 
        + headers.join(",") + "\n" 
        + rows.map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    
    // Create link for download
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "bookings_export.csv");
    document.body.appendChild(link); // Required for FF
    link.click();
    document.body.removeChild(link);
};

// =======================
// DONATION CONTROL LOGIC
// =======================

// Mock Donation Data
function generateMockDonations() {
    if (localStorage.getItem('donations')) return;

    const mockDonations = [
        { id: 'DON-5001', date: '2023-10-25', donorName: 'Vikram Seth', amount: 5001, purpose: 'Annadhan', mobile: '9988776655' },
        { id: 'DON-5002', date: '2023-10-26', donorName: 'Meera Nair', amount: 1001, purpose: 'Temple Maintenance', mobile: '8877665544' },
        { id: 'DON-5003', date: '2023-10-27', donorName: 'Rahul Dravid', amount: 2501, purpose: 'Festival Fund', mobile: '7766554433' },
        { id: 'DON-5004', date: new Date().toISOString().split('T')[0], donorName: 'Suresh Raina', amount: 1100, purpose: 'General Donation', mobile: '6655443322' } // Today's donation
    ];
    localStorage.setItem('donations', JSON.stringify(mockDonations));
    console.log("Mock donations generated.");
}

generateMockDonations();

function getDonations() {
    try {
        return JSON.parse(localStorage.getItem('donations') || '[]');
    } catch (e) {
        return [];
    }
}

function renderDonationControl() {
    const donations = getDonations();
    const tableBody = document.getElementById('donations-table-body');
    
    // Stats
    const totalAmount = donations.reduce((sum, d) => sum + Number(d.amount), 0);
    const today = new Date().toISOString().split('T')[0];
    const todayAmount = donations.filter(d => d.date === today).reduce((sum, d) => sum + Number(d.amount), 0);

    const totalEl = document.getElementById('total-donation-amount');
    const todayEl = document.getElementById('today-donation-amount');

    if (totalEl) totalEl.textContent = `₹${totalAmount}`;
    if (todayEl) todayEl.textContent = `₹${todayAmount}`;

    if (!tableBody) return;

    if (donations.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="6" class="px-6 py-4 text-center text-gray-500">କୌଣସି ଦାନ ମିଳିଲା ନାହିଁ।</td></tr>`;
        return;
    }

    // Sort by date desc
    const sortedDonations = donations.sort((a, b) => new Date(b.date) - new Date(a.date));

    tableBody.innerHTML = sortedDonations.map(d => `
        <tr class="hover:bg-gray-50 transition-colors">
            <td class="px-6 py-4 font-medium text-gray-900">${d.id}</td>
            <td class="px-6 py-4">${d.date}</td>
            <td class="px-6 py-4">${d.donorName}</td>
            <td class="px-6 py-4 font-semibold text-green-700">₹${d.amount}</td>
            <td class="px-6 py-4">${d.purpose}</td>
            <td class="px-6 py-4 text-gray-500">${d.mobile}</td>
        </tr>
    `).join('');
}

window.exportDonationsCSV = function() {
    const donations = getDonations();
    if (donations.length === 0) {
        showNotification('No data to export', 'error');
        return;
    }

    const headers = ["Donation ID", "Date", "Donor Name", "Amount", "Purpose", "Mobile"];
    const rows = donations.map(d => [
        d.id, d.date, d.donorName, d.amount, d.purpose, d.mobile
    ]);

    let csvContent = "data:text/csv;charset=utf-8," 
        + headers.join(",") + "\n" 
        + rows.map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "donations_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

// =======================
// GALLERY MANAGEMENT LOGIC
// =======================

function generateMockGallery() {
    if (localStorage.getItem('galleryImages')) return;

    const mockImages = [
        { id: 'IMG-101', title: 'Morning Aarti', category: 'temple', url: 'https://images.unsplash.com/photo-1542397284385-6010376c5337?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60', dateAdded: '2023-10-20' },
        { id: 'IMG-102', title: 'Mahadev Idol', category: 'deity', url: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60', dateAdded: '2023-10-21' },
        { id: 'IMG-103', title: 'Diwali Celebration', category: 'festival', url: 'https://images.unsplash.com/photo-1516724562728-afc824a36e84?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60', dateAdded: '2023-10-22' }
    ];
    localStorage.setItem('galleryImages', JSON.stringify(mockImages));
    console.log("Mock gallery generated.");
}

generateMockGallery();

function getGalleryImages() {
    try {
        return JSON.parse(localStorage.getItem('galleryImages') || '[]');
    } catch (e) {
        return [];
    }
}

function saveGalleryImages(images) {
    localStorage.setItem('galleryImages', JSON.stringify(images));
}

function renderGalleryControl() {
    const images = getGalleryImages();
    const grid = document.getElementById('gallery-grid');
    if (!grid) return;

    if (images.length === 0) {
        grid.innerHTML = `<p class="text-gray-500 col-span-full text-center py-4">କୌଣସି ଫଟୋ ନାହିଁ।</p>`;
        return;
    }

    grid.innerHTML = images.map(img => `
        <div class="relative group overflow-hidden rounded-lg shadow-md aspect-square bg-gray-100">
            <img src="${img.url}" alt="${img.title}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110">
            <div class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                <h4 class="text-white font-bold truncate">${img.title}</h4>
                <p class="text-xs text-gray-300 capitalize mb-2">${img.category}</p>
                <button onclick="deleteGalleryImage('${img.id}')" class="bg-red-500 text-white text-xs px-2 py-1 rounded hover:bg-red-600 self-start">
                    Delete
                </button>
            </div>
        </div>
    `).join('');
}

// Add Gallery Image Listener
setTimeout(() => {
    const galleryForm = document.getElementById('add-gallery-form');
    if(galleryForm) {
        galleryForm.onsubmit = (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const newImage = {
                id: 'IMG-' + Date.now(),
                title: formData.get('title'),
                category: formData.get('category'),
                url: formData.get('url'),
                dateAdded: new Date().toISOString().split('T')[0]
            };

            const images = getGalleryImages();
            images.unshift(newImage); // Add to top
            saveGalleryImages(images);
            
            showNotification('Image added successfully', 'success');
            e.target.reset();
            renderGalleryControl();
        };
    }
}, 1000);

// =======================
// MAHAPRASAD BOOKING LOGIC
// =======================

function getMahaprasadBookings() {
    try {
        return JSON.parse(localStorage.getItem('mahaprasadBookings') || '[]');
    } catch (e) {
        return [];
    }
}

function saveMahaprasadBookings(bookings) {
    localStorage.setItem('mahaprasadBookings', JSON.stringify(bookings));
}

function renderMahaprasadControl() {
    const bookings = getMahaprasadBookings();
    const container = document.getElementById('mahaprasad-bookings-list');
    
    if (!container) return;

    if (bookings.length === 0) {
        container.innerHTML = `<p class="text-gray-500 text-center py-4">କୌଣସି ମହାପ୍ରସାଦ ବୁକିଂ ନାହିଁ।</p>`;
        return;
    }

    // Sort by date desc (using bookingDate or collectionDate)
    const sortedBookings = bookings.sort((a, b) => new Date(b.bookingDate) - new Date(a.bookingDate));

    container.innerHTML = sortedBookings.map(b => {
        let statusColor = 'bg-gray-100 text-gray-700';
        // Add status if not present (backend compat)
        if(!b.status) b.status = 'pending';

        if (b.status === 'confirmed') statusColor = 'bg-green-100 text-green-700';
        else if (b.status === 'pending') statusColor = 'bg-yellow-100 text-yellow-700';
        else if (b.status === 'completed') statusColor = 'bg-blue-100 text-blue-700';
        else if (b.status === 'cancelled') statusColor = 'bg-red-100 text-red-700';

        const itemsList = b.selectedItems.map(item => 
            `<span class="text-xs bg-orange-50 text-orange-800 px-2 py-1 rounded border border-orange-100 mr-1 mb-1 inline-block">
                ${item.name} x${item.quantity}
            </span>`
        ).join('');

        return `
        <div class="card-premium rounded-lg p-4 border border-gray-100 hover:shadow-md transition-shadow">
            <div class="flex flex-col md:flex-row justify-between gap-4">
                <div class="flex-1">
                    <div class="flex items-center gap-3 mb-2">
                        <span class="font-bold text-gray-800">#${b.id}</span>
                        <span class="text-xs text-gray-500">${new Date(b.bookingDate).toLocaleDateString()}</span>
                        <select onchange="updateMahaprasadStatus('${b.id}', this.value)" class="px-2 py-1 rounded text-xs font-bold uppercase ${statusColor} border-none focus:ring-0 cursor-pointer">
                            <option value="pending" ${b.status === 'pending' ? 'selected' : ''}>Pending</option>
                            <option value="confirmed" ${b.status === 'confirmed' ? 'selected' : ''}>Confirmed</option>
                            <option value="completed" ${b.status === 'completed' ? 'selected' : ''}>Completed</option>
                            <option value="cancelled" ${b.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
                        </select>
                    </div>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-3">
                        <div>
                            <p class="font-semibold text-gray-700">ଭକ୍ତଙ୍କ ବିବରଣୀ:</p>
                            <p>${b.customerName}</p>
                            <p>${b.mobile}</p>
                            <p class="text-xs text-gray-500">${b.email}</p>
                        </div>
                        <div>
                            <p class="font-semibold text-gray-700">ସଂଗ୍ରହ ତାରିଖ:</p>
                            <p class="font-bold text-maroon">${b.collectionDate}</p>
                            ${b.notes ? `<p class="italic text-gray-500 mt-1">"${b.notes}"</p>` : ''}
                        </div>
                    </div>

                    <div class="mb-3">
                        <p class="font-semibold text-gray-700 mb-1">ଅର୍ଡର ବିବରଣୀ:</p>
                        <div class="flex flex-wrap">
                            ${itemsList}
                        </div>
                    </div>

                    <div class="flex items-center justify-between pt-2 border-t border-gray-100">
                         <span class="font-bold text-lg text-maroon">Total: ₹${b.total}</span>
                    </div>
                </div>

                <div class="flex md:flex-col justify-end gap-2">
                    <button onclick="deleteMahaprasadBooking('${b.id}')" class="p-2 text-red-500 hover:bg-red-50 rounded transition-colors" title="Delete Booking">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                    <button onclick="sendMahaprasadWhatsAppReminder('${b.id}')" class="p-2 text-green-500 hover:bg-green-50 rounded transition-colors" title="Send WhatsApp">
                        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                    </button>
                </div>
            </div>
        </div>
        `;
    }).join('');
}

window.updateMahaprasadStatus = function(id, newStatus) {
    let bookings = getMahaprasadBookings();
    const index = bookings.findIndex(b => b.id === id);
    if (index !== -1) {
        bookings[index].status = newStatus;
        saveMahaprasadBookings(bookings);
        renderMahaprasadControl();
        showNotification(`Booking updated to ${newStatus}`, 'success');
    }
};

window.deleteMahaprasadBooking = function(id) {
    if(!confirm('Are you sure you want to delete this booking?')) return;
    
    let bookings = getMahaprasadBookings();
    bookings = bookings.filter(b => b.id !== id);
    saveMahaprasadBookings(bookings);
    renderMahaprasadControl();
    showNotification('Booking deleted', 'success');
};

window.sendMahaprasadWhatsAppReminder = function(id) {
    const bookings = getMahaprasadBookings();
    const booking = bookings.find(b => b.id === id);
    if(booking) {
         // Re-use the logic from offerings.html but adapted for admin sending
         const phoneNumber = booking.mobile;
         const message = `Jay Jagannath! 🙏\n\nDear ${booking.customerName},\nYour Mahaprasad order (#${booking.id}) is ready for collection today.\n\nTotal Amount: ₹${booking.total}\n\nPlease visit the temple office to collect.\n\n- Divine Temple Administration`;
         const url = `https://wa.me/91${phoneNumber}?text=${encodeURIComponent(message)}`;
         window.open(url, '_blank');
    }
};

// Initial Render Hook
const _originalRenderTabs = window.renderAllAdminTabs;
window.renderAllAdminTabs = function() {
    if(_originalRenderTabs) _originalRenderTabs();
    if(typeof renderBookingControl === 'function') renderBookingControl();
    if(typeof renderDonationControl === 'function') renderDonationControl();
    if(typeof renderMahaprasadControl === 'function') renderMahaprasadControl();
    if(typeof renderGalleryControl === 'function') renderGalleryControl();
    if(typeof renderEventControl === 'function') renderEventControl();
};


function generateMockEvents() {
    if (localStorage.getItem('templeEvents')) return;

    const mockEvents = [
        { id: 'EVT-001', title: 'Maha Shivratri', date: '2024-03-08', description: 'Grand celebration of Maha Shivratri with all-night prayers.', image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60', status: 'upcoming' },
        { id: 'EVT-002', title: 'Kartik Purnima', date: '2023-11-27', description: 'Holy bath and lamp lighting festival.', image: 'https://images.unsplash.com/photo-1542397284385-6010376c5337?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60', status: 'upcoming' },
        { id: 'EVT-003', title: 'Diwali', date: '2023-11-12', description: 'Festival of Lights.', image: 'https://images.unsplash.com/photo-1516724562728-afc824a36e84?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60', status: 'completed' }
    ];
    localStorage.setItem('templeEvents', JSON.stringify(mockEvents));
    console.log("Mock events generated.");
}

generateMockEvents();

function getTempleEvents() {
    try {
        return JSON.parse(localStorage.getItem('templeEvents') || '[]');
    } catch (e) {
        return [];
    }
}

function saveTempleEvents(events) {
    localStorage.setItem('templeEvents', JSON.stringify(events));
}

function renderEventControl() {
    const events = getTempleEvents();
    const container = document.getElementById('events-list-container');
    if (!container) return;

    if (events.length === 0) {
        container.innerHTML = `<p class="text-gray-500 text-center py-4">କୌଣସି କାର୍ଯ୍ୟକ୍ରମ ନାହିଁ।</p>`;
        return;
    }

    // Sort: Upcoming first, then by date logic usually.
    // For simplicity, just rendering.
    container.innerHTML = events.map(evt => `
        <div class="flex flex-col md:flex-row gap-4 p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
            <div class="w-full md:w-32 h-24 rounded-lg overflow-hidden bg-gray-200 shrink-0">
                <img src="${evt.image || 'assets/images/temple-placeholder.jpg'}" alt="${evt.title}" class="w-full h-full object-cover">
            </div>
            <div class="flex-1">
                <div class="flex justify-between items-start">
                    <div>
                        <h3 class="font-bold text-lg text-gray-800">${evt.title}</h3>
                        <p class="text-sm text-amber-600 font-medium mb-1">📅 ${evt.date}</p>
                    </div>
                    <span class="px-2 py-1 rounded text-xs uppercase font-bold ${evt.status === 'upcoming' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}">
                        ${evt.status}
                    </span>
                </div>
                <p class="text-sm text-gray-600 line-clamp-2 mb-3">${evt.description}</p>
                <div class="flex gap-2">
                    <button onclick="editEventFeature('${evt.id}')" class="px-3 py-1 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded text-sm font-medium transition-colors">
                        Edit
                    </button>
                    ${evt.status === 'upcoming' ? `
                        <button onclick="toggleEventStatus('${evt.id}')" class="px-3 py-1 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded text-sm font-medium transition-colors">
                            Mark Completed
                        </button>
                    ` : `
                        <button onclick="toggleEventStatus('${evt.id}')" class="px-3 py-1 bg-green-50 text-green-600 hover:bg-green-100 rounded text-sm font-medium transition-colors">
                            Mark Upcoming
                        </button>
                    `}
                    <button onclick="deleteEventFeature('${evt.id}')" class="px-3 py-1 bg-red-50 text-red-600 hover:bg-red-100 rounded text-sm font-medium transition-colors ml-auto">
                        Delete
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Modal Logic
window.openAddEventModal = function() {
    const modal = document.getElementById('event-modal-feature');
    const form = document.getElementById('feature-event-form');
    if (!modal || !form) return;

    form.reset();
    form.elements['id'].value = ''; 
    document.getElementById('event-modal-title').textContent = 'ନୂତନ କାର୍ଯ୍ୟକ୍ରମ ଯୋଡନ୍ତୁ';
    
    modal.classList.remove('hidden');
};

window.closeEventModalFeature = function() {
    document.getElementById('event-modal-feature').classList.add('hidden');
};

// Form Handler
setTimeout(() => {
    const form = document.getElementById('feature-event-form');
    if (form) {
        form.onsubmit = (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const id = formData.get('id');
            
            const eventData = {
                id: id || 'EVT-' + Date.now(),
                title: formData.get('title'),
                date: formData.get('date'),
                description: formData.get('description'),
                image: formData.get('image'),
                status: formData.get('status') ? 'upcoming' : 'completed'
            };

            let events = getTempleEvents();
            
            if (id) {
                // Edit
                const index = events.findIndex(e => e.id === id);
                if(index !== -1) events[index] = eventData;
            } else {
                // Add
                events.unshift(eventData);
            }

            saveTempleEvents(events);
            renderEventControl();
            closeEventModalFeature();
            showNotification('Event saved successfully', 'success');
        };
    }
}, 1000);

// Actions
window.editEventFeature = function(id) {
    const events = getTempleEvents();
    const evt = events.find(e => e.id === id);
    if (!evt) return;

    const modal = document.getElementById('event-modal-feature');
    const form = document.getElementById('feature-event-form');
    
    document.getElementById('event-modal-title').textContent = 'କାର୍ଯ୍ୟକ୍ରମ ସମ୍ପାଦନ (Edit Event)';
    
    form.elements['id'].value = evt.id;
    form.elements['title'].value = evt.title;
    form.elements['date'].value = evt.date;
    form.elements['description'].value = evt.description;
    form.elements['image'].value = evt.image;
    form.elements['status'].checked = evt.status === 'upcoming';

    modal.classList.remove('hidden');
};

window.deleteEventFeature = function(id) {
    if(confirm('Delete this event?')) {
        let events = getTempleEvents();
        events = events.filter(e => e.id !== id);
        saveTempleEvents(events);
        renderEventControl();
        showNotification('Event deleted', 'success');
    }
};

window.toggleEventStatus = function(id) {
    let events = getTempleEvents();
    const index = events.findIndex(e => e.id === id);
    if (index !== -1) {
        events[index].status = events[index].status === 'upcoming' ? 'completed' : 'upcoming';
        saveTempleEvents(events);
        renderEventControl();
        showNotification('Event status updated', 'success');
    }
};

// =======================
// CONTACT CONTROL LOGIC
// =======================

function loadContactInfo() {
    const contactInfo = JSON.parse(localStorage.getItem('contactInfo') || '{}');
    
    // Set default values if empty
    if(Object.keys(contactInfo).length === 0) {
        contactInfo.phone = '+91 9937000000';
        contactInfo.whatsapp = '919937000000';
        contactInfo.email = 'info@mahakaleswar.com';
        contactInfo.address = 'Ainsia, Cuttack, Odisha, 754001';
        contactInfo.timings = 'ସକାଳ ୪:୩୦ - ରାତି ୯:୩୦';
        localStorage.setItem('contactInfo', JSON.stringify(contactInfo));
    }

    const form = document.getElementById('contact-info-form');
    if (form) {
        form.elements['phone'].value = contactInfo.phone || '';
        form.elements['whatsapp'].value = contactInfo.whatsapp || '';
        form.elements['email'].value = contactInfo.email || '';
        form.elements['address'].value = contactInfo.address || '';
        form.elements['timings'].value = contactInfo.timings || '';
    }
}

// Initialize
setTimeout(() => {
    loadContactInfo();
    
    const contactForm = document.getElementById('contact-info-form');
    if (contactForm) {
        contactForm.onsubmit = (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const contactInfo = {
                phone: formData.get('phone'),
                whatsapp: formData.get('whatsapp'),
                email: formData.get('email'),
                address: formData.get('address'),
                timings: formData.get('timings')
            };
            
            localStorage.setItem('contactInfo', JSON.stringify(contactInfo));
            showNotification('Contact information updated successfully', 'success');
        };
    }
}, 1000);

// =======================
// BOOKING CONTROL LOGIC (POOJA)
// =======================

function getBookings() {
    const bookings = localStorage.getItem('templeBookings');
    return bookings ? JSON.parse(bookings) : [];
}

function saveBookings(bookings) {
    localStorage.setItem('templeBookings', JSON.stringify(bookings));
}

window.renderBookingControl = function() {
    const bookings = getBookings();
    const container = document.getElementById('bookings-list');
    
    // Filter Elements
    const dateFilter = document.getElementById('booking-filter-date');
    const statusFilter = document.getElementById('booking-filter-status');
    
    if (!container) return;

    let filteredBookings = bookings.sort((a, b) => b.timestamp - a.timestamp);

    // Apply Filters
    if (dateFilter && dateFilter.value) {
        filteredBookings = filteredBookings.filter(b => b.date === dateFilter.value);
    }
    
    if (statusFilter && statusFilter.value !== 'all') {
        filteredBookings = filteredBookings.filter(b => b.status === statusFilter.value);
    }

    // Stats Update
    const statBookings = document.getElementById('stat-bookings');
    if(statBookings) statBookings.textContent = bookings.length;

    if (filteredBookings.length === 0) {
        container.innerHTML = `<div class="text-center py-8 text-gray-500">
            <p class="text-xl">🔍 କୌଣସି ବୁକିଂ ମିଳିଲା ନାହିଁ</p>
            <p class="text-sm">No bookings found with current filters.</p>
        </div>`;
        return;
    }

    container.innerHTML = filteredBookings.map(b => {
        let statusColor = 'bg-yellow-100 text-yellow-700'; // Pending
        if (b.status === 'confirmed') statusColor = 'bg-green-100 text-green-700';
        else if (b.status === 'completed') statusColor = 'bg-blue-100 text-blue-700';
        else if (b.status === 'cancelled') statusColor = 'bg-red-100 text-red-700';

        return `
        <div class="card-premium rounded-xl p-6 border border-gray-100 hover:shadow-md transition-shadow bg-white relative overflow-hidden">
            <div class="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-amber-100/50 to-transparent rounded-bl-full -mr-10 -mt-10 pointer-events-none"></div>
            
            <div class="md:flex justify-between items-start gap-6 relative z-10">
                <div class="flex-1">
                    <div class="flex flex-wrap items-center gap-3 mb-3">
                        <span class="font-mono text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">#${b.id}</span>
                        <span class="text-sm font-semibold text-gray-600 flex items-center gap-1">
                            📅 ${new Date(b.date).toLocaleDateString('en-IN', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                        </span>
                        
                        <!-- Status Dropdown -->
                        <div class="flex items-center gap-2">
                            <select onchange="updateBookingStatus('${b.id}', this.value)" 
                                class="px-3 py-1 rounded-full text-xs font-bold uppercase ${statusColor} border-none focus:ring-2 focus:ring-offset-1 focus:ring-amber-500 cursor-pointer transition-colors shadow-sm">
                                <option value="pending" ${b.status === 'pending' ? 'selected' : ''}>Pending</option>
                                <option value="confirmed" ${b.status === 'confirmed' ? 'selected' : ''}>Confirmed</option>
                                <option value="completed" ${b.status === 'completed' ? 'selected' : ''}>Completed</option>
                                <option value="cancelled" ${b.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
                            </select>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 mb-4">
                        <div>
                            <p class="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Pooja Details</p>
                            <h3 class="font-bold text-lg text-maroon">${b.poojaName}</h3>
                            <p class="text-sm text-gray-700">🕉️ Deity: ${b.deity || 'N/A'}</p>
                            <p class="text-sm text-gray-700">⏱️ Duration: ${b.duration || 'N/A'}</p>
                            <p class="text-lg font-bold text-amber-600 mt-1">₹${b.price}</p>
                        </div>
                        
                        <div>
                            <p class="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Devotee Details</p>
                            <p class="font-semibold text-gray-800">${b.devoteeName}</p>
                            <p class="text-sm text-gray-600">📱 ${b.mobile}</p>
                            <p class="text-sm text-gray-600">📧 ${b.email}</p>
                            ${b.gotra ? `<p class="text-sm text-gray-600">🧬 Gotra: ${b.gotra}</p>` : ''}
                            ${b.address ? `<p class="text-sm text-gray-600 mt-1 line-clamp-2" title="${b.address}">📍 ${b.address}</p>` : ''}
                        </div>
                    </div>

                    ${b.notes ? `
                    <div class="bg-amber-50 p-3 rounded-lg border border-amber-100 mb-4">
                        <p class="text-xs font-bold text-amber-800 mb-1">📝 Special Notes:</p>
                        <p class="text-sm text-gray-700 italic">"${b.notes}"</p>
                    </div>` : ''}
                </div>

                <!-- Actions -->
                <div class="flex flex-row md:flex-col gap-2 mt-4 md:mt-0 shrink-0">
                    <button onclick="sendBookingWhatsApp('${b.id}')" 
                        class="p-2 text-green-600 bg-green-50 hover:bg-green-100 rounded-lg transition-colors flex items-center gap-2 justify-center" title="Send WhatsApp Update">
                        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                        <span class="md:hidden">WhatsApp</span>
                    </button>
                    <button onclick="deleteBooking('${b.id}')" 
                        class="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors flex items-center gap-2 justify-center" title="Delete Booking">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                        <span class="md:hidden">Delete</span>
                    </button>
                </div>
            </div>
        </div>
        `;
    }).join('');
};

window.updateBookingStatus = function(id, newStatus) {
    let bookings = getBookings();
    const index = bookings.findIndex(b => b.id === id);
    if (index !== -1) {
        bookings[index].status = newStatus;
        saveBookings(bookings);
        renderBookingControl();
        showNotification(`Booking status updated to ${newStatus}`, 'success');
    }
};

window.deleteBooking = function(id) {
    if(!confirm('Are you sure you want to delete this booking history? This cannot be undone.')) return;
    
    let bookings = getBookings();
    bookings = bookings.filter(b => b.id !== id);
    saveBookings(bookings);
    renderBookingControl();
    showNotification('Booking deleted successfully', 'success');
};

window.resetBookingFilters = function() {
    document.getElementById('booking-filter-date').value = '';
    document.getElementById('booking-filter-status').value = 'all';
    renderBookingControl();
};

window.sendBookingWhatsApp = function(id) {
    const bookings = getBookings();
    const booking = bookings.find(b => b.id === id);
    if(!booking) return;

    const phoneNumber = booking.mobile;
    const poojaName = booking.poojaName || booking.name || 'Pooja'; // Fallback
    const date = new Date(booking.date).toLocaleDateString('en-IN');

    // Status specific messages
    let statusMsg = '';
    if(booking.status === 'confirmed') statusMsg = '✅ *CONFIRMED*';
    else if(booking.status === 'completed') statusMsg = '✨ *COMPLETED*';
    else if(booking.status === 'cancelled') statusMsg = '❌ *CANCELLED*';
    else statusMsg = '⏳ *PENDING*';

    const message = `🕉️ *Divine Temple Update* 🕉️\n\nDear ${booking.devoteeName},\n\nYour booking status is: ${statusMsg}\n\n*Booking ID:* ${booking.id}\n*Service:* ${poojaName}\n*Date:* ${date}\n*Status:* ${booking.status.toUpperCase()}\n\nFor any queries, please contact the temple administration.\n\n🙏 Jay Jagannath!`;
    
    const url = `https://wa.me/91${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
};

