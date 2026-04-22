import { Router } from 'express'
import * as controller from '../controllers/analysesController'
import { validate } from '../middlewares/validation'
import { z } from 'zod'

const analysesRouter = Router()

const createSchema = z.object({ url: z.string().url() })
const statusSchema = z.object({ status: z.union([z.literal('queued'), z.literal('running'), z.literal('completed'), z.literal('failed')]) })

analysesRouter.post('/', validate(createSchema), controller.createAnalysis)
analysesRouter.get('/', controller.listAnalyses)
analysesRouter.get('/:id', controller.getAnalysis)
analysesRouter.delete('/:id', controller.deleteAnalysis)
analysesRouter.patch('/:id/status', validate(statusSchema), controller.updateStatus)

export default analysesRouter
