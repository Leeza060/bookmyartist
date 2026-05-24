const router = require("express").Router();

const { updateLocation } = require("../controllers/locationController");
const verifyToken = require("../middleware/verifyToken");

router.put("/update", verifyToken, updateLocation);

module.exports = router;
