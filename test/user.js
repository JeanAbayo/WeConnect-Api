//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");
let User = require('../api/models/User');

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let api = require('../server');
let should = chai.should();

chai.use(chaiHttp);
//Our parent block
describe('Users', () => {
    beforeEach((done) => { //Before each test we empty the database
        User.remove({}, (err) => { 
           done();         
        });     
    });
/*
  * Test user registration
  */
 let user = {
            username: "JohnDoe",
            email: "johndoe@test.com",
            password: "secret",
            confirm_password: "secret"
        }
  describe('User registration', () => {
      it('it should register a user', (done) => {
        chai.request(api)
            .post('/api/auth/register')
            .send(user)
            .end((err, res) => {
                res.should.have.status(201);
                res.body.should.be.a('object');
                res.body.should.have.property('message').eql('User account created successfuly');
              done();
            });
      });
  });

});
