import {WebSocketServer, WebSocket} from 'ws'
import {eventBus} from '../events/eventBus'

const wss = new WebSocketServer({port: 8080})

let clients: WebSocket[] = []

wss.on('connection', (socket) => {
    console.log('WS client connected')

    clients.push(socket)

    socket.on('close', () => {
        clients = clients.filter((x) => x !== socket)
    })
})

eventBus.on('task-event', (data) => {
    const message = JSON.stringify(data)

    clients.forEach((client) => {
        if(client.readyState === WebSocket.OPEN){
            client.send(message)
        }
    })
})

console.log('Web SocketServer running on 8080')