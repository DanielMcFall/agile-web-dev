require('../models/db');
var mongoose = require('mongoose');
var Conversation = mongoose.model('Conversation');
var mongodb = require('mongodb');
var mongoUrl = "mongodb://admin:password@ds133231.mlab.com:33231/agile-web-dev";

//Other controllers
var ctrlGeneral = require('../controllers/general')
var ctrlAccount = require('../controllers/account')

module.exports.connect = function(socket){
  console.log('User connected');
}

module.exports.disconnect = function(){
  console.log('User Disconnected');
}

module.exports.message = function(msg, io){
  console.log('Received input!' + msg.id + " " + msg.email);
  id = msg.id;
  var time = new Date();
  var whitespacePattern = /^\s*$/;

  if(whitespacePattern.test(msg.message)){
    //don't do anything if it's just whitespace
  }else{
    var MongoClient = mongodb.MongoClient;

    MongoClient.connect(mongoUrl, function (err, db) {
      if (err) {
        console.log(err);
      }
      else {
        console.log('(Write) Connection established to', mongoUrl);

        var conversations = db.collection('conversations');

        conversations.update(
          { id : id},
          {
            $push: {
              messages : {
                $each: [{ name: msg.email, message: msg.message, time: time }]
              }
            }
          }
        );

        db.close();

      }
    });
    var send = {name: msg.email, message: msg.message, time: time};
    io.emit('update', send);
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
      collection.find({id: id}, {_id: 0, messages: 1}).toArray(function (err, result) {
      if (err) {
        res.send(err);
      } else if (result.length) {

        var messages = result[0].messages;


        if(messages.length > 21){
          messages = messages.slice(messages.length - 20);
        }

        //output to socket
        io.emit('output', messages);
        db.close();
      }

  });
  }
});
}

module.exports.findConversation = function(user1, user2, cb){
  var MongoClient = mongodb.MongoClient;

  MongoClient.connect(mongoUrl, function (err, db) {
    if (err) {
      console.log(err);
    }
    else {
      console.log('(Read) Connection established to', mongoUrl);

      //var collection = db.collection('conversations');

      Conversation.findOne( {$or:
        [{ $and:
          [{'user1' : user1}, {'user2': user2} ]
        },{ $and:
          [{'user1' : user2}, {'user2': user1} ]
        }]}, function(err, conv) {
        if (err) {
          console.log(err);
        }
        else{
          db.close();
          if(conv)
            cb(conv._id);
          else cb(null);
        }
      });
    }
  });
}

module.exports.createConversation = function(user1, user2, cb){
  var MongoClient = mongodb.MongoClient;

  MongoClient.connect(mongoUrl, function (err, db) {
    if (err) {
      console.log(err);
    }
    else {
      console.log('Connected to DB, Adding conversation');

      var conversations = db.collection('conversations');
      var newConversation = new Conversation({user1: user1, user2: user2});
      newConversation.id = newConversation._id;

      conversations.insert(newConversation, function(err){
       if (err) console.log(err);

       var id = newConversation.id;
       console.log(id);
       var accounts = db.collection('accounts');
       accounts.update(
         {$or:[{'email' : user1}, {'email' : user2}]},
         {$push: {conversations : id}},
         { multi: true },
         function(req, res){
           cb();
         }
       );
      });
    }
  });
}

module.exports.getMessage = function(req, res){
  if(req.user) {

      var MongoClient = mongodb.MongoClient;

      MongoClient.connect(mongoUrl, function (err, db) {
        if (err) {
          console.log(err);
        }
        else {

          console.log('(Read) Connection established to', mongoUrl);

          var collection = db.collection('conversations');

          collection.find({ id: { $in: req.user.conversations }}).toArray(function (err, result) {
            if (err) {
              console.log(err);
              res.redirect('/')
            }
            else if (result.length) {

              db.close();
              console.log(result);
              var conversationArray = result;
              res.render('message', { title: 'Fitness Friends', user: req.user, conversations: result });
            }
          });
        }
      });
  }
  if(!req.user) res.redirect('/');
}

module.exports.initiateConversation = function(req, res){
  if(req.user) {
    var user1 = req.user.email;
    ctrlAccount.getEmail(req.params.id, function(resa){
      var user2 = resa;
      module.exports.findConversation(user1, user2, function(result){
        var convID = result;
        if(convID) {
          console.log('found existing conversation');
          res.redirect('/messages')
        }
        else {
          console.log('creating conversation: ' + user1 + " " + user2);
          module.exports.createConversation(user1, user2, function(){
            res.redirect('/messages');
          });
        }
      });
    });
  }
  if(!req.user) res.redirect('/');
}

module.exports.renderMessages = function(req, res){
  if(req.user) {

      var MongoClient = mongodb.MongoClient;

      MongoClient.connect(mongoUrl, function (err, db) {
        if (err) {
          console.log(err);
        }
        else {

          console.log('(Read) Connection established to', mongoUrl);

          var collection = db.collection('conversations');

          collection.find({ id: { $in: req.user.conversations }}).toArray(function (err, result) {
            console.log(result);
            if (err) {
              console.log(err);
              res.redirect('/');
            }
            else if (result.length) {

              db.close();
              res.render('message', { title: 'Fitness Friends', user: req.user, conversations: result });
            }
            else{
              res.render('message', { title: 'Fitness Friends', user: req.user});
            }
          });
        }
      });
  }
  if(!req.user) res.redirect('/');
 }
