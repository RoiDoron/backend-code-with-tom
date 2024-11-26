import { codeService } from './code.service.js'
import { logger } from '../../services/logger.service.js'
import { socketService } from '../../services/socket.service.js'

export async function getCodes(req, res) {
    try {
        logger.debug('Getting codes:', req.query)
        const filterBy = {
            txt: req.query.txt || '',
            pageIdx: req.query.pageIdx
        }
        const codes = await codeService.query(filterBy)
        res.json(codes)
    } catch (err) {
        logger.error('Failed to get codes', err)
        res.status(400).send({ err: 'Failed to get codes' })
    }
}

export async function getCodeById(req, res) {
    try {
        const codeId = req.params.id
        const code = await codeService.getById(codeId)
        res.json(code)
    } catch (err) {
        logger.error('Failed to get code', err)
        res.status(400).send({ err: 'Failed to get code' })
    }
}

export async function addCode(req, res) {

    try {
        const code = req.body
        const addedCode = await codeService.add(code)
        res.json(addedCode)
    } catch (err) {
        logger.error('Failed to add code', err)
        res.status(400).send({ err: 'Failed to add code' })
    }
}


export async function updateCode(req, res) {
    const data = req.body
    try {
        const code = data.code
        const updatedCode = await codeService.update(code)
        socketService.broadcast({ type: 'code-edit', data: code, userId: data.socketId })
        res.json(updatedCode)
    } catch (err) {
        logger.error('Failed to update code', err)
        res.status(400).send({ err: 'Failed to update code' })

    }
}

export async function removeCode(req, res) {
    try {
        const codeId = req.params.id
        const removedId = await codeService.remove(codeId)
        res.send(removedId)
    } catch (err) {
        logger.error('Failed to remove code', err)
        res.status(400).send({ err: 'Failed to remove code' })
    }
}

export async function addCodeMsg(req, res) {
    try {
        const codeId = req.params.id
        const msg = {
            txt: req.body.txt,
            by: loggedinUser
        }
        const savedMsg = await codeService.addcodeMsg(codeId, msg)
        res.json(savedMsg)
    } catch (err) {
        logger.error('Failed to update code', err)
        res.status(400).send({ err: 'Failed to update code' })

    }
}

export async function removeCodeMsg(req, res) {
    try {
        const codeId = req.params.id
        const { msgId } = req.params

        const removedId = await codeService.removeCodeMsg(codeId, msgId)
        res.send(removedId)
    } catch (err) {
        logger.error('Failed to remove code msg', err)
        res.status(400).send({ err: 'Failed to remove code msg' })

    }
}


