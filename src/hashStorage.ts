import pako from "pako";
import base64 from "base64-js";

const TITLE_LENGTH_SIZE = 1;
const VERSION_SIZE = 1;
const VERSION = 0;

type Data = {
  title: string;
  url: string;
} | null;

function encode(url: string, title: string) {
  const titleBytes = new TextEncoder().encode(title);
  const urlBytes = new TextEncoder().encode(url);

  const size =
    VERSION_SIZE + TITLE_LENGTH_SIZE + titleBytes.length + urlBytes.length;

  const bytes = new Uint8Array(size);

  bytes[0] = VERSION;
  bytes[1] = titleBytes.length;
  bytes.set(titleBytes, VERSION_SIZE + TITLE_LENGTH_SIZE);
  bytes.set(urlBytes, VERSION_SIZE + TITLE_LENGTH_SIZE + titleBytes.length);

  const compressed = pako.deflateRaw(bytes);

  return base64.fromByteArray(compressed);
}

function decode(base64str: string): Data {
  const compressed = base64.toByteArray(base64str);

  const bytes = pako.inflateRaw(compressed);

  const version = bytes[0]; // unused, but added for future changes in the format
  const titleLength = bytes[1];
  const title = new TextDecoder().decode(
    bytes.slice(
      VERSION_SIZE + TITLE_LENGTH_SIZE,
      VERSION_SIZE + TITLE_LENGTH_SIZE + titleLength
    )
  );
  const url = new TextDecoder().decode(
    bytes.slice(VERSION_SIZE + TITLE_LENGTH_SIZE + titleLength)
  );

  return { title, url };
}

class HashStorage {
  #internalChange = false;
  #onChange?: (data: Data) => void;

  constructor() {
    this.#registerListener();
  }

  #registerListener() {
    window.addEventListener(
      "hashchange",
      () => {
        if (this.#internalChange) {
          this.#internalChange = false;
          return;
        }

        if (this.#onChange) {
          this.#onChange(this.get());
        }
      },
      false
    );
  }

  set(url: string, title: string) {
    location.hash = encode(url, title);
    this.#internalChange = true;
  }

  get() {
    return location.hash.length > 1 ? decode(location.hash.slice(1)) : null;
  }

  onChange(fn: (data: Data) => void) {
    this.#onChange = fn;
  }
}

export default HashStorage;
