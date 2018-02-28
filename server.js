var express = require("express");
var bodyParser = require("body-parser");

// create express app
var app = express();

// Configuring the database
var dbConfig = require("./config/database.config.js");
var mongoose = require("mongoose");

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse requests of content-type - application/json
app.use(bodyParser.json());

mongoose.Promise = global.Promise;

mongoose.connect(dbConfig.url, {
	useMongoClient: true
});

mongoose.connection.on("error", function() {
	console.log("Could not connect to the database. Exiting now...");
	process.exit();
});

mongoose.connection.once("open", function() {
	console.log("Successfully connected to the database");
});

require("./app/routes/user.routes.js")(app);

// listen for requests
app.listen(8080, function() {
	console.log("Server is listening on port 8080");
});
