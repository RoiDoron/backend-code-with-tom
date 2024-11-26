import express from 'express'
import { requireAuth } from '../../middlewares/requireAuth.middleware.js'
import { log } from '../../middlewares/logger.middleware.js'
import { getCodes, getCodeById, addCode, updateCode, removeCode, addCodeMsg, removeCodeMsg } from './code.controller.js'

const router = express.Router()

// We can add a middleware for the entire router:
// router.use(requireAuth)

router.get('/', log, getCodes)
router.get('/:id', getCodeById)
router.post('/', addCode)
router.put('/:id', updateCode)
router.delete('/:id', requireAuth, removeCode)
// router.delete('/:id', requireAuth, requireAdmin, removeCode)

router.post('/:id/msg', requireAuth, addCodeMsg)
router.delete('/:id/msg/:msgId', requireAuth, removeCodeMsg)

export const codeRoutes = router
