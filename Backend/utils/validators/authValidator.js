// utils/validators/authValidator.js

const validateRegister = (data) => {
  const errors = [];

  const { username, email, password, phoneNumber, role, category, pricePerHour } = data;

  // allowed roles
  const allowedRoles = ["client", "artist"];

  //email validator
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // common validation
  if (!username) {
    errors.push("Username is required");
  } else if (username.length < 2) {
    errors.push("Username must be at least 2 characters");
  }

  if (!email) {
    errors.push("Email is required");
  } else if (!emailRegex.test(email)) {
    errors.push("Invalid email format");
  }

  if (!password) {
    errors.push("Password is required");
  } else if (password.length < 6) {
    errors.push("Password must be at least 6 characters");
  }

  // phone
  if (!phoneNumber) {
    errors.push("Phone number is required");
  } else if (phoneNumber.length !== 10 || isNaN(phoneNumber)) {
    errors.push("Phone number must be exactly 10 digits");
  }

  // role
  if (!role) {
    errors.push("Role is required");
  } else if (!allowedRoles.includes(role)) {
    errors.push("Invalid role selected");
  }

  // artist fields
  if (role === "artist") {
    if (!category) {
      errors.push("Artist category is required");
    }

    if (!pricePerHour) {
      errors.push("Artist price per hour is required");
    } else if (Number(pricePerHour) <= 0) {
      errors.push("Price per hour must be greater than 0");
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
