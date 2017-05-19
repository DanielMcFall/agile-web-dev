var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var Account = new Schema({
  
});

Account.plugin(passportLocalMongoose, {
  usernameField: 'email'
});

module.exports = mongoose.model('Account', Account);
