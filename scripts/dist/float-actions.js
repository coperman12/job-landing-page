// Floating buttons: a shortcut to the form while it is off screen, and back to top once the page has scrolled
const SCROLLED_PX = 8;
function initFormCta() {
    const cta = document.getElementById('form-cta');
    const form = document.getElementById('contact-form');
    if (!cta || !form)
        return;
    // Scrolled by hand: a normal #link jump would clear the focus from the first field right after it is set
    cta.addEventListener('click', (e) => {
        e.preventDefault();
        form.scrollIntoView();
        form.querySelector('input, textarea')?.focus({ preventScroll: true });
    });
    if (!('IntersectionObserver' in window))
        return;
    new IntersectionObserver((entries) => {
        const entry = entries[entries.length - 1];
        cta.classList.toggle('is-hidden', entry.isIntersecting);
    }).observe(form);
}
function initToTop() {
    const button = document.getElementById('to-top');
    if (!button)
        return;
    const onScroll = () => {
        button.classList.toggle('is-visible', window.scrollY > SCROLLED_PX);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    button.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0 });
        // The button disappears at the top, so keyboard focus moves to the first header link
        document.querySelector('.brand')?.focus({ preventScroll: true });
    });
}
export function initFloatActions() {
    initFormCta();
    initToTop();
}
