const { register, resendVerificationToken, verifyEmail, forgetPassword, resetPassword, login } = require("../controllers/authController");
const upload = require("../middleware/fileUpload");


const router = require("express").Router();

router.post("/register", upload.single('profileImage'),register);
router.post("/login", login)
router.post("/resendverificationtoken", resendVerificationToken);

router.get('/verifyemail/:token', verifyEmail)
router.post('/forgetpassword', forgetPassword)
router.post('/resetpassword/:token', resetPassword)


module.exports = router;
