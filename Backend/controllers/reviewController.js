const Review = require("../models/reviewModel");

exports.addReview = async (req, res) => {
  try {
    const { artistId, bookingId, rating, reviewText } = req.body;

    // prevent duplicate reviews
    const alreadyReviewed = await Review.findOne({
      client: req.user.id,
      booking: bookingId,
    });

    if (alreadyReviewed) {
      return res.status(400).json({
        message: "You already reviewed this booking",
      });
    }

    const review = await Review.create({
      client: req.user.id,
      artist: artistId,
      booking: bookingId,
      rating,
      reviewText,
    });

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.getArtistReviews = async (req, res) => {
  try {
    const reviews = await Review.find({
      artist: req.params.artistId,
    }).populate("client", "username profilePic");

    res.json(reviews);
    
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
