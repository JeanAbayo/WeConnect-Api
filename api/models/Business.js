const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET;

const BusinessSchema = mongoose.Schema(
  {
    owner: { type: Schema.Types.ObjectId, ref: 'User' },
    name: {
      type: String,
      lowercase: true,
      unique: true,
      required: [true, "can't be blank"],
      index: true
    },
    category: {
      type: String,
      lowercase: true,
      required: [true, "can't be blank"],
      index: true
    },
    description: {
      type: String,
      lowercase: true,
      required: [true, "can't be blank"],
      index: true
    },
    location: String,
    profile: String
  },
  {
    timestamps: true
  }
);

BusinessSchema.plugin(uniqueValidator, { message: "is already taken." });
module.exports = mongoose.model("Business", BusinessSchema);
