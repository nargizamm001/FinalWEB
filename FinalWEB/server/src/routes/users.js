const router = require("express").Router();
const Joi = require("joi");
const { validateBody } = require("../middleware/validate");
const { authRequired } = require("../middleware/auth");
const { getProfile, updateProfile } = require("../controllers/userController");

const updateProfileSchema = Joi.object({
  name: Joi.string().min(2).max(50).optional(),
  email: Joi.string().email().optional()
}).min(1); 

router.use(authRequired);

router.get("/profile", getProfile);
router.put("/profile", validateBody(updateProfileSchema), updateProfile);

module.exports = router;