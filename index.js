var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var people = {};

app.use(express.static('public'));

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

// SocketIO
io.on('connect', function(socket) {
    socket.on('disconnect', function() {
        if(people[socket.id]) {
            io.emit('disconnect', people[socket.id] + ' disconnected.');
        }
    });
    // when 'chat message' event recieved
    socket.on('chat message', function(data) {
        // send data to all clients except sender
        socket.broadcast.emit('chat message', {
            user: people[socket.id],
            message: data
        });
    });
    socket.on('set-nickname', function(nickname) {
        people[socket.id] = nickname;
        socket.emit('greeting', 'Welcome to the chat!');
        socket.broadcast.emit('greeting', nickname + ' is connected!');
    });
    socket.on('typing', function(msg) {
        socket.broadcast.emit('typing', msg);
    });
});

http.listen(3000, function(){
    console.log('listening on *:3000');
});