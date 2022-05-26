const express = require("express");
const router = express.Router();
const { registerUser, loginUser, getUserData, getUserAPIKEY } = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

router.post("/signup", registerUser);
router.post("/login", loginUser);
router.get("/user/data", protect, getUserData);
router.get("/generate/apikey", protect, getUserAPIKEY);

module.exports = router;