const http = require('http');
const fs = require('fs');
const path = require('path');
const WebSocket = require('ws');

// HTTP sunucusu oluştur
const server = http.createServer((req, res) => {
    // index.html dosyasını sun
    if (req.method === 'GET' && req.url === '/') {
        fs.readFile(path.join(__dirname, 'index.html'), (err, data) => {
            if (err) {
                res.writeHead(500);
                res.end('Sunucu hatası');
                return;
            }
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);
        });
    } else {
        res.writeHead(404);
        res.end('Sayfa bulunamadı');
    }
});

// WebSocket sunucusu oluştur ve HTTP sunucusuna bağla
const wss = new WebSocket.Server({ server });

let users = [];
let readyUsers = 0;
let texts = [
    "Bu metni aynen yazmanız gerekiyor.",
    "Bir başka karmaşık metin örneği.",
    "Daha uzun ve zor bir metin parçası.",
    "Rastgele cümleler içeren bir test metni.",
    "Kodlamayı öğrenmek harika bir beceridir.",
    "Yapay zeka ile ilgili çalışmalar son yıllarda hızla artmaktadır. Birçok alanda devrim niteliğinde gelişmelere imza atılmıştır.",
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    "In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document.",
    "Bu cümleleri hızlı ve doğru şekilde yazabilmek için bol bol pratik yapmalısınız. Hız ve doğruluk önemli.",
    "Bilgisayar mühendisliği, yazılım geliştirme ve veri bilimi gibi alanlarda çalışmak isteyenler için algoritma bilgisi şarttır.",
    "İnsanlar genellikle bilgisayarlarla ilgili problemlerini hızlıca çözmek isterler. Bu yüzden kullanıcı dostu yazılımlar önemlidir.",
    "JavaScript, HTML ve CSS web geliştirme için temel teknolojilerdir.",
    "Python, veri bilimi ve makine öğrenmesi için popüler bir programlama dilidir.",
    "Algoritmalar ve veri yapıları, verimli yazılım geliştirme için hayati öneme sahiptir.",
    "Bilgisayarlar, büyük miktarda veriyi hızlıca işleyebilme kapasitesine sahiptir.",
    "Yapay zeka, sağlık, eğitim, ulaşım gibi birçok alanda devrim yaratmıştır.",
    "Veri analizi, büyük veri kümelerinden anlamlı bilgiler elde etmek için kullanılır.",
    "Bilgisayar ağları, dünya genelinde milyarlarca cihazı birbirine bağlar.",
    "Siber güvenlik, dijital dünyada veri ve sistemlerin korunmasını sağlar.",
    "Mobil uygulamalar, modern yaşamın vazgeçilmez bir parçası haline gelmiştir.",
    "Blockchain teknolojisi, güvenli ve merkezi olmayan işlemler sağlar.",
    "Oyun geliştirme, yaratıcı ve teknik becerilerin birleşimini gerektirir.",
    "Yapay zeka modelleri, büyük veri kümeleri üzerinde eğitilerek öğrenir.",
    "Büyük veri, karmaşık ve çok boyutlu veri kümelerinin işlenmesi için kullanılan bir terimdir.",
    "Veri görselleştirme, verilerin grafiksel temsillerle daha anlaşılır hale getirilmesini sağlar.",
    "Siber saldırılar, dijital sistemlere yönelik tehditlerin başında gelir.",
    "Makine öğrenmesi, bilgisayarların deneyimden öğrenmesini sağlar.",
    "Veritabanları, büyük miktarda verinin düzenli ve hızlı bir şekilde saklanmasını sağlar.",
    "Bulut bilişim, internet üzerinden çeşitli hizmetlere erişim sağlar.",
    "Bilgisayar grafikleri, görsel içeriklerin oluşturulması ve manipülasyonunu içerir.",
    "Robotik, fiziksel makinelerin tasarımı ve kontrolünü kapsar.",
    "Doğal dil işleme, bilgisayarların insan dilini anlamasını ve işlemesini sağlar.",
    "Yapay zeka algoritmaları, belirli görevleri otomatikleştirmek için kullanılır.",
    "Bilgisayarlar, karmaşık matematiksel hesaplamaları hızlıca yapabilir.",
    "Yapay sinir ağları, biyolojik sinir ağlarını taklit eden hesaplama modelleridir.",
    "Veri madenciliği, büyük veri kümelerinden gizli kalıpların keşfedilmesini sağlar.",
    "Bilgisayar güvenliği, sistemleri kötü amaçlı saldırılardan korur.",
    "Yapay zeka, günlük yaşamda birçok farklı alanda kullanılmaktadır.",
    "Veri bilimi, verileri analiz ederek değerli bilgiler elde etmeyi amaçlar.",
    "Yazılım mühendisliği, büyük ölçekli yazılım sistemlerinin tasarımı ve geliştirilmesini kapsar.",
    "Bilgisayar oyunları, eğlence ve eğitim amaçlı kullanılabilir.",
    "Veri analitiği, iş kararlarını desteklemek için verilerin incelenmesini içerir.",
    "Sanal gerçeklik, kullanıcıların dijital ortamlarla etkileşime girmesini sağlar.",
    "Bilgisayar donanımı, fiziksel bileşenlerin tasarımı ve üretimini içerir.",
    "Veri entegrasyonu, farklı kaynaklardan gelen verilerin birleştirilmesini sağlar.",
    "Yapay zeka etik kuralları, AI sistemlerinin sorumlu ve güvenli bir şekilde kullanılmasını sağlar.",
    "Bilgisayarlar, bilgi işlem gücü sayesinde karmaşık problemleri çözebilir.",
    "Veri gizliliği, kişisel bilgilerin korunmasını ve yetkisiz erişimlerin engellenmesini sağlar.",
    "Bilgisayar mühendisleri, yenilikçi çözümler geliştirerek teknolojiyi ileriye taşır."
];

