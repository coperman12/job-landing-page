// Count numbers up from 0 when the stats row becomes visible
const DURATION_MS = 1400;

function prefersReducedMotion(): boolean {
  if (document.documentElement.hasAttribute('data-a11y-motion')) return true;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function animate(el: HTMLElement): void {
  const target = Number(el.dataset.count ?? 0);
  if (prefersReducedMotion()) {
    el.textContent = String(target);
    return;
  }

  const start = performance.now();
  const step = (now: number): void => {
    const progress = Math.min((now - start) / DURATION_MS, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
    el.textContent = String(Math.round(target * eased));
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

export function initCounters(): void {
  const counters = document.querySelectorAll<HTMLElement>('[data-count]');

  if (!('IntersectionObserver' in window)) {
    counters.forEach((el) => (el.textContent = el.dataset.count ?? ''));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        animate(entry.target as HTMLElement);
        obs.unobserve(entry.target);
      }
    },
    { threshold: 0.6 }
  );
  counters.forEach((el) => observer.observe(el));
}
