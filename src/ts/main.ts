const centerize = (profileCard: HTMLElement) => {
  if (profileCard) {
    const top = window.innerHeight / 2 - profileCard.getBoundingClientRect().height / 2;
    profileCard.style.marginTop = top + "px";
  }
};


window.addEventListener("load", () => {
  const profileCard = document.getElementById("profileCard");
  if (!profileCard) throw new Error("いや～～～、profileCardが見つからないのはバグで…");
  centerize(profileCard);

  const observer = new ResizeObserver(() => {
    centerize(profileCard);
  });
  observer.observe(document.body);
});
