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
    markers: false, // Set to false in production
  });
}

function animateOnView() {
  const items = gsap.utils.toArray(".view_init");

  items.forEach((item) => {
    // Determine if the item is in the left or right column
    const isLeftColumn = item.closest(".review_col:first-child");

    // Set animation properties based on column
    const animation = gsap.from(item, {
      opacity: 0,
      duration: 2,
      filter: "blur(20px)",
      x: isLeftColumn ? "-30%" : "30%", // Left: -30%, Right: 30%
      rotate: isLeftColumn ? "-30deg" : "30deg", // Left: -30deg, Right: 30deg
      ease: "linear",
    });

    // Use helper function to attach ScrollTrigger
    createScrollAnimation({
      trigger: item,
      animation,
      start: "top 90%", // Default for desktop
      end: "bottom bottom",
      scrub: 0.8,
      markers: false,
    });
  });
}

/*

This is function is handling the sticky header
It will add a class to the header when the user scrolls down
It will remove the class when the user scrolls up

*/

function stickyScroll() {
  let lastScrollTop = 50;
  let header = document.querySelector(".site_header");
  let isHeaderFixed = false;

  window.addEventListener("scroll", () => {
    let currentScroll =
      window.pageYOffset || document.documentElement.scrollTop;
    let viewportHeight = window.innerHeight;
    let scrollThreshold = viewportHeight * 0.5;

    if (currentScroll > lastScrollTop) {
      if (
        currentScroll > scrollThreshold &&
        !header.classList.contains("header--hidden")
      ) {
        header.classList.add("header--hidden");
      }
    } else {
      if (header.classList.contains("header--hidden")) {
        header.classList.remove("header--hidden");
      }
    }

    if (currentScroll > header.offsetHeight && !isHeaderFixed) {
      header.classList.add("header--fixed");
      isHeaderFixed = true;
    } else if (currentScroll <= header.offsetHeight && isHeaderFixed) {
      header.classList.remove("header--fixed");
      isHeaderFixed = false;
    }

    if (currentScroll < 50) {
      header.classList.remove("header--hidden");
    }

    lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
  });
}
stickyScroll();

// Cursor
function setupCustomCursor() {
  const cursor = document.querySelector(".custom-drag-cursor");
  if (!cursor || typeof gsap === "undefined") {
    console.warn(
      "Custom cursor element or GSAP not found. Cursor animation disabled."
    );
    return;
  }

  const setX = gsap.quickSetter(cursor, "--x", "px");
  const setY = gsap.quickSetter(cursor, "--y", "px");

  let targetX = window.innerWidth / 2;
  let targetY = window.innerHeight / 2;

  let currentX = targetX;
  let currentY = targetY;

  const speed = 0.2;

  document.addEventListener(
    "mousemove",
    (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
    },
    { passive: true }
  );

  gsap.ticker.add(() => {
    currentX += (targetX - currentX) * speed;
    currentY += (targetY - currentY) * speed;
    setX(currentX - 40);
    setY(currentY - 40);
  });

  document.querySelectorAll(".hasCustomCursor").forEach((item) => {
    item.addEventListener("mouseenter", () =>
      cursor.classList.add("slider-active")
    );
    item.addEventListener("mouseleave", () =>
      cursor.classList.remove("slider-active")
    );
  });
}

