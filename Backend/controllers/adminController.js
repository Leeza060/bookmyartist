const UserModel = require("../models/userModel");
const sendEmail = require("../middleware/emailSender");

// verify artist
exports.verifyArtist = async (req, res) => {
  try {
    // if (req.user.role !== "admin") {
    //   return res.status(403).json({ error: "Access denied" });
    // }

    const { id } = req.params;
    const user = await UserModel.findById(id);

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    if (user.role !== "artist") {
      return res.status(400).json({ error: "User is not an artist." });
    }
    
    if (!user.emailVerified) {
      return res.status(400).json({
        error: "Artist must verify email before admin approval",
      });
    }

    if (user.verificationStatus == "approved") {
      return res.status(400).json({ error: "Artist already approved" });
    }

    user.adminApproved = true;
    user.verificationStatus = "approved";
    user.adminApprovedAt = new Date();

    await user.save();

    await sendEmail({
      to: user.email,
      subject: "Artist Profile Approved 🎉",
      text: "Congratulations! Your artist profile has been approved. You can now receive bookings.",
    });

    res.status(200).json({ message: "Artist verified successfully!", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    // if (req.user.role !== "admin") {
    //   return res.status(403).json({ error: "Access denied" });
    // }
    const users = await UserModel.find().select("-password");

    res.status(200).json({ count: users.length, users });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUserDetails = async (req, res) => {
  try {
    const {userId} = req.params
    const user = await UserModel.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({success: true, user});

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

