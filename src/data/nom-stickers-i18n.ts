import type { SiteLocale } from '../lib/i18n'
import type stickerEntries from './nom-stickers.json'

type RawEntry = (typeof stickerEntries)[number]

export interface StickerI18nData {
  title: string
  usage: string[]
  sampleText: string
}

export const stickersI18n: Record<string, Record<Exclude<SiteLocale, 'zh-CN'>, StickerI18nData>> = {
  'fullbody-idle': {
    en: { title: 'Book Companion', sampleText: "The story is still long, let's take our time.", usage: ['Home intro', 'Sidebar companion', 'Brand mark'] },
    ja: { title: '本を抱いて寄り添う', sampleText: '物語はまだ続きます。ゆっくり進めましょう。', usage: ['トップ紹介', 'サイドバーの相棒', 'ブランド末尾'] },
    ko: { title: '책을 안고 곁에', sampleText: '이야기는 아직 길어요. 천천히 가요.', usage: ['홈 소개', '사이드바 동행', '브랜드 마침'] },
  },
  'fullbody-welcome': {
    en: { title: 'Waving Welcome', sampleText: 'Welcome to your little studio.', usage: ['Home welcome', 'Quick start', 'Community greet'] },
    ja: { title: '手を振って歓迎', sampleText: 'あなたの小さなスタジオへようこそ。', usage: ['トップ歓迎', '初心者案内', 'コミュニティ挨拶'] },
    ko: { title: '손 흔들며 환영', sampleText: '당신의 작은 작업실에 오신 것을 환영해요.', usage: ['홈 환영', '시작 안내', '커뮤니티 인사'] },
  },
  'fullbody-point-left': {
    en: { title: 'Pointing Left', sampleText: "Let's begin right here.", usage: ['Right character with left bubble', 'Downloads', 'Feature tours'] },
    ja: { title: '左へ誘導', sampleText: 'ここから始めましょう。', usage: ['右側キャラクターと左フキダシ', 'ダウンロード案内', '機能紹介'] },
    ko: { title: '왼쪽으로 안내', sampleText: '여기서부터 시작해 볼까요.', usage: ['우측 캐릭터와 좌측 말풍선', '다운로드 안내', '기능 소개'] },
  },
  'fullbody-point-right': {
    en: { title: 'Pointing Right', sampleText: 'Next step is this way.', usage: ['Left character with right bubble', 'Documentation', 'Next steps'] },
    ja: { title: '右へ誘導', sampleText: '次のステップはこちらです。', usage: ['左側キャラクターと右フキダシ', 'ドキュメント案内', '次の手順'] },
    ko: { title: '오른쪽으로 안내', sampleText: '다음 단계는 이쪽이에요.', usage: ['좌측 캐릭터와 우측 말풍선', '문서 안내', '다음 단계'] },
  },
  'fullbody-reading': {
    en: { title: 'Reading a Book', sampleText: 'Turn the page together.', usage: ['Docs', 'Tutorials', 'Knowledge base'] },
    ja: { title: '読書中', sampleText: '一緒にページをめくりましょう。', usage: ['ドキュメント', 'チュートリアル', 'ナレッジ解説'] },
    ko: { title: '책 읽는 중', sampleText: '함께 이 페이지를 넘겨봐요.', usage: ['문서', '튜토리얼', '가이드 설명'] },
  },
  'fullbody-celebrate': {
    en: { title: 'Cheering High', sampleText: 'A new story is ready!', usage: ['Releases', 'Milestones', 'Success notifications'] },
    ja: { title: '手を挙げてお祝い', sampleText: '新しい物語の準備ができました！', usage: ['リリース通知', 'マイルストーン', '完了の合図'] },
    ko: { title: '손 들고 축하', sampleText: '새로운 이야기가 준비되었어요!', usage: ['릴리스 알림', '마일스톤', '완료 안내'] },
  },
  'fullbody-working': {
    en: { title: 'Busy at Desk', sampleText: "Just a moment, I'm organizing.", usage: ['Processing', 'Maintenance notes', 'Devlogs'] },
    ja: { title: 'デスクで作業中', sampleText: '少し待ってくださいね、整理中です。', usage: ['処理中', 'メンテナンス案内', '開発ノート'] },
    ko: { title: '책상 앞 작업 중', sampleText: '잠시만요, 지금 정리 중이에요.', usage: ['처리 중', '점검 안내', '개발 노트'] },
  },
  'fullbody-rest': {
    en: { title: 'Resting with Book', sampleText: "Let's take a little break.", usage: ['Footer', 'Good night', 'Idle state'] },
    ja: { title: '本を抱いてひと休み', sampleText: '少しひと休みしましょう。', usage: ['フッター', 'おやすみ', '待機状態'] },
    ko: { title: '책을 안고 휴식', sampleText: '잠깐 쉬어가요.', usage: ['바닥글', '잘 자요', '대기 상태'] },
  },
  'bust-proud': {
    en: { title: 'Proud & Pleased', sampleText: 'This passage turned out so well.', usage: ['Featured content', 'Showcase', 'Sharing accomplishments'] },
    ja: { title: '本を抱いて誇らしげ', sampleText: 'この文章、とても上手に書けました。', usage: ['おすすめコンテンツ', '作品展示', '成果の共有'] },
    ko: { title: '책을 안고 뿌듯', sampleText: '이 구절, 정말 잘 쓰였어요.', usage: ['추천 콘텐츠', '작품 전시', '성과 공유'] },
  },
  'bust-tip': {
    en: { title: 'Helpful Tip', sampleText: "Here's a quick tip.", usage: ['Tutorial tips', 'Notices', 'Helper bubbles'] },
    ja: { title: 'ワンポイントヒント', sampleText: 'ここにちょっとしたヒントがあります。', usage: ['チュートリアルヒント', '注意点', 'ヘルプフキダシ'] },
    ko: { title: '작은 힌트', sampleText: '여기에 작은 팁이 있어요.', usage: ['튜토리얼 팁', '주의 사항', '도움말 말풍선'] },
  },
  'bust-thinking': {
    en: { title: 'Pondering', sampleText: 'Let me think about it...', usage: ['Search hints', 'FAQ', 'Recommendations'] },
    ja: { title: '頬杖をついて思案', sampleText: '少し考えさせてください……', usage: ['検索のヒント', 'よくある質問', '選択の提案'] },
    ko: { title: '턱을 괴고 고민', sampleText: '잠깐 생각해 볼게요……', usage: ['검색 힌트', '자주 묻는 질문', '선택 제안'] },
  },
  'bust-success': {
    en: { title: 'Thumbs Up', sampleText: 'All set and ready!', usage: ['Success confirmation', 'Install finished', 'Community approval'] },
    ja: { title: 'サムズアップ', sampleText: '準備完了です！', usage: ['操作成功', '導入完了', 'コミュニティ認定'] },
    ko: { title: '엄지 척', sampleText: '준비 완료!', usage: ['성공 확인', '설치 완료', '커뮤니티 인정'] },
  },
  'bust-apology': {
    en: { title: 'Humble Apology', sampleText: 'Hit a little bump, let’s try once more.', usage: ['Error notices', 'Unavailable', 'Feedback response'] },
    ja: { title: '手を合わせてお詫び', sampleText: '少し問題が起きました。もう一度試してみましょう。', usage: ['エラー説明', '一時停止中', 'フィードバック対応'] },
    ko: { title: '두 손 모아 죄송', sampleText: '작은 문제가 생겼어요. 다시 한번 해봐요.', usage: ['오류 안내', '일시 사용 불가', '피드백 응답'] },
  },
  'bust-surprise': {
    en: { title: 'Gasps of Wonder', sampleText: 'Oh! Look what I just found!', usage: ['New features', 'Discovery', 'Easter eggs'] },
    ja: { title: '口元を押さえて驚き', sampleText: 'おや、新しい発見がありました！', usage: ['新機能', '発見コンテンツ', 'サプライズ'] },
    ko: { title: '입을 가린 깜짝', sampleText: '어라, 새로운 걸 발견했어요!', usage: ['새로운 기능', '발견', '깜짝 선물'] },
  },
  'bust-thanks': {
    en: { title: 'Finger Heart', sampleText: 'Thank you for weaving stories with me.', usage: ['Contributors', 'Feedback thanks', 'Community interact'] },
    ja: { title: '指ハートで感謝', sampleText: '一緒に物語を紡いでくれて、ありがとう。', usage: ['貢献者', '感謝の気持ち', 'コミュニティ交流'] },
    ko: { title: '손가락 하트 감사', sampleText: '이야기를 함께 엮어주셔서 고마워요.', usage: ['기여자', '피드백 감사', '커뮤니티 소통'] },
  },
  'bust-gift': {
    en: { title: 'Offering a Gift', sampleText: 'I prepared a little something for you.', usage: ['Downloads', 'Recommended extensions', 'Event rewards'] },
    ja: { title: 'プレゼントをどうぞ', sampleText: '小さな贈り物を用意しました。', usage: ['ダウンロード', 'おすすめ拡張', 'イベント配布'] },
    ko: { title: '선물 건네기', sampleText: '작은 선물을 준비했어요.', usage: ['다운로드', '추천 확장', '이벤트 선물'] },
  },
  'bust-smile': {
    en: { title: 'Gentle Smile', sampleText: "Mhm, I'm right here.", usage: ['Default companion', 'Gentle hints', 'Avatar reactions'] },
    ja: { title: '満足げな微笑み', sampleText: 'うん、ここにいるよ。', usage: ['日常の相棒', '控えめな案内', 'アバターリアクション'] },
    ko: { title: '만족스러운 미소', sampleText: '응, 곁에 있어요.', usage: ['기본 동행', '작은 안내', '아바타 반응'] },
  },
  'bust-laugh': {
    en: { title: 'Beaming Laugh', sampleText: 'Yay!', usage: ['Success feedback', 'Community cheer', 'Fun moments'] },
    ja: { title: '大笑い', sampleText: 'やったー！', usage: ['成功の合図', 'コミュニティの歓声', '楽しい話題'] },
    ko: { title: '활짝 웃음', sampleText: '와아!', usage: ['성공 알림', '커뮤니티 환호', '유쾌한 순간'] },
  },
  'bust-puzzled': {
    en: { title: 'Puzzled Look', sampleText: 'Is something missing?', usage: ['Help', 'No search results', 'Pending choice'] },
    ja: { title: '首をかしげて困惑', sampleText: '何か足りないのかな？', usage: ['ヘルプ', '検索結果なし', '選択待ち'] },
    ko: { title: '갸우뚱 의문', sampleText: '뭔가 빠진 게 있을까요?', usage: ['도움말', '검색 결과 없음', '선택 대기'] },
  },
  'bust-sad': {
    en: { title: 'Melancholy', sampleText: 'No story here just yet.', usage: ['Empty states', 'Page not found', 'Gentle letdown'] },
    ja: { title: '切なげにシュン', sampleText: 'ここにはまだ物語がないみたい。', usage: ['空の状態', 'ページが見つかりません', '残念なお知らせ'] },
    ko: { title: '시무룩 서운', sampleText: '여기엔 아직 이야기가 없어요.', usage: ['빈 상태', '페이지 없음', '아쉬운 응답'] },
  },
  'bust-panic': {
    en: { title: 'Sweating Panic', sampleText: 'Uh-oh, something went a little sideways.', usage: ['Errors', 'Exceptions', 'Surprise reactions'] },
    ja: { title: '慌てて冷や汗', sampleText: 'あわわ、少しトラブルが……', usage: ['エラー通知', '例外発生', '想定外の出来事'] },
    ko: { title: '허둥지둥 식은땀', sampleText: '어머나, 문제가 조금 생겼어요.', usage: ['오류', '예외 알림', '예기치 못한 반응'] },
  },
  'bust-determined': {
    en: { title: 'Resolute & Focused', sampleText: 'Leave it to me.', usage: ['In progress', 'Goals & milestones', 'Encouragement'] },
    ja: { title: '気合を入れて集中', sampleText: '任せてください！', usage: ['進行中', '目標と進捗', '励まし'] },
    ko: { title: '야무진 다짐', sampleText: '저한테 맡겨주세요.', usage: ['진행 중', '목표와 진척', '응원'] },
  },
  'bust-sleepy': {
    en: { title: 'Drowsy Doze', sampleText: 'Just resting my eyes for a sec...', usage: ['Idle wait', 'Night time', 'Short rests'] },
    ja: { title: 'うとうと居眠り', sampleText: '少しだけ目を閉じさせて……', usage: ['待機', '夜間モード', '休憩'] },
    ko: { title: '꾸벅꾸벅 졸음', sampleText: '잠깐만 눈 좀 붙일게요……', usage: ['대기', '야간', '휴식'] },
  },
  'bust-wink': {
    en: { title: 'Playful Wink', sampleText: 'Just between you and me.', usage: ['Easter eggs', 'Completion notices', 'Community greets'] },
    ja: { title: 'お茶目なウインク', sampleText: 'ここだけの秘密だよ。', usage: ['隠し要素', '完了の合図', 'フレンドリーな挨拶'] },
    ko: { title: '장난스런 윙크', sampleText: '쉿, 비밀이에요.', usage: ['이스터에그', '완료 안내', '다정한 인사'] },
  },
  'bust-giggle': {
    en: { title: 'Muffled Chuckle', sampleText: "Hehe, you can't hide it from me.", usage: ['Community banter', 'Dialogue mix'] },
    ja: { title: 'クスクス笑い', sampleText: 'ふふっ、見つけちゃいました。', usage: ['コミュニティ交流', '対話の組み合わせ'] },
    ko: { title: '입 막고 큭큭', sampleText: '히히, 딱 걸렸어요.', usage: ['커뮤니티 소통', '대사 조합'] },
  },
  'bust-tsundere': {
    en: { title: 'Tsundere Pout', sampleText: "It's not like I did it specifically for you!", usage: ['Community banter', 'Dialogue mix'] },
    ja: { title: 'ツンデレな強がり', sampleText: 'べ、別にあんたのために手伝ったんじゃないからね！', usage: ['コミュニティ交流', '対話の組み合わせ'] },
    ko: { title: '새침한 츤데레', sampleText: '딱히 너를 위해서 도와준 건 아니니까!', usage: ['커뮤니티 소통', '대사 조합'] },
  },
  'bust-sleeping': {
    en: { title: 'Pillow Sleep', sampleText: 'Let me sleep just five more minutes...', usage: ['Community banter', 'Dialogue mix'] },
    ja: { title: 'クッションで熟睡', sampleText: 'もう少しだけ眠らせて……', usage: ['コミュニティ交流', '対話の組み合わせ'] },
    ko: { title: '베개 끌어안고 잠', sampleText: '조금만 더 잘게요……', usage: ['커뮤니티 소통', '대사 조합'] },
  },
  'bust-angry': {
    en: { title: 'Puffed Up & Grumpy', sampleText: 'Hmph!', usage: ['Community banter', 'Dialogue mix'] },
    ja: { title: 'ぷんぷん怒り顔', sampleText: 'ふんっ！', usage: ['コミュニティ交流', '対話の組み合わせ'] },
    ko: { title: '볼 부푼 뾰로통', sampleText: '흥!', usage: ['커뮤니티 소통', '대사 조합'] },
  },
  'bust-crying': {
    en: { title: 'Wailing Tears', sampleText: 'Waaaah...', usage: ['Community banter', 'Dialogue mix'] },
    ja: { title: '大泣き', sampleText: 'うわあああ……', usage: ['コミュニティ交流', '対話の組み合わせ'] },
    ko: { title: '엉엉 울음', sampleText: '으앙……', usage: ['커뮤니티 소통', '대사 조합'] },
  },
  'bust-hopeful': {
    en: { title: 'Sparkling Hope', sampleText: 'May I... please?', usage: ['Community banter', 'Dialogue mix'] },
    ja: { title: 'きらきら期待顔', sampleText: 'いいですか……？', usage: ['コミュニティ交流', '対話の組み合わせ'] },
    ko: { title: '초롱초롱 기대', sampleText: '정말 그래도 돼요……?', usage: ['커뮤니티 소통', '대사 조합'] },
  },
  'bust-love': {
    en: { title: 'Love & Heart', sampleText: 'I love it so much!', usage: ['Community banter', 'Dialogue mix'] },
    ja: { title: 'キュンと一目惚れ', sampleText: '大好き！', usage: ['コミュニティ交流', '対話の組み合わせ'] },
    ko: { title: '두근두근 애정', sampleText: '너무 좋아요!', usage: ['커뮤니티 소통', '대사 조합'] },
  },
  'bust-pudding': {
    en: { title: 'Happy with Pudding', sampleText: "One little bite first, then we'll continue.", usage: ['Community banter', 'Dialogue mix'] },
    ja: { title: 'プリンを食べてご満悦', sampleText: 'ひと口食べてから、また続きをね。', usage: ['コミュニティ交流', '対話の組み合わせ'] },
    ko: { title: '달콤한 푸딩 한입', sampleText: '한 입만 먹고 다시 시작해요.', usage: ['커뮤니티 소통', '대사 조합'] },
  },
  'bust-tea': {
    en: { title: 'Sipping Tea', sampleText: "No rush, let's have some tea first.", usage: ['Relaxed watching', 'Break time', 'Community banter'] },
    ja: { title: 'お茶を一杯ひと休み', sampleText: '焦らずに、まずはお茶をどうぞ。', usage: ['まったり見守り', '休憩タイム', 'コミュニティ交流'] },
    ko: { title: '차 한 잔의 여유', sampleText: '급할 거 없어요, 차 한 잔 마셔요.', usage: ['느긋한 응원', '휴식 동행', '커뮤니티 소통'] },
  },
}

export function localizeStickerEntry<T extends RawEntry>(entry: T, locale: SiteLocale): T {
  if (locale === 'zh-CN') return entry
  const translated = stickersI18n[entry.id]?.[locale]
  if (!translated) return entry
  return {
    ...entry,
    title: translated.title,
    usage: translated.usage,
    sampleText: translated.sampleText,
  }
}
