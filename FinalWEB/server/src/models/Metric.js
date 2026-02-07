const mongoose = require("mongoose");

const metricSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    date: { type: Date, required: true, index: true },
    weightKg: { type: Number, min: 0 },
    steps: { type: Number, min: 0 },
    sleepHours: { type: Number, min: 0 },
    waterMl: { type: Number, min: 0 }
  },
  { timestamps: true }
);

metricSchema.index({ userId: 1, date: -1 }, { unique: true }); // 1 запись на день

module.exports = mongoose.model("Metric", metricSchema);