function hoverText() {
  // Exit early if GSAP is not loaded
  if (typeof gsap === "undefined") {
    console.warn(
      "GSAP library is not loaded. Hover text animations will not work."
    );
    return;
  }

  // Select all staggered items
  const items = document.querySelectorAll(".staggered-item");

  // Exit early if no items are found
  if (!items.length) {
    console.warn("No staggered items (.staggered-item) found on the page.");
    return;
  }

  // Store timelines for each staggered item
  const itemTimelines = new Map();

  items.forEach((item) => {
    // Find the main span
    const mainSpan = item.querySelector("span");

    // Skip item if main span is not found
    if (!mainSpan) {
      console.warn("Main span not found in staggered item:", item);
      return;
    }

    const originalText = mainSpan.innerText;
    mainSpan.innerHTML = "";

    // Create default and hover layers
    const defaultLayer = document.createElement("div");
    defaultLayer.classList.add("default-text");

    const hoverLayer = document.createElement("div");
    hoverLayer.classList.add("hover-text");

    // Split text into characters
    originalText.split("").forEach((char) => {
      const defaultChar = document.createElement("span");
      defaultChar.classList.add("letter");
      defaultChar.textContent = char === " " ? "\u00A0" : char;
      defaultLayer.appendChild(defaultChar);

      const hoverChar = document.createElement("span");
      hoverChar.classList.add("letter");
      hoverChar.textContent = char === " " ? "\u00A0" : char;
      hoverLayer.appendChild(hoverChar);
    });

    // Append layers to main span
    mainSpan.appendChild(defaultLayer);
    mainSpan.appendChild(hoverLayer);

    // Select letters
    const defaultLetters = defaultLayer.querySelectorAll(".letter");
    const hoverLetters = hoverLayer.querySelectorAll(".letter");

    // Verify letters exist
    if (!defaultLetters.length || !hoverLetters.length) {
      console.warn(
        "No letters found in default or hover layers for item:",
        item
      );
      return;
    }

    // Create GSAP timeline
    const tl = gsap.timeline({ paused: true });

    defaultLetters.forEach((letter, i) => {
      if (hoverLetters[i]) {
        tl.to(
          letter,
          { y: "-100%", duration: 0.7, ease: "expo.inOut" },
          i * 0.05
        ).to(
          hoverLetters[i],
          { y: "0%", duration: 0.7, ease: "expo.inOut" },
          i * 0.05
        );
      }
    });

    // Store the timeline for this item
    itemTimelines.set(item, tl);

    // Find the closest parent with .stagger_card class, if any
    const staggerCardParent = item.closest(".stagger_card");

    if (!staggerCardParent) {
      // If no .stagger_card parent, use original behavior
      item.addEventListener("mouseenter", () => tl.play());
      item.addEventListener("mouseleave", () => tl.reverse());
    }
  });

  // Handle .stagger_card parents
  const staggerCards = document.querySelectorAll(".stagger_card");
  staggerCards.forEach((card) => {
    card.addEventListener("mouseenter", () => {
      // Play timelines for all .staggered-item children
      const childItems = card.querySelectorAll(".staggered-item");
      childItems.forEach((childItem) => {
        const tl = itemTimelines.get(childItem);
        if (tl) tl.play();
      });
    });
    card.addEventListener("mouseleave", () => {
      // Reverse timelines for all .staggered-item children
      const childItems = card.querySelectorAll(".staggered-item");
      childItems.forEach((childItem) => {
        const tl = itemTimelines.get(childItem);
        if (tl) tl.reverse();
      });
    });
  });
}
function scrollOnView() {
  // Select the row to animate
  const machinesRow = document.querySelector(".our_machines-row");
  const machinesInner = document.querySelector(".our_machines-inner");

  // Set initial state
  gsap.set(machinesRow, { xPercent: 65 }); // Shift row left so ~20% of first item is visible

  // Create animation timeline
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: machinesInner,
      start: "15% top", // Start when top of section hits 20% from top of viewport
      end: "+=100%", // Extend duration for smooth scroll animation
      pin: true, // Pin the section
      scrub: 1, // Smoothly tie animation to scroll
      markers: false, // Set to true for debugging
    },
  });

  // Animate row into view
  tl.to(machinesRow, { xPercent: 0, duration: 1, ease: "power2.out" }); // Slide row fully into view
}
scrollOnView();

/*
This is function is for the text animation
Line by Line Staggering the text with custom ease


*/

function textAnimation() {
  const SplittingTextConfig = {
    selector: "h1, h2, p",
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

// Initialize animations
function initializeAnimations() {
  // Ensure animations are set up after DOM is loaded
  document.addEventListener("DOMContentLoaded", () => {
    animateServiceItems();
    animateOnView();
    setupCustomCursor();
    textAnimation();

    hoverText();
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
