// Static website demonstration, rendered directly with local image resources.
export default function SummerPostcard() {
  return <figure className="story-postcard">
    <figcaption>诺姆的日记本 <span>渲染能力 · 可滚动阅读</span></figcaption>
    <div className="nom-diary" tabIndex={0} role="region" aria-label="诺姆的日记，向下滚动阅读">
      <article className="nom-diary__pages">
<header><small>NOM'S JOURNAL / 私藏的小小日常</small><h2>把今天，写进故事。</h2><p>有些日子没有发生大事，也值得认真记下来。</p><small>向下翻翻，还有照片和没说完的话 ↓</small></header>
<section><small>01 / 雨声与书页</small><h2>今天，把窗边的位置留给你。</h2><p>雨从下午一直下到傍晚。我们点了两杯热饮，把读到一半的书摊在桌上。你问我在看什么，我想了想，把书转向了你。</p><figure><img src="/images/nom/banners/nom-banner-013.png" alt="诺姆与同伴坐在雨天的窗边读书" /><figcaption>窗外是雨，窗内是一个可以慢慢讲的故事。</figcaption></figure><p>其实那一页已经看了很久。只是觉得，和你一起再读一遍，也很好。</p></section>
<section><small>02 / 夜晚的小秘密</small><h2>还有一句话，留在书签后面。</h2><p>城市的灯亮起来的时候，我又翻开了日记。杯子已经空了，纸页上却还留着一点点暖意。</p><figure><img src="/images/nom/illustrations/nom-illustration-001.png" loading="lazy" alt="夜色中戴着眼镜、拿着书的诺姆" /><figcaption>今天的最后一张照片。晚安之前，再读一页。</figcaption></figure><p>明天要写什么呢？先不决定。把下一页空着，等你带来新的故事。</p></section><footer>晚安。<br />—— 诺姆 ✦</footer>
      </article>
    </div>
  </figure>
}
