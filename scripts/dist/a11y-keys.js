// Keyboard shortcuts. Physical key codes keep them working on a Hebrew layout.
// Single keys are active only after "Keyboard navigation" is turned on in the menu (WCAG 2.1.4)
import { stopReading, toggleReading } from './a11y-reader.js';
const TYPING = 'input, textarea, select, [contenteditable]';
const JUMP_SETTLE_MS = 700;
// Smooth scrolling takes a moment, so a quick second press continues from the last target
let lastJump = { index: 0, at: 0 };
function sections() {
    return Array.from(document.querySelectorAll('main > section'));
}
function currentIndex(list) {
    if (performance.now() - lastJump.at < JUMP_SETTLE_MS)
        return lastJump.index;
    const line = (document.querySelector('.site-header')?.getBoundingClientRect().bottom ?? 0) + 16;
    let index = 0;
    list.forEach((section, i) => {
        if (section.getBoundingClientRect().top <= line)
            index = i;
    });
    return index;
}
function jumpTo(list, index) {
    const section = list[index];
    if (!section)
        return;
    lastJump = { index, at: performance.now() };
    // Focus follows the jump, so the next Tab continues from this section
    const heading = section.querySelector('h1, h2') ?? section;
    heading.tabIndex = -1;
    section.scrollIntoView();
    heading.focus({ preventScroll: true });
}
function jumpToNavItem(position) {
    const link = document.querySelectorAll('.main-nav a[href^="#"]')[position];
    const target = link && document.querySelector(link.getAttribute('href'));
    if (!target)
        return false;
    const list = sections();
    jumpTo(list, list.indexOf(target));
    return true;
}
function runShortcut(code) {
    const digit = /^(?:Digit|Numpad)([1-9])$/.exec(code);
    if (digit)
        return jumpToNavItem(Number(digit[1]) - 1);
    const list = sections();
    switch (code) {
        case 'KeyN':
            jumpTo(list, Math.min(currentIndex(list) + 1, list.length - 1));
            return true;
        case 'KeyP':
            jumpTo(list, Math.max(currentIndex(list) - 1, 0));
            return true;
        case 'KeyT':
            document.getElementById('to-top')?.click();
            return true;
        case 'KeyF':
            document.getElementById('form-cta')?.click();
            return true;
        case 'KeyR':
            toggleReading();
            return true;
        default:
            return false;
    }
}
export function initKeys() {
    document.addEventListener('keydown', (e) => {
        const panelOpen = document.querySelector('dialog[open]') !== null;
        if (e.key === 'Escape' && !panelOpen) {
            stopReading();
            return;
        }
        if (!document.documentElement.hasAttribute('data-a11y-keys') || panelOpen)
            return;
        if (e.ctrlKey || e.metaKey || e.altKey || e.shiftKey || e.repeat)
            return;
        if (e.target.closest(TYPING))
            return;
        if (runShortcut(e.code))
            e.preventDefault();
    });
}
