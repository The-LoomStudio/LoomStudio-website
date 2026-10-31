export type SiteLocale = 'zh-CN' | 'en' | 'ja' | 'ko';

export const defaultLocale: SiteLocale = 'zh-CN';
export const supportedLocales: SiteLocale[] = ['zh-CN', 'en', 'ja', 'ko'];

export const localeLabels: Record<SiteLocale, string> = {
  'zh-CN': '中文',
  'en': 'English',
  'ja': '日本語',
  'ko': '한국어',
};

export const localeHtmlLang: Record<SiteLocale, string> = {
  'zh-CN': 'zh-CN',
  'en': 'en',
  'ja': 'ja',
  'ko': 'ko',
};

export function getLocaleFromPath(pathname: string): SiteLocale {
  const normalized = pathname.replace(/\/+$/, '') || '/';
  const segment = normalized.split('/')[1];
  if (segment === 'en' || segment === 'ja' || segment === 'ko') {
    return segment;
  }
  return 'zh-CN';
}

export function stripLocalePrefix(pathname: string): string {
  const normalized = pathname.replace(/\/+$/, '') || '/';
  const match = normalized.match(/^\/(en|ja|ko)(\/.*)?$/);
  if (match) {
    return match[2] || '/';
  }
  return normalized;
}

export function getLocalizedPath(pathname: string, targetLocale: SiteLocale): string {
  const unlocalized = stripLocalePrefix(pathname);
  if (targetLocale === defaultLocale) {
    return unlocalized;
  }
  return unlocalized === '/' ? `/${targetLocale}` : `/${targetLocale}${unlocalized}`;
}

export const uiMessages = {
  'zh-CN': {
    'nav.menuTitle': '页面导航',
    'nav.menuEntries': '页面入口',
    'nav.menuOpen': '打开页面导航',
    'nav.menuClose': '关闭页面导航',
    'nav.quick': '快捷导航',
    'nav.themeDark': '切换至暗色模式',
    'nav.themeLight': '切换至浅色模式',
    'nav.language': '切换语言',
    'nav.indexEdition': '世界与故事 / INDEX',
    'nav.indexScroll': '页面索引',
    'nav.previous': '上一项',
    'nav.next': '下一项',
    'footer.slogan': '为深度长篇 AI 互动叙事而生。',
    'footer.showcase': '作品展厅',
    'footer.marketplace': '生态市场',
    'footer.docs': '文档',
    'footer.download': '下载',
    'footer.news': 'News',
    'footer.source': '源码',
    'footer.easterEgg': '触发樱花彩蛋',
    'portal.suffix': '· Loom Studio 门户',
    'portal.homeSuffix': '· 官方发布与文档门户',
  },
  'en': {
    'nav.menuTitle': 'Page Navigation',
    'nav.menuEntries': 'Page entries',
    'nav.menuOpen': 'Open navigation menu',
    'nav.menuClose': 'Close navigation menu',
    'nav.quick': 'Quick navigation',
    'nav.themeDark': 'Switch to dark theme',
    'nav.themeLight': 'Switch to light theme',
    'nav.language': 'Change language',
    'nav.indexEdition': 'Worlds & Stories / INDEX',
    'nav.indexScroll': 'Page index',
    'nav.previous': 'Previous item',
    'nav.next': 'Next item',
    'footer.slogan': 'Built for deep, long-form AI interactive storytelling.',
    'footer.showcase': 'Showcase',
    'footer.marketplace': 'Marketplace',
    'footer.docs': 'Docs',
    'footer.download': 'Download',
    'footer.news': 'News',
    'footer.source': 'Source',
    'footer.easterEgg': 'Trigger sakura surprise',
    'portal.suffix': '· Loom Studio Portal',
    'portal.homeSuffix': '· Official Release & Documentation Portal',
  },
  'ja': {
    'nav.menuTitle': 'ページナビゲーション',
    'nav.menuEntries': 'ページ一覧',
    'nav.menuOpen': 'ナビゲーションメニューを開く',
    'nav.menuClose': 'ナビゲーションメニューを閉じる',
    'nav.quick': 'クイックナビゲーション',
    'nav.themeDark': 'ダークモードに切り替え',
    'nav.themeLight': 'ライトモードに切り替え',
    'nav.language': '言語を切り替え',
    'nav.indexEdition': '世界と物語 / INDEX',
    'nav.indexScroll': 'ページインデックス',
    'nav.previous': '前の項目',
    'nav.next': '次の項目',
    'footer.slogan': '深層で長大な AI インタラクティブノベルのために。',
    'footer.showcase': '作品ギャラリー',
    'footer.marketplace': 'マーケット',
    'footer.docs': 'ドキュメント',
    'footer.download': 'ダウンロード',
    'footer.news': 'News',
    'footer.source': 'ソースコード',
    'footer.easterEgg': '桜のエフェクトを起動',
    'portal.suffix': '· Loom Studio ポータル',
    'portal.homeSuffix': '· 公式リリースとドキュメントポータル',
  },
  'ko': {
    'nav.menuTitle': '페이지 내비게이션',
    'nav.menuEntries': '페이지 목록',
    'nav.menuOpen': '내비게이션 메뉴 열기',
    'nav.menuClose': '내비게이션 메뉴 닫기',
    'nav.quick': '빠른 내비게이션',
    'nav.themeDark': '다크 모드로 전환',
    'nav.themeLight': '라이트 모드로 전환',
    'nav.language': '언어 변경',
    'nav.indexEdition': '세계와 이야기 / INDEX',
    'nav.indexScroll': '페이지 색인',
    'nav.previous': '이전 항목',
    'nav.next': '다음 항목',
    'footer.slogan': '깊이 있는 장편 AI 인터랙티브 서사를 위해.',
    'footer.showcase': '작품 갤러리',
    'footer.marketplace': '마켓플레이스',
    'footer.docs': '문서',
    'footer.download': '다운로드',
    'footer.news': 'News',
    'footer.source': '소스 코드',
    'footer.easterEgg': '벚꽃 효과 실행',
    'portal.suffix': '· Loom Studio 포털',
    'portal.homeSuffix': '· 공식 릴리스 및 문서 포털',
  },
} as const;

