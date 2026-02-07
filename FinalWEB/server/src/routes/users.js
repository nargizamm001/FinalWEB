const router = require("express").Router();
const { authRequired } = require("../middleware/auth");
const { getProfile, updateProfile } = require("../controllers/userController");

router.use(authRequired);

router.get("/profile", getProfile);
router.put("/profile", updateProfile);

module.exports = router;
