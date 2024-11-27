import express from 'express'
// import { requireAuth } from '../../middlewares/requireAuth.middleware.js'
import { log } from '../../middlewares/logger.middleware.js'
import { getCodes, getCodeById, addCode, updateCode, removeCode} from './code.controller.js'

const router = express.Router()

// We can add a middleware for the entire router:
// router.use(requireAuth)

router.get('/', log, getCodes)
router.get('/:id', getCodeById)
router.post('/', addCode)
router.put('/:id', updateCode)
router.delete('/:id', removeCode)
// router.delete('/:id', requireAuth, requireAdmin, removeCode)

export const codeRoutes = router