export function t(locale: SiteLocale, key: keyof typeof uiMessages['zh-CN']): string {
  return uiMessages[locale]?.[key] ?? uiMessages[defaultLocale][key];
}

export function getHomeFeatures(locale: SiteLocale) {
  const data = {
    'zh-CN': [
      {
        index: '01',
        title: '翻开正文，接着上回读',
        sticker: '/images/nom/stickers/fullbody/reading.png',
        paragraphs: ['剧情正文和 Agent 的工作记录分开呈现，阅读时只看故事，需要时再展开工作过程。', '故事读到一半，不会突然夹进一长串工具调用。'],
      },
      {
        index: '02',
        title: 'Agent 忙了些什么',
        sticker: '/images/nom/stickers/fullbody/working.png',
        paragraphs: ['故事输入与讨论沿用同一会话历史，工作过程可按需展开；辅助 Agent 会话也可独立使用。', '运行记录、诊断与工具结果可按各自范围查看。'],
      },
      {
        index: '03',
        title: '这一轮，模型看到了什么',
        sticker: '/images/nom/stickers/bust/thinking.png',
        paragraphs: ['哪些来源进入上下文、提示词怎样排列，可按该轮已有的构建观察查看。', '模型漏了设定？可以从可用记录开始排查。'],
      },
    ],
    'en': [
      {
        index: '01',
        title: 'Open the story, pick up where you left off',
        sticker: '/images/nom/stickers/fullbody/reading.png',
        paragraphs: ['Story text and Agent work details have separate views over the same story history. Expand the work details when you want to.', 'Never have your reading broken by unexpected blocks of raw tool calls.'],
      },
      {
        index: '02',
        title: 'See what the Agent has been working on',
        sticker: '/images/nom/stickers/fullbody/working.png',
        paragraphs: ['Roleplay and discussion share the story session history, with work details available on demand; auxiliary Agent sessions can run separately.', 'Run records, diagnostics, and tool results can be inspected within their available scope.'],
      },
      {
        index: '03',
        title: 'Inspect what the model saw this turn',
        sticker: '/images/nom/stickers/bust/thinking.png',
        paragraphs: ['Inspect the build observations available for a turn to see source selection, ordering, and activation details.', 'Did the model miss a key detail? Start with the records available for that turn.'],
      },
    ],
    'ja': [
      {
        index: '01',
        title: '本文を開き、物語の続きへ',
        sticker: '/images/nom/stickers/fullbody/reading.png',
        paragraphs: ['ストーリー本文と Agent の作業記録を分離して表示。読むときは物語だけに没入し、必要な時だけ作業プロセスを展開できます。', '物語の途中で、突然長大なツール呼び出しログが挟まることはありません。'],
      },
      {
        index: '02',
        title: 'Agent が何をしていたのか確認する',
        sticker: '/images/nom/stickers/fullbody/working.png',
        paragraphs: ['ロールプレイと相談は物語の同じセッション履歴を使い、作業の詳細は必要に応じて展開できます。補助 Agent の会話は別に利用できます。', 'Run 記録、診断、ツール結果を、それぞれ確認できる範囲で辿れます。'],
      },
      {
        index: '03',
        title: 'このターン、モデルに何が見えていたのか',
        sticker: '/images/nom/stickers/bust/thinking.png',
        paragraphs: ['そのターンにあるビルド観察から、Source の選択、順序、Activation の詳細を確認できます。', 'モデルが設定を見落とした？利用できる記録から原因を探れます。'],
      },
    ],
    'ko': [
      {
        index: '01',
        title: '본문을 열고, 지난번에 이어 읽기',
        sticker: '/images/nom/stickers/fullbody/reading.png',
        paragraphs: ['스토리 본문과 Agent의 작업 기록을 분리하여 표시합니다. 읽을 때는 이야기에만 집중하고, 필요할 때만 작업 과정을 확인하세요.', '이야기 중간에 복잡한 도구 호출 기록이 불쑥 끼어들지 않습니다.'],
      },
      {
        index: '02',
        title: 'Agent가 어떤 작업을 수행했는지 확인',
        sticker: '/images/nom/stickers/fullbody/working.png',
        paragraphs: ['역할극과 논의는 이야기의 같은 세션 기록을 사용하며, 작업 과정은 필요할 때 펼쳐 볼 수 있습니다. 보조 Agent 세션은 별도로 사용할 수 있습니다.', '실행 기록, 진단, 도구 결과를 각각 확인 가능한 범위에서 살펴볼 수 있습니다.'],
      },
      {
        index: '03',
        title: '이번 턴에 모델이 무엇을 확인했는지',
        sticker: '/images/nom/stickers/bust/thinking.png',
        paragraphs: ['해당 턴에 남은 빌드 관찰에서 Source 선택, 정렬, 활성화 정보를 확인할 수 있습니다.', '모델이 설정을 놓쳤다면? 확인 가능한 기록부터 살펴보세요.'],
      },
    ],
  };
  return data[locale] ?? data['zh-CN'];
}

