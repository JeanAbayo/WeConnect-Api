/*jslint node: true */
"use strict";
let express = require("express");
// create express api
let api = express();
let morgan = require('morgan');
let bodyParser = require("body-parser");
let mongoose = require("mongoose");
let expressValidator = require("express-validator");
let port = 8080;
// Configuring the database
let config = require("config");

// Load environment variables
if (process.env.NODE_ENV !== "production") {
	require("dotenv").load();
}

// DB Connection
mongoose.Promise = global.Promise;
mongoose.connect(config.DBHost);
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once("open", function() {
	console.log("Successfully connected to the database");
});

// Don't show the log when it is a testing env
if(config.util.getEnv('NODE_ENV') !== 'test') {
    //use morgan to log at command line
    api.use(morgan('combined')); //'combined' outputs the Apache style LOGs
}

let user = require("./api/routes/user");

// Parse requests of content-type - application/x-www-form-urlencoded
api.use(
	bodyParser.urlencoded({
		extended: true
	})
);

// Parse requests of content-type - application/json
api.use(bodyParser.json());

api.use(expressValidator());

api.use("/api", user);
// Listen for requests
api.listen(port, function() {
	console.log("Server is listening on port " + port);
});

module.exports = api; // For testing
