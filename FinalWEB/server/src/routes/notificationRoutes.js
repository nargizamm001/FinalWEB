const router = require("express").Router();
const { authRequired } = require("../middleware/auth");
const Notification = require("../models/Notification");
const User = require("../models/User");

router.use(authRequired);

router.get("/", async (req, res, next) => {
  try {
    const limit = Math.min(Number(req.query.limit || 30), 100);
    const items = await Notification.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(limit);
    res.json({ items });
  } catch (e) {
    next(e);
  }
});

router.patch("/:id/read", async (req, res, next) => {
  try {
    const notif = await Notification.findOne({ _id: req.params.id, userId: req.user.id });
    if (!notif) return res.status(404).json({ error: "Notification not found" });

    if (notif.read) return res.json(notif);

    notif.read = true;
    await notif.save();

    if (notif.createdBy && notif.createdBy.toString() !== req.user.id) {
      const me = await User.findById(req.user.id).select("email name");

      await Notification.create({
        userId: notif.createdBy, 
        message: `User ${me?.email || req.user.id} read the deletion notice`,
        type: "info",
        meta: { originalNotificationId: notif._id.toString(), ...notif.meta }
      });
    }

    res.json(notif);
  } catch (e) {
    next(e);
  }
});

module.exports = router;