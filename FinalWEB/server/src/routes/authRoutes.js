const router = require("express").Router();
const Joi = require("joi");
const { validateBody } = require("../middleware/validate");
const { authRequired } = require("../middleware/auth");
const { register, login, me } = require("../controllers/authController");

const registerSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(50).required()
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(50).required()
});

router.post("/register", validateBody(registerSchema), register);
router.post("/login", validateBody(loginSchema), login);

router.get("/me", authRequired, me);

module.exports = router;