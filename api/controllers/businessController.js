let Business = require("../models/Business.js");

exports.register = function(req, res) {
	// Business registration
	const name = req.body.name;
	const category = req.body.category;
	const description = req.body.description;
	const location = req.body.location;
	const profile = req.body.profile;

	let newBusiness = new Business({
		name,
		category,
		description,
		location,
		profile
	});

	// Validate new business params
	req.checkBody("name", "Name is required").notEmpty();
	req.checkBody("category", "Category is required").notEmpty();
	req.checkBody("description", "Description is required").notEmpty();
	let errors = req.validationErrors(true);
	if (errors) {
		return res.status(422).json({
			errors: errors
		});
	} else {
		newBusiness.save(function(err) {
			if (err) {
				return res.status(422).json({
					errors: err.message
				});
			} else {
				// Return to client success registration response
				return res.status(201).json({
					message: "Your business was registered successfuly",
					payload: JSON.parse(JSON.stringify(newBusiness))
				});
			}
		});
	}
};
