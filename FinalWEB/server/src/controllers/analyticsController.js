const Workout = require("../models/Workout");
const mongoose = require("mongoose");

async function weeklySummary(req, res) {
  const from = req.query.from ? new Date(req.query.from) : new Date("2000-01-01");
  const to = req.query.to ? new Date(req.query.to) : new Date();
  const userId = new mongoose.Types.ObjectId(req.user.id);

  const result = await Workout.aggregate([
    { $match: { userId, date: { $gte: from, $lte: to } } },
    { $addFields: { week: { $isoWeek: "$date" }, year: { $isoWeekYear: "$date" } } },
    { $group: { _id: { year: "$year", week: "$week" }, workouts: { $sum: 1 }, totalMinutes: { $sum: "$durationMin" } } },
    { $sort: { "_id.year": 1, "_id.week": 1 } },
    { $project: { _id: 0, year: "$_id.year", week: "$_id.week", workouts: 1, totalMinutes: 1 } }
  ]);

  res.json(result);
}

async function topExercises(req, res) {
  const from = req.query.from ? new Date(req.query.from) : new Date("2000-01-01");
  const to = req.query.to ? new Date(req.query.to) : new Date();
  const limit = Math.min(Number(req.query.limit || 10), 50);
  const userId = new mongoose.Types.ObjectId(req.user.id);

  const result = await Workout.aggregate([
    { $match: { userId, date: { $gte: from, $lte: to } } },
    { $unwind: "$items" },
    { $group: { _id: "$items.exerciseId", times: { $sum: 1 }, setsTotal: { $sum: { $size: "$items.sets" } } } },
    { $sort: { times: -1 } },
    { $limit: limit },
    { $lookup: { from: "exercises", localField: "_id", foreignField: "_id", as: "exercise" } },
    { $unwind: "$exercise" },
    { $project: { _id: 0, exerciseId: "$_id", name: "$exercise.name", muscleGroup: "$exercise.muscleGroup", times: 1, setsTotal: 1 } }
  ]);

  res.json(result);
}

module.exports = { weeklySummary, topExercises };