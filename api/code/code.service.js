import { dbService } from '../../services/db.service.js'
import { logger } from '../../services/logger.service.js'
import { utilService } from '../../services/util.service.js'
import mongodb from 'mongodb'
const { ObjectId } = mongodb

async function query() {
    try {
        const collection = await dbService.getCollection('code')

        const codes = await collection.find().toArray()
        return codes
    } catch (err) {
        logger.error('cannot find codes', err)
        throw err
    }
}

async function getById(codeId) {
    try {
        const collection = await dbService.getCollection('code')
        const code = collection.findOne({ _id: new ObjectId(codeId) })
        return code
    } catch (err) {
        logger.error(`while finding code ${codeId}`, err)
        throw err
    }
}

async function remove(codeId) {
    try {
        const collection = await dbService.getCollection('code')
        await collection.deleteOne({ _id: new ObjectId(codeId) })
        return codeId
    } catch (err) {
        logger.error(`cannot remove code ${codeId}`, err)
        throw err
    }
}

async function add(code) {
    try {
        const collection = await dbService.getCollection('code')
        await collection.insertOne(code)
        return code
    } catch (err) {
        logger.error('cannot insert code', err)
        throw err
    }
}

async function update(code) {
    try {
        const codeToSave = {
           studentCode : code.studentCode
        }
        const collection = await dbService.getCollection('code')
        await collection.updateOne({ _id: new ObjectId(code._id) }, { $set: codeToSave })
        return code
    } catch (err) {
        logger.error(`cannot update code ${code._id}`, err)
        throw err
    }
}

async function addCodeMsg(codeId, msg) {
    try {
        msg.id = utilService.makeId()
        const collection = await dbService.getCollection('code')
        await collection.updateOne({ _id: new ObjectId(codeId) }, { $push: { msgs: msg } })
        return msg
    } catch (err) {
        logger.error(`cannot add code msg ${codeId}`, err)
        throw err
    }
}

async function removeCodeMsg(codeId, msgId) {
    try {
        const collection = await dbService.getCollection('code')
        await collection.updateOne({ _id: new ObjectId(codeId) }, { $pull: { msgs: { id: msgId } } })
        return msgId
    } catch (err) {
        logger.error(`cannot add code msg ${codeId}`, err)
        throw err
    }
}

export const codeService = {
    remove,
    query,
    getById,
    add,
    update,
    addCodeMsg,
    removeCodeMsg
}
