require('../models/db');
var mongoose = require('mongoose');
var Conversation = mongoose.model('Conversation');
var mongodb = require('mongodb');
var mongoUrl = "mongodb://admin:password@ds133231.mlab.com:33231/agile-web-dev";

module.exports.getEmail = function(id){

  var MongoClient = mongodb.MongoClient;

  MongoClient.connect(mongoUrl, function (err, db) {
    if (err) {
      console.log(err);
    }
    else {
      console.log('(Read) Connection established to', mongoUrl);

      Account.findOne({ _id: id }, function(err, account) {
        return account.email;
      })
      }

  });
  }
});
