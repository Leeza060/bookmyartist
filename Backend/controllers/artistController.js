const UserModel = require("../models/userModel");

const artistSelect = "-password";

exports.getAllArtists = async (req, res) => {
  try {
    const artists = await UserModel.find({
      role: "artist",
      // emailVerified: true,
    }).select(artistSelect);

    res.status(200).json({ count: artists.length, artists });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getArtistProfile = async (req, res) => {
  try {
    const {id} = req.params
    const artist = await UserModel.findOne({
      _id: id,
      role: "artist"
    }).select(artistSelect);

    if (!artist) {
      return res.status(404).json({ error: "Artist not found" });
    }

    res.status(200).json({success: true, artist});

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getArtistByCategory = async(req, res) =>{
  try{
    const {category} = req.params

    if(!category){
      return res.status(400).json({error: "Category is required"})
    } 

    const artists = await UserModel.find({
      role: "artist",
      category: category,
      // verificationStatus: "approved",

    }).select(artistSelect)

    if(!artists || artists.length === 0){
      return res.status(404).json({
        message: `No artists found in "${category}" category.`
      })
    }

    res.status(200).json({
      count: artists.length,
      artists
    })

  }catch(error){
    return res.status(500).json({error: error.message})
  }
}

exports.updateArtistProfile = async (req, res) => {
  try {
    const artist = await UserModel.findOne({
      _id: req.params.id,
      role: "artist",
    });

    if (!artist) {
      return res.status(404).json({ error: "Artist not found" });
    }

    const { username, phoneNumber, category, bio, pricePerHour } = req.body;

    if (username !== undefined) artist.username = username;
    if (phoneNumber !== undefined) artist.phoneNumber = phoneNumber;
    if (category !== undefined) artist.category = category;
    if (bio !== undefined) artist.bio = bio;
    if (pricePerHour !== undefined) artist.pricePerHour = pricePerHour;
    if (req.file) artist.profileImage = req.file.path;

    await artist.save();

    const updatedArtist = await UserModel.findById(artist._id).select(artistSelect);

    res.status(200).json({
      message: "Artist profile updated successfully",
      artist: updatedArtist,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: "Username already exists" });
    }

    return res.status(500).json({ error: error.message });
  }
};
