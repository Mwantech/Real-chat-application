document.addEventListener('DOMContentLoaded', () => {
    const userSection = document.getElementById('user-section');
    const chatSection = document.getElementById('chat-section');
    const backButton = document.createElement('button');
    const optionsIcon = document.querySelector('.options-icon');
    const optionsMenu = document.querySelector('.options-menu');
    const searchIcon = document.querySelector('.search-icon');
    const searchBar = document.querySelector('.search-bar');
    const attachmentButton = document.querySelector('.attachment-button');
    const attachmentOptions = document.querySelector('.attachment-options');
    let currentChatId = null;

    backButton.innerHTML = '<i class="fas fa-arrow-left"></i>';
    backButton.classList.add('back-button');
    backButton.style.display = 'none';
    chatSection.prepend(backButton);

    function loadUserList() {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', '../php/get_users.php', true);
        xhr.onload = function() {
            if (this.status === 200) {
                document.getElementById('user-list').innerHTML = this.responseText;
                const users = document.querySelectorAll('.user');
                users.forEach(user => {
                    user.addEventListener('click', () => {
                        const uniqueId = user.getAttribute('data-unique-id');
                        const userProfilePic = user.querySelector('.profile-pic').getAttribute('src');
                        
                        toggleDisplay(userSection, false);
                        toggleDisplay(chatSection, true);
                        toggleDisplay(backButton, true);

                        currentChatId = uniqueId;
                        chatSection.setAttribute('data-unique-id', uniqueId);
                        chatSection.querySelector('.chat-header .profile-pic').setAttribute('src', userProfilePic);
                        
                        loadChat(uniqueId);
                    });
                });
            }
        };
        xhr.send();
    }

    function loadChat(uniqueId) {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', `../php/get_chat.php?unique_id=${uniqueId}`, true);
        xhr.onload = function() {
            if (this.status === 200) {
                document.querySelector('.chat-area').innerHTML = this.responseText;
            }
        };
        xhr.send();
    }

    function checkForNewMessages() {
        if (currentChatId) {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', `../php/get_chat.php?unique_id=${currentChatId}`, true);
            xhr.onload = function() {
                if (this.status === 200) {
                    const chatArea = document.querySelector('.chat-area');
                    const newContent = this.responseText;

                    if (chatArea.innerHTML !== newContent) {
                        chatArea.innerHTML = newContent;
                    }
                }
            };
            xhr.send();
        }
    }

    function checkForNewUsers() {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', '../php/get_users.php', true);
        xhr.onload = function() {
            if (this.status === 200) {
                const userList = document.getElementById('user-list');
                const newContent = this.responseText;

                if (userList.innerHTML !== newContent) {
                    userList.innerHTML = newContent;
                    const users = document.querySelectorAll('.user');
                    users.forEach(user => {
                        user.addEventListener('click', () => {
                            const uniqueId = user.getAttribute('data-unique-id');
                            const userProfilePic = user.querySelector('.profile-pic').getAttribute('src');
                            
                            toggleDisplay(userSection, false);
                            toggleDisplay(chatSection, true);
                            toggleDisplay(backButton, true);

                            currentChatId = uniqueId;
                            chatSection.setAttribute('data-unique-id', uniqueId);
                            chatSection.querySelector('.chat-header .profile-pic').setAttribute('src', userProfilePic);
                            
                            loadChat(uniqueId);
                        });
                    });
                }
            }
        };
        xhr.send();
    }

    setInterval(checkForNewMessages, 3000); // Polling every 3 seconds
    setInterval(checkForNewUsers, 3000); // Polling every 3 seconds for users

    backButton.addEventListener('click', () => {
        toggleDisplay(chatSection, false);
        toggleDisplay(userSection, true);
        toggleDisplay(backButton, false);
        currentChatId = null;
    });

    optionsIcon.addEventListener('click', () => {
        toggleDisplay(optionsMenu, !optionsMenu.classList.contains('active'));
    });

    searchIcon.addEventListener('click', () => {
        toggleDisplay(searchBar, !searchBar.classList.contains('active'));
    });

    attachmentButton.addEventListener('click', () => {
        toggleDisplay(attachmentOptions, !attachmentOptions.classList.contains('active'));
    });

    document.addEventListener('click', (event) => {
        if (!event.target.closest('.options-icon') && !event.target.closest('.options-menu')) {
            optionsMenu.style.display = 'none';
        }
        if (!event.target.closest('.search-icon') && !event.target.matches('.search-bar')) {
            searchBar.style.display = 'none';
        }
        if (!event.target.closest('.attachment-button') && !event.target.closest('.attachment-options')) {
            attachmentOptions.style.display = 'none';
        }
    });

    searchBar.addEventListener('input', (event) => {
        const filter = event.target.value.trim().toLowerCase();
        const users = document.querySelectorAll('.user');
        users.forEach(user => {
            const username = user.querySelector('.username').textContent.trim().toLowerCase();
            user.style.display = username.includes(filter) ? '' : 'none';
        });
    });

    function toggleDisplay(element, show) {
        if (show) {
            element.style.display = 'block';
            element.classList.add('active');
        } else {
            element.style.display = 'none';
            element.classList.remove('active');
        }
    }

    loadUserList();
});
