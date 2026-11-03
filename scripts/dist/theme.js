const STORAGE_KEY = 'theme';
function currentTheme() {
    const set = document.documentElement.dataset.theme;
    if (set === 'light' || set === 'dark')
        return set;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}
export function initTheme() {
    const button = document.getElementById('theme-toggle');
    if (!button)
        return;
    button.addEventListener('click', () => {
        const next = currentTheme() === 'dark' ? 'light' : 'dark';
        document.documentElement.dataset.theme = next;
        try {
            localStorage.setItem(STORAGE_KEY, next);
        }
        catch {
            // Storage blocked (private mode) - the toggle still works for this visit
        }
    });
}
