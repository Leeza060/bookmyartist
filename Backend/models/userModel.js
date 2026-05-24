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
    },

    phoneNumber: {
      type: String, //number
      required: true,
      minlength: 10,
    },

    role: {
      type: String,
      enum: ["client", "artist", "admin"],
      // default: "client",
      required: true,
    },

    // 🔽 Only for artists
    category: {
      type: String, // singer, DJ, MC
      required: function () {
        return this.role == "artist";
      },
    },

    bio: {
      type: String,
      default: "",
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

    location: {
      lat: {
        type: Number,
        default: null,
      },

      lng: {
        type: Number,
        default: null,
      },
    },

    profileImage: {
      type: String,
      default: "",
    },

    //email verification for both users
    emailVerified: {
      type: Boolean,
      default: false,
    },

    //Artist approval/verification by admin
    // adminApproved: {
    //   type: Boolean,
    //   default: function () {
    //     return this.role !== "artist";
    //   },
    // },

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
