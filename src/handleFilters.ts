const defaultFilters = {
  brightness: 1,
  contrast: 1,
  saturation: 1,
  hue: 0,
  negative: 0,
  sepia: 0,
};

let filters = { ...defaultFilters };

function handleFilters($filters: HTMLDivElement, $player: HTMLVideoElement) {
  const $brightness = $filters.querySelector(
    '[name="brightness"]'
  ) as HTMLInputElement;
  const $contrast = $filters.querySelector(
    '[name="contrast"]'
  ) as HTMLInputElement;
  const $saturation = $filters.querySelector(
    '[name="saturation"]'
  ) as HTMLInputElement;
  const $hue = $filters.querySelector('[name="hue"]') as HTMLInputElement;
  const $negative = $filters.querySelector(
    '[name="negative"]'
  ) as HTMLInputElement;
  const $sepia = $filters.querySelector('[name="sepia"]') as HTMLInputElement;

  $filters.addEventListener("input", ({ target }) => {
    if (!target) {
      return;
    }

    const input = target as HTMLInputElement;

    filters[input.name as keyof typeof filters] = Number(input.valueAsNumber);

    $player.style.filter =
      `brightness(${filters.brightness}) ` +
      `contrast(${filters.contrast}) ` +
      `saturate(${filters.saturation}) ` +
      `hue-rotate(${filters.hue}deg) ` +
      `invert(${filters.negative})` +
      `sepia(${filters.sepia})`;
  });

  $filters.addEventListener("click", ({ target }) => {
    if (!target) {
      return;
    }

    const input = target as HTMLInputElement;

    if (input.name === "reset") {
      filters = { ...defaultFilters };
      $player.style.filter = "none";
      $brightness.valueAsNumber = filters.brightness;
      $contrast.valueAsNumber = filters.contrast;
      $saturation.valueAsNumber = filters.saturation;
      $hue.valueAsNumber = filters.hue;
      $negative.valueAsNumber = filters.negative;
      $sepia.valueAsNumber = filters.sepia;
      return;
    }

    if (input.name === "close") {
      $filters.classList.toggle("hidden");
    }
  });
}

export default handleFilters;
