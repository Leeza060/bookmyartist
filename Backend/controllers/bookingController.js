const BookingModel = require("../models/bookingModel");
const UserModel = require("../models/userModel");

exports.placeBooking = async (req, res) => {
  try {
    const client = await UserModel.findById(req.body.booking_client);

    if (!client) {
      return res.status(404).json({ error: "Client not found" });
    }

    if (!client.emailVerified) {
      return res.status(403).json({ error: "Please verify your email before booking" });
    }

    let booking = await BookingModel.create({
      client: req.body.booking_client,
      artist: req.body.booking_artist,
      event_date: req.body.event_date,
      event_time: req.body.event_time,
      event_location: req.body.event_location,
      event_category: req.body.event_category,
      event_description: req.body.event_description,
      budget: req.body.budget,
      offered_price: req.body.offered_price,
      agreed_price: req.body.agreed_price,
      status: req.body.status,
      contract: req.body.contract,
      payment: req.body.payment,
    });
    res.send(booking);
  } catch (error) {
    return res.status(400).json({ error: "Something went wrong" });
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
    let booking = await BookingModel.findById(req.params.id)
    .populate("client").populate("artist");
    if(!booking){
      return res.status(404).json({error: "Booking not found"})
    }
    res.send(booking);

  } catch (error) {
    return res.status(400).json({ error: "Something went wrong" });
  }
};

exports.updateBooking = async (req, res) => {
  try {
    let bookingToUpdate = await BookingModel.findByIdAndUpdate(
      req.params.id,
      {
        client: req.body.booking_client,
        artist: req.body.booking_artist,
        event_date: req.body.event_date,
        event_time: req.body.event_time,
        event_location: req.body.event_location,
        event_category: req.body.event_category,
        event_description: req.body.event_description,
        budget: req.body.budget,
        offered_price: req.body.offered_price,
        agreed_price: req.body.agreed_price,
        status: req.body.status,
        contract: req.body.contract,
        payment: req.body.payment,
      },
      { new: true },
    );
    res.send(bookingToUpdate);
  } catch (error) {
    return res.status(400).json({ error: "Something went wrong" });
  }
};

exports.deleteBooking = async (req, res) => {
  try {
    let bookingToDelete = await BookingModel.findByIdAndDelete(req.params.id);
    if (!bookingToDelete) {
      return res.status(404).json({ error: "Booking not found!" });
    }

    res.send({ message: "Booking deleted successfully!" });
  } catch (error) {
    return res.status(500).json({ error: "Something went wrong" });
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

    let bookings = await BookingModel.find(filter).populate("artist").populate("client");

    if (bookings.length == 0) {
      return res.status(404).json({ error: "No bookings found" });
    }
    res.send(bookings);
  } catch (error) {
    return res.status(500).json({ error: "Something went wrong" });
  }
};
