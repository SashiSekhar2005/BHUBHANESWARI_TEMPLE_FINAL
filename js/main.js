// ============================================
// TEMPLE WEBSITE - MAIN JAVASCRIPT
// Handles UI interactions (Mobile Menu, Dropdowns, Notifications)
// Handles Booking Data (Bookings are stored separately from Products)
// ============================================

// ============================================
// DROPDOWN TOGGLE FOR MOBILE
// ============================================
function initDropdowns() {
  const dropdownToggles = document.querySelectorAll('[data-dropdown-toggle]');
  
  // Toggle dropdowns
  dropdownToggles.forEach(toggle => {
    toggle.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation(); // Prevent immediate closing
      const dropdownId = toggle.getAttribute('data-dropdown-toggle');
      const dropdown = document.getElementById(dropdownId);
      
      // Close other dropdowns first
      document.querySelectorAll('.dropdown-menu').forEach(menu => {
        if (menu.id !== dropdownId && !menu.classList.contains('hidden')) {
            menu.classList.add('hidden');
        }
      });

      if (dropdown) {
        dropdown.classList.toggle('hidden');
      }
    });
  });

  // Close when clicking outside
  document.addEventListener('click', (e) => {
    dropdownToggles.forEach(toggle => {
      const dropdownId = toggle.getAttribute('data-dropdown-toggle');
      const dropdown = document.getElementById(dropdownId);
      
      if (dropdown && !dropdown.classList.contains('hidden') && !dropdown.contains(e.target) && !toggle.contains(e.target)) {
        dropdown.classList.add('hidden');
      }
    });
  });
}

// ============================================
// MOBILE MENU TOGGLE
// ============================================
function initMobileMenu() {
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  
  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
  }
}

// ============================================
// BOOKING MANAGEMENT (Shared)
// ============================================
function getBookings() {
  const bookings = localStorage.getItem('templeBookings');
  return bookings ? JSON.parse(bookings) : [];
}

function saveBooking(booking) {
  const bookings = getBookings();
  bookings.push(booking);
  localStorage.setItem('templeBookings', JSON.stringify(bookings));
}

function generateBookingID() {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `BK-${timestamp}${random}`;
}

function getMahaprasadBookings() {
  const bookings = localStorage.getItem('mahaprasadBookings');
  return bookings ? JSON.parse(bookings) : [];
}

function saveMahaprasadBooking(booking) {
  const bookings = getMahaprasadBookings();
  bookings.push(booking);
  localStorage.setItem('mahaprasadBookings', JSON.stringify(bookings));
}

function generateMahaprasadID() {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `MP-${timestamp}${random}`;
}


// ============================================
// WHATSAPP INTEGRATION (Generic)
// ============================================
function sendWhatsAppMessage(bookingData) {
  const phoneNumber = '917735514529'; // Temple WhatsApp number
  
  const message = `🕉️ *ମନ୍ଦିର ପୂଜା ବୁକିଂ ନିଶ୍ଚିତକରଣ* 🕉️

📋 *ବୁକିଂ ଆଇଡି:* ${bookingData.id}

🛕 *ପୂଜା ବିବରଣୀ:*
   • ପୂଜା: ${bookingData.poojaName}
   • ଦେବତା: ${bookingData.deity}
   • ଅବଧି: ${bookingData.duration}
   • ମୂଲ୍ୟ: ₹${bookingData.price}

👤 *ଭକ୍ତ ବିବରଣୀ:*
   • ନାମ: ${bookingData.devoteeName}
   • ମୋବାଇଲ୍: ${bookingData.mobile}
   • ଇମେଲ୍: ${bookingData.email}
   ${bookingData.gotra ? `• ଗୋତ୍ର: ${bookingData.gotra}` : ''}

📅 *ବୁକିଂ ତାରିଖ:* ${formatDate(bookingData.date)}

${bookingData.notes ? `📝 *ବିଶେଷ ଟିପ୍ପଣୀ:* ${bookingData.notes}` : ''}

🙏 *ଆପଣଙ୍କ ଭକ୍ତି ପାଇଁ ଧନ୍ୟବାଦ!*
_ଭଗବାନ ଆପଣଙ୍କୁ ଏବଂ ଆପଣଙ୍କ ପରିବାରକୁ ଆଶୀର୍ବାଦ କରନ୍ତୁ।_`;

  const encodedMessage = encodeURIComponent(message);
  const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
  
  window.open(whatsappURL, '_blank');
}

// ============================================
// UTILITY FUNCTIONS
// ============================================
function formatDate(dateString) {
  if(!dateString) return '';
  const date = new Date(dateString);
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('or-IN', options);
}

function formatCurrency(amount) {
  return `₹${amount.toLocaleString('en-IN')}`;
}

function showNotification(message, type = 'success') {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg transform transition-all duration-300 ${
    type === 'success' ? 'bg-green-500' : 'bg-red-500'
  } text-white`;
  notification.innerHTML = `
    <div class="flex items-center gap-3">
      <span class="text-lg">${type === 'success' ? '✓' : '✗'}</span>
      <span>${message}</span>
    </div>
  `;
  
  document.body.appendChild(notification);
  
  // Animate in
  setTimeout(() => {
    notification.style.transform = 'translateY(0)';
  }, 10);
  
  // Remove after 3 seconds
  setTimeout(() => {
    notification.style.transform = 'translateY(-100px)';
    notification.style.opacity = '0';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// ============================================
// INITIALIZE ON PAGE LOAD
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initDropdowns();
    
    // Warn if products.js is not loaded
    if(typeof getProducts !== 'function') {
         console.warn("products.js not loaded. Some features may not work.");
    }
});
