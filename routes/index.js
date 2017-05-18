var express = require('express');
var router = express.Router();
var mongodb = require('mongodb');
var mongoUrl = 'mongodb://admin:password@ds133231.mlab.com:33231/agile-web-dev';

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Fitness Friends' });
});

//Temporary page to display registered users
router.get('/userlist', function(req, res){

  var MongoClient = mongodb.MongoClient;

  MongoClient.connect(mongoUrl, function (err, db) {
  if (err) {
    console.log(err);
  } else {
    console.log('(Read) Connection established to', mongoUrl);

    var collection = db.collection('users');

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

router.post('/adduser', function(req, res){

    var MongoClient = mongodb.MongoClient;

    MongoClient.connect(mongoUrl, function(err, db){
      if (err) {
        console.log(err);
      } else {
        console.log('(Write) Connection established to', mongoUrl);

        var collection = db.collection('users');

        // Get data from form
        var newuser = {name: req.body.name, age: req.body.age};

        collection.insert([newuser], function (err, result){
          if (err) {
            console.log(err);
          } else {

            //temporary - redirect to user list
            res.redirect("userlist");
          }

          db.close();
        });

      }
    });
});

//updating index.js to load about, algorithm, daniel, madeline, keyur, references pages
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


module.exports = router;
