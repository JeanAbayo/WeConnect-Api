const mongoose = require("mongoose");
var uniqueValidator = require("mongoose-unique-validator");

const UserSchema = mongoose.Schema(
	{
		username: {
			type: String,
			lowercase: true,
			unique: true,
			required: [true, "can't be blank"],
			match: [/^[a-zA-Z0-9]+$/, "is invalid"],
			index: true
		},
		email: {
			type: String,
			lowercase: true,
			unique: true,
			required: [true, "can't be blank"],
			match: [/\S+@\S+\.\S+/, "is invalid"],
			index: true
		},
		password: {
			type: String,
			required: [true, "can't be blank"],
			index: true
		}
	},
	{
		timestamps: true
	}
);

UserSchema.plugin(uniqueValidator, { message: "is already taken." });
module.exports = mongoose.model("User", UserSchema);
