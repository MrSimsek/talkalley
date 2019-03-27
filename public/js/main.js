$(function () {
    var socket = io();
    socket.emit('greeting', 'You are logged in.');

    $('form').submit(function(e){
        e.preventDefault();
        socket.emit('chat message', {
            user: $('#user').val(),
            message: $('#message').val()
        });
        $('#message').val('');
        return false;
    });
    $("#message").keypress(function() {
        socket.emit('typing', $('#user').val() + " is typing...");
    });

    socket.on('greeting', function(msg) {
        var li = document.createElement('li');
        var text = document.createTextNode(msg);
        li.classList.add('m-3', 'p-2', 'border');
        li.appendChild(text);
        $('#messages').append(li);
    });
    socket.on('typing', function(msg) {
        $('#status').text(msg);
    });
    socket.on('chat message', function(data) {
        var li = document.createElement('li');
        var userSpan = document.createElement('span');
        userSpan.classList.add('text-blue', 'font-bold');
        var userText = document.createTextNode(data.user + ': ');
        userSpan.appendChild(userText);

        var messageSpan = document.createElement('span');
        var messageText = document.createTextNode(data.message);
        messageSpan.appendChild(messageText);

        li.classList.add('m-3', 'p-2', 'pl-4', 'border', 'rounded-full');
        li.appendChild(userSpan);
        li.appendChild(messageSpan);
        $('#messages').append(li);
        $('#status').text('');
    });
    socket.on('disconnect', function(msg) {
        $('#messages').append($('<li>').text(msg));
    });
});