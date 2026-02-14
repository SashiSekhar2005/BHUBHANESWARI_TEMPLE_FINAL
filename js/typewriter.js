/**
 * Professional Smooth Reveal Effect
 * Replaces the heavy "letter dropping" effect with a high-performance fade-in/slide-up animation.
 */

class TypewriterEffect {
    constructor(options = {}) {
        this.threshold = options.threshold || 0.15; // Trigger when 15% visible
        this.observer = null;
    }

    /**
     * Initialize scroll-triggered reveal effect
     * @param {string} selector - CSS selector for elements to animate
     */
    init(selector = '.typewriter-text') {
        // Create Intersection Observer
        this.observer = new IntersectionObserver(
            (entries) => this.handleIntersection(entries),
            {
                threshold: this.threshold,
                rootMargin: '0px 0px -30px 0px' // Start slightly before element is fully visible
            }
        );

        // Observe elements
        this.refresh(selector);
    }

    /**
     * Refresh observer for new elements (e.g. after dynamic content load)
     */
    refresh(selector = '.typewriter-text') {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
            // Only observe if not already observed/animated
            if (!element.classList.contains('reveal-active') && !element.classList.contains('is-observed')) {
                element.classList.add('is-observed'); // Marker class
                this.observer.observe(element);
            }
        });
    }

    /**
     * Handle intersection observer callback
     */
    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add class to trigger CSS transition
                entry.target.classList.add('reveal-active');
                
                // Stop observing once revealed
                this.observer.unobserve(entry.target);
                entry.target.classList.remove('is-observed');
            }
        });
    }

    /**
     * Legacy method for compatibility - does nothing now as we don't split text
     */
    applyTo(element) {
        if (this.observer) {
            this.observer.observe(element);
        }
    }

    /**
     * Cleanup
     */
    destroy() {
        if (this.observer) {
            this.observer.disconnect();
        }
    }
}

// Create global instance
window.typewriter = new TypewriterEffect();

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.typewriter.init();
    });
} else {
    window.typewriter.init();
}

// Export for module usage if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TypewriterEffect;
}
