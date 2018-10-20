const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const http = require('http');
const server = http.createServer(app);  
const io = require('socket.io')(server);
const port = process.env.PORT || 80;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static('public'));

const BETTINGTIME = 5000;
const SPINTIME = 10000;
const COLLECTIONTIME = 5000;


const rouleteState = {
    state: null,
    result: null,
    time: null,
};

const initGame = () => {
    rouleteState.state = 'betting';
    changeState('betting');
};
const changeState = (state) => {
    if (rouleteState.state === 'betting') {
        rouleteState.result = null;
        rouleteState.time = new Date();
        io.emit('game', rouleteState);
        setTimeout(() => {
            rouleteState.state = 'spinning';
            rouleteState.time = new Date();
            io.emit('game', rouleteState);
            changeState('spinning');
        }, BETTINGTIME);
    }
    if (rouleteState.state === 'spinning') {
        setTimeout(() => {
            rouleteState.time = new Date();
            rouleteState.result = Math.random() * 10 + 10;
            rouleteState.timeTotal = Math.random() * 3 + 4 * 1000;
            io.emit('game', rouleteState);
            rouleteState.result = null;
            rouleteState.state = 'collection';
            changeState('collection');
        }, SPINTIME);
    }
    if (rouleteState.state === 'collection') {
        rouleteState.time = new Date();
        io.emit('game', rouleteState);
        setTimeout(() => {
            rouleteState.state = 'betting';
            changeState('betting');
        }, COLLECTIONTIME);
    }
};

initGame();

// setInterval(function(){
//     rouleteState.time = new Date();
//     io.emit('game', rouleteState);
// }, 1000);

io.on('connection', socket => {
    console.log('User connected');
    rouleteState.time = new Date();
    io.emit('game', rouleteState);
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

server.listen(port);
console.log('Magic happens at http://localhost:' + port);