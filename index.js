const express = require("express");
const { readFileSync } = require('fs');
const babel = require('@babel/standalone');
const db = require("./backend/backend.js");

const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.use(require('morgan')('dev'));

let chatCode = babel.transform(
    readFileSync(require.resolve('./frontend/Chat.js'), { encoding: 'utf8' }),
    { presets: [['react', { pragma: 'h', pragmaFrag: 'Fragment' }], ['env', { modules: false }]] }
).code;

app.get('/', (_, res) => res.sendFile(require.resolve('./public/index.html')));
app.get('/index.js', (_, res) => res.type('.js').send(chatCode));
app.get('/bootstrap.min.css', (_, res) => res.sendFile(require.resolve('bootstrap/dist/css/bootstrap.min.css')));
app.get('/fontawesome.min.css', (_, res) => res.sendFile(require.resolve('@fortawesome/fontawesome-free/css/all.min.css')));

const chatUser = {};
const messages = {};

io.on('connection', socket => {
    let curUsername;

    socket.on('checkUsername', username => {
        if(chatUser[username]) return socket.emit('usernameTaken');

        chatUser[username] = socket;
        curUsername = username;
        socket.emit('usernameOK', username);
        if (!db.run("SELECT id FROM users WHERE name = '" + username + "'")) {
            db.run("INSERT INTO users (name) VALUES (?)", [username]);
        }
    });

    socket.on('chatMessage', message => {
        messages[curUsername] = message;
        io.emit('chatMessage', { sender: curUsername, message });
        query = db.run("SELECT id FROM users WHERE name = '" + messages[curUsername] + "'");
        console.log(query);
    });

});

server.listen(3000);
