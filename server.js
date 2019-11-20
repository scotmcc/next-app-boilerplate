const http = require('http');
const express = require('express');
const socket = require('socket.io');
const next = require('next');

const app = express();
const server = http.createServer(app);
const io = socket(server);

const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const nextHandler = nextApp.getRequestHandler();

let i = 0;

function send (socket, message) {
    i = i + 1;
    socket.emit('now', {message: message});
    setTimeout(() => {
        send(socket, i);
    }, 3000);
}

function echo(socket, message) {
    socket.emit('echo', {message: message});
}

io.on('connect', socket => {
    send(socket, i);
    socket.on('message', data => {
        console.log('message', data);
    });
    socket.on('echo', data => {
        echo(socket, data.message);
    });
});

nextApp.prepare().then(() => {
    app.get('*', (req, res) => {
        return nextHandler(req, res);
    });
    server.listen(3000, (err) => {
        if (err) throw err;
        console.log(server.address());
        console.log(`> Ready on http://${server.address().address}:${server.address().port}`);
    });
});
