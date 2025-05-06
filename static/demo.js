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
      const messagesContainer = document.getElementById('demo-messages-container');
      messagesContainer.innerHTML = '';
      data.messages.forEach(entry => {
        const messageElement = document.createElement('p');
        const nickname = entry.nickname || 'Untitled';
        messageElement.textContent = `${nickname}: ${entry.message}`;
        messagesContainer.appendChild(messageElement);
      });
    })
    .catch(error => {
      document.getElementById('demo-messages-container').innerHTML = '<p>Error loading messages.</p>';
      console.error('Error fetching messages:', error);
    });
}


document.getElementById('get-req-button').addEventListener('click', () => {
  console.log('getting messages');
  loadMessages();
});

document.getElementById('demo-message-form').addEventListener('submit', function (event) {
  event.preventDefault();

  const messageInput = document.getElementById('message');
  const feedbackElement = document.getElementById('post-feedback');
  let message = messageInput.value.trim();
  let nickname = 'orphy';

  // Basic XSS filter
  const xssPattern = /[<>]/;

  if (xssPattern.test(message)) {
    feedbackElement.textContent = 'Your message contains forbidden characters.';
    feedbackElement.style.color = 'red';
    return;
  }

  if (message !== '') {
    feedbackElement.textContent = 'Submitting...';
    feedbackElement.style.color = 'black';

    fetch('/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message, nickname }),
    })
      .then(response => response.json())
      .then(() => {
        messageInput.value = '';
        feedbackElement.textContent = 'Message submitted!';
        feedbackElement.style.color = 'green';
        setTimeout(() => {
          feedbackElement.textContent = '';
        }, 2000);
      })
      .catch(error => {
        console.error('Error submitting message:', error);
        feedbackElement.textContent = 'Error submitting message.';
        feedbackElement.style.color = 'red';
      });
  }
});




