var mongo = require("mongodb").MongoClient;
var client = require('socket.io').listen(8080).sockets;

mongo.connect('mongodb://admin:password@ds133231.mlab.com:33231/agile-web-dev', function(err, db){
	if(err) throw err;

	client.on('connection', function(socket){

		var col = db.collection('messages');

		//Display all the messages from Monogo DB
		col.find().limit(20).sort({_id: 1}).toArray(function(err, res){

			if(err) throw err;
			socket.emit('output', res);
		});

		//Wait for input
		socket.on('input', function(data){
			var message = data.message;

      //Regular Expression to identify the whitespace
			var whitespacePattern = /^\s*$/;

			if(whitespacePattern.test(message)){

			}else{
  			col.insert({name:name, message:message}, function(){
  				//Emit latest messages to all clients
  				client.emit('output', [data]);

  			});
			}
		});
	});
});
