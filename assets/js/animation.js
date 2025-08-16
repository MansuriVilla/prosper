gsap.registerPlugin(ScrollTrigger);

const lenis = new Lenis({
  duration: 1.2,
});

lenis.on("scroll", ScrollTrigger.update);

gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0);

function preloader() {
  const preloaderIcon = document.querySelectorAll(".preloader-item");
  const container = document.querySelector(".preloader-container");
  const ProductItems = document.querySelector(".preloader__items");

  const floatingProduct = document.querySelector(".in_view-after-laoding");
  const HeroText = document.querySelector(".__spacing-title");
  const numberOfItems = preloaderIcon.length;
  const angleIncrement = (2 * Math.PI) / numberOfItems;
  const radius = 370;
  let isGalleryOpen = false;
  const centerX = container.offsetWidth / 2;
  const centerY = container.offsetHeight / 2;
  const tl = gsap.timeline();

  gsap.registerPlugin(ScrollTrigger);

  gsap.set(floatingProduct, { scale: 0, x: 0 });

  preloaderIcon.forEach(function (item, index) {
    const img = document.createElement("img");
    img.src = `assets/images/preloading-product-image-1.png`;
    item.appendChild(img);
    const angle = index * angleIncrement;
    const initialRotation = (angle * 180) / Math.PI - 90;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);

    gsap.set(item, { scale: 0 });
    tl.to(
      item,
      {
        left: `${x}px`,
        top: `${y}px`,
        rotation: initialRotation,
        scale: 1,
        duration: 1,
        ease: "power2.out",
        delay: 1,
      },
      index * 0.1
    );
  });

  tl.to(floatingProduct, {
    scale: 0.6,
    duration: 0.5,
    ease: "power2.out",
  });

  tl.to(preloaderIcon, {
    scale: 0,
    duration: 0.5,
    ease: "power2.in",
    stagger: 0.05,
  });

  tl.to(ProductItems, {
    opacity: 0,
    duration: 0.5,
    ease: "power2.in",
    PointerEvents: "none",
  });
  tl.to(container, {
    duration: 0.5,
    ease: "power2.in",
    PointerEvents: "none",
  });
  tl.to(HeroText, {
    marginRight: "150px",
    duration: 0.2,
    ease: "linear",
  });
  tl.to(floatingProduct, {
    y: 80,
    x: -305,
    duration: 0.5,
    ease: "linear",
    scale: 0.18,
    filter: "drop-shadow(0 0 60px #00000040)",
  });
  
}
preloader();


// function FloatingProduct() {
//   // Register ScrollTrigger plugin
//   gsap.registerPlugin(ScrollTrigger);

//   // Select the element to animate
//   const floatingProductScen = document.querySelector(".in_view-after-laoding");

//   // Select all sections
//   const sections = document.querySelectorAll(
//     ".prosper_universal-area, .our_machines-area, .service_area"
//   );

//   // Create a GSAP timeline
//   const tl = gsap.timeline({
//     scrollTrigger: {
//       trigger: sections[0], // Start with the first section
//       start: "top bottom", // Start when top of first section hits bottom of viewport
//       end: `+=${sections.length * 100}%`, // Extend end based on number of sections
//       scrub: 1.2, // Animation follows scroll position
//       markers: false, // Set to true for debugging
//     },
//   });


  
//   // Add animations for each section to the timeline
//   sections.forEach((section, index) => {
//     tl.to(floatingProductScen, {
//       x: index === 0 ? 120 : index === 1 ? 700 : index === 2 ? -460 : 400,
//       y: index === 0 ? 80 : index === 1 ? 129 : index === 2 ? 130 : 100,
//       scale: index === 0 ? 0.5 : index === 1 ? 1 : index === 2 ? 1 : 0,
//       duration: 0.2,
//       filter: "none",
//       zIndex:-1,
//       ease: "linear",
//     });
//     gsap.set(floatingProductScen, { opacity: index === 2 ? 1 : 0});
//   });
// }

