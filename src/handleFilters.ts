import * as AColorPicker from "a-color-picker";

const defaultFilters = {
  brightness: "1",
  contrast: "1",
  saturation: "1",
  hue: "0",
  negative: "0",
  sepia: "0",
  blend: "multiply",
  color: "#ffffff",
};

let filters = { ...defaultFilters };

function handleFilters(
  $filters: HTMLDivElement,
  $player: HTMLVideoElement,
  $overlay: HTMLDivElement
) {
  const picker = AColorPicker.from("#picker");

  /// @ts-expect-error
  picker.on("change", (picker, color) => {
    $overlay.style.backgroundColor = color;
  });

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
  const $blendMode = $filters.querySelector(
    '[name="blend"]'
  ) as HTMLInputElement;

  $filters.addEventListener("input", ({ target }) => {
    if (!target) {
      return;
    }

    const input = target as HTMLInputElement;

    filters[input.name as keyof typeof filters] = input.value;

    $player.style.filter =
      `brightness(${filters.brightness}) ` +
      `contrast(${filters.contrast}) ` +
      `saturate(${filters.saturation}) ` +
      `hue-rotate(${filters.hue}deg) ` +
      `invert(${filters.negative})` +
      `sepia(${filters.sepia})`;

    $overlay.style.mixBlendMode = filters.blend;
  });

  $filters.addEventListener("click", ({ target }) => {
    if (!target) {
      return;
    }

    const input = target as HTMLInputElement;

    if (input.name === "reset") {
      filters = { ...defaultFilters };
      $player.style.filter = "none";
      $overlay.style.mixBlendMode = filters.blend;
      // @ts-expect-error
      picker[0].setColor("#ffffff");
      $brightness.value = filters.brightness;
      $contrast.value = filters.contrast;
      $saturation.value = filters.saturation;
      $hue.value = filters.hue;
      $negative.value = filters.negative;
      $sepia.value = filters.sepia;
      $blendMode.value = "multiply";
      return;
    }

    if (input.name === "close") {
      $filters.classList.toggle("hidden");
    }
  });
}

export default handleFilters;