function getRandomText() {
    return texts[Math.floor(Math.random() * texts.length)];
}

wss.on('connection', (socket) => {
    socket.on('message', (message) => {
        const data = JSON.parse(message);
        if (data.type === 'join') {
            socket.username = data.username;
            users.push({ username: data.username, progress: 0 });
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
        } else if (data.type === 'progress') {
            users = users.map(user => 
                user.username === data.username ? { ...user, progress: Math.floor(data.progress) } : user
            );
            broadcastProgress();
        } else if (data.type === 'finished') {
            broadcastWinner(data.username);
        } else if (data.type === 'newGame') {
            resetGame();
        }
    });

    socket.on('close', () => {
        if (socket.username) {
            users = users.filter(user => user.username !== socket.username);
            broadcastUserList();
            broadcastActivity(`${socket.username} sunucudan ayrıldı`);
            if (readyUsers > 0) readyUsers--;
        }
    });

    function broadcastUserList() {
        const userListMessage = JSON.stringify({ type: 'updateUsers', users: users.map(user => user.username) });
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(userListMessage);
            }
        });
    }

    function broadcastActivity(message) {
        const activityMessage = JSON.stringify({ type: 'activity', message: message });
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(activityMessage);
            }
        });
    }

    function broadcastStartCountdown() {
        const startCountdownMessage = JSON.stringify({ type: 'startCountdown' });
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(startCountdownMessage);
            }
        });
    }

    function broadcastRaceStart() {
        const raceStartMessage = JSON.stringify({ type: 'raceStart', text: getRandomText() });
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(raceStartMessage);
            }
        });
    }

    function broadcastProgress() {
        const progressMessage = JSON.stringify({ type: 'progress', users: users });
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(progressMessage);
            }
        });
    }

    function broadcastWinner(username) {
        const winnerMessage = JSON.stringify({ type: 'winner', username: username });
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(winnerMessage);
            }
        });
    }

    function resetGame() {
        readyUsers = 0;
        users = users.map(user => ({ ...user, progress: 0 }));
        broadcastActivity('Yeni oyun başlıyor...');
        const newGameMessage = JSON.stringify({ type: 'newGame' });
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(newGameMessage);
            }
        });
        broadcastUserList();  // Kullanıcı listesini yeniden yayınla
        broadcastProgress();  // Progress barları sıfırla
    }
});

server.listen(8080, () => {
    console.log('Sunucu çalışıyor: http://localhost:8080');
});
