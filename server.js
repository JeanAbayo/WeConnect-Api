/*jslint node: true */
"use strict";
let express = require("express");
// create express api
let api = express();
let morgan = require("morgan");
let bodyParser = require("body-parser");
let mongoose = require("mongoose");
let expressValidator = require("express-validator");
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
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function() {
  console.log("Successfully connected to the database");
});

// Don't show the log when it is a testing env
if (config.util.getEnv("NODE_ENV") !== "test") {
  //use morgan to log at command line
  api.use(morgan("combined")); //'combined' outputs the Apache style LOGs
}

let routes = require("./api/routes");

// Parse requests of content-type - application/x-www-form-urlencoded
api.use(
  bodyParser.urlencoded({
    extended: true
  })
);

// Parse requests of content-type - application/json
api.use(bodyParser.json());

api.use(expressValidator());

const v1 = express.Router();

v1.use(routes);

api.use("/api/v1/", v1);

api.use("/", v1);

// Listen for requests
// api.listen(port, function() {
//   console.log("Server is listening on port " + port);
// });
let port = process.env.PORT || (process.argv[2] || 8080);
port = (typeof port === "number") ? port : 3000;

if(!module.parent){ api.listen(port); }

console.log("Application started. Listening on port:" + port);
module.exports = api; // For testing
