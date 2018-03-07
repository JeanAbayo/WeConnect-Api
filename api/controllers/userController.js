let User = require("../models/User.js");
let bcrypt = require('bcryptjs');

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
		// Compose our salt to encrypt our password
		const salt = crypto.randomBytes(16).toString("hex");
		setPassword = password => {
			hash = crypto
				.pbkdf2Sync(password, salt, 10000, 512, "sha512")
				.toString("hex");
			return hash;
		};
		newUser.password = setPassword(password);
		newUser.salt = salt;
		newUser.save(function(err) {
			if (err) {
				return res.status(422).json({
					payload: err.message
				});
			} else {
				// Remove password and salt from data returned to the client
				newUser.password = undefined;
				newUser.salt = undefined;
				// Return to client success registration response
				return res.status(201).json({
					message: "User account created successfuly",
					payload:  JSON.parse(JSON.stringify(newUser)) 
				});
			}
		});	
	}
};

exports.login = function(req, res) {
	const email = req.body.email;
	const password = req.body.password;
	User.findOne({ email: email }, function (err, user) {
		if (err) {
			return res.status(500).json('Error on the server.');
		}
		else if (!user){
			return res.status(404).json('No user found.');
		}
		else{
			const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
			if (!passwordIsValid) return res.status(401).send({ auth: false, token: null });
			const token = jwt.sign({ id: user._id }, config.secret, {
				expiresIn: 86400 // expires in 24 hours
			});
			res.status(200).json({ auth: true, token: token });
		}
	});
	validPassword = password => {
		const hash = crypto
			.pbkdf2Sync(password, salt, 10000, 512, "sha512")
			.toString("hex");
		return hash === hash;
	};
};
