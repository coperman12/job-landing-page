// Sticky header shadow, mobile menu, and highlighting the section in view
export function initHeader(): void {
  const header = document.querySelector<HTMLElement>('.site-header');
  const nav = document.getElementById('main-nav');
  const toggle = document.getElementById('menu-toggle');

  if (header) {
    const onScroll = (): void => {
      header.classList.toggle('scrolled', window.scrollY > 8);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  if (nav && toggle) {
    const setOpen = (open: boolean): void => {
      nav.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', String(open));
    };
    toggle.addEventListener('click', () => setOpen(!nav.classList.contains('open')));
    nav.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setOpen(false)));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') setOpen(false);
    });
  }

  highlightActiveSection();
}

function highlightActiveSection(): void {
  const links = Array.from(document.querySelectorAll<HTMLAnchorElement>('.main-nav a[href^="#"]'));
  const byId = new Map(links.map((a) => [a.getAttribute('href')!.slice(1), a]));
  const sections = Array.from(byId.keys())
    .map((id) => document.getElementById(id))
    .filter((el): el is HTMLElement => el !== null);

  if (!('IntersectionObserver' in window) || sections.length === 0) return;

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        links.forEach((a) => a.classList.remove('active'));
        byId.get(entry.target.id)?.classList.add('active');
      }
    },
    { rootMargin: '-45% 0px -50% 0px' }
  );
  sections.forEach((s) => observer.observe(s));
}
