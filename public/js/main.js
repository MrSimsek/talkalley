$(function () {

    $('#chat').hide();

    $("form").submit(function(event){
        event.preventDefault();
    });

    $('#login-form').submit(function(event) {
        var nickname = $('#nickname').val();
        if(nickname !== "") {
            window.nickname = nickname;
            socket.emit('set-nickname', nickname);
            $('#login').detach();
            $('#chat').show();
            $('#message').focus();
        }
    });

    var socket = io();
    socket.emit('greeting');

    $('#chat-form').submit(function(e){
        socket.emit('chat message', $('#message').val());

        var li = document.createElement('li');

        var userSpan = document.createElement('span');
        userSpan.classList.add('text-blue', 'font-bold');
        var userText = document.createTextNode(window.nickname + ': ');
        userSpan.appendChild(userText);

        var messageSpan = document.createElement('span');
        var messageText = document.createTextNode($('#message').val());
        messageSpan.appendChild(messageText);

        li.classList.add('m-3', 'p-2', 'pr-4', 'border', 'rounded-full', 'text-right');
        li.appendChild(userSpan);
        li.appendChild(messageSpan);
        $('#messages').append(li);
        $('#status').text('');

        $('#message').val('');
        return false;
    });
    $("#message").keypress(function() {
        // when client types append the status immediately 
        $('#status').text(window.nickname + " is typing...");
        // then send typing event to other clients
        socket.emit('typing', window.nickname + " is typing...");
    });

    socket.on('greeting', function(msg) {
        var li = document.createElement('li');
        var text = document.createTextNode(msg);
        li.classList.add('m-3', 'p-2', 'text-green', 'text-center');
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
        window.scrollTo(0, document.body.scrollHeight);
    });
    socket.on('disconnect', function(msg) {
        var li = document.createElement('li');
        var text = document.createTextNode(msg);
        li.classList.add('m-3', 'p-2', 'text-red', 'text-center');
        li.appendChild(text);
        $('#messages').append(li);
    });
});