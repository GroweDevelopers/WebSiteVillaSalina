import { chromium } from 'playwright'
const w = +(process.argv[2] || 1920)
const browser = await chromium.launch()
for (const [label, base] of [['vecchio', 'http://localhost:4320'], ['nuovo', 'http://localhost:4310']]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: 1000 } })
  const page = await ctx.newPage()
  await page.goto(base + '/gallery', { waitUntil: 'networkidle', timeout: 60000 })
  await page.waitForTimeout(1500)
  const r = await page.evaluate(() => {
    const el = document.querySelector('.imagesSwiper')
    if (!el) return 'nessun .imagesSwiper'
    const wrap = el.querySelector('.swiper-wrapper')
    const slides = [...el.querySelectorAll('.swiper-slide')]
    const sw = el.swiper
    return {
      versione: sw?.constructor?.name,
      contenitore: Math.round(el.getBoundingClientRect().width),
      wrapperTransform: getComputedStyle(wrap).transform,
      wrapperWidth: Math.round(wrap.getBoundingClientRect().width),
      nSlide: slides.length,
      slidesPerView: sw?.params?.slidesPerView,
      loop: sw?.params?.loop,
      centered: sw?.params?.centeredSlides,
      activeIndex: sw?.activeIndex,
      slide: slides.map((s) => ({
        cls: s.className.replace('swiper-slide', '').trim().slice(0, 30),
        x: Math.round(s.getBoundingClientRect().left),
        w: Math.round(s.getBoundingClientRect().width),
        img: (s.querySelector('img')?.currentSrc || '').split('/').pop().split('&')[0].slice(-24),
      })),
    }
  })
  console.log(`\n===== ${label} =====`)
  console.log(JSON.stringify(r, null, 1))
  await ctx.close()
}
await browser.close()
