// const { verifyArtist } = require('../controllers/adminController');

const { getAllUsers, verifyArtist, getUserDetails } = require('../controllers/adminController');

const router = require('express').Router()

router.get("/allusers", getAllUsers);
router.get("/userdetails/:userId", getUserDetails);
router.patch("/verifyartist/:id", verifyArtist);

// router.get("/verifyartist/:token", getAllArtists);

module.exports = router
