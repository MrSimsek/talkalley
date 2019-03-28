$(function () {

    $('#chat').hide();

    $("form").submit(function(event){
        event.preventDefault();
    });

    $('#login-form').submit(function(event) {
        var nickname = $('#nickname').val();
        var nicknameColor = getRandomColor();
        if(nickname !== "") {
            window.nickname = nickname;
            window.nicknameColor = nicknameColor;
            socket.emit('set-nickname', {
                nickname: nickname,
                nicknameColor: nicknameColor
            });
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
        userSpan.style.color = window.nicknameColor;

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
        userSpan.style.color = data.userColor;

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
    socket.on('update-people', function(people) {
        $('#people-online').html('');
        for(var index = 0; index < Object.values(people).length; index++) {
            var li = document.createElement('li');
            var text = document.createTextNode(Object.values(people)[index].nickname);
            li.classList.add('m-3', 'p-2', 'inline-block', 'font-bold', 'text-white', 'rounded-full');
            li.style.backgroundColor = Object.values(people)[index].nicknameColor;
            li.appendChild(text);
            $('#people-online').append(li);
        }
    });

    function getRandomColor() {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }
});