// // Call the function
// FloatingProduct();



function FloatingProduct() {
  // Register ScrollTrigger plugin
  gsap.registerPlugin(ScrollTrigger);

  // Select the element to animate
  const floatingProductScen = document.querySelector(".in_view-after-laoding");

  // Select all sections for animation
  const sections = document.querySelectorAll(
    ".prosper_universal-area, .our_machines-area, .service_area"
  );

  // Create a GSAP timeline for the animation
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: sections[0], // Start with the first section
      start: "top bottom", // Start when top of first section hits bottom of viewport
      end: `+=${sections.length * 100}%`, // Extend end based on number of sections
      scrub: 1.2, // Animation follows scroll position
      markers: false, // Set to true for debugging
    },
  });

  // Add animations for each section to the timeline
  sections.forEach((section, index) => {
    tl.to(floatingProductScen, {
      x: index === 0 ? 120 : index === 1 ? 700 : index === 2 ? -460 : 400,
      y: index === 0 ? 80 : index === 1 ? 129 : index === 2 ? 130 : 100,
      scale: index === 0 ? 0.5 : index === 1 ? 1 : index === 2 ? 1 : 0,
      duration: 0.2,
      filter: "none",
      zIndex: -1,
      ease: "linear",
    });
    gsap.set(floatingProductScen, { opacity: index === 2 ? 1 : 0 });
  });

  // Separate ScrollTrigger for pinning the floating product
  ScrollTrigger.create({
    trigger: sections[0], // Start pinning at the first section
    start: "top top", // Pin when top of first section hits top of viewport
    endTrigger: ".fully_automatic-section", // Stop pinning at .fully_automatic-section
    end: "top top", // Unpin when top of .fully_automatic-section hits top of viewport
    pin: floatingProductScen, // Pin the floating product element
    pinSpacing: false, // No extra spacing added
    markers: false, // Set to true for debugging
  });

  // Stop the animation at .fully_automatic-section (as before)
  ScrollTrigger.create({
    trigger: ".fully_automatic-section",
    start: "top 80%", // Start when 80% of the section is in view
    end: "bottom top", // End when bottom of section hits top of viewport
    onEnter: () => {
      // Pause the timeline and hold the current position
      tl.pause();
      gsap.set(floatingProductScen, {
        x: "+=0", // Maintain current x position
        y: "+=0", // Maintain current y position
        scale: "+=0", // Maintain current scale
        zIndex: -1,
        filter: "none",
        opacity: 1, // Ensure visibility
      });
    },
    onEnterBack: () => {
      // Reapply the hold when scrolling back into the section
      tl.pause();
      gsap.set(floatingProductScen, {
        x: "+=0",
        y: "+=0",
        scale: "+=0",
        zIndex: -1,
        filter: "none",
        opacity: 1,
      });
    },
    markers: false, // Set to true for debugging
  });
}

// Call the function
FloatingProduct();



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
  const mobileStart = isMobile ? "top 90%" : start;
  const mobileEnd = isMobile ? "bottom 10%" : end;

  return ScrollTrigger.create({
    trigger,
    animation,
    start: mobileStart,
    end: mobileEnd,
    scrub,
    pin,
    markers,
    toggleActions,
    invalidateOnRefresh: true,
  });
}

function animateGlobe() {
  const globeAnimation = gsap.to("#globe", {
    rotateZ: 900,
    transformOrigin: "center center",
    ease: "linear",
  });

  createScrollAnimation({
    trigger: "#globe_container",
    animation: globeAnimation,
    start: "top center",
    end: "+=1000",
    endTrigger: ".sustainability-section",
    scrub: 8,
    markers: false,
    isMobile: false,
  });
}

