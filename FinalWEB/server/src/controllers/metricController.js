const Metric = require("../models/Metric");

async function upsertMetric(req, res) {
  const { date, weightKg, steps, sleepHours, waterMl } = req.body;

  const metric = await Metric.findOneAndUpdate(
    { userId: req.user.id, date: new Date(date) },
    { $set: { weightKg, steps, sleepHours, waterMl } },
    { new: true, upsert: true }
  );

  res.status(201).json(metric);
}

async function listMetrics(req, res) {
  const { from, to } = req.query;
  const q = { userId: req.user.id };

  if (from || to) {
    q.date = {};
    if (from) q.date.$gte = new Date(from);
    if (to) q.date.$lte = new Date(to);
  }

  const items = await Metric.find(q).sort({ date: 1 });
  res.json(items);
}

async function deleteMetric(req, res) {
  const ok = await Metric.deleteOne({ _id: req.params.id, userId: req.user.id });
  if (ok.deletedCount === 0) return res.status(404).json({ error: "Metric not found" });
  res.json({ ok: true });
}

module.exports = { upsertMetric, listMetrics, deleteMetric };