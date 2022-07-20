window.addEventListener("load", () => {
  document.querySelectorAll("._cloak").forEach(el => {
    el.classList.add("_cloak--active");
  });
  document.getElementById("shrimp-loader")?.remove();
});
