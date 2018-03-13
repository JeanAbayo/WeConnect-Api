const mongoose = require("mongoose");
const config = require("config");
const Fixtures = require("node-mongodb-fixtures");
const options = null;
const fixtures = new Fixtures({
  dir: "test/utils/fixtures"
});
mongoose.Promise = global.Promise;
before(function(done) {
  //Connect to MongoDB Here
  mongoose.connect(config.DBHost);

  mongoose.connection
    .once("open", function() {
      console.log("Connected to MongoDB!");
      done();
    })
    .on("error", function() {
      console.log("Connection error : ", error);
    });
  fixtures
    .connect(config.DBHost)
    .unload()
    .then(() => fixtures.load())
    .catch(e => console.error(e))
    .finally(() => fixtures.disconnect());
});
after(function(done) {
  mongoose.connection.collections.users.drop(function() {
    done();
  });
});
