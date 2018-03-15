const express = require("express");
const router = express.Router();

// Require controller modules.
const UserController = require("./controllers/userController.js");
const BusinessController = require("./controllers/businessController.js");

/// USER ROUTES ///

// Register new user
router.post("/auth/register", UserController.register);

// Authenticate a user
router.post("/auth/login", UserController.login);

/// BUSINESS ROUTES ///

// Register a business
router.post("/businesses", BusinessController.register);

module.exports = router;
