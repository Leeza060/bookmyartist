const validateBooking = (data) => {
  const errors = [];

  const requiredFields = ["client", "artist", "event_date", "event_location", "price"];

  requiredFields.forEach((field) => {
    if (!data[field]) {
      errors.push(`${field} is required`);
    }
  });

  if (data.price && Number(data.price) <= 0) {
    errors.push("Price must be greater than 0");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

module.exports = {
  validateBooking,
};
