exports.getRecommendations = async (req, res) => {
  try {
    const results = await recommendationService(req.body);

    res.json(results);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
