var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var Account = new Schema({
  name: {type: String},
  postcode: { type: Number},
  areaRange: { type: String},
  fitnessLevel: { type: String},
  fitnessActivity: { type: String},
  gender: { type: String },
  age: { type: Number },
  message: { type: String}
});

Account.plugin(passportLocalMongoose, {
  usernameField: 'email'
});

module.exports = mongoose.model('Account', Account);
