var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose-email');

var Account = new Schema({
  firstname: String,
  lastname: String,
  postcode: String,
  fitness: String,
  birthdate: Date
});

Account.plugin(passportLocalMongoose, {
  usernameField: 'email',
});

module.exports = mongoose.model('Account', Account);
