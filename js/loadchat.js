function updateConversationList(uniqueId, message) {
    const user = document.querySelector(`.user[data-unique-id="${uniqueId}"]`);
    if (user) {
        const lastMessage = user.querySelector('.last-message');
        if (lastMessage) {
            lastMessage.textContent = message;
            lastMessage.classList.add('new-message'); // Add this line to apply the new-message class
        } else {
            const lastMessageSpan = document.createElement('span');
            lastMessageSpan.classList.add('last-message', 'new-message'); // Add new-message class here too
            lastMessageSpan.textContent = message;
            user.querySelector('.user-info').appendChild(lastMessageSpan);
        }
    }
}

// Ensure that loadUserList function removes the 'new-message' class for non-new messages
function loadUserList() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', '../php/get_users.php', true);
    xhr.onload = function() {
        if (this.status === 200) {
            document.getElementById('user-list').innerHTML = this.responseText;
            const users = document.querySelectorAll('.user');
            users.forEach(user => {
                const lastMessage = user.querySelector('.last-message');
                if (lastMessage && !lastMessage.textContent.includes('No messages yet')) {
                    lastMessage.classList.remove('new-message'); // Remove the new-message class for non-new messages
                }
                user.addEventListener('click', () => {
                    const uniqueId = user.getAttribute('data-unique-id');
                    const userProfilePic = user.querySelector('.profile-pic').getAttribute('src');
                    
                    toggleDisplay(userSection, false);
                    toggleDisplay(chatSection, true);
                    toggleDisplay(backButton, true);
    
                    chatSection.setAttribute('data-unique-id', uniqueId);
                    chatSection.querySelector('.chat-header .profile-pic').setAttribute('src', userProfilePic);
                    
                    loadChat(uniqueId);
                });
            });
        }
    };
    xhr.send();
}
