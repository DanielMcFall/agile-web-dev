//Adopted from code from Resource : https://www.youtube.com/watch?v=QISU14OrRbI

var inputArea = document.getElementById('new-message');
var outputArea = document.getElementById('chat-messages');

var socket = io();

if(socket !== undefined){

  console.log('Connection Succeed');
  //Listen for Output
  socket.on('output', function(data){
    if(data.length){
      //Loop through the results

      for(var x =0; x < data.length; x++){
        var message = document.createElement('div');
        message.setAttribute('class','chat-message');
        message.innerHTML = data[x].message;

        // Append
        messagesVar.appendChild(message);
        messagesVar.insertBefore(message, messagesVar.firstChild);
      }
    }
  });

  //Listen for keydown
  if(inputArea){
    inputArea.addEventListener('keydown', function(event){
        var self = this;

          if(event.which === 13){
            socket.emit('input', {
              message:self.value
            });
            self.value = '';
            event.preventDefault();
          }

    });
  }
}
