const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const reviewSchema = new mongoose.Schema(
  {
    client: {
      type: ObjectId,
      ref: "User",
      required: true,
    },

    artist: {
      type: ObjectId,
      ref: "User",
      required: true,
    },

    booking: {
      type: ObjectId,
      ref: "Booking",
      required: true,
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    reviewText: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Review", reviewSchema);
