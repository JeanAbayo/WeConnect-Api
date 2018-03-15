let mongoose = require("mongoose");

// Models
let User = require("../api/models/User");
let Business = require("../api/models/Business");

//Require the dev-dependencies
let chai = require("chai");
let chaiHttp = require("chai-http");
let request = require("supertest");
let should = chai.should();
let api = require("../server");

// Testing data
let data = require("./utils/data.json");
const user = data.user;
const business = data.business;

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
        res.body.payload.should.have.property("_id");
        authUser = request.agent(api); //authUser will be used in all subsequent tests since he's supposed to be authenticated
        authUser
          .post("/auth/login")
          .send({ email: user.email, password: user.password })
          .end(function(err, res) {
            if (err) throw err;
            // authUser will manage its own cookies
            // res.redirects contains an Array of redirects
            res.status.should.be.equal(200);
            res.body.should.have.property("token");
            res.body.payload.should.have.property("_id");
            done();
          });
      });
  });

  /*
  * Test business registration
  */
  describe("Business registration", () => {
    it("it should register a business", done => {
      chai
        .request(api)
        .post("/businesses")
        .send(business)
        .end((err, res) => {
          res.status.should.be.equal(201);
          res.body.should.be.a("object");
          res.body.should.have
            .property("message")
            .eql("Your business was created successfuly");
          done();
        });
    });
  });
  //run once after all tests
  after(function(done) {
    console.log("Deleting test database");
    mongoose.connection.db.dropDatabase(done);
  });
});
