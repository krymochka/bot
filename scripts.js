<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Game App</title>
    <link rel="stylesheet" href="styles.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto:wght@900&display=swap">
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
</head>
<body>
    <div id="particles-js"></div>
    <div class="container mt-5">
        <!-- Main Page -->
        <div id="main-page" class="page active">
            <h1>Main Page</h1>
            <div class="info-box">
                <img id="user-avatar" src="" alt="User Avatar" class="avatar">
                <p id="user-name">Username</p>
                <p><span class="balance-icon">F</span> Balance: <span id="balance">0</span> coins</p>
            </div>
            <div class="game-box">
                <p>Lucky game</p>
                <p>🎟️: 1</p>
                <p>🎫: <span id="tickets">0</span></p>
                <button class="btn btn-primary btn-sm" onclick="showPage('lucky-game-page')">Play</button>
            </div>
        </div>

        <!-- Lucky Game Page -->
        <div id="lucky-game-page" class="page">
            <h1>Lucky Game</h1>
            <div id="tickets-container" class="d-flex flex-wrap justify-content-center">
                <!-- Билетики будут добавлены здесь с помощью JavaScript -->
            </div>
            <button class="btn btn-primary mt-3" onclick="startLuckyGame()">Start</button>
            <button class="btn btn-primary mt-3" onclick="showPage('main-page')">Exit</button>
        </div>

        <!-- Tasks Page -->
        <div id="tasks-page" class="page">
            <h1>Tasks Page</h1>
            <p>Here you can see and complete tasks to earn more tickets and coins.</p>
            <button class="btn btn-primary mt-3" onclick="confirmSubscription()">Subscribe to Telegram</button>
        </div>

        <!-- Referral Page -->
        <div id="referral-page" class="page">
            <h1>Referral Page</h1>
            <p>Invite friends and earn tickets and coins!</p>
            <div class="input-group">
                <input type="text" id="referral-link-display" class="form-control" readonly>
                <div class="input-group-append">
                    <button class="btn btn-primary" onclick="copyReferralLink()">Copy</button>
                    <button class="btn btn-primary" onclick="sendReferralLink()">Send</button>
                </div>
            </div>
        </div>

        <!-- Navigation Bar -->
        <div class="navbar fixed-bottom bg-dark d-flex justify-content-around">
            <button class="nav-button" id="main-link"><i class="fas fa-home"></i></button>
            <button class="nav-button" id="tasks-link"><i class="fas fa-tasks"></i></button>
            <button class="nav-button" id="referral-link"><i class="fas fa-user-friends"></i></button>
        </div>
    </div>
    <script src="https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js"></script>
    <script src="scripts.js"></script>
    <script>
        particlesJS.load('particles-js', 'particles.json', function() {
            console.log('particles.js loaded - callback');
        });

        // Parse URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const userId = urlParams.get('user_id');
        const username = urlParams.get('username');
        const photoUrl = urlParams.get('photo_url');

        // Set user information
        if (username) {
            document.getElementById('user-name').textContent = username;
        }
        if (photoUrl) {
            document.getElementById('user-avatar').src = photoUrl;
        }

        document.addEventListener('DOMContentLoaded', (event) => {
            document.getElementById('main-link').addEventListener('click', function() {
                showPage('main-page');
            });

            document.getElementById('tasks-link').addEventListener('click', function() {
                showPage('tasks-page');
            });

            document.getElementById('referral-link').addEventListener('click', function() {
                showPage('referral-page');
            });

            generateReferralLink();
        });

        function showPage(pageId) {
            const pages = document.querySelectorAll('.page');
            pages.forEach(page => {
                page.classList.remove('active');
            });
            document.getElementById(pageId).classList.add('active');
        }

        function confirmSubscription() {
            alert("Please confirm your subscription in the Telegram channel.");
            // Здесь должна быть логика для проверки подписки пользователя
            setTimeout(function() {
                alert("Subscription confirmed! You have earned 10 coins.");
                updateBalance(10);
            }, 5000);
        }

        function updateBalance(amount) {
            const balanceElement = document.getElementById('balance');
            let currentBalance = parseInt(balanceElement.innerText);
            balanceElement.innerText = currentBalance + amount;
        }

        function generateReferralLink() {
            const referralLink = `https://t.me/FixiCoin_Bot/app?startapp=ref_${userId}`;
            document.getElementById('referral-link-display').value = referralLink;
            // Логика для отображения рефералов
        }

        function copyReferralLink() {
            const referralLink = document.getElementById('referral-link-display');
            referralLink.select();
            referralLink.setSelectionRange(0, 99999); // Для мобильных устройств
            document.execCommand('copy');
            alert("Referral link copied to clipboard!");
        }

        function sendReferralLink() {
            const referralLink = document.getElementById('referral-link-display').value;
            const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(referralLink)}`;
            window.open(telegramUrl, '_blank'); // Открыть ссылку в новой вкладке
        }

        // Lucky Game Logic
        function startLuckyGame() {
            const ticketValues = [20, 20, 50, 50, 50, 50, 100, 100, 100, 300, 500, 1000];
            const shuffledValues = ticketValues.sort(() => Math.random() - 0.5);
            const ticketsContainer = document.getElementById('tickets-container');
            const balanceElement = document.getElementById('balance');
            let remainingTickets = shuffledValues.length;

            // Очистка контейнера
            ticketsContainer.innerHTML = '';

            // Создание билетиков
            shuffledValues.forEach(value => {
                const ticket = document.createElement('div');
                ticket.classList.add('ticket');
                ticket.innerHTML = '🎫';
                ticket.onclick = function() {
                    if (!ticket.classList.contains('revealed') && !ticket.classList.contains('disabled')) {
                        ticket.classList.add('revealed');
                        ticket.innerText = value;
                        // Обновить баланс
                        updateBalance(value);
                        remainingTickets--;

                        // Если все билетики выбраны, блокируем остальные
                        if (remainingTickets === 0) {
                            const allTickets = document.querySelectorAll('.ticket');
                            allTickets.forEach(t => {
                                if (!t.classList.contains('revealed')) {
                                    t.classList.add('disabled');
                                }
                            });
                        }
                    }
                };
                ticketsContainer.appendChild(ticket);
            });

            // Добавляем кнопку для выхода
            const exitButton = document.createElement('button');
            exitButton.textContent = 'Exit';
            exitButton.classList.add('btn', 'btn-primary', 'mt-3');
            exitButton.onclick = function() {
                showPage('main-page');
            };
            ticketsContainer.appendChild(exitButton);
        }
    </script>
</body>
</html>
