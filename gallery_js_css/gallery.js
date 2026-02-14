// Gallery Filter Functionality
document.addEventListener('DOMContentLoaded', function() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const showMoreBtn = document.getElementById('showMoreBtn');
    let showingAll = false;

    // Initially hide items after 6
    galleryItems.forEach((item, index) => {
        if (index >= 6) {
            item.classList.add('hidden-initially');
        }
    });

    // Show More/Less functionality
    showMoreBtn.addEventListener('click', function() {
        showingAll = !showingAll;
        
        galleryItems.forEach((item, index) => {
            if (index >= 6) {
                if (showingAll) {
                    item.classList.remove('hidden-initially');
                } else {
                    item.classList.add('hidden-initially');
                }
            }
        });
        
        showMoreBtn.textContent = showingAll ? 'Show Less' : 'Show All';
    });

    // Filter functionality
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            const filterValue = this.getAttribute('data-filter');

            galleryItems.forEach(item => {
                item.classList.remove('hide');
                item.classList.remove('hidden-initially');
                
                if (filterValue !== 'all' && item.getAttribute('data-category') !== filterValue) {
                    item.classList.add('hide');
                }
            });
        });
    });
});

// View Photo Function
function viewPhoto(src) {
    const modal = document.createElement('div');
    modal.className = 'photo-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="modal-close">&times;</span>
            <img src="${src}" alt="Photo">
        </div>
    `;
    document.body.appendChild(modal);
    
    modal.querySelector('.modal-close').onclick = () => modal.remove();
    modal.onclick = (e) => { if(e.target === modal) modal.remove(); };
}

// Download Photo Function
function downloadPhoto(src, filename) {
    const a = document.createElement('a');
    a.href = src;
    a.download = filename;
    a.click();
}

// Toggle Language for Individual Photo
function toggleLang(btn) {
    const galleryItem = btn.closest('.gallery-item');
    const descEn = galleryItem.querySelector('.desc-en');
    const descOd = galleryItem.querySelector('.desc-od');
    
    if (descEn.style.display === 'none') {
        descEn.style.display = 'block';
        descOd.style.display = 'none';
        btn.textContent = 'ଓଡ଼ିଆ';
    } else {
        descEn.style.display = 'none';
        descOd.style.display = 'block';
        btn.textContent = 'English';
    }
}
