//https://medium.com/nongaap/beginners-guide-to-writing-mongodb-mongoose-unit-tests-using-mocha-chai-ab5bdf3d3b1d

var should = require('should');
var mocha = require('mocha');
var expect = require('chai').expect;
var mongodb = require('mongodb')
var mongoUrl = "mongodb://admin:password@ds133231.mlab.com:33231/agile-web-dev";
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var assert = require('assert');
var express = require('express');
var app = express();
var request = require('supertest');

var testSchema = new Schema({
  name: {type: String, require: true},
  email: {type: String, require: true, unique: true},
  password: {type: String, require: true},
  gender: {type: String, require:true},
  suburb: {type: String, require: true},
  level: {type: String, require: true},
  activity: {type: String, require: true},
 });

 var testAcc = mongoose.model('testAcc',testSchema);

describe('database testing', function() {

  before(function (done) {
    mongoose.connect(mongoUrl);
    var db = mongoose.connection;
    db.on('error',console.error.bind(console,'connection error'));
    db.once('open',function() {
      console.log('   connected to database');
      done();
    });
  });

  describe('test account',function() {

    it('save test account', function(done){
      var testUser = new testAcc({
        name:  "test",
        email: "test@test.com",
        password: "test",
        suburb: "Perth",
        level: "Beginner",
        activity: "Sports",
        gender: "Male"
      });
      testUser.save(done);
    });

    it('  fetch name', function(done){
      testAcc.findOne({name:'test'}, function(err,testUser){
        testUser.should.not.eql('');
        testUser.name.should.eql('test');
        done();
      });
    });

    it('  fetch email', function(done){
      testAcc.findOne({name:'test'}, function(err,testUser){
        testUser.email.should.eql('test@test.com');
        testUser.email.should.contain('@');
        done();
      });
    });

    it('  fetch password',function(done){
      testAcc.findOne({password:'test'}, function(err,testUser) {
        testUser.password.should.eql('test');
        done();
      });
    });

    it('  fetch suburb',function(done){
      testAcc.findOne({suburb:'Perth'}, function(err,testUser) {
        testUser.suburb.should.eql('Perth');
        done();
      });
    });

    it('  fetch level',function(done){
      testAcc.findOne({level:'Beginner'}, function(err,testUser) {
        testUser.level.should.eql('Beginner');
        done();
      });
    });

    it('  fetch activity',function(done){
      testAcc.findOne({activity:'Sports'}, function(err,testUser) {
        testUser.activity.should.eql('Sports');
        done();
      });
    });

    it('  fetch gender',function(done){
      testAcc.findOne({gender:'Male'}, function(err,testUser) {
        testUser.gender.should.eql('Male');
        done();
      });
    });
  });

/*
  var server = app.listen(3000, function() {
    console.log('listening');
  });

  describe('Login API', function(){
    it('test for successful login', function(done){
      request(app)
        .post('http://localhost:3000/#login')
        .send({email: 'test@test.com', password: 'test'})
        .expect(200)
        .expect(function(response){
          expect(response.body).not.to.be.empty;
          expect(response.body).to.be.an('object');
        })
        .end(done);
    });
  });
*/

  after(function(done){
      mongoose.connection.close(done);
  });
});

var datejs = require('../private/js/date');

describe('User age test',function() {
  before(function(){
    date1 = new Date(1990, 10, 10);
    date2 = new Date(2000,03,07);
    date3 = new Date(1996,07,26);
  });

  after(function(){
    date1 = null;
    date2 = null;
    date3 = null;
  });

  it('test age for date1', function(){
    assert.equal(datejs.calculateAge(date1),26,"age should be 26");
  });

  it('test age for date2', function(){
    assert.equal(datejs.calculateAge(date2),17,"age should be 17");
  });

  it('test age for date3', function(){
    assert.equal(datejs.calculateAge(date3),20,"age should be 20");
  });
});

var geolib = require('geolib');

describe('Geodistance calculation test', function(){
  before(function(){
    pt1lat = -31.09944;
    pt2lat = -32.89003;
    pt3lat = -31.57883;
    pt1lon = 115.82745;
    pt2lon = 116.09287;
    pt3lon = 115.42453;
  });

  after(function(){
    pt1lat = null;
    pt2lat = null;
    pt3lat = null;
    pt1lon = null;
    pt2lon = null;
    pt3lon = null;
  });

  it('test distance between points 1 and 2', function(){
    assert.equal(geolib.getDistance({latitude: pt1lat, longitude: pt1lon},{latitude: pt2lat, longitude: pt2lon})/1000,200.13,"Distance should be 200.13");
  });

  it('test distance between points 2 and 3', function(){
    assert.equal(geolib.getDistance({latitude: pt3lat, longitude: pt3lon},{latitude: pt2lat, longitude: pt2lon})/1000,158.458,"Distance should be 158.458");
  });

  it('test distance between points 1 and 3', function(){
    assert.equal(geolib.getDistance({latitude: pt1lat, longitude: pt1lon},{latitude: pt3lat, longitude: pt3lon})/1000,65.539,"Distance should be 65.536");
  });

});
