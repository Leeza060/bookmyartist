const { getAllArtists, getArtistByCategory, getArtistProfile, updateArtistProfile } = require('../controllers/artistController');
const upload = require('../middleware/fileUpload');

const router = require('express').Router()

router.get("/getallartists", getAllArtists);
router.get("/getartists/category/:category", getArtistByCategory);
router.get("/artistprofile/:id", getArtistProfile);
router.put("/updateartistprofile/:id", upload.single("profileImage"), updateArtistProfile);

module.exports = router
