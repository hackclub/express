function loadMessages() {
  fetch('/messages',
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })
    .then(response => response.json())
    .then(data => {
      const messagesContainer = document.getElementById('messages-container');
      messagesContainer.innerHTML = '';
      data.messages.forEach(entry => {
        const messageElement = document.createElement('p');
        const nickname = entry.nickname || 'Untitled';
        messageElement.textContent = `${nickname}: ${entry.message}`;
        messagesContainer.appendChild(messageElement);
      });
    })
    .catch(error => {
      document.getElementById('messages-container').innerHTML = '<p>Error loading messages.</p>';
      console.error('Error fetching messages:', error);
    });
}

loadMessages();

document.addEventListener('DOMContentLoaded', () => {
  const savedNickname = localStorage.getItem('nickname');
  if (savedNickname) {
    document.getElementById('nickname').value = savedNickname;
  }
});

// Pre-fill nickname from local storage
document.addEventListener('DOMContentLoaded', () => {
  const savedNickname = localStorage.getItem('nickname');
  if (savedNickname) {
    document.getElementById('nickname').value = savedNickname;
  }
});

document.getElementById('message-form').addEventListener('submit', function (event) {
  event.preventDefault();

  const messageInput = document.getElementById('message');
  const nicknameInput = document.getElementById('nickname');

  let message = messageInput.value.trim();
  let nickname = nicknameInput.value.trim();

  if (!nickname) nickname = 'Untitled';

  // Save nickname to local storage
  localStorage.setItem('nickname', nickname);

  // Basic XSS filter: reject message if it contains script tags or angle brackets
  const xssPattern = /[<>]/;  // Optionally include other symbols like ["'`()] depending on your threat model

  if (xssPattern.test(message)) {
    alert('Your message contains forbidden characters.');
    return;
  }

  if (message !== '') {
    fetch('/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message, nickname }),
    })
      .then(response => response.json())
      .then(() => {
        loadMessages();
        messageInput.value = '';
      })
      .catch(error => {
        console.error('Error submitting message:', error);
      });
  }
});


