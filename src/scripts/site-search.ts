import { routes } from '../lib/site-routes';

type SearchData = { url: string; meta: { title?: string }; excerpt: string; sub_results?: { url: string; title: string; excerpt: string }[] };
type SearchResult = { data(): Promise<SearchData> };
type SearchApi = { search(query: string | null, options: { filters?: { section: string } }): Promise<{ results: SearchResult[] }> };
const scopes: Record<string, string> = { all: '全部', pages: '页面', docs: '文档', architecture: '架构', news: '新闻' };
const dialog = document.querySelector<HTMLDialogElement>('#site-search')!;
const input = dialog.querySelector<HTMLInputElement>('[data-search-input]')!;
const list = dialog.querySelector<HTMLUListElement>('[data-search-results]')!;
const status = dialog.querySelector<HTMLElement>('[data-search-status]')!;
const more = dialog.querySelector<HTMLButtonElement>('[data-search-more]')!;
const retry = dialog.querySelector<HTMLButtonElement>('[data-search-retry]')!;
let scope = 'all';
let generation = 0;
let matches: SearchResult[] = [];
let count = 0;
let selected = -1;
let api: Promise<SearchApi> | undefined;
let debounce: ReturnType<typeof setTimeout>;
let opener: HTMLElement | null;

function save() {
  try { sessionStorage.setItem('loom-site-search', JSON.stringify({ query: input.value, scope })); } catch { /* Storage is optional in private browsing. */ }
}
function highlight(element: HTMLElement, text: string) {
  const terms = input.value.trim().split(/\s+/u).filter(Boolean).sort((a, b) => b.length - a.length);
  if (!terms.length) { element.textContent = text; return; }
  const pattern = new RegExp(`(${terms.map(term => term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'giu');
  element.replaceChildren(...text.split(pattern).map((part, index) => {
    if (!(index % 2)) return document.createTextNode(part);
    const mark = document.createElement('mark'); mark.textContent = part; return mark;
  }));
}
function plainExcerpt(html: string) {
  // Pagefind returns escaped content with <mark> tags; parse inertly, then render only text.
  return new DOMParser().parseFromString(html, 'text/html').body.textContent ?? '';
}
function append(title: string, href: string, excerpt: string) {
  const url = new URL(href, location.origin);
  if (url.origin !== location.origin || !['http:', 'https:'].includes(url.protocol)) return;
  const li = document.createElement('li'); const link = document.createElement('a');
  link.href = url.pathname + url.search + url.hash;
  const heading = document.createElement('strong'); highlight(heading, title);
  const detail = document.createElement('span'); highlight(detail, excerpt);
  link.append(heading, detail); li.append(link); list.append(li);
}
function select(index: number, focus = false) {
  const links = [...list.querySelectorAll('a')];
  selected = links.length ? (index + links.length) % links.length : -1;
  links.forEach((link, i) => { link.dataset.selected = String(i === selected); });
  if (selected >= 0) { links[selected].scrollIntoView({ block: 'nearest' }); if (focus) links[selected].focus(); }
}
async function loadMore(token: number) {
  more.disabled = true;
  const start = count;
  const data = await Promise.all(matches.slice(start, start + 12).map(result => result.data()));
  if (token !== generation || !dialog.open) return;
  for (const item of data) {
    const sections = input.value.trim() && item.sub_results?.length ? item.sub_results : [];
    if (sections.length) for (const section of sections.slice(0, 3)) append(section.title || item.meta.title || '未命名页面', section.url, plainExcerpt(section.excerpt));
    else append(item.meta.title || '未命名页面', item.url, plainExcerpt(item.excerpt));
  }
  count += data.length;
  more.hidden = count >= matches.length; more.disabled = false;
  status.textContent = matches.length ? `${scopes[scope]} · ${matches.length} 项匹配` : '没有匹配内容，试试其他关键词或范围。';
  if (start === 0) select(0);
}
function failed(error: unknown, token: number) {
  if (token !== generation || !dialog.open) return;
  status.textContent = import.meta.env.DEV ? '搜索索引不可用，请先运行 pnpm build，再重试。' : '搜索暂时无法加载，请重试。';
  more.hidden = true; retry.hidden = false;
  console.error('Website search failed', error);
}
async function search() {
  clearTimeout(debounce);
  const token = ++generation;
  save(); selected = -1; list.replaceChildren(); more.hidden = true; retry.hidden = true; count = 0;
  dialog.querySelectorAll<HTMLElement>('[data-search-scope]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.searchScope === scope)));
  const query = input.value.trim();
  if (!query && scope === 'all') {
    status.textContent = '常用页面 · 选择范围可直接浏览';
    for (const route of routes) append(route.label, route.href, route.caption);
    select(0); return;
  }
  status.textContent = '正在搜索…';
  try {
    if (!api) { const path = '/pagefind/pagefind.js'; api = import(/* @vite-ignore */ path); }
    const engine = await api;
    const result = await engine.search(query || null, { filters: scope === 'all' ? undefined : { section: scope } });
    if (token !== generation || !dialog.open) return;
    matches = result.results;
    await loadMore(token);
  } catch (error) { failed(error, token); }
}
function open() {
  if (dialog.open || document.querySelector('dialog[open]')) return;
  opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  try {
    const saved = JSON.parse(sessionStorage.getItem('loom-site-search') ?? 'null');
    if (saved && typeof saved.query === 'string' && Object.hasOwn(scopes, saved.scope)) { input.value = saved.query.slice(0, 256); scope = saved.scope; }
  } catch { /* Invalid or unavailable session storage does not prevent searching. */ }
  dialog.showModal(); input.focus(); void search();
}
document.querySelector('[data-site-search-open]')!.addEventListener('click', open);
dialog.querySelector('[data-search-close]')!.addEventListener('click', () => dialog.close());
dialog.addEventListener('close', () => { generation++; clearTimeout(debounce); opener?.focus(); });
dialog.addEventListener('click', event => {
  if (event.target !== dialog) return;
  const rect = dialog.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
});
list.addEventListener('click', event => { if ((event.target as Element).closest('a')) dialog.close(); });
document.addEventListener('keydown', event => {
  if (event.code !== 'KeyK' || !(event.ctrlKey || event.metaKey) || event.altKey || event.shiftKey || event.isComposing) return;
  if (document.querySelector('dialog[open]') && !dialog.open) return;
  event.preventDefault(); if (dialog.open) dialog.close(); else open();
});
dialog.addEventListener('keydown', event => {
  if (event.isComposing || event.keyCode === 229) return;
  if (event.target !== input && !(event.target as Element).closest('[data-search-results]')) return;
  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    event.preventDefault(); select(selected + (event.key === 'ArrowDown' ? 1 : -1), true);
  } else if (event.key === 'Enter' && event.target === input && selected >= 0) {
    event.preventDefault(); list.querySelectorAll('a')[selected]?.click();
  }
});
input.addEventListener('input', () => {
  const prefix = /^in:([^\s]+)\s*/i.exec(input.value);
  if (prefix) {
    const entry = Object.entries(scopes).find(([key, label]) => key === prefix[1].toLowerCase() || label === prefix[1]);
    if (entry) { scope = entry[0]; input.value = input.value.slice(prefix[0].length); }
  }
  generation++; clearTimeout(debounce);
  // Do not leave stale, clickable results while a different query is pending.
  list.replaceChildren(); selected = -1; more.hidden = true; status.textContent = '正在搜索…';
  debounce = setTimeout(() => { void search(); }, 150);
});
dialog.querySelectorAll<HTMLElement>('[data-search-scope]').forEach(button => button.addEventListener('click', () => {
  scope = button.dataset.searchScope!; void search(); input.focus();
}));
more.addEventListener('click', () => { const token = generation; void loadMore(token).catch(error => failed(error, token)); });
retry.addEventListener('click', () => { api = undefined; void search(); });
