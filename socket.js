/* Socket.io */
var io = require('socket.io')();

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });

  socket.on('input', function(msg){
   console.log('message: ' + msg);
 });

});

module.exports = io;
