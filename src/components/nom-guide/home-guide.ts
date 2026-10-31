import { getHomeCopy, getHomeFeatures, type SiteLocale } from '../../lib/i18n'
import type { BrandWelcomeCopy } from '../brand-welcome/BrandWelcome'
import type { NomGuideCopy, NomGuideSection, NomSpeech } from './NomGuide'

type LocaleCopy = {
  brand: Pick<BrandWelcomeCopy, 'label'>
  controls: NomGuideCopy
  greeting: Pick<NomSpeech, 'title' | 'text'>
  wall: Pick<NomSpeech, 'title' | 'text'>
  workspace: Pick<NomSpeech, 'title' | 'text'>
  reactions: NomSpeech[]
}
const copy: Record<SiteLocale, LocaleCopy> = {
  'zh-CN': {
    brand: { label: 'Loom Studio 品牌入场' },
    controls: { label: '诺姆的导览', expand: '展开诺姆的导览', minimize: '缩小诺姆的导览', close: '关闭诺姆的导览', greet: '和诺姆打个招呼', minimized: '诺姆在这里' },
    greeting: { title: '啊，你来啦。', text: '我是诺姆，Loom Studio 的看板娘。欢迎来到这间装着角色和故事的小小工作室。往下看看，我陪你。' },
    workspace: { title: '故事之外，还有准备。', text: '点开工作文件，看看这一条伏笔怎样被写下、接续，再回到故事里。' },
    wall: { title: '窗外还有好多故事。', text: '雨天的街道、夜里的列车、还亮着灯的书店。下一幕，你想去哪里？' },
    reactions: [
      { expression: 'giggle', title: '嘿嘿，我在呢。', text: '你慢慢看，遇到喜欢的地方，我们就多停留一会儿。' },
      { expression: 'wink', title: '被你发现啦。', text: '刚才还在想，下一段故事会是什么样子。' },
    ],
  },
  en: {
    brand: { label: 'Welcome to Loom Studio' },
    controls: { label: 'Nom’s guide', expand: 'Expand Nom’s guide', minimize: 'Minimize Nom’s guide', close: 'Close Nom’s guide', greet: 'Say hello to Nom', minimized: 'Nom is here' },
    greeting: { title: 'Oh, you’re here.', text: 'I’m Nom, Loom Studio’s mascot. Welcome to this little studio full of characters and stories. Take a look around—I’ll come along.' },
    workspace: { title: 'Preparing for the next chapter.', text: 'Open the story files and follow a clue from its first note to its return in the story.' },
    wall: { title: 'More stories beyond the window.', text: 'Rainy streets, night trains, a bookshop with its lights still on. Where would you like the next scene to begin?' },
    reactions: [
      { expression: 'giggle', title: 'Hehe, I’m here.', text: 'Take your time. We can linger wherever something catches your eye.' },
      { expression: 'wink', title: 'You found me.', text: 'I was just wondering what the next story might be like.' },
    ],
  },
  ja: {
    brand: { label: 'Loom Studio へようこそ' },
    controls: { label: 'ノムの案内', expand: 'ノムの案内を開く', minimize: 'ノムの案内を小さくする', close: 'ノムの案内を閉じる', greet: 'ノムに挨拶する', minimized: 'ノムはここにいるよ' },
    greeting: { title: 'あ、来てくれたんだ。', text: '私はノム、Loom Studio の看板娘。キャラクターと物語が集まる小さなスタジオへようこそ。一緒に見て回ろう。' },
    workspace: { title: '次の章への準備。', text: '作業ファイルを開いて、伏線が記録され、引き継がれ、物語に戻るまでを見てみよう。' },
    wall: { title: '窓の外にも、物語がいっぱい。', text: '雨の街、夜の列車、まだ明かりのついた本屋さん。次の場面は、どこにしよう？' },
    reactions: [
      { expression: 'giggle', title: 'えへへ、ここにいるよ。', text: 'ゆっくり見てね。気になるところがあったら、少し寄り道しよう。' },
      { expression: 'wink', title: '見つかっちゃった。', text: '次はどんな物語になるのかなって、考えていたところ。' },
    ],
  },
  ko: {
    brand: { label: 'Loom Studio에 오신 것을 환영해요' },
    controls: { label: '놈의 안내', expand: '놈의 안내 펼치기', minimize: '놈의 안내 줄이기', close: '놈의 안내 닫기', greet: '놈에게 인사하기', minimized: '놈은 여기 있어요' },
    greeting: { title: '아, 오셨네요.', text: '저는 Loom Studio의 마스코트 놈이에요. 캐릭터와 이야기가 모이는 작은 작업실에 오신 걸 환영해요. 함께 둘러봐요.' },
    workspace: { title: '다음 장을 위한 준비.', text: '작업 파일을 열고 복선이 기록되고 이어져 다시 이야기로 돌아오는 과정을 살펴보세요.' },
    wall: { title: '창밖에도 이야기가 가득해요.', text: '비 내리는 거리, 밤기차, 아직 불이 켜진 서점. 다음 장면은 어디로 가 볼까요?' },
    reactions: [
      { expression: 'giggle', title: '헤헤, 여기 있어요.', text: '천천히 보세요. 마음에 드는 곳에서는 조금 더 머물러도 좋아요.' },
      { expression: 'wink', title: '들켰네요.', text: '다음에는 어떤 이야기가 펼쳐질지 생각하고 있었어요.' },
    ],
  },
}

export function getHomeGuide(locale: SiteLocale) {
  const text = copy[locale]
  const home = getHomeCopy(locale)
  const features = getHomeFeatures(locale)
  const sections: NomGuideSection[] = [
    { targetId: 'brand-intro', expression: 'smile', ...text.greeting },
    { targetId: 'characters', expression: 'surprised', title: home.cardBanner.title, text: home.cardBanner.nomMessage },
    { targetId: 'prompt-builder', expression: 'thinking', title: features[2].title, text: features[2].paragraphs[0] },
    { targetId: 'story-workspace', expression: 'proud', ...text.workspace },
    { targetId: 'vertical-parallax', expression: 'wink', ...text.wall },
    { targetId: 'nom-stickers', expression: 'giggle', title: home.stickersBanner.button, text: home.stickersBanner.paragraphs[1] },
  ]
  const brand: BrandWelcomeCopy = { ...text.brand, slogan: home.brand.copy, download: home.brand.download }
  return { sections, brand, controls: text.controls, reactions: text.reactions }
}
