const UserModel = require("../models/userModel");
const TokenModel = require("../models/tokenModel");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const sendEmail = require("../middleware/emailSender");
const jwt = require("jsonwebtoken")

exports.register = async (req, res) => {
  // if (!req.file) {
  //   return res.status(400).json({ error: "Upload user image file" });
  // }

  try {
    const { username, email, phoneNumber, password, role, category, bio, basePrice } = req.body;

    const userRole = role || "client";

    //common validations
    if (!username || !email || !password || !phoneNumber) {
      return res.status(400).json({ error: "Required fields missing" });
    }

    // if (userRole !== "admin") {
    //   errors.phoneNumber = "Phone number is required";
    // }

    // if (userRole === "artist" && (!category || !basePrice)) {
    //   return res.status(400).json({ error: "Artist details required" });
    // }

    // // Return validation errors early
    // if (Object.keys(errors).length > 0) {
    //   return res.status(400).json({ errors });
    // }

    // //fake admin roles prevention
    // if (userRole === "admin") {
    //   return res.status(403).json({ error: "Cannot register as admin" });
    // }

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

    // //DB validation errors
    // if (Object.keys(errors).length > 0) {
    //   return res.status(400).json({ errors });
    // }

    //encrypt password
    let salt = await bcrypt.genSalt(Number(process.env.SALTROUNDS));
    let hashedPassword = await bcrypt.hash(password, salt);

    //save user in DB
    let userToRegister = await UserModel.create({
      username,
      email,
      phoneNumber,
      password: hashedPassword,
      role: userRole,

      category,
      bio,
      basePrice,

      profileImage: req.file ? req.file.path : "", //middleware fileUpload

      //email verification
      emailVerified: false,
    });

    if (!userToRegister) {
      return res.status(400).json({ error: "Something went wrong with the registration." });
    }

    //generate verification token
    let tokenToSend = await TokenModel.create({
      token: crypto.randomBytes(16).toString("hex"),
      user: userToRegister._id,
    });

    //send token in email
    let URL = `http://localhost:5001/verify/${tokenToSend.token}`;

    sendEmail({
      from: "noreply@something.com",
      to: email,
      subject: "Verification email",
      text: "Thank you for registering",
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
</head>
<body style="margin:0; padding:0; background-color:#fdf2f8; font-family:Arial, sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="padding:20px;">
    <tr>
      <td align="center">

        <table width="400" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:12px; padding:30px; box-shadow:0 4px 12px rgba(0,0,0,0.08);">

          <tr>
            <td align="center" style="padding-bottom:20px;">
              <h2 style="margin:0; color:#db2777;">Verify Your Email 💌</h2>
            </td>
          </tr>

          <tr>
            <td style="color:#374151; font-size:14px; text-align:center; padding-bottom:20px;">
              Thanks for signing up! Please click the button below to verify your email address.
            </td>
          </tr>

          <tr>
            <td align="center" style="padding-bottom:20px;">
              <a href="${URL}" 
                 style="background:#ec4899; color:#ffffff; padding:12px 24px; text-decoration:none; border-radius:8px; font-size:14px; display:inline-block;">
                 Verify Email
              </a>
            </td>
          </tr>

          <tr>
            <td style="font-size:12px; color:#6b7280; text-align:center;">
              If the button doesn't work, copy and paste this link:
              <br/>
              <a href="${URL}" style="color:#db2777;">${URL}</a>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>
`,
    });

    res.status(201).json({
      message: `${userRole} registered successfully!`,
      userToRegister,
      tokenToSend,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.resendVerificationToken = async (req, res) => {
  try {
    const { email } = req.body;
    //check if email is registered or not
    let user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(400).json({ error: "Email not registered." });
    }

    //check if email is already verified
    if (user.emailVerified) {
      return res.status(400).json({ error: `${user.role} email already verified` });
    }

    //generate verification token
    let tokenToSend = await TokenModel.create({
      token: crypto.randomBytes(16).toString("hex"),
      user: user._id,
    });

    //send token in email
    let URL = `http://localhost:5001/verify/${tokenToSend.token}`;

    await sendEmail({
      from: "noreply@something.com",
      to: email,
      subject: "Verification email",
      text: "Thank you for registering",
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
</head>
<body style="margin:0; padding:0; background-color:#fdf2f8; font-family:Arial, sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="padding:20px;">
    <tr>
      <td align="center">

        <table width="400" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:12px; padding:30px; box-shadow:0 4px 12px rgba(0,0,0,0.08);">

          <tr>
            <td align="center" style="padding-bottom:20px;">
              <h2 style="margin:0; color:#db2777;">Verify Your Email 💌</h2>
            </td>
          </tr>

          <tr>
            <td style="color:#374151; font-size:14px; text-align:center; padding-bottom:20px;">
              Thanks for signing up! Please click the button below to verify your email address.
            </td>
          </tr>

          <tr>
            <td align="center" style="padding-bottom:20px;">
              <a href="${URL}" 
                 style="background:#ec4899; color:#ffffff; padding:12px 24px; text-decoration:none; border-radius:8px; font-size:14px; display:inline-block;">
                 Verify Email
              </a>
            </td>
          </tr>

          <tr>
            <td style="font-size:12px; color:#6b7280; text-align:center;">
              If the button doesn't work, copy and paste this link:
              <br/>
              <a href="${URL}" style="color:#db2777;">${URL}</a>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>
`,
    });

    //send msg to user
    res.status(200).json({
      message: `Verification email resent successfully`,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    //check is token is valid or not
    let tokenData = await TokenModel.findOne({ token });
    if (!tokenData) {
      return res.status(400).json({ error: "Invalid or expired token!" });
    }

    //find user associated with token
    let user = await UserModel.findById(tokenData.user);

    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    //check if user is already verified
    if (user.emailVerified) {
      return res.status(400).json({ error: `${user.role} email already verified` });
    }

    //verify user
    user.emailVerified = true;

    //save user
    user = await user.save();

    // delete token (IMPORTANT)
    await TokenModel.deleteOne({ _id: tokenData._id });

    //send message to user
    res.status(200).json({
      message: `User verified successfullly`,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;

    //check is token is valid or not
    let tokenData = await TokenModel.findOne({ token });
    if (!tokenData) {
      return res.status(400).json({ error: "Invalid or expired token!" });
    }

    //find user associated with token
    let user = await UserModel.findById(tokenData.user);

    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    //encrypt password
    let salt = await bcrypt.genSalt(Number(process.env.SALTROUNDS));
    user.password = await bcrypt.hash(req.body.password, salt);

    //save user
    user = await user.save();

    // delete token (IMPORTANT)
    await TokenModel.deleteOne({ _id: tokenData._id });

    //send message to user
    res.status(200).json({
      message: `Password has been reset successfullly`,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.forgetPassword = async (req, res) => {
  try {
    //check if user exists by email registration
    const { email } = req.body;
    let user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    //generate verification token
    let tokenToSend = await TokenModel.create({
      token: crypto.randomBytes(16).toString("hex"),
      user: user._id,
    });

    //send token in email
    let URL = `http://localhost:5001/resetpassword/${tokenToSend.token}`;

    await sendEmail({
      from: "noreply@something.com",
      to: email,
      subject: "Forget Password Request 🔐",
      text: "Reset your password using the link below",

      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
</head>
<body style="margin:0; padding:0; background-color:#fdf2f8; font-family:Arial, sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="padding:20px;">
    <tr>
      <td align="center">

        <table width="400" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:12px; padding:30px; box-shadow:0 4px 12px rgba(0,0,0,0.08);">

          <tr>
            <td align="center" style="padding-bottom:20px;">
              <h2 style="margin:0; color:#db2777;">Reset Your Password 🔐</h2>
            </td>
          </tr>

          <tr>
            <td style="color:#374151; font-size:14px; text-align:center; padding-bottom:20px;">
              We received a request to reset your password. Click the button below to proceed.
            </td>
          </tr>

          <tr>
            <td align="center" style="padding-bottom:20px;">
              <a href="${URL}" 
                 style="background:#db2777; color:#ffffff; padding:12px 24px; text-decoration:none; border-radius:8px; font-size:14px; display:inline-block;">
                 Reset Password
              </a>
            </td>
          </tr>

          <tr>
            <td style="font-size:12px; color:#6b7280; text-align:center;">
              If you did not request this, you can safely ignore this email.<br/>
              This link will expire after use for security reasons.
              <br/><br/>
              <a href="${URL}" style="color:#db2777;">${URL}</a>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>
`,
    });

    //send msg to user
    res.status(200).json({
      message: `Password reset link has been sent to your email`,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. check fields
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

    // 2. check user exists
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // 3. check password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // (optional) check artist approval
    if (user.role === "artist" && user.verificationStatus !== "approved") {
      return res.status(403).json({ error: "Artist not approved yet" });
    }

    const userResponse = user.toObject();
    delete userResponse.password;

    // 4. generate login token
    const token = jwt.sign(
      {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" },
    );

    // 5. success
    res.status(200).json({
      message: "Login successful",
      token,
      user: userResponse,
    });
    
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

