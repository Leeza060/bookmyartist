const BookingModel = require("../models/bookingModel");
const UserModel = require("../models/userModel");
const mongoose = require("mongoose");

const isPositiveNumber = (value) => Number(value) > 0;

exports.placeBooking = async (req, res) => {
  try {
    const requiredFields = [
      "client", "artist", "event_date", "event_time", "offered_price"
    ];
    
    const missingFields = requiredFields.filter((field) => !req.body[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({
        error: "Missing required booking fields",
        fields: missingFields,
      });
    }

    if (!mongoose.Types.ObjectId.isValid(req.body.client)) {
      return res.status(400).json({ error: "Invalid client id" });
    }

    if (!mongoose.Types.ObjectId.isValid(req.body.artist)) {
      return res.status(400).json({ error: "Invalid artist id" });
    }

    const eventDate = new Date(req.body.event_date);

    if (Number.isNaN(eventDate.getTime())) {
      return res.status(400).json({ error: "Invalid event date" });
    }

    if (!isPositiveNumber(req.body.offered_price)) {
      return res.status(400).json({ error: "Offered price must be greater than 0" });
    }

    if (req.body.budget && !isPositiveNumber(req.body.budget)) {
      return res.status(400).json({ error: "Budget must be greater than 0" });
    }

    const client = await UserModel.findById(req.body.client);

    if (!client) {
      return res.status(404).json({ error: "Client not found" });
    }

    if (client.role !== "client") {
      return res.status(400).json({ error: "Only client users can place bookings" });
    }

    if (!client.emailVerified) {
      return res.status(403).json({ error: "Please verify your email before booking" });
    }

    const artist = await UserModel.findById(req.body.artist);

    if (!artist) {
      return res.status(404).json({ error: "Artist not found" });
    }

    if (artist.role !== "artist") {
      return res.status(400).json({ error: "Selected user is not an artist" });
    }

    if (!artist.adminApproved) {
      return res.status(403).json({ error: "Artist is not approved for bookings yet" });
    }

    const booking = await BookingModel.create({
      client: req.body.client,
      artist: req.body.artist,
      event_date: eventDate,
      event_time: req.body.event_time,
      event_location: req.body.event_location,
      event_category: req.body.event_category,
      event_description: req.body.event_description,
      budget: req.body.budget,
      offered_price: req.body.offered_price,
      contract: req.body.contract,
    });

    res.status(201).json({
      message: "Booking placed successfully",
      booking,
    });
  } catch (error) {
    return res.status(400).json({ error: "Something went wrong" });
  }
};

exports.respondToBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { status, agreed_price } = req.body;

    const booking = await BookingModel.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    // Only allow valid status transitions
    const allowedStatus = ["accepted", "rejected", "cancelled"];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ error: "Invalid status update" });
    }

    booking.status = status;

    // If artist accepts, set agreed price
    if (status === "accepted" && agreed_price) {
      booking.agreed_price = agreed_price;
      booking.artist_accepted = true;
    }

    if (status === "rejected") {
      booking.artist_accepted = false;
    }

    await booking.save();

    res.json(booking);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

exports.getAllBookings = async (req, res) => {
  try {
    let bookings = await BookingModel.find().populate("client").populate("artist");
    if (!bookings) {
      return res.status(404).json({ error: "Booking not found" });
    }
    res.send(bookings);
  } catch (error) {
    return res.status(400).json({ error: "Something went wrong" });
  }
};

exports.getBookingDetails = async (req, res) => {
  try {
    const { bookingId } = req.params;

    let booking = await BookingModel.findById(bookingId).populate("client").populate("artist");

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }
    res.send(booking);
  } catch (error) {
    return res.status(400).json({ error: "Something went wrong" });
  }
};

exports.getBookingByUser = async (req, res) => {
  try {
    let filter = {};
    if (req.query.clientId) {
      filter.client = req.query.clientId;
    }
    if (req.query.artistId) {
      filter.artist = req.query.artistId;
    }
    if (!req.query.clientId && !req.query.artistId && req.params.userId) {
      filter = {
        $or: [
          { client: req.params.userId },
          { artist: req.params.userId },
        ],
      };
    }

    let bookings = await BookingModel.find(filter).populate("artist").populate("client");

    res.send(bookings);
  } catch (error) {
    return res.status(500).json({ error: "Something went wrong" });
  }
};

exports.updateBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const allowedFields = [
      "client",
      "artist",
      "event_date",
      "event_time",
      "event_location",
      "event_category",
      "event_description",
      "budget",
      "offered_price",
      "agreed_price",
      "status",
      "contract",
      "payment",
    ];

    const updateData = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    let bookingToUpdate = await BookingModel.findByIdAndUpdate(
      bookingId,
      updateData,
      { new: true, runValidators: true },
    );

    if (!bookingToUpdate) {
      return res.status(404).json({ error: "Booking not found" });
    }

    res.send(bookingToUpdate);
  } catch (error) {
    return res.status(400).json({ error: "Something went wrong" });
  }
};

exports.deleteBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    let bookingToDelete = await BookingModel.findByIdAndDelete(bookingId);
    if (!bookingToDelete) {
      return res.status(404).json({ error: "Booking not found!" });
    }

    res.send({ message: "Booking deleted successfully!" });
  } catch (error) {
    return res.status(500).json({ error: "Something went wrong" });
  }
};

exports.updatePayment = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await BookingModel.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    booking.payment.status = req.body.status || booking.payment.status;
    booking.payment.method = req.body.method;
    booking.payment.amount = req.body.amount;
    booking.payment.transaction_id = req.body.transaction_id;
    booking.payment.paid_at = new Date();

    await booking.save();

    res.json(booking);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};
