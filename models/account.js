var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');
var Account = new Schema({

  name: {type: String, require: true},
  birthdate: {type: Date, require:true},
  gender: {type: String, require:true},
  suburb: {type: String, require: true},
  postcode: Number,
  range: {type: Number, default: 10},
  level: {type: String, require: true},
  activity: {type: String, require: true},
  photo: { data: Buffer, contentType: String },
  bio: String,
  conversations: [String],
  latitude : Number,
  longitude : Number
 });

 Account.plugin(passportLocalMongoose, {
  usernameField: 'email'
});

module.exports = mongoose.model('Account', Account);
