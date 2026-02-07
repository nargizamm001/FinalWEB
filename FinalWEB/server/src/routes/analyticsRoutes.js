const router = require("express").Router();
const { authRequired } = require("../middleware/auth");
const { weeklySummary, topExercises } = require("../controllers/analyticsController");

router.use(authRequired);

router.get("/weekly-summary", weeklySummary);
router.get("/top-exercises", topExercises);

module.exports = router;