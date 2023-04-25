import Player from "video.js/dist/types/player";

const registerKeys = (player: Player, $filters: HTMLDivElement) => {
  document.addEventListener("keydown", (e) => {
    switch (e.key) {
      case "m":
        player.muted(!player.muted());
        return;
      case "f":
        $filters.classList.toggle("hidden");
        return;
      case "ArrowRight":
        player.currentTime(player.currentTime() + 10);
        return;
      case "ArrowLeft":
        player.currentTime(player.currentTime() - 10);
        return;
      case "ArrowUp":
        player.volume(Math.min(player.volume() + 0.1, 1));
        return;
      case "ArrowDown":
        player.volume(Math.max(player.volume() - 0.1, 0));
        return;
      case " ":
        player.paused() ? player.play() : player.pause();
        return;
    }
  });
};

export default registerKeys;
