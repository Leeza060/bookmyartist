const Contract = require("../models/contractModel");

// CREATE CONTRACT
exports.createContract = async (req, res) => {
  try {
    const { bookingId, clientId, artistId, event_date, event_time, agreed_price, terms } = req.body;

    // prevent duplicate contract for booking

    const existingContract = await Contract.findOne({
      booking: bookingId,
    });

    if (existingContract) {
      return res.status(400).json({
        message: "Contract already exists for this booking",
      });
    }

    const contract = await Contract.create({
      booking: bookingId,

      client: clientId,

      artist: artistId,

      event_date,

      event_time,

      agreed_price,

      terms,

      status: "pending",
    });

    res.status(201).json(contract);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// CLIENT SIGN CONTRACT

exports.clientSignContract = async (req, res) => {
  try {
    const contract = await Contract.findById(req.params.contractId);

    if (!contract) {
      return res.status(404).json({
        message: "Contract not found",
      });
    }

    contract.client_signed = true;

    contract.client_signed_at = Date.now();

    if (contract.artist_signed) {
      contract.status = "signed";
    }

    await contract.save();

    res.json({
      message: "Client signed successfully",

      contract,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ARTIST SIGN CONTRACT

exports.artistSignContract = async (req, res) => {
  try {
    const contract = await Contract.findById(req.params.contractId);

    if (!contract) {
      return res.status(404).json({
        message: "Contract not found",
      });
    }

    contract.artist_signed = true;

    contract.artist_signed_at = Date.now();

    if (contract.client_signed) {
      contract.status = "signed";
    }

    await contract.save();

    res.json({
      message: "Artist signed successfully",

      contract,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET CONTRACT BY CONTRACT ID

exports.getContract = async (req, res) => {
  try {
    const contract = await Contract.findById(req.params.contractId)

      .populate("client", "username email")

      .populate("artist", "username email")

      .populate("booking");

    if (!contract) {
      return res.status(404).json({
        message: "Contract not found",
      });
    }

    res.json(contract);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.getAllContracts = async (req, res) => {
  const filter = {};

  if (req.query.artistId) filter.artistId = req.query.artistId;
  if (req.query.clientId) filter.clientId = req.query.clientId;

  const contracts = await Contract.find(filter);
  res.json(contracts);
};
