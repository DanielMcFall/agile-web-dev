require('../models/db');
var mongoose = require('mongoose');
var Conversation = mongoose.model('Conversation');
var mongodb = require('mongodb');
var mongoUrl = "mongodb://admin:password@ds133231.mlab.com:33231/agile-web-dev";
var Account = require('../models/account');
var geocoding = require('../public/js/geocoding.js');

//seperate js files
var datejs = require('../private/js/date');

//Other controllers
var ctrlChat = require('../controllers/chat')
var ctrlGeneral = require('../controllers/general')

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

module.exports.register = function(req, res){
    res.render('register', {title: 'Fitness Friends | Sign Up' });
}

module.exports.update = function(req, res){
  if(req.user){

    Account.update({ email: req.user.email },{
      name: req.body.name,
      birthdate: req.body.date,
      gender: req.body.gender,
      suburb: req.body.suburb,
      postcode: req.body.postcode,
      range: req.body.range,
      level: req.body.level,
      activity: req.body.activity,
      bio: req.body.bio,
      //latitude : req.body.latitude,
      //longitude : req.body.longitude
    },
    function(err, account) {
      if(err) {
        console.log(err);
        res.redirect('/');
      }

      console.log('user settings updated');
      res.redirect('/');
    });
  }
  else{
    res.redirect('/');
  }
}

module.exports.getPhoto = function(req, res) {
  console.log('photo id', req.params.id);

  Account.findOne({ _id: req.params.id }, function(err, account) {
    var photo = account && account.photo || {};
    console.log('photo =', photo);
    res.contentType(photo.contentType || 'text/plain');
    res.send(photo.data || '');
  })
}
