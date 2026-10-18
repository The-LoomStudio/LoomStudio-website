import { animate, type AnimationPlaybackControls } from 'motion';

const root = document.querySelector<HTMLElement>('.news')!;
const board = root.querySelector<HTMLElement>('.news-board')!;
const filters = root.querySelector<HTMLFieldSetElement>('.news-filters')!;
const cards = Array.from(board.querySelectorAll<HTMLElement>('[data-news-card]'));
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const animations = new Map<HTMLElement, AnimationPlaybackControls>();
const highlight = document.createElement('span');
highlight.className = 'news-filter-highlight';
highlight.setAttribute('aria-hidden', 'true');
filters.prepend(highlight);
const empty = document.createElement('p');
empty.className = 'news-filter-status';
empty.setAttribute('role', 'status');
empty.textContent = document.documentElement.lang.startsWith('en') ? 'No notes in this category yet.'
  : document.documentElement.lang.startsWith('ja') ? 'このカテゴリにはまだ記事がありません。'
  : document.documentElement.lang.startsWith('ko') ? '이 분류에는 아직 소식이 없습니다.' : '这个分类暂时还没有手记。';
board.after(empty);
root.dataset.motionFilters = '';

function filter(animateChanges: boolean) {
  const choice = filters.querySelector<HTMLInputElement>('input:checked')!;
  const before = new Map(cards.filter(card => !card.hidden).map(card => [card, card.getBoundingClientRect()]));
  const opacities = new Map(cards.map(card => [card, Number(getComputedStyle(card).opacity)]));
  animations.forEach(animation => animation.stop());
  animations.clear();
  for (const card of cards) {
    card.style.cssText = '';
    const visible = choice.value === 'all' || card.dataset.category === choice.value;
    card.hidden = !visible;
    card.inert = !visible;
    card.setAttribute('aria-hidden', String(!visible));
  }
  empty.hidden = cards.some(card => !card.hidden);
  const label = choice.nextElementSibling!.getBoundingClientRect();
  const controls = filters.getBoundingClientRect();
  const target = { left: label.left - controls.left, top: label.top - controls.top, width: label.width, height: label.height };
  if (!animateChanges || reducedMotion.matches) {
    Object.assign(highlight.style, Object.fromEntries(Object.entries(target).map(([key, value]) => [key, `${value}px`])));
    return;
  }
  animations.set(highlight, animate(highlight, target, { type: 'spring', stiffness: 380, damping: 34 }));

  const after = new Map(cards.filter(card => !card.hidden).map(card => [card, card.getBoundingClientRect()]));
  const origin = board.getBoundingClientRect();
  for (const card of cards) {
    const first = before.get(card);
    const last = after.get(card);
    if (last) {
      animations.set(card, animate(card, {
        x: [first ? first.left - last.left : 0, 0],
        y: [first ? first.top - last.top : 10, 0],
        opacity: [first ? opacities.get(card)! : 0, 1],
      }, { duration: 0.36, ease: [0.2, 0.8, 0.2, 1] }));
    } else if (first) {
      // Keep outgoing paper cards visible without reserving a grid slot.
      card.hidden = false;
      Object.assign(card.style, {
        position: 'absolute', left: `${first.left - origin.left}px`, top: `${first.top - origin.top}px`, width: `${first.width}px`,
      });
      animations.set(card, animate(card, { opacity: [opacities.get(card)!, 0], y: [0, -8] }, {
        duration: 0.18, ease: 'easeOut', onComplete: () => { card.hidden = true; card.style.cssText = ''; },
      }));
    }
  }
}
filter(false);
filters.addEventListener('change', () => filter(true));
window.addEventListener('resize', () => filter(false));
window.addEventListener('pagehide', () => filter(false));
