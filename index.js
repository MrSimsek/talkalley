var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static('public'));

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

// SocketIO
io.on('connection', function(socket){
    socket.on('disconnect', function(){
        io.emit('disconnect', 'A user disconnected.');
    });
    socket.on('chat message', function(data){
        io.emit('chat message', data);
    });
    socket.on('greeting', function(msg){
        io.emit('greeting', msg);
    });
    socket.on('typing', function(msg){
        io.emit('typing', msg);
    });
});

http.listen(3000, function(){
    console.log('listening on *:3000');
});