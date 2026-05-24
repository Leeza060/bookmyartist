// utils/helpers/generateContract.js

const generateContract = ({ clientName, artistName, eventDate, location, amount }) => {
  return `
FREELANCE ARTIST CONTRACT

Client: ${clientName}

Artist: ${artistName}

Event Date: ${eventDate}

Location: ${location}

Total Amount: Rs. ${amount}

Both parties agree to the booking terms
and event responsibilities.

`;
};

module.exports = generateContract;
