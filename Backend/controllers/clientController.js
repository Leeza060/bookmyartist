//this has been converted to authController, artistController, adminController

const UserModel = require("../models/userModel");
const bcrypt = require("bcrypt");

exports.getAllClients = async (req, res) => {
  try {
    const clients = await UserModel.find({
      role: "client",
      // emailVerified: true,
    });

    res.status(200).json({ count: clients.length, clients });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getClientById = async (req, res) => {
  try {
    const {id} = req.params
    const client = await UserModel.findOne({
      _id: id,
      role: "client"
    });

    if (!client) {
      return res.status(404).json({ error: "Client not found" });
    }

    res.status(200).json({success: true, client});

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// exports.getClientDetails = async(req, res) =>{
//   try{
//     const {category} = req.params

//     if(!category){
//       return res.status(400).json({error: "Category is required"})
//     } 

//     const artists = await UserModel.find({
//       role: "artist",
//       category: category,
//       // verificationStatus: "approved",

//     })

//     if(!artists || artists.length === 0){
//       return res.status(404).json({
//         message: `No artists found in "${category}" category.`
//       })
//     }

//     res.status(200).json({
//       count: artists.length,
//       artists
//     })

//   }catch(error){
//     return res.status(500).json({error: error.message})
//   }
// }
 
exports.updateArtist = async (req, res) => {
  try {
    const { username, email, phoneNumber, password, role, category, bio, basePrice, profileImage } = req.body;

    if (role === "artist" && (!category || !basePrice)) {
      return res.status(400).json({ error: "Category and Base Price required for Artist." });
    }
    //fake admin roles prevention
    if (role === "admin") {
      return res.status(403).json({ error: "Cannot register as Admin" });
    }

    //username available or not
    let usernameExists = await UserModel.findOne({ username });
    if (usernameExists) {
      return res.status(400).json({ error: "Username already registered." });
    }

    //email registered or not
    let emailExists = await UserModel.findOne({ email });
    if (emailExists) {
      return res.status(400).json({ error: "Email already registered." });
    }

    //phone number registered or not
    let phoneNumberExists = await UserModel.findOne({ phoneNumber });
    if (phoneNumberExists) {
      return res.status(400).json({ error: "Phone number already registered." });
    }

    //hash password
    let salt = await bcrypt.genSalt(Number(process.env.SALTROUNDS));
    let hashedPassword = await bcrypt.hash(password, salt);

    //save user in DB
    let userToRegister = await UserModel.create({
      username,
      email,
      password: hashedPassword,
      role: userRole,

      category: category,
      bio: bio,
      basePrice: basePrice,
      profileImage: profileImage,
      emailVerified: role == "artist" ? false : true,
    });

    if (!userToRegister) {
      return res.status(400).json({ error: "Something went wrong" });
    }

    //generate verification token

    //send token in email

    res.status(201).json({
      message: `${userRole} registered successfully!`,
    });

  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};
