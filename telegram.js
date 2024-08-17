function onTelegramAuth(user) {
    // Получение данных пользователя из Telegram
    const userId = user.id;
    const username = user.username;
    const photoUrl = user.photo_url;

    // Добавление данных в URL
    const newUrl = `${window.location.pathname}?user_id=${userId}&username=${username}&photo_url=${photoUrl}`;
    window.history.pushState({}, '', newUrl);

    // Обновление информации о пользователе
    document.getElementById('user-name').textContent = username;
    document.getElementById('user-avatar').src = photoUrl;
}
