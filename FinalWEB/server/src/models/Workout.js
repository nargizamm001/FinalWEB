const mongoose = require("mongoose");

const setSchema = new mongoose.Schema(
  {
    reps: { type: Number, required: true, min: 1 },
    weight: { type: Number, required: true, min: 0 },
    restSec: { type: Number, default: 60, min: 0 }
  },
  { _id: true }
);

const itemSchema = new mongoose.Schema(
  {
    exerciseId: { type: mongoose.Schema.Types.ObjectId, ref: "Exercise", required: true },
    sets: { type: [setSchema], default: [] }
  },
  { _id: true }
);

const workoutSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    date: { type: Date, required: true, index: true },
    durationMin: { type: Number, default: 30, min: 0 },
    notes: { type: String, default: "" },
    items: { type: [itemSchema], default: [] }
  },
  { timestamps: true }
);

workoutSchema.index({ userId: 1, date: -1 }); // compound index

module.exports = mongoose.model("Workout", workoutSchema);