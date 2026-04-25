import fs from 'fs/promises'
import path from 'path'
import { chromium } from 'playwright'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'

const API_BASE = process.env.API_BASE_URL || 'http://localhost:4000'
const TOKEN = process.env.WORKER_SHARED_TOKEN || ''
const POLL_MS = Number(process.env.POLL_INTERVAL_MS || '10000')

const AWS_REGION = process.env.AWS_REGION || undefined
const S3_BUCKET = process.env.AWS_S3_BUCKET || ''
const S3_PUBLIC_BASE = process.env.AWS_S3_PUBLIC_BASE_URL || ''

const s3 = new S3Client({ region: AWS_REGION })

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms))

async function claim(): Promise<any> {
  const res = await fetch(`${API_BASE}/api/internal/analyses/claim`, { method: 'POST', headers: { Authorization: `Bearer ${TOKEN}` } })
  if (!res.ok) throw new Error(`claim failed: ${res.status}`)
  return res.json()
}

async function complete(id: string, payload: any) {
  const res = await fetch(`${API_BASE}/api/internal/analyses/${id}/complete`, { method: 'POST', headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
  if (!res.ok) throw new Error(`complete failed: ${res.status} ${await res.text()}`)
  return res.json()
}

async function fail(id: string, errorMessage: string) {
  const res = await fetch(`${API_BASE}/api/internal/analyses/${id}/fail`, { method: 'POST', headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ errorMessage }) })
  if (!res.ok) throw new Error(`fail failed: ${res.status} ${await res.text()}`)
  return res.json()
}

const ensureDir = async (p: string) => {
  await fs.mkdir(p, { recursive: true })
}

const sanitize = (s: string) => s.replace(/[^a-zA-Z0-9._-]/g, '-').toLowerCase()

async function uploadToS3(localPath: string, analysisId: string, stepIndex = 1, label = 'home') {
  if (!S3_BUCKET) throw new Error('S3 bucket not configured')
  const ext = path.extname(localPath) || '.png'
  const key = `analyses/${analysisId}/step-${stepIndex}-${sanitize(label)}${ext}`
  const body = await fs.readFile(localPath)
  await s3.send(new PutObjectCommand({ Bucket: S3_BUCKET, Key: key, Body: body, ContentType: 'image/png' }))
  let url = ''
  if (S3_PUBLIC_BASE) url = `${S3_PUBLIC_BASE.replace(/\/$/, '')}/${key}`
  else if (AWS_REGION) url = `https://${S3_BUCKET}.s3.${AWS_REGION}.amazonaws.com/${key}`
  else url = `https://${S3_BUCKET}.s3.amazonaws.com/${key}`
  return { s3Key: key, url }
}

const extractPatterns = (title: string, buttons: string[], links: string[]) => {
  const patterns: string[] = []
  const t = (title || '').toLowerCase()
  if (t.includes('login') || buttons.some(b => /login/i.test(b))) patterns.push('login')
  if (buttons.some(b => /sign up|signup|register/i.test(b))) patterns.push('signup')
  if (links.some(l => /pricing/i.test(l))) patterns.push('pricing')
  if (t.includes('saas') || links.some(l => /docs|api/i.test(l))) patterns.push('product')
  if (patterns.length === 0) patterns.push('landing-page')
  return patterns
}

export async function run() {
  console.log('Worker started')
  while (true) {
    try {
      const { data } = await claim()
      if (!data) {
        await sleep(POLL_MS)
        continue
      }

      const analysis = data
      console.log('Claimed analysis', analysis.id, analysis.url)

      const outputDir = path.join(process.cwd(), 'outputs', String(analysis.id))
      await ensureDir(outputDir)

      const browser = await chromium.launch({ headless: true })
      const context = await browser.newContext({ viewport: { width: 1280, height: 800 } })
      const page = await context.newPage()

      try {
        await page.goto(analysis.normalizedUrl || analysis.url, { waitUntil: 'networkidle', timeout: 60000 })
        const pageTitle = await page.title()
        const finalUrl = page.url()

        const { buttons, links } = await page.evaluate(() => {
          const visible = (el: Element) => {
            const r = el.getBoundingClientRect()
            return r.width > 0 && r.height > 0
          }
          const btns = Array.from(document.querySelectorAll('button, input[type="button"], input[type="submit"], [role="button"]'))
            .filter(visible).map((el) => (el.textContent || '').trim()).filter(Boolean).slice(0, 20)
          const lks = Array.from(document.querySelectorAll('a')).filter(visible).map((el) => (el.textContent || '').trim()).filter(Boolean).slice(0, 50)
          return { buttons: Array.from(new Set(btns)), links: Array.from(new Set(lks)) }
        })

        const screenshotPath = path.join(outputDir, `step-1-home.png`)
        await page.screenshot({ path: screenshotPath, type: 'png', fullPage: true })

        const s3res = await uploadToS3(screenshotPath, String(analysis.id), 1, 'home')

        const screenshotsJson = [
          {
            stepIndex: 1,
            label: 'home',
            filePath: path.relative(process.cwd(), screenshotPath),
            storage: 's3',
            s3Key: s3res.s3Key,
            url: s3res.url
          }
        ]

        const summaryJson = { pageTitle, finalUrl, buttons, links, timestamp: new Date().toISOString(), detectedPatterns: extractPatterns(pageTitle, buttons, links) }

        const userStories: string[] = []
        if (buttons.some(b => /sign up|signup|register/i.test(b))) userStories.push('- As a visitor, I want to sign up so I can create an account.')
        if (buttons.some(b => /login/i.test(b))) userStories.push('- As a user, I want to log in so I can access my dashboard.')
        if (userStories.length === 0) {
          userStories.push('- As a visitor, I want to understand the product offering so I can decide to try it.')
          if (links.length > 0) userStories.push('- As a visitor, I want to navigate to key pages (eg. ' + (links[0] || '...') + ')')
        }

        const payload = {
          summaryJson,
          productMapJson: { states: [{ id: 'home', url: finalUrl, title: pageTitle }], transitions: [] },
          flowsJson: {},
          apiMapJson: {},
          uxInsightsJson: {},
          userStoriesMd: userStories.join('\n'),
          flowsMd: '',
          prdMd: '',
          uxInsightsMd: '',
          screenshotsJson
        }

        await complete(String(analysis.id), payload)
        console.log('Completed analysis', analysis.id)
      } catch (err: any) {
        console.error('Error processing analysis', analysis.id, err?.message || err)
        try { await fail(String(analysis.id), String(err?.message || err)) } catch (e) { console.error('Fail report failed', e) }
      } finally {
        try { await page.close(); await context.close(); await browser.close() } catch (e) {}
      }
    } catch (err: any) {
      console.error('Worker loop error', err?.message || err)
      await sleep(POLL_MS)
    }
  }
}