export function getHomeCopy(locale: SiteLocale) {
  const data = {
    'zh-CN': {
      sectionsLabel: 'SECTIONS',
      sections: [
        { href: '#prompt-builder', id: 'prompt-builder', label: '01 叙事' },
        { href: '#story-workspace', id: 'story-workspace', label: '02 系统' },
        { href: '#architecture', id: 'architecture', label: '03 架构' },
      ],
      scroll: '往下看看',
      brand: { copy: '编织世界，交织故事。', download: '下载与启动' },
      cardBanner: {
        eyebrow: 'A gallery of possibilities',
        title: '故事从谁开始？',
        nomMessage: '唔……都想认识一下。选谁好呢？',
      },
      manifesto: {
        eyebrow: 'A home for your stories',
        title: '正文归正文<br />幕后也有地方放',
        paragraphs: [
          '读故事时看正文，调整设定时打开工作区。',
          'Agent 的工作记录、工具结果和提示词构建也各有位置，需要时再展开。',
        ],
      },
      product: {
        eyebrow: 'Inside the studio',
        title: '故事写到哪儿<br />工作台就开在哪儿',
        paragraphs: [
          '角色、设定和对话放在同一个工作台里，不用来回翻找。',
          '下面是一段交互演示，可以读读故事，也可以展开工作区看看。',
        ],
        legend: [
          { index: '01', title: '故事时间线', desc: '阅读剧情，查看故事分支' },
          { index: '02', title: 'Agent 工作区', desc: '查看对话、工具调用与运行记录' },
          { index: '03', title: '提示词构建', desc: '检查本轮上下文用了哪些设定' },
        ],
      },
      architecture: {
        eyebrow: 'A little look backstage',
        title: '工作台里面<br />是怎么运转的',
        paragraphs: [
          '故事正文、Agent 会话和提示词构建由不同模块负责。',
          '架构地图把它们连起来，方便沿着一次操作查找对应的代码。',
        ],
        nomMessage: '啊，里面还有这么多……我先从认识的地方看起。',
        button: '开发者架构地图',
      },
      stickersBanner: {
        title: '故事之外<br />日常也有小小陪伴',
        paragraphs: [
          '认真、开心、困困，偶尔还会气鼓鼓。',
          '33 张透明贴纸，把 Nom 的小表情带进日常。',
        ],
        button: '去挑一张表情',
      },
    },
    'en': {
      sectionsLabel: 'SECTIONS',
      sections: [
        { href: '#prompt-builder', id: 'prompt-builder', label: '01 Story' },
        { href: '#story-workspace', id: 'story-workspace', label: '02 System' },
        { href: '#architecture', id: 'architecture', label: '03 Architecture' },
      ],
      scroll: 'Scroll down',
      brand: { copy: 'Weave worlds, interweave stories.', download: 'Download & Launch' },
      cardBanner: {
        eyebrow: 'A gallery of possibilities',
        title: 'Whose story starts here?',
        nomMessage: 'Hmm... I want to meet them all. Who should we pick?',
      },
      manifesto: {
        eyebrow: 'A home for your stories',
        title: 'Story in front,<br />the workshop behind',
        paragraphs: [
          'Read prose cleanly, open the workspace when adjusting lore.',
          'Agent runs, tool outputs, and prompt assemblies each have their place, expanding on demand.',
        ],
      },
      product: {
        eyebrow: 'Inside the studio',
        title: 'Where your story goes,<br />the workbench follows',
        paragraphs: [
          'Characters, lore, and dialogues together in one workbench—no endless tabs.',
          'Explore the interactive demo below to read the story or inspect the workspace.',
        ],
        legend: [
          { index: '01', title: 'Narrative Timeline', desc: 'Read prose and branch narratives' },
          { index: '02', title: 'Agent Workspace', desc: 'Inspect dialogues, tool calls & runs' },
          { index: '03', title: 'Prompt Assembly', desc: 'Check which lore entered this turn' },
        ],
      },
      architecture: {
        eyebrow: 'A little look backstage',
        title: 'How the studio<br />runs behind the scenes',
        paragraphs: [
          'Story text, Agent sessions, and prompt assemblies are handled by modular systems.',
          'The architecture map traces them together to make code discovery intuitive.',
        ],
        nomMessage: "Whoa, there's so much inside... I'll start with the parts I know.",
        button: 'Architecture Map',
      },
      stickersBanner: {
        title: 'Beyond stories<br />a little everyday company',
        paragraphs: [
          'Earnest, joyful, sleepy, or occasionally pouting.',
          '33 transparent Nom stickers for everyday chats.',
        ],
        button: 'Pick a sticker',
      },
    },
    'ja': {
      sectionsLabel: 'SECTIONS',
      sections: [
        { href: '#prompt-builder', id: 'prompt-builder', label: '01 叙事' },
        { href: '#story-workspace', id: 'story-workspace', label: '02 システム' },
        { href: '#architecture', id: 'architecture', label: '03 設計' },
      ],
      scroll: 'もっと見る',
      brand: { copy: '世界を紡ぎ、物語を交差させる。', download: 'ダウンロードと起動' },
      cardBanner: {
        eyebrow: 'A gallery of possibilities',
        title: '誰から物語を始めよう？',
        nomMessage: 'うーん……みんな気になるな。誰にしよう？',
      },
      manifesto: {
        eyebrow: 'A home for your stories',
        title: '本文は本文へ、<br />舞台裏もすっきりと',
        paragraphs: [
          '読むときは本文に没入し、設定変更時はワークスペースへ。',
          'Agent の作業履歴、ツール結果、プロンプト構築もそれぞれの場所に整理され、必要な時だけ展開できます。',
        ],
      },
      product: {
        eyebrow: 'Inside the studio',
        title: '物語が進む場所へ、<br />スタジオも共に開く',
        paragraphs: [
          'キャラクター、設定、対話をひとつのスタジオに統合。タブを行き来する必要はありません。',
          '以下のインタラクティブデモで、物語を読むかワークスペースを展開してみてください。',
        ],
        legend: [
          { index: '01', title: 'ストーリータイムライン', desc: '本文を読み、分岐を確認' },
          { index: '02', title: 'Agent ワークスペース', desc: '対話、ツール呼び出し、実行記録を確認' },
          { index: '03', title: 'プロンプト構築', desc: 'このターンに投入された設定を確認' },
        ],
      },
      architecture: {
        eyebrow: 'A little look backstage',
        title: 'スタジオの裏側は<br />どう動いているか',
        paragraphs: [
          '本文、Agent セッション、プロンプト構築は独立したモジュールが担当します。',
          'アーキテクチャマップがそれらを繋ぎ、コードの追跡を容易にします。',
        ],
        nomMessage: 'わあ、こんなにたくさんあるんだ……まずは知っているところから見てみよう。',
        button: 'アーキテクチャマップ',
      },
      stickersBanner: {
        title: '物語の外でも<br />お話し相手になりたいな',
        paragraphs: [
          '真面目、嬉しい、眠い、ときどきぷんぷん。',
          '透過スタンプ 33 枚。Nom の小さな表情を毎日の会話に。',
        ],
        button: 'スタンプを見に行く',
      },
    },
    'ko': {
      sectionsLabel: 'SECTIONS',
      sections: [
        { href: '#prompt-builder', id: 'prompt-builder', label: '01 서사' },
        { href: '#story-workspace', id: 'story-workspace', label: '02 시스템' },
        { href: '#architecture', id: 'architecture', label: '03 아키텍처' },
      ],
      scroll: '아래로 스크롤',
      brand: { copy: '세계를 엮고, 이야기를 교차하다.', download: '다운로드 및 실행' },
      cardBanner: {
        eyebrow: 'A gallery of possibilities',
        title: '누구의 이야기부터 시작할까요?',
        nomMessage: '음…… 다 만나보고 싶어요. 누구를 고를까요?',
      },
      manifesto: {
        eyebrow: 'A home for your stories',
        title: '본문은 이야기로,<br />무대 뒤도 깔끔하게',
        paragraphs: [
          '이야기를 읽을 땐 본문에 집중하고, 설정을 바꿀 땐 작업실을 열어보세요.',
          'Agent의 실행 기록, 도구 결과, 프롬프트 빌드도 제자리에 정리되어 필요할 때만 펼쳐볼 수 있습니다.',
        ],
      },
      product: {
        eyebrow: 'Inside the studio',
        title: '이야기가 머무는 곳,<br />작업대가 함께 열립니다',
        paragraphs: [
          '캐릭터, 설정, 대화가 하나의 작업대에 모여 있어 번갈아 찾을 필요가 없습니다.',
          '아래 인터랙티브 데모에서 이야기를 읽거나 작업 공간을 열어보세요.',
        ],
        legend: [
          { index: '01', title: '스토리 타임라인', desc: '본문을 읽고 이야기 분기 확인' },
          { index: '02', title: 'Agent 작업 영역', desc: '대화, 도구 호출 및 실행 기록 확인' },
          { index: '03', title: '프롬프트 구성', desc: '이번 턴에 사용된 설정 확인' },
        ],
      },
      architecture: {
        eyebrow: 'A little look backstage',
        title: '작업대 안쪽은<br />어떻게 돌아갈까요',
        paragraphs: [
          '스토리 본문, Agent 세션, 프롬프트 구성은 각 모듈이 담당합니다.',
          '아키텍처 맵으로 연결되어 한 번의 동작과 관련된 코드를 쉽게 찾을 수 있습니다.',
        ],
        nomMessage: '와, 안에 이렇게 많은 게…… 아는 부분부터 천천히 살펴봐야겠어요.',
        button: '개발자 아키텍처 맵',
      },
      stickersBanner: {
        title: '이야기 너머<br />일상 속 작은 동행',
        paragraphs: [
          '진지하고, 즐겁고, 졸리고, 때로는 토라지기도 하는.',
          '33장의 투명 스티커로 Nom의 표정을 일상 속에 담아보세요.',
        ],
        button: '스티커 고르러 가기',
      },
    },
  };
  return data[locale] ?? data['zh-CN'];
}

