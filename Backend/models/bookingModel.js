const mongoose = require("mongoose");
const {ObjectId} = mongoose.Schema

const bookingSchema = new mongoose.Schema(
  {
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    artist: {
      type: mongoose.Schema.Types.ObjectId,
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
    event_location: {
      type: String,
      trim: true,
    },
    event_category: {
      type: String,
      trim: true,
    },
    event_description: {
      type: String,
      trim: true,
    },
    budget: {
      type: Number,
      default: null,
    },
    offered_price: {
      type: Number,
      required: true,
    },
    agreed_price: {
      type: Number,
      default: null,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "contract_unsigned", "contract_signed", "completed", "cancelled"],
      default: "pending",
    },
    artist_accepted: {
      type: Boolean,
      default: false,
    },
    client_confirmed: {
      type: Boolean,
      default: false,
    },
    contract: {
      type: ObjectId,
      ref: "Contract",
    },
    payment: {
      status: {
        type: String,
        enum: ["unpaid", "pending", "paid", "refunded", "failed"],
        default: "unpaid",
      },
      method: {
        type: String,
        trim: true,
      },
      amount: {
        type: Number,
        default: null,
      },
      transaction_id: {
        type: String,
        trim: true,
      },
      paid_at: {
        type: Date,
        default: null,
      },
    },
    cancel_reason: {
      type: String,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Booking", bookingSchema);
