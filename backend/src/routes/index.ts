import { Router } from 'express'
import analysesRouter from './analyses'

const router = Router()

router.use('/analyses', analysesRouter)

export default router
