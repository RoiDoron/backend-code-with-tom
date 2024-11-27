import { log } from '../middlewares/logger.middleware.js'
import { logger } from './logger.service.js'
import { Server } from 'socket.io'

var gIo = null
var gUserCount = []
var instructor = ''
var mentorPosition = null

export function setupSocketAPI(server) {
    gIo = new Server(server, {
        cors: {
            origin: '*',
        }
    })
    gIo.on('connection', socket => {
        logger.info(`New connected socket [id: ${socket.id}]`)
        socket.emit('where-is-mentor', mentorPosition)
        socket.on('disconnect', function () {
            gUserCount.filter(id => id != socket.id)
            logger.info(`Socket disconnected [id: ${socket.id}]`)

        })

        socket.on('where-mentor', codeId => {
            mentorPosition = codeId
            broadcast({ type: 'where-is-mentor', data: codeId, userId: socket.id })

        })

        socket.on('leave-room', role => {
            console.log(role);

            if (role === 'instructor') {
                gUserCount = []
                instructor = ''
                mentorPosition = null
                broadcast({ type: 'mentor-leave', data: mentorPosition, userId: socket.id })
            } else if (role === 'student') {
                gUserCount = gUserCount.filter(id => id != socket.id)
                console.log(gUserCount);

                broadcast({ type: 'student-count', data: gUserCount.length, userId: socket.id })
            }

        })

        socket.on('my-current-role', role => {
            if (role === 'instructor' || role === 'student') return

            if (instructor === '') {
                role = 'instructor'
                instructor = socket.id
            } else {
                gUserCount.push(socket.id)
                role = 'student'
                socket.emit('student-count', gUserCount.length)
                broadcast({ type: 'student-count', data: gUserCount.length, userId: socket.id })
            }
            let data = {
                role,
                socketId: socket.id,
            }
            socket.emit('assignRole', data)

        })

    })
}

function emitTo({ type, data, label }) {
    if (label) gIo.to('watching:' + label.toString()).emit(type, data)
    else gIo.emit(type, data)
}

async function emitToUser({ type, data, userId }) {
    userId = userId.toString()
    const socket = await _getUserSocket(userId)

    if (socket) {
        logger.info(`Emiting event: ${type} to user: ${userId} socket [id: ${socket.id}]`)
        socket.emit(type, data)
    } else {
        logger.info(`No active socket for user: ${userId}`)
        // _printSockets()
    }
}

// If possible, send to all sockets BUT not the current socket 
// Optionally, broadcast to a room / to all
async function broadcast({ type, data, room = null, userId }) {
    userId = userId.toString()

    logger.info(`Broadcasting event: ${type}`)
    const excludedSocket = await _getUserSocket(userId)
    if (room && excludedSocket) {
        logger.info(`Broadcast to room ${room} excluding user: ${userId}`)
        excludedSocket.broadcast.to(room).emit(type, data)
    } else if (excludedSocket) {
        logger.info(`Broadcast to all excluding user: ${userId}`)
        excludedSocket.broadcast.emit(type, data)
    } else if (room) {
        logger.info(`Emit to room: ${room}`)
        gIo.to(room).emit(type, data)
    } else {
        logger.info(`Emit to all`)
        gIo.emit(type, data)
    }
}

async function _getUserSocket(userId) {
    const sockets = await _getAllSockets()
    const socket = sockets.find(s => s.userId === userId)
    return socket
}
async function _getAllSockets() {
    // return all Socket instances
    const sockets = await gIo.fetchSockets()
    return sockets
}

async function _printSockets() {
    const sockets = await _getAllSockets()
    console.log(`Sockets: (count: ${sockets.length}):`)
    sockets.forEach(_printSocket)
}
function _printSocket(socket) {
    console.log(`Socket - socketId: ${socket.id} userId: ${socket.userId}`)
}

export const socketService = {
    // set up the sockets service and define the API
    setupSocketAPI,
    // emit to everyone / everyone in a specific room (label)
    emitTo,
    // emit to a specific user (if currently active in system)
    emitToUser,
    // Send to all sockets BUT not the current socket - if found
    // (otherwise broadcast to a room / to all)
    broadcast,
}
