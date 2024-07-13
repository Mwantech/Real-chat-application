function scrollToTop() {
    document.querySelector('.chat-area').scrollTo({ top: 0, behavior: 'smooth' });
}

function scrollToBottom() {
    document.querySelector('.chat-area').scrollTo({ top: document.querySelector('.chat-area').scrollHeight, behavior: 'smooth' });
}

document.addEventListener('DOMContentLoaded', () => {
    const chatArea = document.querySelector('.chat-area');
    const scrollUpButton = document.querySelector('.scroll-up');
    const scrollDownButton = document.querySelector('.scroll-down');

    chatArea.addEventListener('scroll', () => {
        if (chatArea.scrollTop > 50) {
            scrollUpButton.style.display = 'block';
        } else {
            scrollUpButton.style.display = 'none';
        }

        if (chatArea.scrollTop + chatArea.clientHeight < chatArea.scrollHeight - 50) {
            scrollDownButton.style.display = 'block';
        } else {
            scrollDownButton.style.display = 'none';
        }
    });

    scrollToBottom();
});
