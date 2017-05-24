var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');
var Account = new Schema({

  name: {type: String, require: true},
  birthdate: Date,
  gender: String,
  suburb: String,
  postcode: {type: Number, require: true},
  range: {type: Number, default: 10},
  level: {type: String, require: true},
  activity: {type: String, require: true},
  photo: { data: Buffer, contentType: String }, 
  bio: String
 });

 Account.plugin(passportLocalMongoose, {
  usernameField: 'email'
});

module.exports = mongoose.model('Account', Account);
