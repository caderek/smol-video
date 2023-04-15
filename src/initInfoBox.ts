const initDomElements = () => {
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

  return {
    $infoBox,
    $videoTitle,
    $back,
  };
};

export default initDomElements;
