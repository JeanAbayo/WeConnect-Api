const express = require("express");
const router = express.Router();

// Require controller modules.
const UserController = require("../controllers/userController.js");

/// USER ROUTES ///

// Register new user
router.post("/auth/register", UserController.register);

// Authenticate a user
router.post("/auth/login", UserController.login);

module.exports = router;
