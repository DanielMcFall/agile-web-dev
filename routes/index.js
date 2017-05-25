var express = require('express');
var router = express.Router();
var passport = require('passport');
var Account = require('../models/account');
var multer = require('multer');
var fs= require('fs');


//Mongo variables
var mongodb = require('mongodb');
var mongoUrl = "mongodb://admin:password@ds133231.mlab.com:33231/agile-web-dev";

//seperate js files
var datejs = require('../private/js/date');
var ctrlChat = require('../controllers/chat')

//user details variables
var userFitnessLevel = '';
var userFitnessActivity = '';
var userPostCode = '';
var userGender = '';
var userEmail = '';


/* GET home page. */
router.get('/', function(req, res, next) {
  if(req.user) {
    //save user values for matching algorithm
    userFitnessLevel = req.user.level;
    userFitnessActivity = req.user.activity;
    userPostCode = req.user.postcode;
    userGender = req.user.gender;
    userEmail = req.user.email;

    res.render('index', { title: 'Fitness Friends', user: req.user, age: datejs.calculateAge(req.user.birthdate)});

  }
  if(!req.user) res.render('index', { title: 'Fitness Friends'});
});

//Temporary page to display registered users
router.get('/listing', function(req, res) {

  var MongoClient = mongodb.MongoClient;

  MongoClient.connect(mongoUrl, function (err, db) {
  if (err) {
    console.log(err);
  } else {
    console.log('(Read) Connection established to', mongoUrl);

    var collection = db.collection('accounts');

    // Return beginner and sports users ..temp hard coded
    collection.find({ $and: [ {'level' : req.user.level}, {'activity': req.user.activity}, { 'email': { $ne : req.user.email} } ] }).toArray(function (err, result) {
      if (err) {
        console.log(err);
      } else if (result.length) {
//        console.log(result);

        res.render('listing', {
          // Pass back to Jade
          userlist : result,
          username : req.user.name,
           useremail : req.user.email
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

//multer
var upload = multer({ dest: './uploads/',
 rename: function (fieldname, filename) {
   return filename;
 },
});

router.post('/register', upload.single('photo'), function(req, res){

  Account.register( new Account ( {
    email : req.body.email,
    name: req.body.name,
    birthdate: req.body.date,
    gender: req.body.gender,
    suburb: req.body.suburb,
    postcode: req.body.postcode,
    range: req.body.range,
    level: req.body.level,
    activity: req.body.activity,
    bio: req.body.bio
    }),
  req.body.password, function(err, account) {
    if(err) {
      return res.render('register', { title: 'Fitness Friends | Sign Up', error: err.message });
    }

    // account.photo.data = fs.readFileSync(req.files.photo.path);
    // account.photo.contentType = 'image/png';
    // account.save();

    console.log('user registered!');

    passport.authenticate('local')(req, res, function () {
      res.redirect('listing', {username: req.user.name, useremail: req.user.email });
    });
  });
});

router.get('/settings', function(req, res, next) {
  if(req.user) res.render('profile', { title: 'Fitness Friends', user: req.user, age: req.user.date});
  if(!req.user) res.redirect('/');
});


router.post('/login', passport.authenticate('local'), function(req, res) {
    res.redirect('listing');
});

router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

router.get('/listing-detail/:userId', function (req, res) {
  // Look up the user Id in the database
  Account.findOne({ _id: req.params.userId }, function(err, account) {
    res.render('listing-detail', { matchUser: account, username: req.user.name, useremail: req.user.email });
  })
});

//updating index.js to load about, algorithm, daniel, madeline, keyur, references, login menu(temp) pages
router.get('/about', function(req, res){
    res.render('about', {title:  '' });
});

router.get('/testing', function(req, res){
    res.render('testing',{title: ''});
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

router.get('/match', function(req, res){
    if(!req.user) res.redirect('/');
    res.render('match', {user: req.user});
});

router.get('/messages', function(req, res){
  if(req.user) res.render('message', { title: 'Fitness Friends', user: req.user });
  if(!req.user) res.redirect('/');
});

router.post('/message', function(req, res){
  if(req.user) {
    user1 = req.user.email;
    user2 = req.body.email;
    var convID = ctrlChat.findConversation(user1, user2);
    if(convID) {
      res.render('message', { title: 'Fitness Friends', user: req.user, convID : convID });
    }
    else {
      ctrlChat.createConversation(user1, user2);
      res.render('message', { title: 'Fitness Friends', user: req.user, convID : convID });
    }
  }
  if(!req.user) res.redirect('/');
})


module.exports = router;
