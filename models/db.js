var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Conversation = new Schema({

  id : String,
  user1 : String,
  user2 : String,
  messages: [{
    name: String,
    time: Date,
    message: String
  }]
});

module.exports = mongoose.model('Conversation', Conversation);
