const { createAvailability, getArtistAvailability, getAvailabilityDetails, updateAvailability, deleteAvailability } = require("../controllers/availabilityController");

const Router = require("express").Router();

// Create availability for artist
router.post("/artists/:artistId/availability", createAvailability);

// Get all availability of artist
router.get("/artists/:artistId/availability", getArtistAvailability);


// Get single availability
router.get("/availability/:availabilityId", getAvailabilityDetails);

// Update availability
router.put("/availability/:availabilityId", updateAvailability);

// Delete availability
router.delete("/availability/:availabilityId", deleteAvailability);

module.exports = router;
