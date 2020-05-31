const express = require('express');
const env = require('dotenv').config()
const http = require('http');
const showdown = require('showdown');
const path = require('path');
const app = express();
const server = http.Server(app);
const io = require('socket.io')(server);
const converter = new showdown.Converter();
var md5 = require("blueimp-md5")
const mongoose = require('mongoose');
const Signup = require(path.join(__dirname, 'models/user.model.js'))
const UserModel = mongoose.model("users");
var mode = process.env.BLTMODE || "FULLSCREEN"
const modes = { "FULLSCREEN": "show.html", "LT": "showlt.html" }
const adminUser = md5(process.env.BLTUSER)
const adminPass = md5(process.env.BLTPASS)

// Configuration

mongoose.connect(process.env.MONGOCONNSTR, { useNewUrlParser: true, useUnifiedTopology: true }, (error) => {
    if (error) {
        console.log("Error connecting to database");
        console.log(error)
    } else {
        console.log("Successfully connected to db!");
    }
});

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

    console.log(`[ server.js ] GET request to '/edit' => ${JSON.stringify(req.query)}`);

    const { user } = req.query;
    const { pass } = req.query;

    if (adminUser == user && adminPass == pass) {
        console.log(`User ${adminUser} logged in`)
        console.log(adminUser)
        console.log(adminPass)
        res.sendFile(path.join(__dirname, 'views/editor/edit.html'));
    } else {
        console.log(`Attempted logged in`)
        res.sendFile(path.join(__dirname, 'views/editor/login.html'));
    }

});

app.get('/edit/editor.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/editor/editor.js'));
});
app.get('/edit/editor.css', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/editor/editor.css'));
});
app.get('/edit/login.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/editor/login.js'));
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

app.get('/api/newUser', (req, res) => {
    // in progress
    console.log(`[ server.js ] GET request to 'api/newUser' => ${JSON.stringify(req.query)}`);

    const { user } = req.query;
    const { pass } = req.query;
    const { name } = req.query;
    var msg = "";

    let data = {
        email: user,
        password: pass,
        name: name
    }
    var instance = new UserModel(data)
    instance.save((err, doc) => {
        console.log("------------------")
        console.log(JSON.stringify(err));
        console.log("----------------------")
        console.log(JSON.stringify(req.body));
        console.log("----------------------")

        if (err) {
            msg = encodeURIComponent(err)
            res.sendFile(path.join(__dirname, `views/editor/login.html?msg=${msg}`));
        } else {
            msg = encodeURIComponent("You have been registered successfully! You may login.")
	    res.redirect(`/edit?msg=${msg}`)
        }
    })

    // make the user
    // redirect back to login page with status


});
