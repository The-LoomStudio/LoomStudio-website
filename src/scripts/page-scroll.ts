// Match the menu's 200ms exponential follow without replacing native touch scrolling.
if (document.body.hasAttribute('data-buffered-scroll')) {
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let frame = 0;
  let lastTime = 0;
  let position = window.scrollY;
  let target = position;

  const stop = () => {
    cancelAnimationFrame(frame);
    frame = 0;
    position = target = window.scrollY;
  };
  const render = (time: number) => {
    frame = 0;
    if (document.hidden || reducedMotion.matches || document.documentElement.hasAttribute('data-menu-open')) {
      stop();
      return;
    }
    const elapsed = Math.min(time - lastTime, 64);
    lastTime = time;
    target = Math.min(Math.max(0, document.documentElement.scrollHeight - innerHeight), target);
    position += (target - position) * (1 - Math.exp(-elapsed / 200));
    const settled = Math.abs(target - position) < 0.5;
    if (settled) position = target;
    window.scrollTo({ top: position, behavior: 'instant' });
    if (!settled) frame = requestAnimationFrame(render);
  };
  const usesNativeScroll = (element: Element | null, delta: number) => {
    for (let node = element; node && node !== document.body; node = node.parentElement) {
      if (node.matches('dialog, input, textarea, select, [contenteditable="true"]')) return true;
      const overflow = getComputedStyle(node).overflowY;
      if ((overflow === 'auto' || overflow === 'scroll') && node.scrollHeight > node.clientHeight
        && (delta < 0 ? node.scrollTop > 0 : node.scrollTop + node.clientHeight < node.scrollHeight)) return true;
    }
    return false;
  };
  window.addEventListener('wheel', event => {
    if (event.defaultPrevented || !event.cancelable || event.ctrlKey || event.metaKey || event.shiftKey
      || reducedMotion.matches || document.documentElement.hasAttribute('data-menu-open')
      || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
    const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? innerHeight : 1;
    const delta = event.deltaY * unit;
    if (!delta || usesNativeScroll(event.target instanceof Element ? event.target : null, delta)) return;
    if (!frame) position = target = window.scrollY;
    target = Math.max(0, Math.min(document.documentElement.scrollHeight - innerHeight, target + delta));
    event.preventDefault();
    if (!frame && target !== position) {
      lastTime = performance.now();
      frame = requestAnimationFrame(render);
    }
  }, { passive: false });
  // Direct manipulation, navigation and browser restoration take precedence over a pending target.
  window.addEventListener('pointerdown', stop, { passive: true });
  window.addEventListener('keydown', event => {
    if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '].includes(event.key)) stop();
  });
  window.addEventListener('scroll', () => {
    if (frame && Math.abs(window.scrollY - position) > 2) stop();
  }, { passive: true });
  window.addEventListener('pagehide', stop);
  window.addEventListener('popstate', stop);
  window.addEventListener('hashchange', stop);
  document.addEventListener('visibilitychange', stop);
  reducedMotion.addEventListener('change', stop);
}
