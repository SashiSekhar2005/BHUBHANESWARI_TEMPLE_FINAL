/**
 * ========================================
 * FLOATING OM BACKGROUND ANIMATION
 * JavaScript Engine
 * Premium Spiritual Animation System
 * ======================================== 
 */

class FloatingOmAnimation {
  constructor(options = {}) {
    // Configuration
    this.containerSelector = options.containerSelector || '.floating-om-container';
    this.desktopOmCount = options.desktopOmCount || 15;
    this.tabletOmCount = options.tabletOmCount || 10;
    this.mobileOmCount = options.mobileOmCount || 5;
    
    // Size distribution (percentages)
    this.sizes = {
      small: 0.4,    // 40% small
      medium: 0.4,   // 40% medium
      large: 0.2     // 20% large
    };
    
    // Opacity distribution
    this.opacities = {
      faded: 0.3,    // 30% faded
      subtle: 0.5,   // 50% subtle
      visible: 0.2   // 20% visible
    };
    
    // Animation types distribution
    this.animations = {
      floatUp: 0.3,
      floatUpDrift: 0.3,
      floatSideways: 0.2,
      floatBreath: 0.15,
      floatOrbit: 0.05
    };
    
    // Glow effects distribution
    this.glowEffects = {
      none: 0.6,        // 60% no glow
      soft: 0.25,       // 25% soft glow
      intense: 0.15     // 15% intense glow
    };
    
    // Duration variations
    this.durations = ['slow', 'medium', 'fast'];
    
    this.container = null;
    this.omElements = [];
  }

  /**
   * Initialize the animation system
   */
  init() {
    this.container = document.querySelector(this.containerSelector);
    if (!this.container) {
      console.warn(`Container "${this.containerSelector}" not found`);
      return;
    }

    // Determine device type and generate appropriate number of elements
    const omCount = this.getDeviceOmCount();
    this.generateOmElements(omCount);
    
    // Restart animation when window is resized
    window.addEventListener('resize', () => this.handleResize());
    
    console.log(`✨ Floating OM Animation initialized with ${omCount} elements`);
  }

  /**
   * Determine device type and return appropriate OM count
   */
  getDeviceOmCount() {
    const width = window.innerWidth;
    
    if (width >= 1025) {
      return this.desktopOmCount;
    } else if (width >= 769) {
      return this.tabletOmCount;
    } else {
      return this.mobileOmCount;
    }
  }

  /**
   * Handle window resize
   */
  handleResize() {
    const newCount = this.getDeviceOmCount();
    const currentCount = this.omElements.length;
    
    if (newCount !== currentCount) {
      // Clear existing elements
      this.container.innerHTML = '';
      this.omElements = [];
      
      // Regenerate with new count
      this.generateOmElements(newCount);
    }
  }

  /**
   * Generate floating OM elements
   */
  generateOmElements(count) {
    for (let i = 0; i < count; i++) {
      const element = this.createOmElement(i);
      this.container.appendChild(element);
      this.omElements.push(element);
    }
  }

  /**
   * Create a single OM element with random properties
   */
  createOmElement(index) {
    const element = document.createElement('div');
    element.className = 'floating-om';
    element.textContent = 'ॐ';
    element.setAttribute('aria-hidden', 'true');
    
    // Random properties
    const size = this.getRandomSize();
    const opacity = this.getRandomOpacity();
    const animation = this.getRandomAnimation();
    const duration = this.getRandomDuration();
    const delay = this.getRandomDelay();
    const startX = Math.random() * 100; // 0-100%
    const startY = Math.random() * 120 - 10; // Slightly above viewport
    const driftX = (Math.random() - 0.5) * 200; // -100 to 100px
    const verticalDrift = (Math.random() - 0.5) * 150; // -75 to 75px
    const glowEffect = this.getRandomGlowEffect();
    
    // Apply size class
    element.classList.add(`size-${size}`);
    
    // Apply opacity class
    element.classList.add(`opacity-${opacity}`);
    
    // Apply glow effect class
    if (glowEffect !== 'none') {
      element.classList.add(`glow-${glowEffect}`);
    }
    
    // Apply duration class
    element.classList.add(`duration-${duration}`);
    
    // Set CSS custom properties for animation parameters
    element.style.setProperty('--om-opacity', this.getOpacityValue(opacity));
    element.style.setProperty('--drift-x', `${driftX}px`);
    element.style.setProperty('--vertical-drift', `${verticalDrift}px`);
    element.style.setProperty('--start-x', `${startX}vw`);
    element.style.setProperty('--duration', `var(--${duration}-duration, 35s)`);
    
    // Set initial position
    element.style.left = `${startX}vw`;
    element.style.top = `${startY}vh`;
    
    // Apply animation
    const animationName = animation;
    const animationTiming = 'ease-in-out';
    const animationIterationCount = 'infinite';
    
    element.style.animation = `${animationName} var(--duration, 35s) ${animationTiming} ${delay}s ${animationIterationCount}`;
    
    // Add shimmer effect to some elements
    if (Math.random() > 0.7) {
      const shimmerAnimation = glowEffect === 'none' ? 'subtleShimmer' : 'shimmerGlow';
      const shimmerDuration = '3s';
      element.style.animation += `, ${shimmerAnimation} ${shimmerDuration} ease-in-out ${delay}s infinite`;
    }
    
    return element;
  }

