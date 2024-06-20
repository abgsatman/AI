const WebSocket = require('ws');
const http = require('http');

const server = http.createServer();
const wss = new WebSocket.Server({ server });

let users = [];
let readyUsers = [];
const sampleText = "Bu bir test metnidir.";

wss.on('connection', (ws) => {
    ws.on('message', (message) => {
        try {
            const parsedMessage = JSON.parse(message);

            if (parsedMessage.type === 'ready') {
                readyUsers.push(ws.username);
                if (readyUsers.length === users.length) {
                    broadcastSystemMessage("Tüm kullanıcılar hazır. Yarışma başlıyor!");
                    setTimeout(() => {
                        wss.clients.forEach((client) => {
                            if (client.readyState === WebSocket.OPEN) {
                                client.send(JSON.stringify({ type: 'start' }));
                            }
                        });
                    }, 1000);
                }
            } else if (parsedMessage.type === 'input') {
                if (parsedMessage.data === sampleText) {
                    broadcastResult(`${ws.username} yarışı kazandı!`);
                }
            }
        } catch (e) {
            // Gelen mesaj bir kullanıcı adı (string) ise buraya düşer
            const username = message.toString();
            ws.username = username;
            users.push(username);
            users = [...new Set(users)]; // Tekrarlanan kullanıcı adlarını önlemek için
            broadcastUsers();
            broadcastSystemMessage(`${username} sunucuya bağlandı`);
            ws.send(JSON.stringify({ type: 'text', data: sampleText }));
        }
    });

    ws.on('close', () => {
        if (ws.username) {
            users = users.filter(user => user !== ws.username);
            readyUsers = readyUsers.filter(user => user !== ws.username);
            broadcastUsers();
            broadcastSystemMessage(`${ws.username} sunucudan ayrıldı`);
        }
    });

    function broadcastUsers() {
        const userMessage = {
            type: 'users',
            data: users
        };
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(userMessage));
            }
        });
    }

    function broadcastSystemMessage(message) {
        const systemMessage = {
            type: 'system',
            data: message
        };
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(systemMessage));
            }
        });
    }

    function broadcastResult(resultMessage) {
        const result = {
            type: 'result',
            data: resultMessage
        };
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(result));
            }
        });
    }
});

server.listen(8080, () => {
    console.log('Sunucu 8080 portunda çalışıyor.');
});
