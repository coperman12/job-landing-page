// Read aloud with the browser's speech engine. The voice is picked per sentence (Hebrew or English),
// so English job titles on the Hebrew page sound right. Which voices exist depends on the device
import { getLang, t } from './i18n.js';
const STORAGE_KEY = 'a11y-reader';
// Measured on macOS Chrome: below 1 the engine barely reacts (0.8 is 0-10% slower, 0.5 is 20-30% slower)
const RATES = { slow: 0.5, normal: 1, fast: 1.3 };
const RATE_STEPS = Object.keys(RATES); // Slowest to fastest, for the bar's - and + buttons
const BLOCKS = 'h1, h2, h3, p, label, .stat, .chips, .timeline-years, .edu-tag';
const NOT_READ = '.hp, .field-error, .form-status';
const CONTROLS = 'a, button, input, textarea, summary';
const synth = window.speechSynthesis;
let state = 'idle';
let chunks = [];
let position = 0;
let run = 0; // Bumped by every speak and stop, so callbacks of a cancelled sentence are ignored
let spoken = null;
let following = false; // Continuous reading scrolls with the text; a single clicked paragraph stays put
let readOnClick = false;
let rate = 'normal';
let bar;
let statusLabel;
let pauseButton;
let pauseLabel;
let speedValue;
let slowerButton;
let fasterButton;
let notice;
let renderControls = () => { };
function clean(text) {
    return text.replace(/\s*[•·]\s*/g, ', ').replace(/\s+/g, ' ').trim();
}
function blockText(el) {
    // The typewriter holds a half-typed word at any moment, so read its full list instead
    const typed = el.querySelector('#typed');
    if (typed)
        return clean(JSON.parse(typed.dataset.words ?? '[]').join(', '));
    if (el.classList.contains('chips'))
        return Array.from(el.children, (li) => li.textContent ?? '').join(', ');
    const copy = el.cloneNode(true);
    copy.querySelectorAll('[aria-hidden="true"]').forEach((node) => node.remove());
    return clean(copy.textContent ?? '');
}
function controlName(el) {
    const label = el.labels?.[0]?.textContent;
    return clean(el.getAttribute('aria-label') ?? label ?? el.textContent ?? '');
}
// Short pieces: Chrome cuts off long utterances. Only punctuation before a space counts, to keep ".NET" whole
function toChunks(el, text) {
    return text
        .replace(/([.!?:;])\s+/g, '$1\n')
        .split('\n')
        .filter(Boolean)
        .map((sentence) => ({ el, text: sentence }));
}
function pageChunks() {
    return Array.from(document.querySelectorAll(`main :is(${BLOCKS})`))
        .filter((el) => !el.closest(NOT_READ))
        .flatMap((el) => toChunks(el, blockText(el)));
}
function findVoice(lang) {
    // "iw" is the old code for Hebrew, still reported on Android
    const pattern = lang === 'he' ? /^(he|iw)([-_]|$)/i : /^en([-_]|$)/i;
    const voices = (synth?.getVoices() ?? []).filter((v) => pattern.test(v.lang));
    return (voices.find((v) => v.default) ??
        voices.find((v) => /samantha|google|microsoft|natural|premium|enhanced/i.test(v.name)) ??
        voices[0]);
}
function setNotice(key) {
    notice.textContent = key ? t(key) : '';
}
// An empty voice list can just mean "not loaded yet", so only a loaded list without this language blocks reading
function readyToRead() {
    if (!synth) {
        setNotice('a11y.read.unsupported');
        return false;
    }
    if (synth.getVoices().length > 0 && !findVoice(getLang())) {
        setNotice('a11y.read.noVoice');
        return false;
    }
    setNotice(null);
    return true;
}
function mark(el) {
    if (spoken === el)
        return;
    spoken?.classList.remove('a11y-speaking');
    spoken = el;
    if (!el)
        return;
    el.classList.add('a11y-speaking');
    if (!following)
        return;
    // Keep the text being read in the middle of the screen. Blocks on the same row don't move the page
    const box = el.getBoundingClientRect();
    const middle = (box.top + box.bottom) / 2;
    if (middle < window.innerHeight * 0.3 || middle > window.innerHeight * 0.6)
        el.scrollIntoView({ block: 'center' });
}
function renderBar() {
    bar.hidden = state === 'idle';
    bar.dataset.state = state;
    statusLabel.textContent = t(state === 'paused' ? 'a11y.read.paused' : 'a11y.read.reading');
    pauseLabel.textContent = t(state === 'paused' ? 'a11y.read.resume' : 'a11y.read.pause');
    speedValue.textContent = t(`a11y.read.${rate}`);
    slowerButton.setAttribute('aria-disabled', String(rate === RATE_STEPS[0]));
    fasterButton.setAttribute('aria-disabled', String(rate === RATE_STEPS[RATE_STEPS.length - 1]));
}
function speakCurrent() {
    const chunk = chunks[position];
    if (!synth || !chunk) {
        stopReading();
        return;
    }
    const id = ++run;
    const lang = /[֐-׿]/.test(chunk.text) ? 'he' : 'en';
    const utterance = new SpeechSynthesisUtterance(chunk.text);
    utterance.lang = lang === 'he' ? 'he-IL' : 'en-US';
    const voice = findVoice(lang);
    if (voice)
        utterance.voice = voice;
    utterance.rate = RATES[rate];
    utterance.onend = () => {
        if (id !== run)
            return;
        position++;
        speakCurrent();
    };
    utterance.onerror = () => {
        if (id !== run)
            return;
        stopReading();
        setNotice('a11y.read.failed');
    };
    mark(chunk.el);
    synth.speak(utterance);
}
function play(items, from = 0, follow = false) {
    if (items.length === 0)
        return;
    run++;
    synth?.cancel();
    chunks = items;
    position = from;
    following = follow;
    state = 'reading';
    renderBar();
    speakCurrent();
}
function startPage() {
    if (!readyToRead())
        return false;
    const items = pageChunks();
    const headerBottom = document.querySelector('.site-header')?.getBoundingClientRect().bottom ?? 0;
    const firstInView = items.findIndex((chunk) => chunk.el && chunk.el.getBoundingClientRect().bottom > headerBottom);
    play(items, Math.max(firstInView, 0), true);
    return true;
}
// Pausing cancels and remembers the sentence: speechSynthesis.pause() is unreliable on Android
function togglePause() {
    if (state === 'reading') {
        run++;
        synth?.cancel();
        state = 'paused';
        renderBar();
    }
    else if (state === 'paused') {
        state = 'reading';
        renderBar();
        speakCurrent();
    }
}
export function stopReading() {
    if (state === 'idle')
        return;
    run++;
    synth?.cancel();
    state = 'idle';
    chunks = [];
    position = 0;
    mark(null);
    // The bar is about to hide - don't leave keyboard focus on a hidden button
    const hadFocus = bar.contains(document.activeElement);
    renderBar();
    if (hadFocus)
        document.getElementById('a11y-open')?.focus();
}
// The X turns reading off altogether: unlike Stop, read-on-click doesn't stay on either
function closeReader() {
    readOnClick = false;
    renderControls();
    savePrefs();
    stopReading();
}
export function toggleReading() {
    if (state === 'idle')
        startPage();
    else
        stopReading();
}
function savePrefs() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ click: readOnClick, rate }));
    }
    catch {
        // Storage blocked - the choice still works for this visit
    }
}
function loadPrefs() {
    try {
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}');
        readOnClick = saved.click === true;
        if (saved.rate && saved.rate in RATES)
            rate = saved.rate;
    }
    catch {
        // Nothing saved or storage blocked - keep the defaults
    }
}
function setRate(next) {
    rate = next;
    savePrefs();
    renderControls();
    renderBar();
    // Takes effect at once: the sentence being read restarts at the new speed
    if (state === 'reading') {
        synth?.cancel();
        speakCurrent();
    }
}
function stepRate(by) {
    const next = RATE_STEPS[RATE_STEPS.indexOf(rate) + by];
    if (next)
        setRate(next);
}
export function resetReader() {
    stopReading();
    readOnClick = false;
    rate = 'normal';
    setNotice(null);
    renderControls();
    savePrefs();
}
function initReadOnClick() {
    document.addEventListener('click', (e) => {
        if (!readOnClick)
            return;
        const target = e.target;
        if (target.closest(`${CONTROLS}, label, dialog, .reader-bar`))
            return;
        const selected = window.getSelection()?.toString().trim();
        if (selected) {
            play(toChunks(null, clean(selected)));
            return;
        }
        const block = target.closest(`main :is(${BLOCKS})`);
        if (block && !block.closest(NOT_READ))
            play(toChunks(block, blockText(block)));
    });
    document.addEventListener('focusin', (e) => {
        if (!readOnClick)
            return;
        const target = e.target;
        if (!target.matches(CONTROLS) || !target.matches(':focus-visible'))
            return;
        if (target.closest('dialog, .reader-bar, .hp'))
            return;
        play(toChunks(null, controlName(target)));
    });
}
export function initReader(panel) {
    bar = document.getElementById('reader-bar');
    statusLabel = document.getElementById('reader-status');
    pauseButton = document.getElementById('reader-pause');
    pauseLabel = document.getElementById('reader-pause-label');
    speedValue = document.getElementById('reader-speed-value');
    slowerButton = document.getElementById('reader-slower');
    fasterButton = document.getElementById('reader-faster');
    notice = document.getElementById('a11y-read-notice');
    const clickBox = document.getElementById('a11y-read-click');
    const rates = Array.from(panel.querySelectorAll('input[name="a11y-rate"]'));
    renderControls = () => {
        clickBox.checked = readOnClick;
        rates.forEach((input) => (input.checked = input.value === rate));
    };
    loadPrefs();
    renderControls();
    synth?.getVoices(); // Chrome loads voices lazily - ask early so they are ready on the first click
    document.getElementById('a11y-read-page')?.addEventListener('click', () => {
        if (!startPage())
            return;
        panel.close();
        pauseButton.focus();
    });
    clickBox.addEventListener('change', () => {
        readOnClick = clickBox.checked;
        if (readOnClick)
            readyToRead();
        else
            stopReading();
        savePrefs();
    });
    rates.forEach((input) => input.addEventListener('change', () => setRate(input.value)));
    slowerButton.addEventListener('click', () => stepRate(-1));
    fasterButton.addEventListener('click', () => stepRate(1));
    pauseButton.addEventListener('click', togglePause);
    document.getElementById('reader-stop')?.addEventListener('click', stopReading);
    document.getElementById('reader-close')?.addEventListener('click', closeReader);
    initReadOnClick();
    document.addEventListener('langchange', () => {
        stopReading();
        setNotice(null);
    });
    window.addEventListener('pagehide', () => synth?.cancel()); // Chrome keeps talking after a reload otherwise
}
