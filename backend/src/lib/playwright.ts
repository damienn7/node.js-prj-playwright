import { chromium } from 'playwright'

export type PageAnalysisResult = {
  pageTitle: string
  finalUrl: string
  buttons: string[]
  links: string[]
  screenshotBuffer: Buffer
}

export const runPageAnalysis = async (url: string, timeout = 30000): Promise<PageAnalysisResult> => {
  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } })
  const page = await context.newPage()

  try {
    await page.goto(url, { timeout, waitUntil: 'domcontentloaded' })

    const pageTitle = await page.title()
    const finalUrl = page.url()

    const { buttons, links } = await page.evaluate(() => {
      const visible = (el: Element) => {
        const r = el.getBoundingClientRect()
        return r.width > 0 && r.height > 0
      }

      const buttonEls = Array.from(document.querySelectorAll('button, input[type="button"], input[type="submit"], [role="button"]'))
        .filter(visible)
        .map((el) => (el.textContent || '').trim())
        .filter(Boolean)
        .slice(0, 20)

      const linkEls = Array.from(document.querySelectorAll('a'))
        .filter(visible)
        .map((el) => (el.textContent || '').trim())
        .filter(Boolean)
        .slice(0, 50)

      return { buttons: Array.from(new Set(buttonEls)), links: Array.from(new Set(linkEls)) }
    })

    const screenshotBuffer = await page.screenshot({ type: 'png', fullPage: false })

    return { pageTitle, finalUrl, buttons, links, screenshotBuffer }
  } finally {
    try {
      await page.close()
    } catch (e) {
      // ignore
    }
    try {
      await context.close()
    } catch (e) {}
    try {
      await browser.close()
    } catch (e) {}
  }
}
