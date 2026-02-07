const mongoose = require("mongoose");

const exerciseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    muscleGroup: { type: String, required: true, trim: true }
  },
  { timestamps: true }
);

exerciseSchema.index({ name: 1, muscleGroup: 1 });

module.exports = mongoose.model("Exercise", exerciseSchema);