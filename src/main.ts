import "./style.css";
import "../node_modules/video.js/dist/video-js.min.css";
import videojs from "video.js";

const $playerBox = document.getElementById("player-box") as HTMLDivElement;
const $formBox = document.getElementById("form-box") as HTMLDivElement;
const $player = document.getElementById("player") as HTMLVideoElement;
const $load = document.getElementById("load") as HTMLButtonElement;
const $source = document.getElementById("source") as HTMLInputElement;
const $title = document.getElementById("title") as HTMLAnchorElement;
const $back = document.getElementById("back") as HTMLAnchorElement;

const player = videojs($player, {
  fill: true,
  controls: true,
  preload: "auto",
});

const registerKeys = () => {
  document.addEventListener("keydown", (e) => {
    console.log(e.key);
    switch (e.key) {
      case "m":
        player.muted(!player.muted());
        return;
      case "ArrowRight":
        player.currentTime(player.currentTime() + 10);
        return;
      case "ArrowLeft":
        player.currentTime(player.currentTime() - 10);
        return;
      case " ":
        player.paused() ? player.play() : player.pause();
        return;
    }
  });
};

if (location.hash) {
  player.src({
    type: "application/x-mpegURL",
    src: atob(location.hash.slice(1)),
  });

  $playerBox.classList.toggle("hidden");
  $back.classList.toggle("hidden");
  $title.classList.toggle("dim");

  registerKeys();
} else {
  $formBox.classList.toggle("hidden");

  const loadFromForm = (e: Event) => {
    e.preventDefault();

    const source = $source.value.trim();

    if (source) {
      $source.value = "";

      player.src({
        src: source,
      });

      player.autoplay(true);

      location.hash = btoa(source);

      $formBox.classList.toggle("hidden");
      $playerBox.classList.toggle("hidden");
      $back.classList.toggle("hidden");
      $title.classList.toggle("dim");

      registerKeys();
    }
  };

  $load.addEventListener("click", loadFromForm);
  $source.addEventListener("change", loadFromForm);
}
