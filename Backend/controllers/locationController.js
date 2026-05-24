const User = require("../models/userModel");

// UPDATE USER LOCATION
exports.updateLocation = async (req, res) => {
  try {
    const { coordinates, address } = req.body;

    if (!coordinates || coordinates.length !== 2) {
      return res.status(400).json({
        message: "Invalid coordinates format [lng, lat]",
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        location: {
          type: "Point",
          coordinates,
          address: address || "",
        },
      },
      { new: true },
    );

    res.status(200).json({
      message: "Location updated successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
