// utils/helpers/hashPassword.js

const bcrypt = require("bcrypt");

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(Number(process.env.SALTROUNDS));

  return bcrypt.hash(password, salt);
};

module.exports = hashPassword;
