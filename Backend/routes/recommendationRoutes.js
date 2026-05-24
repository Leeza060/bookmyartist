const { getRecommendations } = require("../controllers/recommendationController");

const router = require("express").Router();

router.post("/artists", getRecommendations);

module.exports = router;
