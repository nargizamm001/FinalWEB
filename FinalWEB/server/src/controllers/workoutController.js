const mongoose = require("mongoose");
const Workout = require("../models/Workout");

async function createWorkout(req, res) {
  const workout = await Workout.create({
    userId: req.user.id,
    date: req.body.date,
    durationMin: req.body.durationMin ?? 30,
    notes: req.body.notes ?? "",
    items: []
  });
  res.status(201).json(workout);
}

async function listWorkouts(req, res) {
  const { from, to, page = 1, limit = 10, sort = "desc" } = req.query;

  const q = { userId: req.user.id };
  if (from || to) {
    q.date = {};
    if (from) q.date.$gte = new Date(from);
    if (to) q.date.$lte = new Date(to);
  }

  const skip = (Number(page) - 1) * Number(limit);
  const sortVal = sort === "asc" ? 1 : -1;

  const [items, total] = await Promise.all([
    Workout.find(q)
      .sort({ date: sortVal })
      .skip(skip)
      .limit(Number(limit))
      .populate("items.exerciseId", "name muscleGroup"),
    Workout.countDocuments(q)
  ]);

  res.json({ items, total, page: Number(page), limit: Number(limit) });
}

async function getWorkout(req, res) {
  const workout = await Workout.findOne({ _id: req.params.id, userId: req.user.id })
    .populate("items.exerciseId", "name muscleGroup");

  if (!workout) return res.status(404).json({ error: "Workout not found" });
  res.json(workout);
}

async function updateWorkout(req, res) {
  const workout = await Workout.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.id },
    { $set: { date: req.body.date, durationMin: req.body.durationMin, notes: req.body.notes } },
    { new: true }
  ).populate("items.exerciseId", "name muscleGroup");

  if (!workout) return res.status(404).json({ error: "Workout not found" });
  res.json(workout);
}

async function deleteWorkout(req, res) {
  const ok = await Workout.deleteOne({ _id: req.params.id, userId: req.user.id });
  if (ok.deletedCount === 0) return res.status(404).json({ error: "Workout not found" });
  res.json({ ok: true });
}

// add item (exercise) to workout
async function addItem(req, res) {
  const { exerciseId } = req.body;

  const workout = await Workout.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.id },
    { $push: { items: { _id: new mongoose.Types.ObjectId(), exerciseId, sets: [] } } },
    { new: true }
  ).populate("items.exerciseId", "name muscleGroup");

  if (!workout) return res.status(404).json({ error: "Workout not found" });
  res.json(workout);
}

// add set to specific exercise item
async function addSet(req, res) {
  const { reps, weight, restSec = 60 } = req.body;
  const workoutId = req.params.id;
  const exerciseId = req.params.exerciseId;

  const workout = await Workout.findOneAndUpdate(
    { _id: workoutId, userId: req.user.id, "items.exerciseId": exerciseId },
    { $push: { "items.$.sets": { _id: new mongoose.Types.ObjectId(), reps, weight, restSec } } },
    { new: true }
  ).populate("items.exerciseId", "name muscleGroup");

  if (!workout) return res.status(404).json({ error: "Workout or exercise item not found" });
  res.json(workout);
}

// edit specific set
async function editSet(req, res) {
  const workoutId = req.params.id;
  const exerciseId = req.params.exerciseId;
  const setId = req.params.setId;

  const update = {};
  if (req.body.reps != null) update["items.$[it].sets.$[st].reps"] = req.body.reps;
  if (req.body.weight != null) update["items.$[it].sets.$[st].weight"] = req.body.weight;
  if (req.body.restSec != null) update["items.$[it].sets.$[st].restSec"] = req.body.restSec;

  if (Object.keys(update).length === 0) return res.status(400).json({ error: "No fields to update" });

  const workout = await Workout.findOneAndUpdate(
    { _id: workoutId, userId: req.user.id },
    { $set: update },
    {
      new: true,
      arrayFilters: [
        { "it.exerciseId": new mongoose.Types.ObjectId(exerciseId) },
        { "st._id": new mongoose.Types.ObjectId(setId) }
      ]
    }
  ).populate("items.exerciseId", "name muscleGroup");

  if (!workout) return res.status(404).json({ error: "Workout not found" });
  res.json(workout);
}

// delete specific set
async function deleteSet(req, res) {
  const workoutId = req.params.id;
  const exerciseId = req.params.exerciseId;
  const setId = req.params.setId;

  const workout = await Workout.findOneAndUpdate(
    { _id: workoutId, userId: req.user.id },
    { $pull: { "items.$[it].sets": { _id: new mongoose.Types.ObjectId(setId) } } },
    {
      new: true,
      arrayFilters: [{ "it.exerciseId": new mongoose.Types.ObjectId(exerciseId) }]
    }
  ).populate("items.exerciseId", "name muscleGroup");

  if (!workout) return res.status(404).json({ error: "Workout not found" });
  res.json(workout);
}

// remove exercise item from workout
async function removeItem(req, res) {
  const workoutId = req.params.id;
  const exerciseId = req.params.exerciseId;

  const workout = await Workout.findOneAndUpdate(
    { _id: workoutId, userId: req.user.id },
    { $pull: { items: { exerciseId: new mongoose.Types.ObjectId(exerciseId) } } },
    { new: true }
  ).populate("items.exerciseId", "name muscleGroup");

  if (!workout) return res.status(404).json({ error: "Workout not found" });
  res.json(workout);
}

module.exports = {
  createWorkout,
  listWorkouts,
  getWorkout,
  updateWorkout,
  deleteWorkout,
  addItem,
  addSet,
  editSet,
  deleteSet,
  removeItem
};