document.getElementById('send-button').addEventListener('click', sendMessage);
document.getElementById('user-input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

async function sendMessage() {
    const userInput = document.getElementById('user-input');
    const messageText = userInput.value.trim();
    
    if (messageText === "") return;

    // 1. عرض رسالة المستخدم
    displayMessage(messageText, 'user');
    userInput.value = ''; // مسح مربع الإدخال

    // 2. إرسال الرسالة إلى الواجهة الخلفية
    try {
        const response = await fetch('http://localhost:3000/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: messageText }),
        });

        const data = await response.json();
        
        // 3. عرض رد الروبوت
        if (data.response) {
            displayMessage(data.response, 'bot');
        } else if (data.error) {
            displayMessage(`Error: ${data.error}`, 'bot');
        }

    } catch (error) {
        console.error('Fetch Error:', error);
        displayMessage('Connection error. Could not reach the server.', 'bot');
    }
}

function displayMessage(text, sender) {
    const messagesDiv = document.getElementById('messages');
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message', sender);
    msgDiv.textContent = text;
    messagesDiv.appendChild(msgDiv);
    // التمرير للأسفل لرؤية أحدث رسالة
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}