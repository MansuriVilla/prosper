document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger, SplitText);
  const lenis = new Lenis();
  lenis.on("scroll", ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);

  /*---------------------------
  Animation On Scroll 
  ----------------*/
  function animateOnView() {
    const items = document.querySelectorAll(".view_init");

    const isMobile = window.innerWidth <= 768;

    const triggerStart = isMobile ? "top 90%" : "top 50%";
    const triggerEnd = isMobile ? "bottom 10%" : "bottom 60%";

    items.forEach((item) => {
      gsap.from(item, {
        y: 20,
        opacity: 0,
        duration: 0.9,
        stagger: 0.1,
        ease: "cubic-bezier(.858, .01, .068, .99)",
        scrollTrigger: {
          markers: true,
          trigger: item,
          start: triggerStart,
          end: triggerEnd,
          toggleActions: "play none none none",
          scrub: true,
        },
      });
    });
  }
  animateOnView();
});
