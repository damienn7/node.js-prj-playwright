import fs from 'fs/promises'
import path from 'path'
import { runPageAnalysis } from '../lib/playwright'
import * as repo from '../repositories/analysisRepository'

const OUTPUTS_DIR = path.join(process.cwd(), 'outputs')

const ensureDir = async (p: string) => {
  await fs.mkdir(p, { recursive: true })
}

const detectPatterns = (pageTitle: string, buttons: string[], links: string[]) => {
  const patterns: string[] = []
  const title = pageTitle.toLowerCase()
  if (title.includes('login') || buttons.some(b => /login/i.test(b))) patterns.push('login')
  if (buttons.some(b => /sign up|signup|register/i.test(b))) patterns.push('signup')
  if (links.some(l => /pricing/i.test(l))) patterns.push('pricing')
  if (title.includes('saas') || links.some(l => /docs|api/i.test(l))) patterns.push('product')
  if (patterns.length === 0) patterns.push('landing-page')
  return patterns
}

export const runAnalysis = async (analysisId: string, targetUrl: string) => {
  const startedAt = new Date()
  // mark running
  await repo.updateById(analysisId, { status: 'running', startedAt })

  const outputFolder = path.join(OUTPUTS_DIR, analysisId)
  await ensureDir(outputFolder)

  try {
    const res = await runPageAnalysis(targetUrl)

    // save screenshot
    const screenshotPath = path.join(outputFolder, `screenshot-0.png`)
    await fs.writeFile(screenshotPath, res.screenshotBuffer)

    const timestamp = new Date().toISOString()

    const summaryJson = {
      pageTitle: res.pageTitle,
      finalUrl: res.finalUrl,
      buttons: res.buttons,
      links: res.links,
      timestamp,
      detectedPatterns: detectPatterns(res.pageTitle, res.buttons, res.links)
    }

    const productMapJson = {
      states: [
        {
          id: 'home',
          url: res.finalUrl,
          title: res.pageTitle
        }
      ],
      transitions: []
    }

    const screenshotsJson = [
      {
        stepIndex: 0,
        label: 'home',
        filePath: path.relative(process.cwd(), screenshotPath)
      }
    ]

    const userStoriesMd = (() => {
      const stories: string[] = []
      if (res.buttons.some(b => /sign up|signup|register/i.test(b))) {
        stories.push('- As a visitor, I want to sign up so I can create an account.')
      }
      if (res.buttons.some(b => /login/i.test(b))) {
        stories.push('- As a user, I want to log in so I can access my dashboard.')
      }
      if (stories.length === 0) {
        stories.push('- As a visitor, I want to understand the product offering so I can decide to try it.')
        if (res.links.length > 0) stories.push('- As a visitor, I want to navigate to key pages (eg. ' + (res.links[0] || '...') + ')')
      }
      return stories.join('\n')
    })()

    const completedAt = new Date()
    const durationMs = completedAt.getTime() - startedAt.getTime()

    await repo.updateById(analysisId, {
      status: 'completed',
      summaryJson,
      productMapJson,
      screenshotsJson,
      userStoriesMd,
      completedAt,
      durationMs
    } as any)

    return true
  } catch (err: any) {
    const completedAt = new Date()
    const durationMs = completedAt.getTime() - startedAt.getTime()
    await repo.updateById(analysisId, { status: 'failed', errorMessage: String(err?.message || err), completedAt, durationMs } as any)
    return false
  }
}
