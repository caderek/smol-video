import Player from "video.js/dist/types/player";

const initStorage = (player: Player) => {
  return {
    save() {
      if (player.currentTime() !== 0) {
        localStorage.setItem(location.hash, player.currentTime().toFixed(0));
      }
    },

    read() {
      const time = localStorage.getItem(location.hash);
      return time ? Number(time) : 0;
    },

    update(ms: number = 1000) {
      this.save();
      setTimeout(this.update.bind(this), ms);
    },
  };
};

export default initStorage;
