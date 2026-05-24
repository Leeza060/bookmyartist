// utils/validators/authValidator.js

const validateRegister = (data) => {
  const errors = [];

  const { username, email, password, phoneNumber, role, category, pricePerHour } = data;

  // common validation
  if (!username) {
    errors.push("Username is required");
  }

  if (!email) {
    errors.push("Email is required");
  }

  if (!password) {
    errors.push("Password is required");
  }

  if (!phoneNumber) {
    errors.push("Phone number is required");
  }

  // artist validation
  if (role === "artist") {
    if (!category) {
      errors.push("Artist category is required");
    }

    if (!pricePerHour) {
      errors.push("Artist base price is required");
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

const validateLogin = (data) => {
  const errors = [];

  if (!data.email) {
    errors.push("Email is required");
  }

  if (!data.password) {
    errors.push("Password is required");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

module.exports = {
  validateRegister,
  validateLogin,
};
