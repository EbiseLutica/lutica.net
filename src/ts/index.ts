const handleProfileCard = () => {
  const centerize = (profileCard: HTMLElement) => {
    if (profileCard) {
      const top = window.innerHeight / 2 - profileCard.getBoundingClientRect().height / 2;
      profileCard.style.marginTop = top + "px";
    }
  };

  const profileCard = document.getElementById("profileCard");
  if (!profileCard) throw new Error("いや～～～、profileCardが見つからないのはバグで…");
  centerize(profileCard);

  const observer = new ResizeObserver(() => {
    centerize(profileCard);
  });
  observer.observe(document.body);
};

const handleDiscordButton = () => {
  const discordButton = document.getElementById("discordButton");
  if (!discordButton) throw new Error("いや～～～、profileCardが見つからないのはバグで…");
  discordButton.addEventListener("click", () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(discordButton.dataset.discordTag ?? "").then(() => {
        alert("Discordタグをクリップボードにコピーしました！");
      });
    } else {
      alert("Discordタグをクリップボードにコピーしようとしましたが、お使いの環境ではできません。");
    }
  });
};

window.addEventListener("load", () => {
  handleProfileCard();
  handleDiscordButton();
});