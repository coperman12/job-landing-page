// Fade elements in as they scroll into view. data-delay="ms" staggers siblings
export function initReveal(): void {
  const items = document.querySelectorAll<HTMLElement>('.reveal');

  if (!('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const el = entry.target as HTMLElement;
        const delay = Number(el.dataset.delay ?? 0);
        el.style.transitionDelay = `${delay}ms`;
        el.classList.add('visible');
        obs.unobserve(el);
      }
    },
    { threshold: 0.12 }
  );

  items.forEach((el) => observer.observe(el));
}
