document.addEventListener('DOMContentLoaded', () => {
    const chatSection = document.getElementById('chat-section');
    let lastMessageId = 0;
    let pollInterval;

    function loadChat(uniqueId) {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', `../php/get_chat.php?unique_id=${uniqueId}`, true);
        xhr.onload = function() {
            if (this.status === 200) {
                const chatArea = document.querySelector('.chat-area');
                chatArea.innerHTML = this.responseText;

                const messages = chatArea.querySelectorAll('.message');
                if (messages.length > 0) {
                    lastMessageId = messages[messages.length - 1].getAttribute('data-id');
                } else {
                    lastMessageId = 0; // Reset lastMessageId if no messages are loaded
                }

                // Clear and restart polling interval
                if (pollInterval) clearInterval(pollInterval);
                pollInterval = setInterval(pollNewMessages, 5000);
            }
        };
        xhr.send();
    }

    function pollNewMessages() {
        const chatUniqueId = chatSection.getAttribute('data-unique-id');
        const xhr = new XMLHttpRequest();
        xhr.open('GET', `../php/get_messages.php?chat_unique_id=${chatUniqueId}&last_message_id=${lastMessageId}`, true);
        xhr.onload = function() {
            if (this.status === 200) {
                const newMessages = JSON.parse(this.responseText);
                const chatArea = document.querySelector('.chat-area');

                newMessages.forEach(message => {
                    // Check if message with same ID already exists in chatArea
                    if (!chatArea.querySelector(`.message[data-id="${message.msg_id}"]`)) {
                        const messageElement = document.createElement('div');
                        messageElement.classList.add('message');
                        messageElement.classList.add(message.outgoing_msg_id == chatUniqueId ? 'received' : 'sent');
                        messageElement.setAttribute('data-id', message.msg_id);
                        messageElement.innerHTML = message.msg;
                        chatArea.appendChild(messageElement);
                        lastMessageId = message.msg_id;
                    }
                });
            }
        };
        xhr.send();
    }

    const users = document.querySelectorAll('.user');
    users.forEach(user => {
        user.addEventListener('click', () => {
            const uniqueId = user.getAttribute('data-unique-id');
            chatSection.setAttribute('data-unique-id', uniqueId);
            loadChat(uniqueId);
        });
    });

    const backButton = document.querySelector('.back-button');
    backButton.addEventListener('click', () => {
        if (pollInterval) clearInterval(pollInterval);
    });
});
