const assert = require('assert');
let User = require("../api/models/User");
let user = require("./utils/data.json").user;

describe('Saving Records', function () {
    it('Save Record to MongoDB', function (done) {
        
       var new_user = new User({
           username: user.username,
           email: user.email
       });
       new_user.save().then(function () {
          assert(new_user.isNew === false);
          done();
       });
    });
});
