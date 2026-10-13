import type { SiteLocale } from './i18n';
import { getLocalizedPath } from './i18n';

export interface RouteItem {
  id: string;
  href: string;
  label: string;
  short: string;
  caption: string;
  image: string;
  detail: string;
}

interface RouteTemplate {
  id: string;
  baseHref: string;
  image: string;
  detail: string;
  i18n: Record<SiteLocale, { label: string; short: string; caption: string }>;
}

const rawRoutes: RouteTemplate[] = [
  {
    id: 'home',
    baseHref: '/',
    image: 'banners/nom-banner-015.png',
    detail: 'illustrations/nom-illustration-004.png',
    i18n: {
      'zh-CN': { label: '发布', short: '首页', caption: '编织世界，交织故事。从一位角色开始，留下属于你的世界线。' },
      'en': { label: 'Release', short: 'Home', caption: 'Weave worlds, interweave stories. Start from a single character, leaving your own timeline behind.' },
      'ja': { label: 'リリース', short: 'ホーム', caption: '世界を紡ぎ、物語を交差させる。一人のキャラクターから、あなただけの世界線を。' },
      'ko': { label: '릴리스', short: '홈', caption: '세계를 엮고, 이야기를 교차하다. 한 명의 캐릭터에서 시작해 나만의 세계선을 남겨보세요.' },
    },
  },
  {
    id: 'showcase',
    baseHref: '/showcase',
    image: 'illustrations/nom-illustration-001.png',
    detail: 'banners/nom-banner-020.png',
    i18n: {
      'zh-CN': { label: '作品展厅', short: '展厅', caption: '一封来信，一座陌生的城。每一次选择，都有新的故事。' },
      'en': { label: 'Showcase', short: 'Showcase', caption: 'A letter from afar, an unfamiliar town. With every choice comes a new chapter.' },
      'ja': { label: '作品ギャラリー', short: 'ギャラリー', caption: '一通の手紙、見知らぬ街。選ぶたびに、新しい物語が始まる。' },
      'ko': { label: '작품 갤러리', short: '갤러리', caption: '한 통의 편지, 낯선 도시. 매 선택마다 새로운 이야기가 펼쳐집니다.' },
    },
  },
  {
    id: 'marketplace',
    baseHref: '/marketplace',
    image: 'banners/nom-banner-017.png',
    detail: 'banners/nom-banner-007.png',
    i18n: {
      'zh-CN': { label: '生态市场', short: '市场', caption: '角色、设定与创作的工具。为你的世界，寻找新的灵感。' },
      'en': { label: 'Marketplace', short: 'Market', caption: 'Characters, lore, and creation tools. Discover fresh inspiration for your world.' },
      'ja': { label: 'マーケット', short: '市場', caption: 'キャラクター、設定、創作のツール。あなたの世界に新しいひらめきを。' },
      'ko': { label: '마켓플레이스', short: '마켓', caption: '캐릭터, 설정 및 창작 도구. 당신의 세계를 위한 새로운 영감을 찾아보세요.' },
    },
  },
  {
    id: 'download',
    baseHref: '/download',
    image: 'banners/nom-banner-009.png',
    detail: 'banners/nom-banner-016.png',
    i18n: {
      'zh-CN': { label: '客户端下载', short: '下载', caption: '把故事带回自己的工作台。下一段旅程，从这里开始。' },
      'en': { label: 'Download', short: 'Download', caption: 'Bring the stories to your own workstation. Your next journey begins right here.' },
      'ja': { label: 'クライアントダウンロード', short: 'ダウンロード', caption: '物語を手元のスタジオへ持ち帰る。次の旅はここから始まります。' },
      'ko': { label: '클라이언트 다운로드', short: '다운로드', caption: '이야기를 당신만의 작업대로 가져오세요. 다음 여정은 여기서 시작됩니다.' },
    },
  },
  {
    id: 'docs',
    baseHref: '/docs',
    image: 'illustrations/nom-illustration-007.png',
    detail: 'banners/nom-banner-014.png',
    i18n: {
      'zh-CN': { label: '公开文档', short: '文档', caption: '翻开工作台的使用手册。从第一步，到故事的深处。' },
      'en': { label: 'Documentation', short: 'Docs', caption: 'Open the workbench guide. From your first steps into the depths of your story.' },
      'ja': { label: '公式ドキュメント', short: 'ドキュメント', caption: 'スタジオのマニュアルを開く。最初の一歩から、物語の深淵へ。' },
      'ko': { label: '공식 문서', short: '문서', caption: '작업대 사용 설명서를 펼쳐보세요. 첫걸음부터 이야기의 깊은 곳까지.' },
    },
  },
  {
    id: 'architecture',
    baseHref: '/docs/architecture',
    image: 'banners/nom-banner-003.png',
    detail: 'banners/nom-banner-012.png',
    i18n: {
      'zh-CN': { label: '架构地图', short: '架构', caption: '正文、推演与上下文。沿着一条线，走进工作台的幕后。' },
      'en': { label: 'Architecture Map', short: 'Architecture', caption: 'Narratives, deductions, and context. Trace the lines and step behind the scenes.' },
      'ja': { label: 'アーキテクチャマップ', short: '設計図', caption: '本文、推論、コンテキスト。一本の線をたどり、スタジオの舞台裏へ。' },
      'ko': { label: '아키텍처 맵', short: '아키텍처', caption: '본문, 추론 및 컨텍스트. 선을 따라 작업대의 무대 뒤로 걸어가 보세요.' },
    },
  },
  {
    id: 'news',
    baseHref: '/news',
    image: 'banners/nom-banner-018.png',
    detail: 'banners/nom-banner-021.png',
    i18n: {
      'zh-CN': { label: '工作室手记', short: 'News', caption: '新消息、小修补，还有创作途中的一点灵感。来公告板前，看看最近的故事。' },
      'en': { label: 'Studio Notes', short: 'News', caption: 'Updates, refinements, and creative sparks. Check the board for the latest stories.' },
      'ja': { label: 'スタジオノート', short: 'News', caption: '最新情報、小さな修正、創作の合間のひらめき。掲示板で最近の出来事を覗いてみましょう。' },
      'ko': { label: '스튜디오 노트', short: 'News', caption: '새 소식, 소소한 개선, 그리고 창작 여정의 영감. 게시판에서 최근 이야기를 확인하세요.' },
    },
  },
];

export function getRoutes(locale: SiteLocale): RouteItem[] {
  return rawRoutes.map((item) => {
    const text = item.i18n[locale] ?? item.i18n['zh-CN'];
    return {
      id: item.id,
      href: getLocalizedPath(item.baseHref, locale),
      label: text.label,
      short: text.short,
      caption: text.caption,
      image: item.image,
      detail: item.detail,
    };
  });
}

// Backward-compatible default export
export const routes = getRoutes('zh-CN');
