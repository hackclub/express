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
  let nickname = 'orphy-bot';

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



function getAIResponse() {
  fetch("https://ai.hackclub.com/chat/completions", {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messages: [
        {
          role: "system",
          content: "Your response should be one sentence at maximum and be informative and understandable to a complete beginner. Don't respond with the following ideas: TOdo list app, weather API, user authentication system, specific products like mongoDB"
        },
        {
          role: "user",
          content: "generate 3 beginner Node.js/express projects"
        }
      ]
    })
  })
    .then(res => res.json())
    .then(data => {
      const reply = data.choices[0].message.content;
      document.getElementById('ai-response').textContent = reply;
    })
    .catch(err => {
      console.error("Error getting AI response:", err);
    });
}


document.getElementById('generate-ideas-button').addEventListener('click', () => {
  getAIResponse();
});

