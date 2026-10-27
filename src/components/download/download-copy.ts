import type { SiteLocale } from '../../lib/i18n'

export const operations = [
  ['git clone https://github.com/The-LoomStudio/LoomStudio.git', 'cd LoomStudio', 'npm start'],
  ['npm start'],
  ['git pull --ff-only', 'npm exec --yes --package=pnpm@9.15.0 -- pnpm install --frozen-lockfile', 'npm exec --yes --package=pnpm@9.15.0 -- pnpm build:app', 'npm start'],
]

export const downloadCopy = {
  'zh-CN': {
    modes: ['首次安装', '日常启动', '更新源码'], platform: '选择系统', modeLabel: '选择操作',
    title: '把工作台，带回本地。', copy: '复制全部命令', copying: '正在复制', copied: '已复制', failed: '重试复制',
    ready: '复制后，在你自己的终端粘贴运行。', success: '命令已复制。切回终端，粘贴后按回车运行。',
    error: '无法访问剪贴板，请选中下方命令手动复制。', select: '点选步骤，看看这一步做什么。',
    contexts: ['从你准备存放程序的目录开始。', '先进入已有的 LoomStudio 目录，再执行启动命令。', '先停止服务并备份数据，再在 LoomStudio 目录更新。'],
    names: [['获取源码', '进入目录', '启动工作台'], ['启动工作台'], ['拉取源码', '安装依赖', '重新构建', '启动工作台']],
    help: [
      ['下载源码到一个新的 LoomStudio 文件夹。需要提前安装 Git。', '让终端进入刚刚克隆的程序目录。后续命令都在这里执行。', '首次运行会安装依赖，并在缺少构建时构建应用。保持终端开启，按它显示的地址打开工作台。'],
      ['再次使用时不必重新克隆。保持终端开启，退出时按 Ctrl+C 停止服务。'],
      ['仅允许快进更新；如果 Git 提示存在冲突或本地改动，先处理改动，不要覆盖自己的文件。', '使用固定版本 pnpm 安装与锁文件匹配的依赖。', '源码变化后主动重建；npm start 不会判断旧构建是否过期。', '构建完成后启动服务。程序会在终端显示访问地址和实际数据目录。'],
    ],
    tips: ['打开 Windows Terminal 或 PowerShell。确保 git、node、npm 可用。', '打开“终端”。通用入口是 npm start；start.command 的执行权限取决于本机设置。', '打开终端运行命令。通用入口是 npm start；Linux 启动脚本尚待实机人工验收。'],
    footer: '源码启动 · 需要 Git 与 Node.js 24.22.0+', hint: '安装包准备中。当前提供源码启动方式。',
  },
  en: {
    modes: ['First install', 'Start again', 'Update source'], platform: 'Choose your system', modeLabel: 'Choose an operation',
    title: 'A workbench of your own.', copy: 'Copy all commands', copying: 'Copying', copied: 'Copied', failed: 'Try copying again',
    ready: 'Paste these commands into your own terminal to run them.', success: 'Commands copied. Paste into your terminal and press Enter.',
    error: 'Clipboard unavailable. Select the commands below and copy them manually.', select: 'Select a step to see what it does.',
    contexts: ['Start in the folder where you want to keep the app.', 'Open your existing LoomStudio folder before running this command.', 'Stop the server and back up your data, then update from the LoomStudio folder.'],
    names: [['Get the source', 'Open the folder', 'Start Loom'], ['Start Loom'], ['Pull changes', 'Install dependencies', 'Rebuild', 'Start Loom']],
    help: [
      ['Clone the source into a new LoomStudio folder. Install Git first.', 'Enter the cloned project folder. Run the remaining commands there.', 'The first start installs dependencies and builds missing output. Keep the terminal open and visit the address it displays.'],
      ['No need to clone again. Keep the terminal open while playing; press Ctrl+C to stop the server.'],
      ['Fast-forward updates only. Resolve local changes or conflicts first; do not overwrite your files.', 'Install dependencies matching the lockfile with the pinned pnpm version.', 'Rebuild after source changes. npm start does not check whether existing output is outdated.', 'Start the rebuilt app. The terminal displays the URL and actual data directory.'],
    ],
    tips: ['Use Windows Terminal or PowerShell. Make sure git, node and npm are available.', 'Open Terminal. npm start is the universal entry; start.command permissions depend on your Mac.', 'Use a terminal. npm start is the universal entry; the Linux launcher still awaits manual testing.'],
    footer: 'From source · Git & Node.js 24.22.0+', hint: 'Installers are still in preparation. Use the source commands for now.',
  },
  ja: {
    modes: ['初回インストール', 'もう一度起動', 'ソースを更新'], platform: 'システムを選択', modeLabel: '操作を選択',
    title: 'あなたの手元に、スタジオを。', copy: 'すべてコピー', copying: 'コピー中', copied: 'コピー済み', failed: '再試行',
    ready: '自分のターミナルに貼り付けて実行してください。', success: 'コピーしました。ターミナルに貼り付け、Enter キーで実行してください。',
    error: 'クリップボードを利用できません。下のコマンドを選択して手動でコピーしてください。', select: 'ステップを選ぶと説明が表示されます。',
    contexts: ['アプリを保存するフォルダから始めます。', '既存の LoomStudio フォルダで実行してください。', 'サービスを停止しデータをバックアップしてから、LoomStudio フォルダで更新します。'],
    names: [['ソースを取得', 'フォルダへ移動', '起動'], ['起動'], ['更新を取得', '依存関係を導入', '再ビルド', '起動']],
    help: [
      ['Git を事前にインストールし、新しい LoomStudio フォルダにソースを取得します。', '取得したフォルダに移動します。以降のコマンドはここで実行します。', '初回は依存関係を導入し、不足するビルドを作成します。ターミナルを開いたまま、表示された URL にアクセスしてください。'],
      ['再取得は不要です。利用中はターミナルを開いたままにし、終了時は Ctrl+C で停止します。'],
      ['早送り更新のみを実行します。ローカルの変更や競合は先に解決し、ファイルを上書きしないでください。', '固定バージョンの pnpm でロックファイルに一致する依存関係を導入します。', 'ソース更新後は再ビルドします。npm start は既存ビルドの古さを確認しません。', 'ビルドしたアプリを起動します。URL とデータ保存先はターミナルに表示されます。'],
    ],
    tips: ['Windows Terminal または PowerShell を開き、git、node、npm が使えることを確認してください。', '「ターミナル」を開きます。共通の入口は npm start です。start.command の権限は本体設定によります。', 'ターミナルで実行します。共通の入口は npm start です。Linux 起動スクリプトは実機での確認待ちです。'],
    footer: 'ソースから起動 · Git と Node.js 24.22.0+', hint: 'インストーラは準備中です。現在はソースから起動できます。',
  },
  ko: {
    modes: ['처음 설치', '다시 실행', '소스 업데이트'], platform: '운영체제 선택', modeLabel: '작업 선택',
    title: '내 컴퓨터에 작은 작업실을.', copy: '전체 명령어 복사', copying: '복사 중', copied: '복사 완료', failed: '다시 복사',
    ready: '자신의 터미널에 붙여넣어 실행하세요.', success: '복사했습니다. 터미널에 붙여넣고 Enter를 누르세요.',
    error: '클립보드를 사용할 수 없습니다. 아래 명령어를 선택해 직접 복사하세요.', select: '단계를 선택하면 설명을 볼 수 있습니다.',
    contexts: ['프로그램을 보관할 폴더에서 시작하세요.', '기존 LoomStudio 폴더에서 실행하세요.', '서비스를 중지하고 데이터를 백업한 뒤 LoomStudio 폴더에서 업데이트하세요.'],
    names: [['소스 받기', '폴더로 이동', '실행'], ['실행'], ['변경 받기', '의존성 설치', '다시 빌드', '실행']],
    help: [
      ['Git을 먼저 설치하세요. 새 LoomStudio 폴더에 소스를 받습니다.', '받은 프로그램 폴더로 이동합니다. 이후 명령어는 이곳에서 실행합니다.', '처음 실행하면 의존성을 설치하고 없는 빌드 결과물을 생성합니다. 터미널을 열어 두고 표시된 주소로 접속하세요.'],
      ['다시 받을 필요가 없습니다. 사용 중에는 터미널을 열어 두고 Ctrl+C로 종료하세요.'],
      ['빠른 병합만 허용합니다. 로컬 변경이나 충돌을 먼저 해결하고 자신의 파일을 덮어쓰지 마세요.', '고정된 pnpm 버전으로 잠금 파일에 맞는 의존성을 설치합니다.', '소스 변경 후 다시 빌드하세요. npm start는 기존 빌드가 오래되었는지 확인하지 않습니다.', '빌드한 앱을 실행합니다. 주소와 실제 데이터 폴더는 터미널에 표시됩니다.'],
    ],
    tips: ['Windows Terminal 또는 PowerShell을 열고 git, node, npm을 사용할 수 있는지 확인하세요.', '터미널을 여세요. 공통 실행 명령은 npm start입니다. start.command 권한은 Mac 설정에 따라 다릅니다.', '터미널에서 실행하세요. 공통 명령은 npm start입니다. Linux 실행 스크립트는 실제 환경 확인을 기다리고 있습니다.'],
    footer: '소스 실행 · Git 및 Node.js 24.22.0+', hint: '설치 패키지를 준비 중입니다. 지금은 소스 명령어를 이용하세요.',
  },
} satisfies Record<SiteLocale, unknown>
