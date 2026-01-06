// Твой API ключ
const API_KEY = "AIzaSyDoYkGq5O0pur5b-2k5QZM8Yp_Z2E2mm_Q";

const sendBtn = document.getElementById('send-btn');
const userInput = document.getElementById('user-input');
const chatWindow = document.getElementById('chat-window');

// Функция для добавления сообщений в окно чата
function appendMessage(text, side) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message', side);
    msgDiv.innerText = text;
    chatWindow.appendChild(msgDiv);
    
    // Автопрокрутка вниз
    chatWindow.scrollTo({
        top: chatWindow.scrollHeight,
        behavior: 'smooth'
    });
}

// Главная функция запроса к Gemini
async function getPandiResponse(prompt) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;
    
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            contents: [{
                parts: [{
                    text: `Ты — нейросеть Панди. Твой характер: дружелюбный, милый, любишь бамбук. Отвечай кратко. Вопрос пользователя: ${prompt}`
                }]
            }]
        })
    });

    if (!response.ok) {
        const errorData = await response.json();
        console.error("Ошибка API:", errorData);
        throw new Error(errorData.error.message || "Ошибка сети");
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
}

// Обработчик нажатия кнопки
sendBtn.addEventListener('click', async () => {
    const message = userInput.value.trim();
    
    if (message === "") return;

    // Блокируем ввод на время ответа
    userInput.value = "";
    sendBtn.disabled = true;
    sendBtn.innerText = "...";

    // Показываем сообщение пользователя
    appendMessage(message, 'user');

    try {
        const aiResponse = await getPandiResponse(message);
        appendMessage(aiResponse, 'bot');
    } catch (error) {
        console.error(error);
        appendMessage("Упс! Панди не смогла ответить. Проверь VPN или API ключ.", 'bot');
    } finally {
        // Разблокируем ввод
        sendBtn.disabled = false;
        sendBtn.innerText = "Отправить";
    }
});

// Отправка по нажатию Enter
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendBtn.click();
    }
});