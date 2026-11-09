// Entry point - wires up every page behaviour once the DOM is ready
import { initI18n } from './i18n.js';
import { initTheme } from './theme.js';
import { initHeader } from './header.js';
import { initReveal } from './reveal.js';
import { initCounters } from './counters.js';
import { initTyped } from './typed.js';
import { initContactForm } from './contact-form.js';
import { initFloatActions } from './float-actions.js';
import { initA11y } from './a11y.js';

function init(): void {
  initI18n();
  initTheme();
  initHeader();
  initReveal();
  initCounters();
  initTyped();
  initContactForm();
  initFloatActions();
  initA11y();

  const year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
