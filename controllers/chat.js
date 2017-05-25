//modified from example in lecture 16:Sockets
require('../models/db');
var mongoose = require('mongoose');
var Conversation = mongoose.model('Conversation');
var mongodb = require('mongodb');
var mongoUrl = "mongodb://admin:password@ds133231.mlab.com:33231/agile-web-dev";

module.exports.connect = function(socket){
  console.log('User connected');
  /*
  Conversation.find().sort({time:-1}).limit(10).exec(
    function(err, messages){
      if(err){
        res.render('error', {
          message:err.message,
          error:err
        })
      }
      else {
        console.log('last 10 messages');
        for(var i = messages.length - 1; i >= 0; i--){
          socket.emit('message', messages[i].message);
        }
      }
    });
  */
}

module.exports.disconnect = function(){
  console.log('User Disconnected');
}

module.exports.message = function(msg, io){
  console.log('Received input!' + msg);
  var message = {user: msg.email, message:msg.message, time: new Date()};
  /*
  message.save(function(err, data){
    if(err){
      console.log(err);
      res.status(500);
      res.render('error', {
        message:err.message,
        error:err
      });
    }
    else {
      console.log(data, 'message saved');
    }
  });
  */
  io.emit('output', msg);
}

module.exports.findConversation = function(user1, user2){
  var MongoClient = mongodb.MongoClient;

  MongoClient.connect(mongoUrl, function (err, db) {
    if (err) {
      console.log(err);
    }
    else {
      console.log('(Read) Connection established to', mongoUrl);

      var collection = db.collection('conversations');

      var id = collection.find($or [{ $and: [{'user1' : user1}, {'user2': user2} ] },{ $and: [{'user1' : user2}, {'user2': user1} ] } ])._id;

      db.close();

      if(id) return id;
      return null;
    }
  });
}

module.exports.createConversation = function(user1, user2){
  var MongoClient = mongodb.MongoClient;

  MongoClient.connect(mongoUrl, function (err, db) {
    if (err) {
      console.log(err);
    }
    else {
      console.log('(Read) Connection established to', mongoUrl);

      var conversations = db.collection('conversations');
      var newConversation = new Conversation({user1: user1, user2: user2});

      conversations.insert(newConversation, function(err){
       if (err) return;

       var id = newConversation._id;
      });

      db.accounts.update(
        {$or:[{email : user1}, {email : user2}]},
        {$push: {conversations : id}}
      )

    }
  });
}
