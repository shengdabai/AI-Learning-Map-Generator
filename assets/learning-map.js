(() => {
  "use strict";

  const root = document.documentElement;
  const navLinks = [...document.querySelectorAll(".atlas-nav a[href^='#']")];
  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  const updateProgress = () => {
    const scrollable = root.scrollHeight - root.clientHeight;
    const progress = scrollable > 0 ? (root.scrollTop / scrollable) * 100 : 0;
    root.style.setProperty("--reading-progress", `${Math.min(100, Math.max(0, progress))}%`);
  };

  const setCurrent = (id) => {
    navLinks.forEach((link) => {
      const current = link.getAttribute("href") === `#${id}`;
      if (current) {
        link.setAttribute("aria-current", "true");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  };

  if ("IntersectionObserver" in window && sections.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setCurrent(visible.target.id);
      },
      { rootMargin: "-18% 0px -68% 0px", threshold: [0, 0.1, 0.5] }
    );
    sections.forEach((section) => observer.observe(section));
  }

  addEventListener("scroll", updateProgress, { passive: true });
  addEventListener("resize", updateProgress, { passive: true });
  updateProgress();
})();
