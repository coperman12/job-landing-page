// Typewriter effect that cycles through the words in data-words
const TYPE_MS = 55;
const DELETE_MS = 30;
const HOLD_MS = 1600;

export function initTyped(): void {
  const el = document.getElementById('typed');
  if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let words: string[];
  try {
    words = JSON.parse(el.dataset.words ?? '[]') as string[];
  } catch {
    return;
  }
  if (words.length < 2) return;

  let wordIndex = 0;
  let charIndex = words[0].length;
  let deleting = true;

  const tick = (): void => {
    // "Stop animations" in the accessibility menu: hold the first word until it is turned off
    if (document.documentElement.hasAttribute('data-a11y-motion')) {
      el.textContent = words[0];
      wordIndex = 0;
      charIndex = words[0].length;
      deleting = true;
      window.setTimeout(tick, HOLD_MS);
      return;
    }

    const word = words[wordIndex];
    charIndex += deleting ? -1 : 1;
    el.textContent = word.slice(0, charIndex);

    let wait = deleting ? DELETE_MS : TYPE_MS;
    if (!deleting && charIndex === word.length) {
      deleting = true;
      wait = HOLD_MS;
    } else if (deleting && charIndex === 0) {
      deleting = false;
      wordIndex = (wordIndex + 1) % words.length;
    }
    window.setTimeout(tick, wait);
  };

  window.setTimeout(tick, HOLD_MS);
}
