//During the test the env variable is set to test
process.env.NODE_ENV = "test";

let mongoose = require("mongoose");
let User = require("../api/models/User");

//Require the dev-dependencies
let chai = require("chai");
let chaiHttp = require("chai-http");
let request = require("supertest");
let api = require("../server");
let should = chai.should();
let user = require("./utils/data.json").user;
let user1 = require("./utils/data.json").user1;
chai.use(chaiHttp);

//Our parent block
describe("Users", () => {
  before(function(done) {

    // Clear users before testing
    User.remove().exec();

    request(api)
      .post("/auth/register")
      .send(user)
      // end handles the response
      .end(function(err, res) {
        if (err) {
          throw err;
        }
        res.status.should.be.equal(201);
        res.body.payload._id.should.exist;
        authUser = request.agent(api); //authUser will be used in all subsequent tests since he's supposed to be authenticated
        authUser
          .post("/auth/login")
          .send({ email: user.email, password: user.password })
          .end(function(err, res) {
            if (err) throw err;
            // user1 will manage its own cookies
            // res.redirects contains an Array of redirects
            res.status.should.be.equal(200);
            res.body.token.should.exist;
            res.body.payload._id.should.exist;
            done();
          });
      });
  });

  /*
  * Test user registration
  */
  describe("User registration", () => {
    it("it should register a user", done => {
      chai
        .request(api)
        .post("/auth/register")
        .send(user1)
        .end((err, res) => {
          res.status.should.be.equal(201);
          res.body.should.be.a("object");
          res.body.should.have
            .property("message")
            .eql("Your account was created successfuly");
          done();
        });
    });
  });
  /*
  * Test user can authenticate
  */
  describe("User Authentication", () => {
    it("it should authenticate successfully", done => {
      chai
        .request(api)
        .post("/auth/login")
        .send({ email: user.email, password: user.password})
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have
            .property("message")
            .eql("You have successfuly logged in");
          done();
        });
    });

      it("it should not authenticate invalid data", done => {
        chai
          .request(api)
          .post("/auth/login")
          .send({ email: "fakeuser@test.com", password: "fake" })
          .end((err, res) => {
            res.should.have.status(422);
            res.body.should.be.a("object");
            res.body.should.have
              .property("message")
              .eql("User does not exist, check your email input");
            done();
          });
      });
  });
});
