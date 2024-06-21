<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Yarışma</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            background-color: #f0f0f0;
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: flex-start;
            min-height: 100vh;
            margin: 0;
            padding: 20px;
        }
        #leftPane, #rightPane {
            flex: 1;
            padding: 20px;
        }
        #leftPane {
            display: flex;
            flex-direction: column;
            align-items: center;
            max-width: 300px;
        }
        #rightPane {
            display: flex;
            flex-direction: column;
            align-items: center;
            max-width: 600px;
        }
        h1, h2 {
            color: #333;
        }
        #userList, #activityList {
            list-style-type: none;
            padding: 0;
            margin: 10px 0;
            width: 100%;
            max-height: 200px;
            overflow-y: auto;
            background-color: #fff;
            border-radius: 5px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        #userList li, #activityList li {
            padding: 10px;
            margin: 5px;
            border-bottom: 1px solid #ccc;
        }
        #timer {
            font-size: 72px;
            text-align: center;
            margin: 20px 0;
            color: #333;
        }
        #textToType {
            margin: 20px 0;
            padding: 15px;
            background-color: #fff;
            border: 1px solid #ccc;
            border-radius: 5px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            text-align: left;
            width: 100%;
            max-width: 600px;
            min-height: 60px;
            display: none;
        }
        .correct {
            color: green;
        }
        .incorrect {
            color: red;
        }
        #typingArea {
            margin: 20px 0;
            width: 100%;
            max-width: 600px;
            display: none;
        }
        textarea {
            width: 100%;
            height: 100px;
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 5px;
            font-size: 16px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        button {
            background-color: #007BFF;
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
            transition: background-color 0.3s;
        }
        button:hover {
            background-color: #0056b3;
        }
        #result {
            display: none;
            padding: 20px;
            margin-top: 20px;
            border-radius: 5px;
            font-size: 18px;
            text-align: center;
            width: 100%;
            max-width: 600px;
        }
        .winner {
            background-color: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
        }
        .loser {
            background-color: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
        }
        #newGameButton {
            display: none;
            margin-top: 20px;
        }
    </style>
    <script>
        let socket;
        let username = prompt("Kullanıcı adınızı girin:");
        let readyUsers = 0;
        let requiredText = "";

        if (username.trim() === '') {
            alert('Lütfen geçerli bir kullanıcı adı girin.');
            window.location.reload();
        }

        window.onload = function () {
            socket = new WebSocket('ws://' + window.location.host);

            socket.onopen = function () {
                console.log('Bağlantı kuruldu.');
                socket.send(JSON.stringify({ type: 'join', username: username }));
            };

            socket.onmessage = function (event) {
                const data = JSON.parse(event.data);
                if (data.type === 'updateUsers') {
                    const userList = document.getElementById('userList');
                    userList.innerHTML = '';
                    data.users.forEach(user => {
                        const li = document.createElement('li');
                        li.textContent = user;
                        userList.appendChild(li);
                    });
                } else if (data.type === 'activity') {
                    const activityList = document.getElementById('activityList');
                    const li = document.createElement('li');
                    li.textContent = data.message;
                    activityList.appendChild(li);
                } else if (data.type === 'startCountdown') {
                    startCountdown();
                } else if (data.type === 'raceStart') {
                    startRace(data.text);
                } else if (data.type === 'winner') {
                    showResult(data.username);
                } else if (data.type === 'newGame') {
                    resetGame();
                }
            };

            socket.onclose = function () {
                console.log('Bağlantı kapandı.');
            };
        }

        function ready() {
            socket.send(JSON.stringify({ type: 'ready' }));
        }

        function startCountdown() {
            document.getElementById('readyButton').style.display = 'none';
            let countdown = 5;
            const timerElement = document.getElementById('timer');
            timerElement.style.display = 'block';
            const interval = setInterval(() => {
                timerElement.textContent = countdown;
                countdown--;
                if (countdown < 0) {
                    clearInterval(interval);
                    socket.send(JSON.stringify({ type: 'raceStart' }));
                }
            }, 1000);
        }

        function startRace(text) {
            requiredText = text;
            document.getElementById('timer').style.display = 'none';
            document.getElementById('textToType').innerHTML = getFormattedText(requiredText, '');
            document.getElementById('textToType').style.display = 'block';
            document.getElementById('typingArea').style.display = 'block';
        }

        function checkText() {
            const typedText = document.getElementById('typedText').value;
            document.getElementById('textToType').innerHTML = getFormattedText(requiredText, typedText);
            if (typedText === requiredText) {
                socket.send(JSON.stringify({ type: 'finished', username: username }));
            }
        }

        function getFormattedText(reference, input) {
            let formattedText = '';
            for (let i = 0; i < reference.length; i++) {
                if (i < input.length) {
                    if (reference[i] === input[i]) {
                        formattedText += `<span class="correct">${reference[i]}</span>`;
                    } else {
                        formattedText += `<span class="incorrect">${reference[i]}</span>`;
                    }
                } else {
                    formattedText += `<span>${reference[i]}</span>`;
                }
            }
            return formattedText;
        }

        function showResult(winner) {
            const resultElement = document.getElementById('result');
            if (winner === username) {
                resultElement.className = 'winner';
                resultElement.textContent = `Tebrikler ${winner}, siz kazandınız!`;
            } else {
                resultElement.className = 'loser';
                resultElement.textContent = `Üzgünüm, ${winner} kazandı.`;
            }
            resultElement.style.display = 'block';
            document.getElementById('textToType').style.display = 'none';
            document.getElementById('typingArea').style.display = 'none';
            document.getElementById('newGameButton').style.display = 'block';
        }

        function resetGame() {
            document.getElementById('result').style.display = 'none';
            document.getElementById('newGameButton').style.display = 'none';
            document.getElementById('readyButton').style.display = 'block';
            document.getElementById('typedText').value = '';
            document.getElementById('textToType').style.display = 'none';
            document.getElementById('typingArea').style.display = 'none';
        }

        function newGame() {
            socket.send(JSON.stringify({ type: 'newGame' }));
        }
    </script>
</head>
<body>
    <div id="leftPane">
        <h2>Bağlı Kullanıcılar</h2>
        <ul id="userList"></ul>

        <h2>Hareket Listesi</h2>
        <ul id="activityList"></ul>
    </div>

    <div id="rightPane">
        <h1>Yarışma</h1>
        <button id="readyButton" onclick="ready()">Hazırım</button>
        <div id="timer"></div>

        <div id="textToType"></div>
        <div id="typingArea">
            <textarea id="typedText" rows="5" cols="50" oninput="checkText()"></textarea>
        </div>
        <div id="result"></div>
        <button id="newGameButton" onclick="newGame()">Yeni Oyun</button>
    </div>
</body>
</html>
