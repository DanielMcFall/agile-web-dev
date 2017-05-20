var express = require('express');
var router = express.Router();
var mongodb = require('mongodb');
var passport = require('passport');
var Account = require('../models/account');
var mongoUrl = "mongodb://admin:password@ds133231.mlab.com:33231/agile-web-dev";

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Fitness Friends', user: req.user});
});

//Temporary page to display registered users
router.get('/userlist', function(req, res){

  var MongoClient = mongodb.MongoClient;

  MongoClient.connect(mongoUrl, function (err, db) {
  if (err) {
    console.log(err);
  } else {
    console.log('(Read) Connection established to', mongoUrl);

    var collection = db.collection('accounts');

    // Return all users
    collection.find({}).toArray(function (err, result) {
      if (err) {
        console.log(err);
      } else if (result.length) {
        res.render('userlist',{
          // Pass back to Jade
          "userlist" : result
        });
      } else {
        res.send('No user documents found');
      }

      db.close();
    });
  }
  });
});

router.get('/register', function(req, res){
    res.render('register', {title: 'Fitness Friends | Sign Up' });
});

router.post('/register', function(req, res){
  Account.register(new Account({
    email : req.body.email,
    name: req.body.name,
    birthdate: req.body.date,
    gender: req.body.gender,
    suburb: req.body.suburb,
    postcode: req.body.postcode,
    range: req.body.range,
    level: req.body.level,
    activity: req.body.activity,
    bio: req.body.bio }), 
  req.body.password, function(err, account) {
    if(err) {
      return res.render('register', { title: 'Fitness Friends | Sign Up', error: err.message });
    }

    console.log('user registered!');

    res.redirect('userlist');
  });
});

router.post('/login', passport.authenticate('local'), function(req, res) {
    res.redirect('/');
});

router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

//updating index.js to load about, algorithm, daniel, madeline, keyur, references, login menu(temp) pages
router.get('/about', function(req, res){
    res.render('about', {title:  '' });
});

router.get('/algorithm', function(req, res){
    res.render('algorithm', {title:  '' });
});

router.get('/daniel', function(req, res){
    res.render('daniel', {title:  '' });
});

router.get('/madeline', function(req, res){
    res.render('madeline', {title:  '' });
});

router.get('/keyur', function(req, res){
    res.render('keyur', {title:  '' });
});

router.get('/references', function(req, res){
    res.render('references', {title:  '' });
});

router.get('/menuLogin', function(req, res){
    res.render('menuLogin', {title:  '' });
});

module.exports = router;