export function getStickersCopy(locale: SiteLocale) {
  const data = {
    'zh-CN': {
      hero: {
        title: '把一点陪伴<br />带进日常',
        intro: '有时认真，有时困困，偶尔还会偷偷得意。<br />这里是 Nom 的小小表情室，挑一张，替今天说句话。',
      },
      pack: {
        countSuffix: '种心情<br />一起带走',
        downloadButton: '下载整套表情包',
        details: (packSize: string) => `透明 PNG · 512px · ZIP ${packSize} MiB<br />8 张全身 + 25 张表情与动作`,
      },
      divider: '选个表情，试句台词。',
      noscript: '下方贴纸已完整展示。开启 JavaScript 后可切换分类、试搭背景和气泡；整套及单张下载无需 JavaScript。',
      gallery: {
        label: 'A LITTLE COMPANY',
        groups: [
          { id: 'all', title: '全部' },
          { id: 'bust', title: '表情与动作' },
          { id: 'fullbody', title: '全身陪伴' },
        ],
        backgrounds: [
          { id: 'checker', title: '透明棋盘' },
          { id: 'light', title: '浅色' },
          { id: 'dark', title: '深色' },
        ],
        sides: [
          { id: 'left', title: '气泡在左' },
          { id: 'right', title: '气泡在右' },
        ],
        previewBackgroundAria: '预览背景',
        bubblePositionAria: '气泡位置',
        filterAria: '贴纸分类',
        previewSectionAria: '表情与气泡试搭',
        downloadOriginal: '下载这张原图',
        bubbleLabel: '替她说一句',
        bubbleNote: '只在这里试台词，下载的图片不含文字。',
        collectionTitle: '今天是哪一种心情',
        collectionCount: (visible: number, total: number) => `${visible} / ${total} 张`,
        previewAria: (title: string) => `预览：${title}`,
        downloadAria: (title: string) => `下载${title}原图`,
      },
    },
    'en': {
      hero: {
        title: 'A little company<br />in everyday moments',
        intro: "Earnest, sleepy, or quietly proud.<br />This is Nom's little sticker room. Pick one to speak for today.",
      },
      pack: {
        countSuffix: 'moods to<br />take along',
        downloadButton: 'Download Sticker Pack',
        details: (packSize: string) => `Transparent PNG · 512px · ZIP ${packSize} MiB<br />8 full-body + 25 expressions & gestures`,
      },
      divider: 'Pick a mood, try a line.',
      noscript: 'All stickers are displayed below. Enable JavaScript to filter categories and preview bubbles; pack and single downloads do not require JavaScript.',
      gallery: {
        label: 'A LITTLE COMPANY',
        groups: [
          { id: 'all', title: 'All' },
          { id: 'bust', title: 'Expressions' },
          { id: 'fullbody', title: 'Companions' },
        ],
        backgrounds: [
          { id: 'checker', title: 'Checker' },
          { id: 'light', title: 'Light' },
          { id: 'dark', title: 'Dark' },
        ],
        sides: [
          { id: 'left', title: 'Bubble Left' },
          { id: 'right', title: 'Bubble Right' },
        ],
        previewBackgroundAria: 'Preview background',
        bubblePositionAria: 'Bubble position',
        filterAria: 'Sticker categories',
        previewSectionAria: 'Sticker & bubble preview',
        downloadOriginal: 'Download original image',
        bubbleLabel: 'Write a line for her',
        bubbleNote: 'Text is for preview only; downloaded stickers are transparent.',
        collectionTitle: 'A mood for every moment',
        collectionCount: (visible: number, total: number) => `${visible} / ${total} stickers`,
        previewAria: (title: string) => `Preview: ${title}`,
        downloadAria: (title: string) => `Download original ${title}`,
      },
    },
    'ja': {
      hero: {
        title: '小さな寄り添いを<br />いつもの毎日に',
        intro: '真面目だったり、うとうとしたり、時にはこっそり誇らしげ。<br />ここは Nom の小さなスタンプ部屋。今日の気持ちにぴったりの一枚を。',
      },
      pack: {
        countSuffix: '種類の表情を<br />まとめて',
        downloadButton: 'スタンプセットをダウンロード',
        details: (packSize: string) => `透過 PNG · 512px · ZIP ${packSize} MiB<br />全身 8 枚 + 表情・仕草 25 枚`,
      },
      divider: 'スタンプを選んで、セリフを試す。',
      noscript: 'スタンプ一覧は下に表示されています。JavaScript を有効にするとカテゴリ切替やフキダシプレビューが使えます。一括および個別ダウンロードに JavaScript は不要です。',
      gallery: {
        label: 'A LITTLE COMPANY',
        groups: [
          { id: 'all', title: 'すべて' },
          { id: 'bust', title: '表情と仕草' },
          { id: 'fullbody', title: '全身の相棒' },
        ],
        backgrounds: [
          { id: 'checker', title: '市松模様' },
          { id: 'light', title: 'ライト' },
          { id: 'dark', title: 'ダーク' },
        ],
        sides: [
          { id: 'left', title: '左のフキダシ' },
          { id: 'right', title: '右のフキダシ' },
        ],
        previewBackgroundAria: '背景プレビュー',
        bubblePositionAria: 'フキダシの位置',
        filterAria: 'スタンプカテゴリ',
        previewSectionAria: 'スタンプとフキダシのお試し',
        downloadOriginal: 'この画像をダウンロード',
        bubbleLabel: 'セリフを入れてみる',
        bubbleNote: 'ここでのプレビュー用です。ダウンロードする画像に文字は入りません。',
        collectionTitle: '今日はどんな気分',
        collectionCount: (visible: number, total: number) => `${visible} / ${total} 枚`,
        previewAria: (title: string) => `プレビュー：${title}`,
        downloadAria: (title: string) => `${title}の原寸をダウンロード`,
      },
    },
    'ko': {
      hero: {
        title: '작은 다정함을<br />일상 속으로',
        intro: '진지하다가도, 졸려 하다가, 가끔은 슬그머니 뿌듯해지는.<br />여기는 Nom의 작은 스티커 방입니다. 오늘의 마음에 맞는 하나를 골라보세요.',
      },
      pack: {
        countSuffix: '가지 기분을<br />함께',
        downloadButton: '스티커 팩 전체 다운로드',
        details: (packSize: string) => `투명 PNG · 512px · ZIP ${packSize} MiB<br />전신 8장 + 표정 및 동작 25장`,
      },
      divider: '스티커를 고르고, 대사를 넣어보세요.',
      noscript: '아래에 스티커가 표시되어 있습니다. JavaScript를 활성화하면 카테고리 필터와 말풍선 미리보기를 사용할 수 있습니다. 전체 및 개별 다운로드는 JavaScript 없이도 가능합니다.',
      gallery: {
        label: 'A LITTLE COMPANY',
        groups: [
          { id: 'all', title: '전체' },
          { id: 'bust', title: '표정과 동작' },
          { id: 'fullbody', title: '전신 동행' },
        ],
        backgrounds: [
          { id: 'checker', title: '바둑판' },
          { id: 'light', title: '밝은 배경' },
          { id: 'dark', title: '어두운 배경' },
        ],
        sides: [
          { id: 'left', title: '왼쪽 말풍선' },
          { id: 'right', title: '오른쪽 말풍선' },
        ],
        previewBackgroundAria: '미리보기 배경',
        bubblePositionAria: '말풍선 위치',
        filterAria: '스티커 분류',
        previewSectionAria: '스티커 및 말풍선 미리보기',
        downloadOriginal: '이 원본 다운로드',
        bubbleLabel: '대사를 넣어보세요',
        bubbleNote: '미리보기 전용입니다. 다운로드하는 이미지에는 텍스트가 포함되지 않습니다.',
        collectionTitle: '오늘은 어떤 기분인가요',
        collectionCount: (visible: number, total: number) => `${visible} / ${total} 장`,
        previewAria: (title: string) => `미리보기: ${title}`,
        downloadAria: (title: string) => `${title} 원본 다운로드`,
      },
    },
  };
  return data[locale] ?? data['zh-CN'];
}

