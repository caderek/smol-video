import Player from "video.js/dist/types/player";

const loadSource = (url: string, player: Player) => {
  return new Promise((resolve, reject) => {
    // @ts-ignore
    player.on("error", reject);

    // @ts-ignore
    player.on("loadeddata", resolve);

    player.src({
      src: url,
    });
  });
};

export default loadSource;
