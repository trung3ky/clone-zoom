const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const { get } = require('http');
const { v4: uuidv4 } = require('uuid');

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', function(req, res, next) {
    res.redirect(`/${uuidv4()}`);
});

app.get('/:room', function(req, res, next) {
    res.render('room', { roomId: req.params.room });
});
//khi có client kết nối tới
io.on('connection', socket => {
    socket.on('join-room', function(roomId, userId) {
        socket.join(roomId);
        socket.to(roomId).broadcast.emit('user-connected', userId);
    });
});


var port = 3000;
server.listen(port, function() {
    console.log("server is listening on port: " + port);
});