function animateServiceItems() {
  const serviceItems = gsap.utils.toArray(".service_item");
  const itemsToAnimate = serviceItems.slice(1);

  const tl = gsap.timeline();

  tl.to(itemsToAnimate, {
    x: (index) => -(index + 1) * 300,
    duration: 1,
    stagger: 0.2,
  });

  createScrollAnimation({
    trigger: ".service_area",
    animation: tl,
    start: "7% top",
    end: () => "+=" + (serviceItems.length - 1) * 500,
    scrub: true,
    pin: true,
    markers: false,
  });
}

function animateOnView() {
  const items = gsap.utils.toArray(".view_init");

  items.forEach((item) => {
    const isLeftColumn = item.closest(".review_col:first-child");

    const animation = gsap.from(item, {
      opacity: 0,
      duration: 2,
      filter: "blur(20px)",
      x: isLeftColumn ? "-30%" : "30%",
      rotate: isLeftColumn ? "-30deg" : "30deg",
      ease: "linear",
    });

    createScrollAnimation({
      trigger: item,
      animation,
      start: "top 90%",
      end: "bottom bottom",
      scrub: 0.8,
      markers: false,
    });
  });
}

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
  if (typeof gsap === "undefined") {
    console.warn(
      "GSAP library is not loaded. Hover text animations will not work."
    );
    return;
  }

  const items = document.querySelectorAll(".staggered-item");

  if (!items.length) {
    console.warn("No staggered items (.staggered-item) found on the page.");
    return;
  }

  const itemTimelines = new Map();

  items.forEach((item) => {
    const mainSpan = item.querySelector("span");

    if (!mainSpan) {
      console.warn("Main span not found in staggered item:", item);
      return;
    }

    const originalText = mainSpan.innerText;
    mainSpan.innerHTML = "";

    const defaultLayer = document.createElement("div");
    defaultLayer.classList.add("default-text");

    const hoverLayer = document.createElement("div");
    hoverLayer.classList.add("hover-text");

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

    mainSpan.appendChild(defaultLayer);
    mainSpan.appendChild(hoverLayer);

    const defaultLetters = defaultLayer.querySelectorAll(".letter");
    const hoverLetters = hoverLayer.querySelectorAll(".letter");

    if (!defaultLetters.length || !hoverLetters.length) {
      console.warn(
        "No letters found in default or hover layers for item:",
        item
      );
      return;
    }

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

    itemTimelines.set(item, tl);

    const staggerCardParent = item.closest(".stagger_card");

    if (!staggerCardParent) {
      item.addEventListener("mouseenter", () => tl.play());
      item.addEventListener("mouseleave", () => tl.reverse());
    }
  });

  const staggerCards = document.querySelectorAll(".stagger_card");
  staggerCards.forEach((card) => {
    card.addEventListener("mouseenter", () => {
      const childItems = card.querySelectorAll(".staggered-item");
      childItems.forEach((childItem) => {
        const tl = itemTimelines.get(childItem);
        if (tl) tl.play();
      });
    });
    card.addEventListener("mouseleave", () => {
      const childItems = card.querySelectorAll(".staggered-item");
      childItems.forEach((childItem) => {
        const tl = itemTimelines.get(childItem);
        if (tl) tl.reverse();
      });
    });
  });
}

function scrollOnView() {
  const machinesRow = document.querySelector(".our_machines-row");
  const machinesInner = document.querySelector(".our_machines-inner");

  gsap.set(machinesRow, { xPercent: 65 });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: machinesInner,
      start: "15% top",
      end: "+=110%",
      pin: true,
      scrub: 1,
      markers: false,
    },
  });

  tl.to(machinesRow, { xPercent: 0, duration: 3, ease: "ease" });
}
scrollOnView();

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
    start: "top 90%",
  };

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

function initializeAnimations() {
  document.addEventListener("DOMContentLoaded", () => {
    animateServiceItems();
    animateOnView();
    setupCustomCursor();
    textAnimation();
    animateGlobe();
    hoverText();

    ScrollTrigger.refresh();
  });

  window.addEventListener("resize", () => {
    ScrollTrigger.refresh();
  });
}

initializeAnimations();
