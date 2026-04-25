import { Router } from 'express'
import analysesRouter from './analyses'
import internalAnalysesRouter from './internalAnalyses'

const router = Router()

router.use('/analyses', analysesRouter)
router.use('/internal/analyses', internalAnalysesRouter)

export default router
