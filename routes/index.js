var express = require('express');
var router = express.Router();
var passport = require('passport');
var Account = require('../models/account');
var multer = require('multer');
var fs = require('fs');
var geocoding = require('../public/js/geocoding.js');
var geolib = require('geolib');
//Mongo variables
var mongodb = require('mongodb');
var mongoUrl = "mongodb://admin:password@ds133231.mlab.com:33231/agile-web-dev";

//seperate js files
var datejs = require('../private/js/date');
var ctrlChat = require('../controllers/chat')
var ctrlGeneral = require('../controllers/general')
var ctrlAccount = require('../controllers/account')

var upload = multer({ dset: './uploads/' });

/* GET home page. */
router.get('/', ctrlGeneral.getIndex);

router.get('/photo/:id', ctrlAccount.getPhoto);

router.get('/match', ctrlGeneral.generateMatches);

router.get('/register', ctrlGeneral.getRegister);

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
    bio: req.body.bio,
    latitude : req.body.latitude,
    longitude : req.body.longitude
  }),
  req.body.password, function(err, account) {
    if(err) {
      return res.render('register', { title: 'Fitness Friends | Sign Up', error: err.message });
    }

//    console.log('req.file', req.file);

    account.photo.data = req.file.buffer;
    account.photo.contentType = 'image/png';
    account.save();

    console.log('user registered!');

    passport.authenticate('local')(req, res, function () {
      res.redirect('match');
    });
  });
});

router.get('/settings', ctrlGeneral.getSettings);

router.post('/settings',  ctrlAccount.update);


router.post('/login', passport.authenticate('local'), function(req, res) {
    res.redirect('/');
});

router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

router.get('/match-detail/:userId', function (req, res) {
  // Look up the user Id in the database
  Account.findOne({ _id: req.params.userId }, function(err, account) {
    res.render('match-detail', { matchUser: account, username: req.user.name, useremail: req.user.email });
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
  if(req.user) {

      var MongoClient = mongodb.MongoClient;

      MongoClient.connect(mongoUrl, function (err, db) {
        if (err) {
          console.log(err);
        }
        else {

          console.log('(Read) Connection established to', mongoUrl);

          var collection = db.collection('conversations');

          collection.find({ id: { $in: req.user.conversations }}).toArray(function (err, result) {
            if (err) {
              console.log(err);
              res.redirect('/')
            }
            else if (result.length) {

              db.close();
              console.log(result);
              res.render('message', { title: 'Fitness Friends', user: req.user, conversations: result });
            }
          });
        }
      });
  }
  if(!req.user) res.redirect('/');
 });

router.post('/message', ctrlChat.initiateConversation);


module.exports = router;
