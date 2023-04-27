import "./style.css";
import "../node_modules/video.js/dist/video-js.min.css";
import videojs from "video.js";
import isMobile from "is-mobile";
import HashStorage from "./hashStorage";
import registerKeys from "./registerKeys";
import loadSource from "./loadSource";
import initStorage from "./storage";
import initInfoBox from "./initInfoBox";
import handleFilters from "./handleFilters";

const $homePage = document.getElementById("home-page") as HTMLDivElement;
const $playerPage = document.getElementById("player-page") as HTMLDivElement;
const $startBox = document.getElementById("start-box") as HTMLDivElement;
const $player = document.getElementById("player") as HTMLVideoElement;
const $filters = document.getElementById("filters") as HTMLDivElement;
const $overlay = document.getElementById("overlay") as HTMLDivElement;
const $load = document.getElementById("load") as HTMLButtonElement;
const $source = document.getElementById("source") as HTMLInputElement;
const $name = document.getElementById("name") as HTMLInputElement;
const $play = document.getElementById("play") as HTMLButtonElement;
const $titleBig = document.getElementById("video-title-big") as HTMLDivElement;
const $error = document.getElementById("error") as HTMLParagraphElement;

const PAGE_TITLE = "SmolVid";

const player = videojs($player, {
  fill: true,
  controls: true,
  preload: "auto",
});

handleFilters($filters, $player, $overlay);

const { $videoTitle } = initInfoBox();

const hashStorage = new HashStorage();
const storage = initStorage(player);

const loadVideo = async (
  data: { url: string; title: string },
  options: { autoplay: boolean; updateHash: boolean }
) => {
  if (data === null) {
    return false;
  }

  let timeout;

  try {
    await loadSource(data.url, player);
  } catch (e) {
    $homePage.classList.remove("hidden");
    $error.classList.remove("hidden");

    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
      $error.classList.add("hidden");
    }, 2000);

    return false;
  }

  player.autoplay(options.autoplay);

  if (options.updateHash) {
    hashStorage.set(data.url, data.title);
  }

  if (data.title) {
    document.title = `${data.title} - ${PAGE_TITLE}`;
    $videoTitle.innerText = data.title;
    $titleBig.classList.remove("hidden");
    $titleBig.innerText = data.title;
  } else {
    $titleBig.classList.add("hidden");
  }

  $homePage.classList.add("hidden");
  $playerPage.classList.remove("hidden");

  // @todo if it is the end of video, start from beginning
  if (!isMobile()) {
    player.currentTime(storage.read());
  }

  registerKeys(player, $filters);
  storage.update();

  return true;
};

const main = async () => {
  const data = hashStorage.get();

  if (data) {
    if (!(await loadVideo(data, { autoplay: false, updateHash: false }))) {
      return;
    }
  } else {
    $homePage.classList.remove("hidden");
    const loadFromForm = (e: Event) => {
      e.preventDefault();

      const source = $source.value.trim();
      const name = $name.value.trim();

      if (source) {
        loadVideo(
          { url: source, title: name },
          { autoplay: false, updateHash: true }
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

  $startBox.classList.remove("hidden");

  $play.addEventListener("click", () => {
    player.play();
    $startBox.classList.add("hidden");
  });
};

main();
