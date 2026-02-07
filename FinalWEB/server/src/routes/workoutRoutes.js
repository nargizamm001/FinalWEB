const router = require("express").Router();
const Joi = require("joi");
const { validateBody } = require("../middleware/validate");
const { authRequired } = require("../middleware/auth");
const c = require("../controllers/workoutController");

const createWorkoutSchema = Joi.object({
  date: Joi.date().required(),
  durationMin: Joi.number().min(0).optional(),
  notes: Joi.string().allow("").optional()
});

const updateWorkoutSchema = Joi.object({
  date: Joi.date().required(),
  durationMin: Joi.number().min(0).required(),
  notes: Joi.string().allow("").required()
});

const addItemSchema = Joi.object({
  exerciseId: Joi.string().length(24).required()
});

const addSetSchema = Joi.object({
  reps: Joi.number().min(1).required(),
  weight: Joi.number().min(0).required(),
  restSec: Joi.number().min(0).optional()
});

const editSetSchema = Joi.object({
  reps: Joi.number().min(1).optional(),
  weight: Joi.number().min(0).optional(),
  restSec: Joi.number().min(0).optional()
});

router.use(authRequired);

router.post("/", validateBody(createWorkoutSchema), c.createWorkout);
router.get("/", c.listWorkouts);
router.get("/:id", c.getWorkout);
router.put("/:id", validateBody(updateWorkoutSchema), c.updateWorkout);
router.delete("/:id", c.deleteWorkout);

// advanced
router.post("/:id/items", validateBody(addItemSchema), c.addItem);
router.post("/:id/items/:exerciseId/sets", validateBody(addSetSchema), c.addSet);
router.patch("/:id/items/:exerciseId/sets/:setId", validateBody(editSetSchema), c.editSet);
router.delete("/:id/items/:exerciseId/sets/:setId", c.deleteSet);
router.delete("/:id/items/:exerciseId", c.removeItem);

module.exports = router;