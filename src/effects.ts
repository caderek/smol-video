function changeFilters() {
  document.querySelector("video")!.style.filter =
    "contrast(1) grayscale(0) hue-rotate(0deg) saturate(1) sepia(0) invert(0)";
}

export { changeFilters };
