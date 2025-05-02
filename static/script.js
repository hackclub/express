// script.js
function loadMessages() {
    fetch('/messages')
      .then(response => response.json())
      .then(data => {
        const messagesContainer = document.getElementById('messages-container');
        messagesContainer.innerHTML = '';
        data.messages.forEach(message => {
          const messageElement = document.createElement('p');
          messageElement.textContent = message;
          messagesContainer.appendChild(messageElement);
        });
      })
      .catch(error => {
        document.getElementById('messages-container').innerHTML = '<p>Error loading messages.</p>';
        console.error('Error fetching messages:', error);
      });
  }
  
  loadMessages();
  
  document.getElementById('message-form').addEventListener('submit', function (event) {
    event.preventDefault();
    const message = document.getElementById('message').value;
    if (message.trim() !== '') {
      fetch('/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      })
        .then(response => response.json())
        .then(() => {
          loadMessages();
          document.getElementById('message').value = '';
        })
        .catch(error => {
          console.error('Error submitting message:', error);
        });
    }
  });
  