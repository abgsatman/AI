const WebSocket = require('ws');
const server = new WebSocket.Server({ port: 8080 });

let users = [];
let readyUsers = 0;
let texts = [
    "Bu metni aynen yazmanız gerekiyor.",
    "Bir başka karmaşık metin örneği.",
    "Daha uzun ve zor bir metin parçası.",
    "Rastgele cümleler içeren bir test metni.",
    "Kodlamayı öğrenmek harika bir beceridir."
];

function getRandomText() {
    return texts[Math.floor(Math.random() * texts.length)];
}

server.on('connection', (socket) => {
    socket.on('message', (message) => {
        const data = JSON.parse(message);
        if (data.type === 'join') {
            socket.username = data.username;
            users.push(data.username);
            broadcastUserList();
            broadcastActivity(`${data.username} sunucuya bağlandı`);
        } else if (data.type === 'ready') {
            readyUsers++;
            broadcastActivity(`${socket.username} yarışmaya hazır`);
            if (readyUsers === users.length) {
                broadcastStartCountdown();
            }
        } else if (data.type === 'raceStart') {
            broadcastRaceStart();
        } else if (data.type === 'finished') {
            broadcastWinner(data.username);
        } else if (data.type === 'newGame') {
            resetGame();
        }
    });

    socket.on('close', () => {
        if (socket.username) {
            users = users.filter(user => user !== socket.username);
            broadcastUserList();
            broadcastActivity(`${socket.username} sunucudan ayrıldı`);
            if (readyUsers > 0) readyUsers--;
        }
    });

    function broadcastUserList() {
        const userListMessage = JSON.stringify({ type: 'updateUsers', users: users });
        server.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(userListMessage);
            }
        });
    }

    function broadcastActivity(message) {
        const activityMessage = JSON.stringify({ type: 'activity', message: message });
        server.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(activityMessage);
            }
        });
    }

    function broadcastStartCountdown() {
        const startCountdownMessage = JSON.stringify({ type: 'startCountdown' });
        server.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(startCountdownMessage);
            }
        });
    }

    function broadcastRaceStart() {
        const raceStartMessage = JSON.stringify({ type: 'raceStart', text: getRandomText() });
        server.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(raceStartMessage);
            }
        });
    }

    function broadcastWinner(username) {
        const winnerMessage = JSON.stringify({ type: 'winner', username: username });
        server.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(winnerMessage);
            }
        });
    }

    function resetGame() {
        readyUsers = 0;
        broadcastActivity('Yeni oyun başlıyor...');
        const newGameMessage = JSON.stringify({ type: 'newGame' });
        server.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(newGameMessage);
            }
        });
    }
});

console.log('WebSocket sunucusu çalışıyor...');
