// Register GSAP and ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Initialize Lenis for smooth scrolling
const lenis = new Lenis({
  duration: 1.2, // Smooth scroll duration
});

// Sync Lenis with ScrollTrigger
lenis.on("scroll", ScrollTrigger.update);

gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0);

// Helper function to create ScrollTrigger animations
function createScrollAnimation({
  trigger,
  animation,
  start = "top 80%",
  end = "bottom 20%",
  scrub = false,
  pin = false,
  markers = false,
  isMobile = window.innerWidth <= 768,
  toggleActions = "play none none none",
}) {
  // Adjust start and end for mobile if needed
  const mobileStart = isMobile ? "top 90%" : start;
  const mobileEnd = isMobile ? "bottom 10%" : end;

  // Create ScrollTrigger instance
  return ScrollTrigger.create({
    trigger,
    animation,
    start: mobileStart,
    end: mobileEnd,
    scrub,
    pin,
    markers,
    toggleActions,
    invalidateOnRefresh: true, // Recalculate on resize
  });
}

// Service items stacking animation
function animateServiceItems() {
  const serviceItems = gsap.utils.toArray(".service_item");
  const itemsToAnimate = serviceItems.slice(1); // Exclude the first item

  // Create a timeline for the stacking animation
  const tl = gsap.timeline();

  // Animate items to stack with offset
  tl.to(itemsToAnimate, {
    x: (index) => -(index + 1) * 300, // Move left for partial overlap
    duration: 1,
    stagger: 0.2,
  });

  // Use helper function to attach ScrollTrigger
  createScrollAnimation({
    trigger: ".service_area",
    animation: tl,
    start: "7% top",
    end: () => "+=" + (serviceItems.length - 1) * 500,
    scrub: true,
    pin: true,
    markers: true, // Set to false in production
  });
}

// View items animation
function animateOnView() {
  const items = gsap.utils.toArray(".view_init");

  items.forEach((item) => {
    // Create animation for each item
    const animation = gsap.from(item, {
      y: 20,
      opacity: 0,
      duration: 0.9,
      ease: "cubic-bezier(.858, .01, .068, .99)",
    });

    // Use helper function to attach ScrollTrigger
    createScrollAnimation({
      trigger: item,
      animation,
      start: "top 50%", // Default for desktop
      end: "bottom 60%",
      scrub: true,
      markers: false,
    });
  });
}

/*
This is function is for the text animation
Line by Line Staggering the text with custom ease


*/

function textAnimation() {
  const SplittingTextConfig = {
    selector: "h1, h2,p",
    type: "words,lines",
    linesClass: "line",
    duration: 0.8,
    yPercent: 100,
    opacity: 0,
    stagger: 0.1,
    ease: "cubic-bezier(0.77, 0, 0.175, 1)",
    start: "top 95%",
  };

  // Set initial visibility to hidden for all targeted elements
  document.querySelectorAll(SplittingTextConfig.selector).forEach((element) => {
    element.style.visibility = "hidden";
  });

  document.fonts.ready.then(() => {
    if (document.body.classList.contains("animation_init")) {
      const elements = document.querySelectorAll(SplittingTextConfig.selector);

      if (elements.length === 0) {
        console.warn("No elements found for SplitText animation");
        return;
      }

      elements.forEach((element) => {
        element.style.visibility = "visible";
        element.style.opacity = "1";

        const split = new SplitText(element, {
          type: SplittingTextConfig.type,
          linesClass: SplittingTextConfig.linesClass,
        });

        const animation = gsap.timeline({ paused: true });
        split.lines.forEach((line, index) => {
          const wordsInLine = line.querySelectorAll("div");
          animation.from(
            wordsInLine,
            {
              duration: SplittingTextConfig.duration,
              yPercent: SplittingTextConfig.yPercent,
              opacity: SplittingTextConfig.opacity,
              ease: SplittingTextConfig.ease,
            },
            index * SplittingTextConfig.stagger
          );
        });

        ScrollTrigger.create({
          trigger: element,
          scroller: document.body,
          start: SplittingTextConfig.start,
          animation: animation,
          toggleActions: "play none none reverse",
          // markers: true,
        });
      });
    } else {
      console.log(
        'Animation not initialized: body does not have "animation_init" class'
      );
    }
  });
}

document.body.classList.add("animation_init");
textAnimation();

// Initialize animations
function initializeAnimations() {
  // Ensure animations are set up after DOM is loaded
  document.addEventListener("DOMContentLoaded", () => {
    animateServiceItems();
    animateOnView();

    // Refresh ScrollTrigger to ensure proper calculations
    ScrollTrigger.refresh();
  });

  // Handle window resize to update triggers
  window.addEventListener("resize", () => {
    ScrollTrigger.refresh();
  });
}

// Run initialization
initializeAnimations();
