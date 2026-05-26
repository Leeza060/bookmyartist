const UserModel = require("../models/userModel");
const TokenModel = require("../models/tokenModel");

const bcrypt = require("bcrypt");
const crypto = require("crypto");

const sendEmail = require("../middleware/emailSender");
const jwt = require("jsonwebtoken");

//validators
const { validateRegister, validateLogin } = require("../utils/validators/authValidator");

//helpers
const hashPassword = require("../utils/helpers/hashPassword");
const generateToken = require("../utils/helpers/generateToken");
const verificationEmail = require("../utils/helpers/verificationEmail");
const resetPasswordEmail = require("../utils/helpers/resetPasswordEmail");

exports.register = async (req, res) => {
  try {
    const { username, email, phoneNumber, password, role, address, category, bio, pricePerHour } = req.body;

    //incase of Rita or rita in gmail as unique email
    //email normalization
    const normalizedEmail = email?.toLowerCase().trim();

    const validation = validateRegister({
      ...req.body,
      email: normalizedEmail,
    });

    if (!validation.isValid) {
      return res.status(400).json({
        errors: validation.errors,
      });
    }

    const existingUser = await UserModel.findOne({
      $or: [{ username }, { email: normalizedEmail }, { phoneNumber }],
    });

    if (existingUser) {
      const errors = [];

      if (existingUser.username === username) {
        errors.push({
          field: "username",
          message: "Username already exists",
        });
      }

      if (existingUser.email === normalizedEmail) {
        errors.push({
          field: "email",
          message: "Email already exists",
        });
      }

      if (existingUser.phoneNumber === phoneNumber) {
        errors.push({
          field: "phoneNumber",
          message: "Phone number already exists",
        });
      }

      return res.status(409).json({
        success: false,
        errors,
      });
    }

    const hashedPassword = await hashPassword(password);

    //save user in DB
    let userToRegister = await UserModel.create({
      username,
      email,
      phoneNumber,
      password: hashedPassword,
      role,

      category,
      bio,
      pricePerHour,
      address: address || "",

      profileImage: req.file ? req.file.path : "", //middleware fileUpload
    });

    if (!userToRegister) {
      return res.status(400).json({ error: "Something went wrong with the registration." });
    }

    //generate verification token
    let tokenToSend = await TokenModel.create({
      token: generateToken(),
      user: userToRegister._id,
    });

    //send token in email
    let URL = `http://localhost:5001/api/auth/verifyemail/${tokenToSend.token}`;

    sendEmail({
      from: "noreply@something.com",
      to: email,
      subject: "Verification email",
      text: "Thank you for registering",
      html: verificationEmail(URL),
    });

    // remove password before response
    const userResponse = userToRegister.toObject();

    delete userResponse.password;

    res.status(201).json({
      message: `${role} registered successfully!`,
      userToRegister,
      tokenToSend,
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
    let URL = `http://localhost:5001/api/auth/verifyemail/${tokenToSend.token}`;

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

exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

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

    // validate password
    if (!password) {
      return res.status(400).json({
        error: "Missing Password",
      });
    }
    if (password.length < 6) {
      return res.status(400).json({
        error: "Password must at least be 6",
      });
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
    let URL = `http://localhost:5001/api/auth/resetpassword/${tokenToSend.token}`;

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
      return res.status(404).json({ error: "User not found" });
    }

    // 3. check password
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    if (!user.emailVerified) {
      return res.status(403).json({
        error: "Please verify your email first",
      });
    }

    const userResponse = user.toObject();
    delete userResponse.password;

    // 4. JWT Authentication Token for login authentication, protected routes, keeping user logged in
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
