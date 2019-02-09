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

const BETTINGTIME = 20000;
const SPINTIME = 20000;
const COLLECTIONTIME = 10000;


const rouleteState = {
    state: null,
    result: null,
    time: null,
};

const initGame = () => {
    rouleteState.result = 'betting'
    changeState('betting');
};

const wait = (time) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve()
        }, time);
    })
}
const changeState = async (state) => {
    if (state === 'betting') {
        console.log('BETTING')
        rouleteState.result = null;
        rouleteState.state = 'betting';
        io.emit('game', rouleteState);
        await wait(BETTINGTIME);
        changeState('spinning');
    }
    if (state === 'spinning') {
        rouleteState.state = 'spinning';
        rouleteState.result = Math.floor(Math.random() * 36) + 0;
        io.emit('game', rouleteState);
        await wait(SPINTIME)
        changeState('collection');
    }
    if (state === 'collection') {
        rouleteState.state = 'collection';
        rouleteState.result = null;
        io.emit('game', rouleteState);
        await wait(COLLECTIONTIME)
        changeState('betting');
    }
};

initGame();

// setInterval(function(){
//     rouleteState.time = new Date();
//     io.emit('game', rouleteState);
// }, 1000);

io.on('connection', socket => {
    console.log('User connected');
    io.emit('game', {
        state: 'pending',
        result: null,
        time: null,
    });
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

server.listen(port);
console.log('Magic happens at http://localhost:' + port);