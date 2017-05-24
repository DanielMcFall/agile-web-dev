var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var conversation = new Schema({

  user1 : String,
  user2: String,
  messages: [{
    user: String,
    time: Date,
    value: String
  }]
});

module.exports = mongoose.model('Conversation', conversation);
