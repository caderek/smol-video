const $playerBox = document.getElementById("player-box");
const $formBox = document.getElementById("form-box");
const $player = document.getElementById("player");
const $load = document.getElementById("load");
const $source = document.getElementById("source");

const width = Math.min(
  Math.floor((16 / 9) * window.innerHeight),
  window.innerWidth
);

const player = videojs($player, {
  fill: true,
  controls: true,
  preload: "auto",
});

if (location.hash) {
  player.src({
    type: "application/x-mpegURL",
    src: atob(location.hash.slice(1)),
  });

  setTimeout(() => {
    console.log({ w: player.videoWidth(), h: player.videoHeight() });
  }, 3000);

  $playerBox.classList.toggle("hidden");
} else {
  $formBox.classList.toggle("hidden");

  $load.addEventListener("click", (e) => {
    e.preventDefault();

    const source = $source.value.trim();

    if (source) {
      $source.value = "";

      player.src({
        type: "application/x-mpegURL",
        src: source,
      });

      player.autoplay();

      location.hash = btoa(source);

      $formBox.classList.toggle("hidden");
      $playerBox.classList.toggle("hidden");
    }
  });
}
