const router = require("express").Router();
const { authRequired } = require("../middleware/auth");
const checkRole = require("../middleware/checkRole");
const Workout = require("../models/Workout");

router.use(authRequired);
router.use(checkRole("admin"));

router.delete("/workouts/:id", async (req, res, next) => {
  try {
    const deleted = await Workout.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Workout not found" });
    res.json({ message: "Workout deleted by admin" });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
