let User = require("../models/User.js");
let bcrypt = require("bcrypt-nodejs");

exports.register = function(req, res) {
	// User registration
	const username = req.body.username;
	const email = req.body.email;
	const password = req.body.password;
	const confirm_password = req.body.confirm_password;

	let newUser = new User({
		username,
		email,
		password,
		confirm_password
	});

	// Check password are not equal
	req
		.assert("confirm_password", "Passwords do not match")
		.equals(req.body.password);

	let errors = req.validationErrors(true);
	if (errors) {
		return res.status(422).json({
			payload: errors.confirm_password.msg
		});
	} else {
		bcrypt.genSalt(10, function(err, salt) {
			bcrypt.hash(newUser.password, salt, null, function(err, hash) {
				if (err) {
					return res.status(400).json({
						payload: err
					});
				}
				newUser.password = hash;
				newUser.save(function(err) {
					if (err) {
						return res.status(422).json({
							payload: err.message
						});
					} else {
						return res.status(201).json({
							message: "User account created successfuly",
							payload: { newUser }
						});
					}
				});
			});
		});
	}
};

exports.login = function(req, res) {
	// User authentication
	return null;
};
