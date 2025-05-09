const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware to parse JSON body
app.use(express.json());

const staticPath = path.join(__dirname, '../static');
console.log('Serving static files from:', staticPath);
app.use(express.static(staticPath));

// Enable CORS
app.use(cors());

// File path for the messages data
const filePath = path.join(__dirname, 'messages.json');

// Helper function to load messages from the file
function loadMessages() {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                reject(err);
            } else {
                try {
                    const jsonData = JSON.parse(data);
                    resolve(jsonData);
                } catch (parseErr) {
                    reject(parseErr);
                }
            }
        });
    });
}

// Helper function to save messages to the file
function saveMessages(messages) {
    return new Promise((resolve, reject) => {
        const jsonData = JSON.stringify({ messages }, null, 2);
        fs.writeFile(filePath, jsonData, 'utf8', (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

// hello world example
app.get('/hello_world', (req, res) => {
    console.log("hello world")
    res.send('Hello, world!');
})  

// Get all messages
app.get('/messages', async (req, res) => {
    try {
        const data = await loadMessages();
        res.json(data);
    } catch (err) {
        console.error('Error reading messages:', err);
        res.status(500).json({ error: 'Error reading messages' });
    }
});

// Return the static HTML file on home path
app.get('/home', (req, res) => {
    const indexPath = path.join(__dirname, '../static/home.html');
    console.log('Root handler: resolved home.html path:', indexPath);
    fs.access(indexPath, fs.constants.F_OK, (err) => {
        if (err) {
            console.error('home.html does not exist at:', indexPath);
        } else {
            console.log('home.html found at:', indexPath);
        }
        res.sendFile(indexPath);
    });
});

// Return the static HTML file on deploy path
app.get('/deploy', (req, res) => {
    const indexPath = path.join(__dirname, '../static/deploy.html');
    console.log('Root handler: resolved deploy.html path:', indexPath);
    fs.access(indexPath, fs.constants.F_OK, (err) => {
        if (err) {
            console.error('deploy.html does not exist at:', indexPath);
        } else {
            console.log('deploy.html found at:', indexPath);
        }
        res.sendFile(indexPath);
    });
});

// Return the static HTML file on how-backend-works path
app.get('/how-backend-works', (req, res) => {
    const indexPath = path.join(__dirname, '../static/how-backend-works.html');
    console.log('Root handler: resolved how-backend-works.html path:', indexPath);
    fs.access(indexPath, fs.constants.F_OK, (err) => {
        if (err) {
            console.error('how-backend-works.html does not exist at:', indexPath);
        } else {
            console.log('how-backend-works.html found at:', indexPath);
        }
        res.sendFile(indexPath);
    });
});

// Return the static HTML file on info path
app.get('/info', (req, res) => {
    const indexPath = path.join(__dirname, '../static/info.html');
    console.log('Root handler: resolved info.html path:', indexPath);
    fs.access(indexPath, fs.constants.F_OK, (err) => {
        if (err) {
            console.error('info.html does not exist at:', indexPath);
        } else {
            console.log('info.html found at:', indexPath);
        }
        res.sendFile(indexPath);
    });
});

// Return the static HTML file on resources path
app.get('/resources', (req, res) => {
    const indexPath = path.join(__dirname, '../static/resources.html');
    console.log('Root handler: resolved resources.html path:', indexPath);
    fs.access(indexPath, fs.constants.F_OK, (err) => {
        if (err) {
            console.error('resources.html does not exist at:', indexPath);
        } else {
            console.log('resources.html found at:', indexPath);
        }
        res.sendFile(indexPath);
    });
});

// Return the static HTML file on start path
app.get('/start', (req, res) => {
    const indexPath = path.join(__dirname, '../static/start.html');
    console.log('Root handler: resolved start.html path:', indexPath);
    fs.access(indexPath, fs.constants.F_OK, (err) => {
        if (err) {
            console.error('start.html does not exist at:', indexPath);
        } else {
            console.log('start.html found at:', indexPath);
        }
        res.sendFile(indexPath);
    });
});
// Return the static HTML file on submit path
app.get('/submit', (req, res) => {
    const indexPath = path.join(__dirname, '../static/submit.html');
    console.log('Root handler: resolved submit.html path:', indexPath);
    fs.access(indexPath, fs.constants.F_OK, (err) => {
        if (err) {
            console.error('submit.html does not exist at:', indexPath);
        } else {
            console.log('submit.html found at:', indexPath);
        }
        res.sendFile(indexPath);
    });
});


// Add a new message
app.post('/messages', async (req, res) => {
    let { message, nickname } = req.body;

    if (!message || typeof message !== 'string') {
        return res.status(400).json({ error: 'Invalid message' });
    }

    // Default nickname to "Untitled" if missing or not a string
    if (!nickname || typeof nickname !== 'string' || nickname.trim() === '') {
        nickname = 'Untitled';
    }

    try {
        const data = await loadMessages();
        const messages = data.messages || [];

        // Ensure no more than 5 messages
        if (messages.length >= 5) {
            messages.shift(); // Remove the oldest message
        }

        // Add new message object
        messages.push({ nickname, message });

        await saveMessages(messages);
        res.json({ messages });
    } catch (err) {
        console.error('Error adding message:', err);
        res.status(500).json({ error: 'Error adding message' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
