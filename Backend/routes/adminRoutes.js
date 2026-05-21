// const { verifyArtist } = require('../controllers/adminController');

const { getAllUsers, verifyArtist } = require('../controllers/adminController');

const router = require('express').Router()

router.get("/getallusers", getAllUsers);
router.patch("/verifyartist/:id", verifyArtist);

// router.get("/verifyartist/:token", getAllArtists);

module.exports = router
