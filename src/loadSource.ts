import Player from "video.js/dist/types/player";

const loadSource = (url: string, player: Player): Promise<void> => {
  // @ts-ignore
  window.player = player;
  return new Promise((resolve, reject) => {
    fetch(url, { method: "HEAD" })
      .then((res) => {
        if (res.ok) {
          resolve();
        } else {
          reject();
        }
      })
      .catch(reject);

    player.src({
      src: url,
    });
  });
};

export default loadSource;

// https://q1.livemodo.click/wnRkgmDVBChzXvokRj4bVw/1681861266/34362e3230342e37362e313932/ff90/playlist.m3u8

// https://sgoteu2vejkxvm.sharecast.ws/hls/4af3adfcec5a39cd-1cca2b9763c71f1c56bad7d4a60810f60e665e3a4911fe8e15909c935c39157e/live.m3u8
