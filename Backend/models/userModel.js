const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },

    phoneNumber: {
      type: String, //number
      required: true,
      minlength: 10,
    },

    role: {
      type: String,
      enum: ["client", "artist", "admin"],
      required: true,
    },

    bio: {
      type: String,
      default: "",
    },

    profileImage: {
      type: String,
      default: "",
    },

    address: {
      type: String,
      default: "",
    },

    location: {
      type: {
        type: String,
        default: "Point",
      },
      coordinates: {
        type: [Number], // [lng, lat]
        required: true,
      },

      address: {
        type: String,
        default: "",
      },
    },

    //email verification for both users
    emailVerified: {
      type: Boolean,
      default: false,
    },

    // only artists
    category: {
      type: String,
      required: function () {
        return this.role == "artist";
      },
    },

    pricePerHour: {
      type: Number,
      required: function () {
        return this.role == "artist";
      },
      min: 0,
    },

    genres: {
      type: [String],
      default: [],
    },

    specialties: {
      type: [String],
      default: [],
    },

    languages: {
      type: [String],
      default: [],
    },

    verificationStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: function () {
        return this.role === "artist" ? "pending" : "approved";
      },
    },

    adminApprovedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);
