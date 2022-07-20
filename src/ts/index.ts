const handleProfileCard = () => {
  const centerize = (profileCard: HTMLElement) => {
    if (profileCard) {
      const top = window.innerHeight / 2 - profileCard.getBoundingClientRect().height / 2;
      profileCard.style.marginTop = top + "px";
    }
  };

  const profileCard = document.getElementById("profileCard");
  if (!profileCard) return;
  centerize(profileCard);

  const observer = new ResizeObserver(() => {
    centerize(profileCard);
  });
  observer.observe(document.body);
};

const handleDiscordButton = () => {
  const discordButton = document.getElementById("discordButton");
  discordButton?.addEventListener("click", () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(discordButton.dataset.discordTag ?? "").then(() => {
        alert("Discordタグをクリップボードにコピーしました！");
      });
    } else {
      alert("Discordタグをクリップボードにコピーしようとしましたが、お使いの環境ではできません。");
    }
  });
};

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

window.addEventListener("load", () => {
  handleProfileCard();
  handleDiscordButton();
  handleTimelineParallax();
});