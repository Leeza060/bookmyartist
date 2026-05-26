const jwt = require('jsonwebtoken')
const User = require('../models/userModel')


exports.isLoggedIn = async(req, res, next) => {
  if(!req.headers ["authorization"]){
    return res.status(401).json({error: "You need to login first"})
  }
  else{
    let token = req.headers["authorization"]
    let decrypted = jwt.verify(token, process.env.JWT_SECRET)

    let user = await UserModel.findById(decrypted._id)

    if(!user){
      return res.status(403).json({error: "Cannot verify your account"})
    }

    next()
  }
}


exports.isAdmin = async(req, res, next) => {
  if(!req.headers ["authorization"]){
    return res.status(401).json({error: "You need to login first"})
  }
  else{
    let token = req.headers["authorization"]
    let decrypted = jwt.verify(token, process.env.JWT_SECRET)

    let user = await UserModel.findById(decrypted._id)

    if(!user){
      return res.status(403).json({error: "Cannot verify your account"})
    }

    if (user.role !== "admin") {
      return res.status(400).json({ error: "You need to be admin first" });
    }

    next()
  }
}