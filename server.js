const express = require('express');
const env = require('dotenv').config()
const http = require('http');
const showdown = require('showdown');
const path = require('path');
const app = express();
const server = http.Server(app);
const io = require('socket.io')(server);
const converter = new showdown.Converter();
var mode = process.env.MODE || "FULLSCREEN"
const modes = { "FULLSCREEN": "show.html", "LT": "showlt.html" }

// Configuration

server.listen(process.env.PORT || 8000, () => {
    console.log(`[ server.js ] Listening on port ${server.address().port}`);
});

// Routes
app.get('/', (req, res) => {
    if (mode in modes) {
        res.sendFile(path.join(__dirname, 'views/', modes[mode]));
    } else {
        res.sendFile(path.join(__dirname, 'views/show.html'));
    }
});

app.get('/edit', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/editor/edit.html'));
});
app.get('/edit/script.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/editor/editor.js'));
});
app.get('/edit/editor.css', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/editor/editor.css'));
});

// Socket Events

io.on('connection', (socket) => {
    console.log(`[ server.js ] ${socket.id} connected in mode ${mode}`);
    socket.emit('slideModes', modes)
    socket.on('disconnect', () => {
        console.log(`[ server.js ] ${socket.id} disconnected`);
    });
});

function updateSlide(markdown) {
    io.emit('update slide', converter.makeHtml(markdown));
}

// API

app.get('/api/updateSlide', (req, res) => {
    console.log(`[ server.js ] GET request to 'api/updateSlide' => ${JSON.stringify(req.query)}`);

    const { markdown } = req.query;

    if (markdown) {
        updateSlide(markdown);
        res.status(200).send(`Received 'updateSlide' request with: ${markdown}\n`);
    } else {
        res.status(400).send('Invalid parameters.\n');
    }
});