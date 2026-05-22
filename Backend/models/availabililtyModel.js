const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types

const availabilitySchema = new mongoose.Schema({
  artist: {
    type: ObjectId,
    ref: "User",
    required: true
  },
  available_date: {
    type: Date,
    required: true
  },
  start_time: String,
  end_time: String,
  status: {
    type: String,
    enum: ['Available', 'Unavailable'],
    default: "Available"
  }
});