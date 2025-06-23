document.addEventListener('DOMContentLoaded', () => {
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');

    // Load API key from settings (assuming it's saved in localStorage)
    const openaiApiKey = 'AIzaSyDo4HyB7iZU6g2OXGiqa-V8K_sSN8J-Zv0';
    if (!openaiApiKey) {
        displayMessage('assistant', 'يرجى إدخال مفتاح OpenAI API الخاص بك في صفحة الإعدادات لاستخدام المساعد الذكي.', 'warning');
    }

    // Load chat history from localStorage (optional)
    loadChatHistory();

    sendButton.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    function displayMessage(sender, message, type = 'normal') {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', `${sender}-message`);
        if (type === 'warning') {
            messageElement.classList.add('warning-message');
            messageElement.innerHTML = `<p><i data-feather="alert-triangle"></i> ${message}</p>`;
        } else {
            messageElement.innerHTML = `<p>${message}</p><span class="message-time">${new Date().toLocaleTimeString()}</span>`;
        }
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight; // Auto-scroll to bottom
        feather.replace(); // Re-initialize feather icons for new elements
    }

    async function sendMessage() {
        const message = userInput.value.trim();
        if (!message) return;

        displayMessage('user', message);
        userInput.value = '';

        if (!openaiApiKey) {
            displayMessage('assistant', 'لا يمكن إرسال الرسالة: مفتاح OpenAI API غير موجود. يرجى إدخاله في الإعدادات.', 'warning');
            return;
        }

        // Save message to history (optional)
        saveMessageToHistory('user', message);

        try {
            displayMessage('assistant', 'جاري الكتابة...', 'typing'); // Show typing indicator
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${openaiApiKey}`
                },
                body: JSON.stringify({
                    model: 'gpt-3.5-turbo',
                    messages: [{ role: 'user', content: message }],
                    max_tokens: 150
                })
            });

            const data = await response.json();
            const assistantResponse = data.choices[0].message.content;
            
            // Remove typing indicator
            const typingIndicator = chatMessages.querySelector('.assistant-message.typing');
            if (typingIndicator) {
                typingIndicator.remove();
            }

            displayMessage('assistant', assistantResponse);
            saveMessageToHistory('assistant', assistantResponse);

        } catch (error) {
            console.error('Error communicating with OpenAI:', error);
            // Remove typing indicator
            const typingIndicator = chatMessages.querySelector('.assistant-message.typing');
            if (typingIndicator) {
                typingIndicator.remove();
            }
            displayMessage('assistant', 'حدث خطأ أثناء الاتصال بالمساعد الذكي. يرجى المحاولة مرة أخرى لاحقاً.', 'warning');
        }
    }

    function saveMessageToHistory(sender, message) {
        let history = JSON.parse(localStorage.getItem('chatHistory')) || [];
        history.push({ sender, message, timestamp: new Date().toISOString() });
        // Keep history size manageable, e.g., last 50 messages
        if (history.length > 50) {
            history = history.slice(history.length - 50);
        }
        localStorage.setItem('chatHistory', JSON.stringify(history));
    }

    function loadChatHistory() {
        const history = JSON.parse(localStorage.getItem('chatHistory')) || [];
        history.forEach(chat => {
            displayMessage(chat.sender, chat.message);
        });
    }

    // Initial Feather icons replacement
    feather.replace();

    // Dummy developer info (replace with actual data if dynamic)
    const developerAvatar = document.querySelector('.developer-avatar');
    const poweredByText = document.querySelector('.footer p');
    developerAvatar.src = 'https://via.placeholder.com/60/4A90E2/FFFFFF?text=MEEMX'; // Placeholder image
    poweredByText.textContent = 'Powered by MEEMX © 2023';
});