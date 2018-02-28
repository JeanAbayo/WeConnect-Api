module.exports = function(app) {
    var users = require("../controllers/user.controller.js");

    // Create a new Note
    app.post("/auth/register", users.register);

    // Retrieve all Notes
    app.post("/auth/login", users.login);
};