  /**
   * Get random size (small, medium, large)
   */
  getRandomSize() {
    const rand = Math.random();
    let cumulative = 0;
    
    for (const [size, probability] of Object.entries(this.sizes)) {
      cumulative += probability;
      if (rand <= cumulative) {
        return size;
      }
    }
    
    return 'medium';
  }

  /**
   * Get random opacity class
   */
  getRandomOpacity() {
    const rand = Math.random();
    let cumulative = 0;
    
    for (const [opacity, probability] of Object.entries(this.opacities)) {
      cumulative += probability;
      if (rand <= cumulative) {
        return opacity;
      }
    }
    
    return 'subtle';
  }

  /**
   * Get opacity value for CSS variable
   */
  getOpacityValue(opacityClass) {
    const opacityMap = {
      faded: '0.08',
      subtle: '0.15',
      visible: '0.25'
    };
    
    return opacityMap[opacityClass] || '0.15';
  }

  /**
   * Get random animation type
   */
  getRandomAnimation() {
    const rand = Math.random();
    let cumulative = 0;
    
    for (const [animation, probability] of Object.entries(this.animations)) {
      cumulative += probability;
      if (rand <= cumulative) {
        return animation;
      }
    }
    
    return 'floatUp';
  }

  /**
   * Get random duration class
   */
  getRandomDuration() {
    return this.durations[Math.floor(Math.random() * this.durations.length)];
  }

  /**
   * Get random animation delay (staggered start)
   */
  getRandomDelay() {
    return Math.random() * 5; // 0-5 second random delay
  }

  /**
   * Get random glow effect
   */
  getRandomGlowEffect() {
    const rand = Math.random();
    let cumulative = 0;
    
    for (const [glow, probability] of Object.entries(this.glowEffects)) {
      cumulative += probability;
      if (rand <= cumulative) {
        return glow;
      }
    }
    
    return 'none';
  }

  /**
   * Pause all animations
   */
  pause() {
    this.omElements.forEach(el => {
      el.style.animationPlayState = 'paused';
    });
  }

  /**
   * Resume all animations
   */
  resume() {
    this.omElements.forEach(el => {
      el.style.animationPlayState = 'running';
    });
  }

  /**
   * Regenerate all elements with new properties
   */
  regenerate() {
    this.container.innerHTML = '';
    this.omElements = [];
    const omCount = this.getDeviceOmCount();
    this.generateOmElements(omCount);
  }

  /**
   * Get animation statistics (for debugging)
   */
  getStats() {
    return {
      totalElements: this.omElements.length,
      containerSize: {
        width: this.container.offsetWidth,
        height: this.container.offsetHeight
      }
    };
  }
}

/**
 * ========================================
 * INITIALIZATION
 * ======================================== 
 */

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const floatingOmAnimation = new FloatingOmAnimation({
    containerSelector: '.floating-om-container',
    desktopOmCount: 15,   // Full desktop
    tabletOmCount: 10,    // Tablet optimization
    mobileOmCount: 5      // Mobile optimization
  });

  floatingOmAnimation.init();

  // Expose to global scope for debugging/control
  window.floatingOmAnimation = floatingOmAnimation;
});

/**
 * ========================================
 * USAGE NOTES
 * ======================================== 
 * 
 * The animation is automatically initialized when the page loads.
 * 
 * Available controls via console:
 * 
 * 1. Pause animation:
 *    window.floatingOmAnimation.pause();
 * 
 * 2. Resume animation:
 *    window.floatingOmAnimation.resume();
 * 
 * 3. Regenerate with new properties:
 *    window.floatingOmAnimation.regenerate();
 * 
 * 4. Get animation stats:
 *    window.floatingOmAnimation.getStats();
 * 
 * 5. Custom initialization:
 *    const custom = new FloatingOmAnimation({
 *      desktopOmCount: 20,
 *      tabletOmCount: 12,
 *      mobileOmCount: 6
 *    });
 *    custom.init();
 * 
 * ========================================
 */
