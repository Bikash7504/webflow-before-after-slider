<script>
class BeforeAfterSlider {
  constructor(container) {
    this.container = container;
    this.afterWrap = container.querySelector('.c-slider_after-wrap');
    this.handle = container.querySelector('.c-slider_handle');
    this.isActive = false;
    
    this.init();
  }

  init() {
    this.addEventListeners();
    this.initGSAP();
  }

  updateSlider(xPos) {
    const rect = this.container.getBoundingClientRect();
    let percentage = ((xPos - rect.left) / rect.width) * 100;
    
    // Constraints (0% to 100%)
    percentage = Math.max(0, Math.min(100, percentage));

    // UPDATE LOGIC:
    // 1. Handle moves across the X axis
    this.handle.style.left = `${percentage}%`;
    // 2. Reveal Wrap only changes WIDTH (stays anchored at left: 0)
    this.afterWrap.style.width = `${percentage}%`;
    this.afterWrap.style.left = `0%`; // Force it to stay at 0
    
    this.handle.setAttribute('aria-valuenow', Math.round(percentage));
  }

  addEventListeners() {
    const startAction = () => this.isActive = true;
    const endAction = () => this.isActive = false;
    const moveAction = (e) => {
      if (!this.isActive) return;
      const x = e.pageX || (e.touches ? e.touches[0].pageX : 0);
      this.updateSlider(x);
    };

    // Mouse
    this.handle.addEventListener('mousedown', startAction);
    window.addEventListener('mouseup', endAction);
    window.addEventListener('mousemove', moveAction);

    // Touch
    this.handle.addEventListener('touchstart', startAction);
    window.addEventListener('touchend', endAction);
    window.addEventListener('touchmove', moveAction, { passive: true });

    // Keyboard (A11y)
    this.handle.addEventListener('keydown', (e) => {
        let currentP = parseFloat(this.handle.style.left) || 50;
        if (e.key === 'ArrowLeft') this.setSlider(currentP - 5);
        if (e.key === 'ArrowRight') this.setSlider(currentP + 5);
    });
  }

  // Helper for keyboard and GSAP
  setSlider(pct) {
    const rect = this.container.getBoundingClientRect();
    this.updateSlider(rect.left + (rect.width * pct / 100));
  }

  initGSAP() {
    if (typeof gsap === 'undefined') return;

    // Entrance animation: Tease the slider
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: this.container,
        start: "top 80%",
      }
    });

    tl.fromTo(this.handle, { left: "50%" }, { left: "30%", duration: 0.8, ease: "power2.inOut" })
      .fromTo(this.afterWrap, { width: "50%" }, { width: "30%", duration: 0.8, ease: "power2.inOut" }, "<")
      .to(this.handle, { left: "50%", duration: 0.6, ease: "power2.out" })
      .to(this.afterWrap, { width: "50%", duration: 0.6, ease: "power2.out" }, "<");
  }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.c-slider_wrapper').forEach(el => new BeforeAfterSlider(el));
});
</script>