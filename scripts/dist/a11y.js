// Accessibility menu. Every choice is a data-a11y-* attribute on <html>, styled in a11y.css
// and restored before paint by the inline script in index.html
import { initKeys } from './a11y-keys.js';
import { initReader, resetReader } from './a11y-reader.js';
const STORAGE_KEY = 'a11y';
const TEXT_SIZES = [100, 125, 150, 175, 200];
const root = document.documentElement;
let prefs = {};
function load() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}');
    }
    catch {
        return {};
    }
}
function setPref(name, value) {
    if (value === null) {
        delete prefs[name];
        root.removeAttribute(`data-a11y-${name}`);
    }
    else {
        prefs[name] = value;
        root.setAttribute(`data-a11y-${name}`, value);
    }
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    }
    catch {
        // Storage blocked - the choice still works for this visit
    }
}
// Wires the checkboxes, color radios and text size buttons. Returns a function that redraws them from prefs
function initControls(panel) {
    const toggles = Array.from(panel.querySelectorAll('input[data-a11y-toggle]'));
    const colors = Array.from(panel.querySelectorAll('input[name="a11y-colors"]'));
    const down = document.getElementById('a11y-text-down');
    const up = document.getElementById('a11y-text-up');
    const value = document.getElementById('a11y-text-value');
    const textIndex = () => Math.max(0, TEXT_SIZES.indexOf(Number(prefs.text ?? 100)));
    const render = () => {
        toggles.forEach((input) => (input.checked = input.dataset.a11yToggle in prefs));
        colors.forEach((input) => (input.checked = input.value === (prefs.colors ?? '')));
        const index = textIndex();
        value.textContent = `${TEXT_SIZES[index]}%`;
        down.setAttribute('aria-disabled', String(index === 0));
        up.setAttribute('aria-disabled', String(index === TEXT_SIZES.length - 1));
    };
    const stepText = (delta) => {
        const next = TEXT_SIZES[textIndex() + delta];
        if (next === undefined)
            return;
        setPref('text', next === 100 ? null : String(next));
        render();
    };
    toggles.forEach((input) => input.addEventListener('change', () => setPref(input.dataset.a11yToggle, input.checked ? 'true' : null)));
    colors.forEach((input) => input.addEventListener('change', () => setPref('colors', input.value || null)));
    down.addEventListener('click', () => stepText(-1));
    up.addEventListener('click', () => stepText(1));
    return render;
}
function initGuide() {
    const guide = document.getElementById('a11y-guide');
    if (!guide)
        return;
    document.addEventListener('pointermove', (e) => {
        if (!root.hasAttribute('data-a11y-guide'))
            return;
        guide.classList.add('is-active');
        guide.style.transform = `translateY(${e.clientY}px)`;
    }, { passive: true });
}
export function initA11y() {
    const panel = document.getElementById('a11y-panel');
    const openButton = document.getElementById('a11y-open');
    if (!panel || !openButton || typeof panel.showModal !== 'function')
        return;
    prefs = load();
    const render = initControls(panel);
    render();
    initGuide();
    initReader(panel);
    initKeys();
    const toggle = () => {
        if (panel.open)
            panel.close();
        else
            panel.showModal();
    };
    openButton.addEventListener('click', toggle);
    document.getElementById('a11y-close')?.addEventListener('click', () => panel.close());
    // The panel has no padding of its own, so a click whose target is the dialog landed on the backdrop
    panel.addEventListener('click', (e) => {
        if (e.target === panel)
            panel.close();
    });
    // Opened with Alt+A while nothing had focus: give the keyboard a place to continue from
    panel.addEventListener('close', () => {
        if (document.activeElement === document.body)
            openButton.focus();
    });
    document.getElementById('a11y-reset')?.addEventListener('click', () => {
        Object.keys(prefs).forEach((name) => setPref(name, null));
        render();
        resetReader();
    });
    // e.code is the physical key, so this works on a Hebrew layout and with Option on a Mac
    document.addEventListener('keydown', (e) => {
        if (e.altKey && !e.ctrlKey && !e.metaKey && e.code === 'KeyA') {
            e.preventDefault();
            toggle();
        }
    });
}
