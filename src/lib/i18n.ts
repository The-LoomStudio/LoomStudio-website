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
        paragraphs: ['整理线索、调用工具、生成回复，Agent 的工作记录留在独立面板里。', '出了岔子，也有记录可查。'],
      },
      {
        index: '03',
        title: '这一轮，模型看到了什么',
        sticker: '/images/nom/stickers/bust/thinking.png',
        paragraphs: ['哪些设定进入了上下文、提示词怎样排列，可以展开构建记录查看。', '模型漏了设定？先从这里找找原因。'],
      },
    ],
    'en': [
      {
        index: '01',
        title: 'Open the story, pick up where you left off',
        sticker: '/images/nom/stickers/fullbody/reading.png',
        paragraphs: ['Story text and Agent execution logs are kept separate. Read uninterrupted, expanding tool workflows only when you want to.', 'Never have your reading broken by unexpected blocks of raw tool calls.'],
      },
      {
        index: '02',
        title: 'See what the Agent has been working on',
        sticker: '/images/nom/stickers/fullbody/working.png',
        paragraphs: ['Clue gathering, tool invocation, and draft generation stay neatly contained in a dedicated panel.', 'When something unexpected happens, full audit logs are always within reach.'],
      },
      {
        index: '03',
        title: 'Inspect what the model saw this turn',
        sticker: '/images/nom/stickers/bust/thinking.png',
        paragraphs: ['Expand prompt build steps to see exact context ordering and which lore entries got activated.', 'Did the model miss a key detail? Trace it directly from here.'],
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
        paragraphs: ['手がかりの整理、ツールの実行、返答の生成。Agent の足跡は専用パネルに残ります。', '万が一の挙動も、記録を辿って確認できます。'],
      },
      {
        index: '03',
        title: 'このターン、モデルに何が見えていたのか',
        sticker: '/images/nom/stickers/bust/thinking.png',
        paragraphs: ['どの設定がコンテキストに入り、プロンプトがどう並べられたかをビルド履歴で展開可能。', 'モデルが設定を見落とした？ここから原因をすぐ特定できます。'],
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
        paragraphs: ['단서 정리, 도구 호출, 응답 생성 등 Agent의 작업 기록은 독립된 패널에 보관됩니다.', '문제가 발생해도 언제든 원인을 추적할 수 있습니다.'],
      },
      {
        index: '03',
        title: '이번 턴에 모델이 무엇을 확인했는지',
        sticker: '/images/nom/stickers/bust/thinking.png',
        paragraphs: ['어떤 설정이 컨텍스트에 포함되었는지, 프롬프트가 어떻게 정렬되었는지 빌드 기록에서 펼쳐볼 수 있습니다.', '모델이 설정을 놓쳤다면? 여기서 원인을 찾아보세요.'],
      },
    ],
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
      headline: 'Keep the workbench on your own machine',
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
      headline: '작업대를 당신만의 로컬 환경에',
      intro: '지금 소스 코드에서 Loom Studio를 실행할 수 있습니다. 설치 패키지는 준비 중이며, Git과 Node.js만 있으면 세 줄의 명령어로 시작할 수 있습니다.',
    },
  },
  showcase: {
    'zh-CN': {
      title: '作品展厅',
      description: '探索 Loom Studio 官方与社区角色卡、世界设定与故事示例。',
      eyebrow: 'Community & Official Showcase',
      marker: 'PAGE / 01 · SHOWCASE',
      headline: '一封来信，一座陌生的城',
      intro: '每一次选择，都有新的故事。在这里翻开角色卡与设定集，挑选属于你的下一段旅途。',
    },
    'en': {
      title: 'Work Showcase',
      description: 'Explore official and community character cards, worldbooks, and story samples.',
      eyebrow: 'Community & Official Showcase',
      marker: 'PAGE / 01 · SHOWCASE',
      headline: 'A letter from afar, an unfamiliar town',
      intro: 'With every choice comes a new story. Flip through character cards and world lore, choosing your next adventure.',
    },
    'ja': {
      title: '作品ギャラリー',
      description: '公式およびコミュニティ制作のキャラクターカード、世界設定、ストーリーのサンプルを探索。',
      eyebrow: 'Community & Official Showcase',
      marker: 'PAGE / 01 · SHOWCASE',
      headline: '一通の手紙、見知らぬ街',
      intro: '選ぶたびに、新しい物語が始まる。キャラクターカードと世界設定を開き、次の旅路を見つけましょう。',
    },
    'ko': {
      title: '작품 갤러리',
      description: '공식 및 커뮤니티 캐릭터 카드, 세계관 설정 및 스토리 샘플을 둘러보세요.',
      eyebrow: 'Community & Official Showcase',
      marker: 'PAGE / 01 · SHOWCASE',
      headline: '한 통의 편지, 낯선 도시',
      intro: '매 선택마다 새로운 이야기가 시작됩니다. 캐릭터 카드와 세계관 설정을 살펴보고 다음 여정을 선택하세요.',
    },
  },
  marketplace: {
    'zh-CN': {
      title: '生态市场',
      description: '官方与社区扩展插件、预设模型与创作工具集市。',
      eyebrow: 'Extensions & Presets Market',
      marker: 'PAGE / 02 · MARKETPLACE',
      headline: '为你的世界，寻找新的灵感',
      intro: '扩展脚本、正则流水线与 Agent 工具箱。让工作台的能力随你的创作一同进化。',
    },
    'en': {
      title: 'Ecosystem Marketplace',
      description: 'Official and community extension plugins, preset models, and creative toolkits.',
      eyebrow: 'Extensions & Presets Market',
      marker: 'PAGE / 02 · MARKETPLACE',
      headline: 'Discover fresh inspiration for your world',
      intro: 'Extension scripts, regex pipelines, and Agent toolsets. Evolve your studio alongside your creativity.',
    },
    'ja': {
      title: 'マーケット',
      description: '公式・コミュニティ拡張プラグイン、プリセットモデル、クリエイティブツールのマーケットプレイス。',
      eyebrow: 'Extensions & Presets Market',
      marker: 'PAGE / 02 · MARKETPLACE',
      headline: 'あなたの世界に、新しいひらめきを',
      intro: '拡張スクリプト、正規表現パイプライン、Agent ツールキット。創作に合わせてスタジオの機能を拡張しましょう。',
    },
    'ko': {
      title: '마켓플레이스',
      description: '공식 및 커뮤니티 확장 플러그인, 프리셋 모델 및 창작 도구 모음.',
      eyebrow: 'Extensions & Presets Market',
      marker: 'PAGE / 02 · MARKETPLACE',
      headline: '당신의 세계를 위한 새로운 영감',
      intro: '확장 스크립트, 정규식 파이프라인, Agent 툴킷. 창작과 함께 진화하는 작업대를 만나보세요.',
    },
  },
  news: {
    'zh-CN': {
      title: '工作室手记',
      description: 'Loom Studio 版本更新日志、技术手记与开发动态。',
      eyebrow: 'Studio Devlogs & Updates',
      marker: 'PAGE / 05 · NEWS',
      headline: '来公告板前，看看最近的故事',
      intro: '新消息、小修补，还有创作途中的一点灵感。了解工作台的最新进展与设计考量。',
    },
    'en': {
      title: 'Studio Notes',
      description: 'Loom Studio release changelogs, engineering devlogs, and design thoughts.',
      eyebrow: 'Studio Devlogs & Updates',
      marker: 'PAGE / 05 · NEWS',
      headline: 'Step up to the board, check recent stories',
      intro: 'Updates, refinements, and creative sparks. Stay informed about the latest progress and workbench design thinking.',
    },
    'ja': {
      title: 'スタジオノート',
      description: 'Loom Studio のアップデート履歴、開発手記、設計ノート。',
      eyebrow: 'Studio Devlogs & Updates',
      marker: 'PAGE / 05 · NEWS',
      headline: '掲示板の前で、最近の物語を覗く',
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
      intro: '从第一步到故事的深处。掌握角色卡结构、提示词预设编排以及状态变量的全部用法。',
    },
    'en': {
      title: 'Documentation',
      description: 'Loom Studio quick start, core concepts, and system architecture guide.',
      eyebrow: 'Documentation & Guide',
      marker: 'PAGE / 04 · DOCS',
      headline: 'Open the workbench guide',
      intro: 'From your first steps into the depths of your stories. Master character card structures, prompt pipelines, and runtime state variables.',
    },
    'ja': {
      title: '公式ドキュメント',
      description: 'Loom Studio クイックスタート、コア概念、システムアーキテクチャガイド。',
      eyebrow: 'Documentation & Guide',
      marker: 'PAGE / 04 · DOCS',
      headline: 'スタジオのマニュアルを開く',
      intro: '最初の一歩から物語の深淵へ。キャラクターカードの構造、プロンプトプリセットの組み立て、ステート変数の活用法を解説します。',
    },
    'ko': {
      title: '공식 문서',
      description: 'Loom Studio 빠른 시작, 핵심 개념 및 시스템 아키텍처 가이드.',
      eyebrow: 'Documentation & Guide',
      marker: 'PAGE / 04 · DOCS',
      headline: '작업대 사용 설명서를 펼쳐보세요',
      intro: '첫걸음부터 이야기의 깊은 곳까지. 캐릭터 카드 구조, 프롬프트 파이프라인 조립, 런타임 상태 변수 활용법을 마스터하세요.',
    },
  },
} as const;

