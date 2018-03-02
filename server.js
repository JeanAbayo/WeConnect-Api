var express = require("express");
var bodyParser = require("body-parser");

// create express api
var api = express();

// Configuring the database
var dbConfig = require("./config/database.js");
var mongoose = require("mongoose");

// Load environment variables
if (process.env.NODE_ENV !== "production") {
	require("dotenv").load();
}

// parse requests of content-type - application/x-www-form-urlencoded
api.use(
	bodyParser.urlencoded({
		extended: true
	})
);

// parse requests of content-type - application/json
api.use(bodyParser.json());

mongoose.Promise = global.Promise;

mongoose.connect(dbConfig.url);

mongoose.connection.on("error", function() {
	console.log("Could not connect to the database. Exiting now...");
	process.exit();
});

mongoose.connection.once("open", function() {
	console.log("Successfully connected to the database");
});

const expressValidator = require("express-validator");
api.use(expressValidator());

const user = require("./api/routes/user");
api.use("/api", user);

// listen for requests
api.listen(8080, function() {
	console.log("Server is listening on port 8080");
});
