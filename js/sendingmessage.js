document.addEventListener('DOMContentLoaded', () => {
    const sendButton = document.querySelector('.send-button');
    const messageInput = document.querySelector('.message-input');
    const chatSection = document.getElementById('chat-section');

    sendButton.addEventListener('click', sendMessage);
    messageInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            sendMessage();
        }
    });

    function sendMessage() {
        const message = messageInput.value.trim();
        if (message === '') return;

        const uniqueId = chatSection.getAttribute('data-unique-id');
        const xhr = new XMLHttpRequest();
        xhr.open('POST', '../php/send_message.php', true);
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xhr.onload = function() {
            if (this.status === 200) {
                messageInput.value = '';
                updateConversationList(uniqueId, message);
            }
        };
        xhr.send(`unique_id=${uniqueId}&message=${encodeURIComponent(message)}`);
    }

    function updateConversationList(uniqueId, message) {
        const user = document.querySelector(`.user[data-unique-id="${uniqueId}"]`);
        if (user) {
            const lastMessage = user.querySelector('.last-message');
            if (lastMessage) {
                lastMessage.textContent = message;
            } else {
                const lastMessageSpan = document.createElement('span');
                lastMessageSpan.classList.add('last-message');
                lastMessageSpan.textContent = message;
                user.appendChild(lastMessageSpan);
            }
        }
    }
});
