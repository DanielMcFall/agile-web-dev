/* Socket.io */
var io = require('socket.io')();
var ctrlChat = require('./controllers/chat');

io.on('connection', function(socket){
  ctrlChat.connect(io, socket);
  socket.on('disconnect', ctrlChat.disconnect);
  socket.on('input', function(msg){
   ctrlChat.message(msg, io);
  });
  socket.on('update', function(id){
    ctrlChat.sendUpdate(id.id, io);
  })
});

module.exports = io;
