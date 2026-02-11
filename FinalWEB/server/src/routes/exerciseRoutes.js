const router = require("express").Router();
const { authRequired } = require("../middleware/auth");
const Exercise = require("../models/Exercise");

router.use(authRequired);

// GET /api/exercises?q=bench&limit=50
router.get("/", async (req, res, next) => {
  try {
    const q = (req.query.q || "").trim();
    const limit = Math.min(Number(req.query.limit || 50), 200);

    const filter = q
      ? {
          $or: [
            { name: { $regex: q, $options: "i" } },
            { muscleGroup: { $regex: q, $options: "i" } },
          ],
        }
      : {};

    const items = await Exercise.find(filter).sort({ name: 1 }).limit(limit);
    res.json({ items });
  } catch (e) {
    next(e);
  }
});

module.exports = router;