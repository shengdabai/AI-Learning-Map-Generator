(() => {
  const root = document.documentElement;
  const progress = document.querySelector(".reading-progress");
  const links = [...document.querySelectorAll(".toc a")];
  const sections = [...document.querySelectorAll("main section[id]")];
  const update = () => {
    const max = root.scrollHeight - innerHeight;
    const value = max > 0 ? Math.min(100, (scrollY / max) * 100) : 0;
    root.style.setProperty("--read", `${value}%`);
    if (progress) progress.setAttribute("aria-valuenow", String(Math.round(value)));
  };
  const observer = new IntersectionObserver(entries => {
    const visible = entries.filter(e => e.isIntersecting).sort((a,b) => b.intersectionRatio-a.intersectionRatio)[0];
    if (!visible) return;
    links.forEach(link => {
      const active = link.getAttribute("href") === `#${visible.target.id}`;
      link.classList.toggle("is-active", active);
      if (active) link.setAttribute("aria-current", "location"); else link.removeAttribute("aria-current");
    });
  }, {rootMargin:"-20% 0px -65% 0px",threshold:[0,.1,.5]});
  sections.forEach(section => observer.observe(section));
  addEventListener("scroll", update, {passive:true});
  addEventListener("resize", update);
  update();
})();
