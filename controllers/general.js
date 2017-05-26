require('../models/db');
var mongoose = require('mongoose');
var Conversation = mongoose.model('Conversation');
var mongodb = require('mongodb');
var mongoUrl = "mongodb://admin:password@ds133231.mlab.com:33231/agile-web-dev";
var Account = require('../models/account');
var geolib = require('geolib');
var geocoding = require('../public/js/geocoding.js');

//seperate js files
var datejs = require('../private/js/date');

//Other controllers
var ctrlChat = require('../controllers/chat')
var ctrlAccount = require('../controllers/account')

module.exports.getRegister = function(req, res){
    res.render('register', {title: 'Fitness Friends | Sign Up' });
}

module.exports.getIndex = function(req, res, next){
  if(req.user) {
    res.render('index', { title: 'Fitness Friends', user: req.user, age: datejs.calculateAge(req.user.birthdate)});
  }
  if(!req.user) res.render('index', { title: 'Fitness Friends'});
}

module.exports.getSettings = function(req, res, next) {
  if(req.user) res.render('settings', { title: 'Fitness Friends', user: req.user, age: req.user.date});
  if(!req.user) res.redirect('/');
}

module.exports.generateMatches = function(req, res) {

  var MongoClient = mongodb.MongoClient;

  MongoClient.connect(mongoUrl, function (err, db) {
  if (err) {
    console.log(err);
  } else {
    console.log('(Read) Connection established to', mongoUrl);

    var collection = db.collection('accounts');

    /*if range is less than distance between user's lat, lng
     and database user lat, lng
    */
    collection.find({ $and: [
        { 'level' : req.user.level},
        { 'activity': req.user.activity},
        { 'email': { $ne : req.user.email}},
        { 'range' : { $lt : (geolib.getDistance(
          { latitude: req.user.latitude, longitude: req.user.longitude},
          { latitude: -31.961310, longitude: 115.806648} ))/1000 }
        }
      ]
    }).toArray(function (err, result) {
      if (err) {
        console.log(err);
      } else if (result.length) {

        //filter based on location
        console.log( (geolib.getDistance({latitude : -31.984533 , longitude : 115.816075}, {latitude: -31.961310, longitude:115.806648}))/1000 +'km' );


        res.render('match', {
          // Pass back to Jade
          userlist : result,
          username : req.user.name,
          useremail : req.user.email,
          userid: req.user._id
        });
      } else {
        res.send('No user documents found');
      }

      db.close();
    });
  }
  });
}

module.exports.references = function(req, res){
    res.render('references', {title:  '' });
}

module.exports.keyur = function(req, res){
    res.render('keyur', {title:  '' });
}

module.exports.madeline = function(req, res){
    res.render('madeline', {title:  '' });
}

module.exports.daniel = function(req, res){
    res.render('daniel', {title:  '' });
}

module.exports.about = function(req, res){
    res.render('about', {title:  '' });
}

module.exports.testing = function(req, res){
    res.render('testing',{title: ''});
}

module.exports.algorithm = function(req, res){
    res.render('algorithm', {title:  '' });
}
