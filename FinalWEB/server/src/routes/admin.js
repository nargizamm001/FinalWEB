// server/src/routes/admin.js
const router = require("express").Router();
const { authRequired } = require("../middleware/auth");
const checkRole = require("../middleware/checkRole");

const Workout = require("../models/Workout");
const Notification = require("../models/Notification");

router.use(authRequired);
router.use(checkRole("admin"));


router.get("/workouts", async (req, res, next) => {
  try {
    const limit = Math.min(Number(req.query.limit || 50), 200);

    const items = await Workout.find({})
      .sort({ date: -1 })
      .limit(limit)
      .populate("userId", "email name");

    res.json({ items });
  } catch (e) {
    next(e);
  }
});

/**
 * DELETE /api/admin/workouts/:id
 * Admin-only: delete any workout + create notification for workout owner
 */
router.delete("/workouts/:id", async (req, res, next) => {
  try {
    const workout = await Workout.findById(req.params.id);
    if (!workout) return res.status(404).json({ error: "Workout not found" });

    // delete workout
    await Workout.deleteOne({ _id: workout._id });

    // notify workout owner
    await Notification.create({
      userId: workout.userId,
      createdBy: req.user.id, // admin id
      message: `Admin deleted your workout (${new Date(workout.date).toISOString().slice(0, 10)})`,
      type: "warning",
      meta: { workoutId: workout._id.toString() }
    });

    res.json({ message: "Workout deleted by admin" });
  } catch (e) {
    next(e);
  }
});

module.exports = router;