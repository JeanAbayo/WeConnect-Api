let bcrypt = require('bcryptjs');
let jwt = require("jsonwebtoken");
let User = require("../models/User.js");
const secret = process.env.JWT_SECRET;

exports.register = function(req, res) {
	// User registration
	const username = req.body.username;
	const email = req.body.email;
	const password = req.body.password;
	const confirm_password = req.body.confirm_password;

	let newUser = new User({
		username,
		email
	});

	// Check passwords do match
	req
		.assert("confirm_password", "Passwords do not match")
		.equals(req.body.password);

	let errors = req.validationErrors(true);
	if (errors) {
		return res.status(422).json({
			payload: errors.confirm_password.msg
		});
	} else {
		// Use bcrypt to hash our password
		const hashedPassword = bcrypt.hashSync(password, 8);
		newUser.password = hashedPassword;
		newUser.save(function(err) {
			if (err) {
				return res.status(422).json({
					payload: err.message
				});
			} else {
				// Remove password from data returned to the client
				newUser.password = undefined;
				// Return to client success registration response
				return res.status(201).json({
					message: "Your account was created successfuly",
					payload:  JSON.parse(JSON.stringify(newUser)) 
				});
			}
		});	
	}
};

exports.login = function(req, res) {
	const email = req.body.email;
	const password = req.body.password;
	// Validate login params
    req.checkBody('email', 'Invalid email').notEmpty().isEmail();
    req.checkBody('password', 'Password is required').notEmpty();
	let errors = req.validationErrors(true);
	if (errors) {
		return res.status(422).json({
			payload: errors
		});
	} else {
		// Find the user using email and authenticate
		User.findOne({ email: email }, function (err, user) {
			if (err) {
				return res.status(500).json(
					{message: err}
				);
			} else if (!user) {
				return res.status(422).json({
					message: 'User does not exist, check your email input'
				});
			} else {
				// Compare provided password and user password
				const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
				if (!passwordIsValid) {
					return res.status(422).send({ message: "Your password is invalid" });
				}
				const token = jwt.sign({ id: user._id }, secret, {
					expiresIn: 86400 // expires in 24 hours
				});
				user.password = undefined;
				res.status(200).json({
					message: "You have successfuly logged in",
					token: token,
					payload: JSON.parse(JSON.stringify(user))
				});
			}
		});
	}
};
