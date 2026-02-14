/* ============================================
   Maa Bhubaneswari Temple — Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    /* ---------- Mobile Menu Toggle ---------- */
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav    = document.querySelector('.main-nav');
    const menuIcon   = menuToggle?.querySelector('img');

    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', () => {
            const isOpen = mainNav.classList.toggle('open');
            menuIcon.src = isOpen
                ? 'assets/icons/close.svg'
                : 'assets/icons/menu.svg';
            menuIcon.alt = isOpen ? 'Close menu' : 'Open menu';
            document.body.style.overflow = isOpen ? 'hidden' : '';
        });

        // Close nav when clicking a link
        mainNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mainNav.classList.remove('open');
                menuIcon.src = 'assets/icons/menu.svg';
                menuIcon.alt = 'Open menu';
                document.body.style.overflow = '';
            });
        });
    }

    /* ---------- Active Nav Highlight ---------- */
    const currentPage = location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.main-nav a').forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage) {
            link.classList.add('active');
        }
    });

    /* ---------- Scroll Fade-In Animation ---------- */
    const fadeEls = document.querySelectorAll('.fade-in');

    if (fadeEls.length && 'IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });

        fadeEls.forEach(el => observer.observe(el));
    } else {
        // Fallback: show everything
        fadeEls.forEach(el => el.classList.add('visible'));
    }

    /* ---------- Smooth scroll for anchor links ---------- */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', e => {
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

});
