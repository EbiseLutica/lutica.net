window.addEventListener("load", () => {
  document.querySelectorAll("._cloak").forEach(el => {
    el.classList.add("_cloak--active");
  });
  document.getElementById("shrimp-loader")?.remove();
  handleTimelineParallax();
});

const handleTimelineParallax = () => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
      }
    });
  }, {
    threshold: 0.5
  });
  document.querySelectorAll(".__timelineParallax").forEach(it => {
    observer.observe(it);
  });
};