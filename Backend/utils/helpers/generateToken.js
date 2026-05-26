// utils/helpers/generateToken.js

const crypto = require("crypto");

const generateToken = () => {
  return crypto.randomBytes(16).toString("hex");
};

module.exports = generateToken;

//used for email verification, password reset and one time links