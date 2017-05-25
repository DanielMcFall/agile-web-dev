//modified from example in lecture 16:Sockets
require('../models/db');
var mongoose = require('mongoose');
var Conversation = mongoose.model('Conversation');
var mongodb = require('mongodb');
var mongoUrl = "mongodb://admin:password@ds133231.mlab.com:33231/agile-web-dev";

module.exports.connect = function(socket){
  console.log('User connected');
}

module.exports.disconnect = function(){
  console.log('User Disconnected');
}

module.exports.message = function(msg, io){
  console.log('Received input!' + msg);
  id = msg.id;
  var message = {name: msg.email, message:msg.message, time: new Date()};

  var whitespacePattern = /^\s*$/;

  if(whitespacePattern.test(message)){
    //don't do anything if it's just whitespace
  }else{
    var MongoClient = mongodb.MongoClient;

    MongoClient.connect(mongoUrl, function (err, db) {
      if (err) {
        console.log(err);
      }
      else {
        console.log('(Write) Connection established to', mongoUrl);

        db.conversations.update(
          {_id : id},
          {$push: {messages : message}}
        )

        db.close();

      }
    });

    io.emit('output', message);
  }
}

module.exports.sendUpdate = function(id, io){

  var MongoClient = mongodb.MongoClient;

  MongoClient.connect(mongoUrl, function (err, db) {
    if (err) {
      console.log(err);
    }
    else {
      console.log('(Read) Connection established to', mongoUrl);

      var collection = db.collection('conversations');

      //Get array of messages
      var messages = collection.find({'_id' : id}).messages;
      db.close();

      //only send last 20 messages
      if(messages.length > 21){
        messages = messages.slice(messages.length - 20);
      }

      io.emit('output', messages);
    }
  });
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
