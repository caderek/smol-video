import "./style.css";
import "../node_modules/video.js/dist/video-js.min.css";
import videojs from "video.js";
import HashStorage from "./hashStorage";

const $playerBox = document.getElementById("player-box") as HTMLDivElement;
const $formBox = document.getElementById("form-box") as HTMLDivElement;
const $player = document.getElementById("player") as HTMLVideoElement;
const $load = document.getElementById("load") as HTMLButtonElement;
const $source = document.getElementById("source") as HTMLInputElement;
const $name = document.getElementById("name") as HTMLInputElement;
const $title = document.getElementById("title") as HTMLAnchorElement;
const $back = document.getElementById("back") as HTMLAnchorElement;

const PAGE_TITLE = "SmolVid";

const hashStorage = new HashStorage();

const player = videojs($player, {
  fill: true,
  controls: true,
  preload: "auto",
});

const storage = {
  save() {
    if (player.currentTime() !== 0) {
      localStorage.setItem(location.hash, player.currentTime().toFixed(0));
    }
  },

  read() {
    const time = localStorage.getItem(location.hash);
    return time ? Number(time) : 0;
  },
};

const updateStorage = (ms: number = 5000) => {
  storage.save();
  setTimeout(updateStorage, ms);
};

const registerKeys = () => {
  document.addEventListener("keydown", (e) => {
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

const loadVideo = (
  data: { url: string; title: string },
  options: { autoplay: boolean; updateHash: boolean }
) => {
  if (data === null) {
    return;
  }

  player.src({
    src: data.url,
  });

  player.autoplay(options.autoplay);

  if (options.updateHash) {
    hashStorage.set(data.url, data.title);
  }

  if (data.title) {
    document.title = `${data.title} - ${PAGE_TITLE}`;
  }

  $formBox.classList.add("hidden");
  $playerBox.classList.remove("hidden");
  $back.classList.remove("hidden");
  $title.classList.add("dim");

  player.currentTime(storage.read());
  registerKeys();
  updateStorage();
};

const data = hashStorage.get();

if (data) {
  loadVideo(data, { autoplay: false, updateHash: false });
} else {
  const loadFromForm = (e: Event) => {
    e.preventDefault();

    const source = $source.value.trim();
    const name = $name.value.trim();

    if (source) {
      loadVideo(
        { url: source, title: name },
        { autoplay: true, updateHash: true }
      );
    }
  };

  $load.addEventListener("click", loadFromForm);

  [$source, $name].forEach(($el) => {
    $el.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        loadFromForm(e);
      }
    });
  });

  hashStorage.onChange((data) => {
    if (data !== null) {
      loadVideo(data, { autoplay: false, updateHash: false });
    }
  });
}
