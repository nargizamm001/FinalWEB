const router = require("express").Router();
const Joi = require("joi");
const { validateBody } = require("../middleware/validate");
const { authRequired } = require("../middleware/auth");
const { upsertMetric, listMetrics, deleteMetric } = require("../controllers/metricController");

const metricSchema = Joi.object({
  date: Joi.date().required(),
  weightKg: Joi.number().min(0).optional(),
  steps: Joi.number().min(0).optional(),
  sleepHours: Joi.number().min(0).optional(),
  waterMl: Joi.number().min(0).optional()
});

router.use(authRequired);

router.post("/", validateBody(metricSchema), upsertMetric);
router.get("/", listMetrics);
router.delete("/:id", deleteMetric);

module.exports = router;