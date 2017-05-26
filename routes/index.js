var express = require('express');
var router = express.Router();
var passport = require('passport');
var multer = require('multer');

var geocoding = require('../public/js/geocoding.js');

//Mongo variables
var mongodb = require('mongodb');
var mongoUrl = "mongodb://admin:password@ds133231.mlab.com:33231/agile-web-dev";

//Controller files
var ctrlChat = require('../controllers/chat')
var ctrlGeneral = require('../controllers/general')
var ctrlAccount = require('../controllers/account')

var upload = multer({ dset: './uploads/' });

/* GET home page. */
router.get('/', ctrlGeneral.getIndex);

router.get('/photo/:id', ctrlAccount.getPhoto);

router.get('/match', ctrlGeneral.generateMatches);

router.get('/register', ctrlGeneral.getRegister);

router.post('/register', upload.single('photo'), ctrlAccount.register);

router.get('/settings', ctrlGeneral.getSettings);

router.post('/settings',  ctrlAccount.update);

router.post('/login', passport.authenticate('local'), ctrlAccount.login);

router.get('/logout', ctrlAccount.logout);

router.get('/match-detail/:userId', ctrlAccount.accountDetail);

router.get('/about', ctrlGeneral.about);

router.get('/testing', ctrlGeneral.testing);

router.get('/algorithm', ctrlGeneral.algorithm);

router.get('/daniel', ctrlGeneral.daniel);

router.get('/madeline', ctrlGeneral.madeline);

router.get('/keyur', ctrlGeneral.keyur);

router.get('/references', ctrlGeneral.references);

router.get('/messages', ctrlChat.renderMessages);

router.get('/message/:id', ctrlChat.initiateConversation);


module.exports = router;
