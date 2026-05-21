const mongoose = require('mongoose')
// const { ObjectId }= mongoose.Schema

const tokenSchema = new mongoose.Schema({
  token:{
    type: String,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 86400 //24*60*60 - 1 day ma verify garnu paryo

  }
})

module.exports = mongoose.model('Token', tokenSchema)