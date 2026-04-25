import { Router } from 'express'
import * as controller from '../controllers/internalAnalysesController'
import { internalAuth } from '../middlewares/internalAuth'

const router = Router()

router.post('/claim', internalAuth, controller.claimAnalysis)
router.post('/:id/complete', internalAuth, controller.completeAnalysis)
router.post('/:id/fail', internalAuth, controller.failAnalysis)

export default router
