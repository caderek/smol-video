import "./style.css";
import "../node_modules/video.js/dist/video-js.min.css";
import videojs from "video.js";
import HashStorage from "./hashStorage";

const $playerBox = document.getElementById("player-box") as HTMLDivElement;
const $startBox = document.getElementById("start-box") as HTMLDivElement;
const $formBox = document.getElementById("form-box") as HTMLDivElement;
const $player = document.getElementById("player") as HTMLVideoElement;
const $load = document.getElementById("load") as HTMLButtonElement;
const $source = document.getElementById("source") as HTMLInputElement;
const $name = document.getElementById("name") as HTMLInputElement;
const $header = document.getElementById("header") as HTMLDivElement;
const $play = document.getElementById("play") as HTMLButtonElement;
const $videoTitleBig = document.getElementById(
  "video-title-big"
) as HTMLDivElement;

const PAGE_TITLE = "SmolVid";

const hashStorage = new HashStorage();

const player = videojs($player, {
  fill: true,
  controls: true,
  preload: "auto",
});

const $controlBar = document.querySelector(".vjs-control-bar");

const $infoBox = document.createElement("section");
$infoBox.classList.add("info-box");

const $videoTitle = document.createElement("h2");

const $back = document.createElement("a");
$back.href = "/";
$back.title = "Go back to the homepage";
$back.classList.add("back");

$infoBox.appendChild($videoTitle);
$infoBox.appendChild($back);
$controlBar?.appendChild($infoBox);

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

const updateStorage = (ms: number = 1000) => {
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
    $videoTitle.innerText = data.title;
    $videoTitleBig.classList.remove("hidden");
    $videoTitleBig.innerText = data.title;
  } else {
    $videoTitleBig.classList.add("hidden");
  }

  $header.classList.add("hidden");
  $formBox.classList.add("hidden");
  $playerBox.classList.remove("hidden");
  $back.classList.remove("hidden");
  $infoBox.classList.remove("hidden");

  // @todo if it is the end of video, start from beginning
  player.currentTime(storage.read());
  registerKeys();
  updateStorage();
};

const data = hashStorage.get();

if (data) {
  loadVideo(data, { autoplay: false, updateHash: false });
  $startBox.classList.remove("hidden");

  $play.addEventListener("click", () => {
    player.play();
    $startBox.classList.add("hidden");
  });
} else {
  $formBox.classList.remove("hidden");
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
