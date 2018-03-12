const mongoose = require('mongoose');
const config = require("config");
mongoose.Promise = global.Promise;
before(function (done) {
    //Connect to MongoDB Here
    mongoose.connect(config.DBHost);
 
    mongoose.connection.once('open', function () {
        console.log('Connected to MongoDB!');
        done();
    }).on('error', function () {
        console.log('Connection error : ', error);
    });
});

beforeEach(function (done) {
   mongoose.connection.collections.users.drop(function () {
       done();
   })
});
