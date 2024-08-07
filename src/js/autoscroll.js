// autoScroll.js
document.addEventListener('DOMContentLoaded', () => {
    const resultElement = document.getElementById('result');
    const chatgptResultElement = document.getElementById('chatgptResponse');
    // Function to scroll to the bottom
    function scrollToBottom() {
        resultElement.scrollTop = resultElement.scrollHeight;
        chatgptResultElement.scrollTop = chatgptResultElement.scrollHeight
    }

    // Assuming content is appended dynamically, call scrollToBottom() after updates
    // For demonstration, assume the content is updated every second
    setInterval(() => {
        scrollToBottom();
        // chatgptResultElement();
    }, 1000);
});
