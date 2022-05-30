const ws = require('ws');

let messages = []

const wsServer = new ws.Server({
    port: 5000,
}, () => console.log(`Server started on 5000`))

wsServer.on('connection', (wsClient) => {
    wsClient.on('message', message => {
        let date = new Date();
        when = `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`
        time = `${date.getHours()}:${date.getMinutes()}`
        message = {...JSON.parse(message), when: when, time: time}

        switch (message.action) {
            case 'new_connection':
            case 'new_message':
                messages.push(message)
                if (messages.length > 50) messages.splice(0, 1)

                broadcast(message)
                break;
            case 'get_prev_messages':
                wsClient.send(JSON.stringify({last_msg: messages, action: 'get_prev_messages'}))
                break;
        }
    })
})

const broadcast = message => {
    wsServer.clients.forEach(wsClient => {
        wsClient.send(JSON.stringify(message))
    })
}