const router = require("express").Router();

const { addReview, getArtistReviews } = require("../controllers/reviewController");

const verifyToken = require("../middleware/verifyToken");

router.post("/", verifyToken, addReview);

router.get("/:artistId", getArtistReviews);

module.exports = router;
