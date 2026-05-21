const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const contractSchema = new mongoose.Schema(
  {
    booking: {
      type: ObjectId,
      ref: "Booking",
      required: true,
      unique: true,
    },
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
    event_date: {
      type: Date,
      required: true,
    },
    event_time: {
      type: String,
      required: true,
    },
    agreed_price: {
      type: Number,
      required: true,
    },
    terms: {
      type: String,
      required: true,
      trim: true,
    },
    client_signed: {
      type: Boolean,
      default: false,
    },
    artist_signed: {
      type: Boolean,
      default: false,
    },
    client_signed_at: {
      type: Date,
      default: null,
    },
    artist_signed_at: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ["draft", "pending", "signed", "cancelled"],
      default: "draft",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Contract", contractSchema);