export const pageMeta = {
  download: {
    'zh-CN': {
      title: '下载与启动',
      description: '通过 Git 克隆 Loom Studio，使用 npm start 安装依赖、构建并启动本地工作台。',
      eyebrow: 'Get Loom Studio',
      marker: 'PAGE / 03 · GET STARTED',
      headline: '把工作台留在自己的机器上',
      intro: '现在可以从源码启动 Loom Studio。安装包尚未发布，先准备好 Git 和 Node.js，三行命令就能开始安装。',
    },
    'en': {
      title: 'Download & Launch',
      description: 'Clone Loom Studio via Git, install dependencies with npm start, build and launch the local workstation.',
      eyebrow: 'Get Loom Studio',
      marker: 'PAGE / 03 · GET STARTED',
      headline: 'A workbench running locally',
      intro: 'Loom Studio can now be launched from source. Prebuilt binaries are coming soon; prepare Git and Node.js, and get started in three commands.',
    },
    'ja': {
      title: 'ダウンロードと起動',
      description: 'Git で Loom Studio をクローンし、npm start で依存関係をインストール・ビルドしてローカルスタジオを起動します。',
      eyebrow: 'Get Loom Studio',
      marker: 'PAGE / 03 · GET STARTED',
      headline: 'ワークベンチを手元のマシンに置く',
      intro: '現在、ソースコードから Loom Studio を起動できます。インストーラーは準備中ですが、Git と Node.js を用意すれば 3 行のコマンドですぐに始められます。',
    },
    'ko': {
      title: '다운로드 및 실행',
      description: 'Git으로 Loom Studio를 클론하고, npm start로 의존성을 설치 및 빌드하여 로컬 작업대를 실행합니다.',
      eyebrow: 'Get Loom Studio',
      marker: 'PAGE / 03 · GET STARTED',
      headline: '로컬 환경에서 실행하는 작업대',
      intro: '지금 소스 코드에서 Loom Studio를 실행할 수 있습니다. 설치 패키지는 준비 중이며, Git과 Node.js만 있으면 세 줄의 명령어로 시작할 수 있습니다.',
    },
  },
  showcase: {
    'zh-CN': {
      title: '作品展厅',
      description: '探索 Loom Studio 官方与社区角色卡、世界设定与故事示例。',
      eyebrow: 'Community & Official Showcase',
      marker: 'PAGE / 01 · SHOWCASE',
      headline: '一封来信一座陌生的城',
      intro: '每一次选择，都有新的故事。角色卡与设定集承载不同世界，也展开新的旅途。',
    },
    'en': {
      title: 'Work Showcase',
      description: 'Explore official and community character cards, worldbooks, and story samples.',
      eyebrow: 'Community & Official Showcase',
      marker: 'PAGE / 01 · SHOWCASE',
      headline: 'A letter from afar an unfamiliar town',
      intro: 'With every choice comes a new story. Character cards and world lore open paths to new adventures.',
    },
    'ja': {
      title: '作品ギャラリー',
      description: '公式およびコミュニティ制作のキャラクターカード、世界設定、ストーリーのサンプルを探索。',
      eyebrow: 'Community & Official Showcase',
      marker: 'PAGE / 01 · SHOWCASE',
      headline: '一通の手紙見知らぬ街',
      intro: '選ぶたびに、新しい物語が始まる。キャラクターカードと世界設定を開き、次の旅路を見つけましょう。',
    },
    'ko': {
      title: '작품 갤러리',
      description: '공식 및 커뮤니티 캐릭터 카드, 세계관 설정 및 스토리 샘플을 둘러보세요.',
      eyebrow: 'Community & Official Showcase',
      marker: 'PAGE / 01 · SHOWCASE',
      headline: '한 통의 편지 낯선 도시',
      intro: '매 선택마다 새로운 이야기가 시작됩니다. 캐릭터 카드와 세계관 설정을 살펴보고 다음 여정을 선택하세요.',
    },
  },
  marketplace: {
    'zh-CN': {
      title: '生态市场',
      description: '官方与社区扩展插件、预设模型与创作工具集市。',
      eyebrow: 'Extensions & Presets Market',
      marker: 'PAGE / 02 · MARKETPLACE',
      headline: '为故事世界带来新的灵感',
      intro: '扩展脚本、正则流水线与 Agent 工具箱。工作台的能力随创作需求一同扩展。',
    },
    'en': {
      title: 'Ecosystem Marketplace',
      description: 'Official and community extension plugins, preset models, and creative toolkits.',
      eyebrow: 'Extensions & Presets Market',
      marker: 'PAGE / 02 · MARKETPLACE',
      headline: 'New inspiration for story worlds',
      intro: 'Extension scripts, regex pipelines, and Agent toolsets. The studio grows with each creative project.',
    },
    'ja': {
      title: 'マーケット',
      description: '公式・コミュニティ拡張プラグイン、プリセットモデル、クリエイティブツールのマーケットプレイス。',
      eyebrow: 'Extensions & Presets Market',
      marker: 'PAGE / 02 · MARKETPLACE',
      headline: '物語の世界に新しいひらめきを',
      intro: '拡張スクリプト、正規表現パイプライン、Agent ツールキット。創作に合わせてスタジオの機能を拡張しましょう。',
    },
    'ko': {
      title: '마켓플레이스',
      description: '공식 및 커뮤니티 확장 플러그인, 프리셋 모델 및 창작 도구 모음.',
      eyebrow: 'Extensions & Presets Market',
      marker: 'PAGE / 02 · MARKETPLACE',
      headline: '이야기 세계를 위한 새로운 영감',
      intro: '확장 스크립트, 정규식 파이프라인, Agent 툴킷. 창작과 함께 진화하는 작업대를 만나보세요.',
    },
  },
  news: {
    'zh-CN': {
      title: '工作室手记',
      description: 'Loom Studio 版本更新日志、技术手记与开发动态。',
      eyebrow: 'Studio Devlogs & Updates',
      marker: 'PAGE / 05 · NEWS',
      headline: '来公告板前看看最近的故事',
      intro: '新消息、小修补，还有创作途中的一点灵感。了解工作台的最新进展与设计考量。',
    },
    'en': {
      title: 'Studio Notes',
      description: 'Loom Studio release changelogs, engineering devlogs, and design thoughts.',
      eyebrow: 'Studio Devlogs & Updates',
      marker: 'PAGE / 05 · NEWS',
      headline: 'Step up to the board check recent stories',
      intro: 'Updates, refinements, and creative sparks. Stay informed about the latest progress and workbench design thinking.',
    },
    'ja': {
      title: 'スタジオノート',
      description: 'Loom Studio のアップデート履歴、開発手記、設計ノート。',
      eyebrow: 'Studio Devlogs & Updates',
      marker: 'PAGE / 05 · NEWS',
      headline: '掲示板の前で最近の物語を覗く',
      intro: '最新情報、小さな修正、創作の合間のひらめき。スタジオの進捗と設計の裏側をお届けします。',
    },
    'ko': {
      title: '스튜디오 노트',
      description: 'Loom Studio 릴리스 업데이트 로그, 기술 노트 및 개발 소식.',
      eyebrow: 'Studio Devlogs & Updates',
      marker: 'PAGE / 05 · NEWS',
      headline: '게시판에서 최근 이야기를 확인하세요',
      intro: '새로운 소식, 자잘한 개선, 그리고 창작 여정의 영감. 작업대의 최신 소식과 디자인 고민을 전해드립니다.',
    },
  },
  docs: {
    'zh-CN': {
      title: '公开文档',
      description: 'Loom Studio 快速上手、核心概念与系统架构指南。',
      eyebrow: 'Documentation & Guide',
      marker: 'PAGE / 04 · DOCS',
      headline: '翻开工作台的使用手册',
      intro: '从第一步到故事的深处。了解角色资源、提示词构建、Session 工作历史与本地数据边界。',
    },
    'en': {
      title: 'Documentation',
      description: 'Loom Studio quick start, core concepts, and system architecture guide.',
      eyebrow: 'Documentation & Guide',
      marker: 'PAGE / 04 · DOCS',
      headline: 'Open the workbench guide',
      intro: 'From initial setup to the details of storytelling. Learn about character resources, prompt construction, Session work history, and local data boundaries.',
    },
    'ja': {
      title: '公式ドキュメント',
      description: 'Loom Studio クイックスタート、コア概念、システムアーキテクチャガイド。',
      eyebrow: 'Documentation & Guide',
      marker: 'PAGE / 04 · DOCS',
      headline: 'スタジオのマニュアルを開く',
      intro: '最初の一歩から物語の深層へ。キャラクターリソース、Prompt 構築、Session の作業履歴、ローカルデータの境界を紹介します。',
    },
    'ko': {
      title: '공식 문서',
      description: 'Loom Studio 빠른 시작, 핵심 개념 및 시스템 아키텍처 가이드.',
      eyebrow: 'Documentation & Guide',
      marker: 'PAGE / 04 · DOCS',
      headline: '작업대 사용 설명서를 펼쳐보세요',
      intro: '첫걸음부터 이야기의 깊은 곳까지. 캐릭터 리소스, Prompt 구성, Session 작업 기록, 로컬 데이터 경계를 알아봅니다.',
    },
  },
  stickers: {
    'zh-CN': {
      title: 'Nom 表情包',
      description: '把 Nom 带到日常聊天里。33 张透明贴纸，浏览表情、试搭气泡，免费下载整套 512px PNG 或单张原图。',
      eyebrow: 'Nom Sticker Pack',
      marker: 'PAGE / 06 · STICKERS',
      headline: '把一点陪伴带进日常',
      intro: '33 张透明贴纸，浏览表情、试搭气泡，免费下载整套 512px PNG 或单张原图。',
    },
    'en': {
      title: 'Nom Stickers',
      description: 'Nom stickers for everyday chats. 33 transparent stickers with preview bubbles. Free 512px PNG pack and original single downloads.',
      eyebrow: 'Nom Sticker Pack',
      marker: 'PAGE / 06 · STICKERS',
      headline: 'A little company in everyday moments',
      intro: '33 transparent stickers with preview bubbles. Free 512px PNG pack and original single downloads.',
    },
    'ja': {
      title: 'Nom スタンプ',
      description: 'Nom を日常の会話に。透過スタンプ 33 枚。セリフを試して、512px PNG パックや原寸画像を無料ダウンロード。',
      eyebrow: 'Nom Sticker Pack',
      marker: 'PAGE / 06 · STICKERS',
      headline: '小さな寄り添いをいつもの毎日に',
      intro: '透過スタンプ 33 枚。セリフを試して、512px PNG パックや原寸画像を無料ダウンロード。',
    },
    'ko': {
      title: 'Nom 스티커',
      description: 'Nom을 일상 대화로 초대하세요. 33장의 투명 스티커와 말풍선 미리보기. 512px PNG 팩 및 개별 원본 무료 다운로드.',
      eyebrow: 'Nom Sticker Pack',
      marker: 'PAGE / 06 · STICKERS',
      headline: '작은 다정함을 일상 속으로',
      intro: '33장의 투명 스티커와 말풍선 미리보기. 512px PNG 팩 및 개별 원본 무료 다운로드.',
    },
  },
} as const;

