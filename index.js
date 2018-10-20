const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const server = require('http').createServer(app);  
const io = require('socket.io')(server);
const port = process.env.PORT || 80;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static('public'));

io.on('connection', socket => {
    console.log('User connected')
    setInterval(function(){
        socket.emit('game', 1);
    }, 1000);
    socket.on('disconnect', () => {
        console.log('user disconnected')
    });
});

server.listen(port);
console.log('Magic happens at http://localhost:' + port);