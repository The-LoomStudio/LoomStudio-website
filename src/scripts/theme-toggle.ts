export function setupThemeToggle(button: HTMLButtonElement | null) {
  if (!button) return;
  const root = document.documentElement;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let desiredTheme = root.dataset.theme === 'dark' ? 'dark' : 'light';
  let active: ViewTransition | undefined;
  let generation = 0;

  const syncButton = () => {
    const dark = root.dataset.theme === 'dark';
    const label = dark ? '切换至浅色模式' : '切换至暗色模式';
    button.setAttribute('aria-pressed', String(dark));
    button.setAttribute('aria-label', label);
    button.title = label;
  };
  const applyTheme = () => {
    // A skipped transition still runs its update callback. Always apply the latest choice.
    root.dataset.theme = desiredTheme;
    root.style.colorScheme = desiredTheme;
    document.querySelector('[data-theme-color]')?.setAttribute('content', desiredTheme === 'dark' ? '#252b31' : '#82919b');
    try { localStorage.setItem('loom-site-theme', desiredTheme); } catch { /* Optional in private browsing. */ }
    syncButton();
  };
  button.addEventListener('click', () => {
    desiredTheme = desiredTheme === 'dark' ? 'light' : 'dark';
    const current = ++generation;
    active?.skipTransition();
    if (!document.startViewTransition || reducedMotion.matches || document.hidden) {
      active = undefined;
      delete root.dataset.themeTransition;
      applyTheme();
      return;
    }
    const rect = button.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    root.dataset.themeTransition = '';
    const transition = document.startViewTransition(applyTheme);
    active = transition;
    let reveal: Animation | undefined;
    void transition.ready.then(() => {
      if (current !== generation) return;
      reveal = root.animate({ clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] }, {
        duration: 520, easing: 'cubic-bezier(.2, .8, .2, 1)', fill: 'both',
        pseudoElement: '::view-transition-new(root)',
      });
    }, () => { /* Skipped or unavailable snapshots still apply the theme. */ });
    void transition.finished.finally(() => {
      reveal?.cancel();
      if (current !== generation) return;
      delete root.dataset.themeTransition;
      active = undefined;
    });
  });
  syncButton();
}
