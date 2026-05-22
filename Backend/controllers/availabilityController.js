const AvailabilityModel = require("../models/availabililtyModel");

exports.createAvailability = async (req, res) => {
  try {
    const { artistId } = req.params;
    const availability = await AvailabilityModel.create({
      artist: artistId,
      available_date: req.body.available_date,
      start_time: req.body.start_time,
      end_time: req.body.end_time,
    });

    res.status(201).json(availability);

  } catch (error) {
    res.status(400).json({
      error: "Something went wrong",
    });
  }
};

exports.getArtistAvailability = async (req, res) => {
  try {
    const { artistId } = req.params;

    const availability = await AvailabilityModel.find({
      artist: artistId,
    }).sort({
      available_date: 1,
    });

    res.json(availability);
  } catch (error) {
    res.status(500).json({
      error: "Something went wrong",
    });
  }
};

exports.getAvailabilityDetails = async (req, res) => {
  try {
   const { availabilityId } = req.params;

    const availability = await AvailabilityModel.findById(availabilityId);

    if (!availability) {
      return res.status(404).json({
        error: "Availability not found",
      });
    }

    res.json(availability);
  } catch (error) {
    res.status(500).json({
      error: "Something went wrong",
    });
  }
};

exports.updateAvailability = async (req, res) => {
  try {
    const { availabilityId } = req.params;

    const updatedAvailability = await AvailabilityModel.findByIdAndUpdate(
      availabilityId,
      {
        available_date: req.body.available_date,
        start_time: req.body.start_time,
        end_time: req.body.end_time,
      },
      { new: true },
    );

    if (!updatedAvailability) {
      return res.status(404).json({
        error: "Availability not found",
      });
    }

    res.json(updatedAvailability);
  } catch (error) {
    res.status(400).json({
      error: "Something went wrong",
    });
  }
};

exports.deleteAvailability = async (req, res) => {
  try {
    const { availabilityId } = req.params;

    const deletedAvailability = await AvailabilityModel.findByIdAndDelete(availabilityId);

    if (!deletedAvailability) {
      return res.status(404).json({
        error: "Availability not found",
      });
    }

    res.json({
      message: "Availability deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      error: "Something went wrong",
    });
  }
};