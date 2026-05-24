// utils/helpers/calculatePrice.js

const calculatePrice = (hourlyRate, hours, travelCost = 0) => {
  const total = hourlyRate * hours + travelCost;

  return total;
};

module.exports = calculatePrice;
