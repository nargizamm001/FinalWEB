import React, { useEffect, useMemo, useState } from "react";
import http from "../api/http";
import { useParams } from "react-router-dom";

export default function WorkoutDetails() {
  const { id } = useParams();

  const [workout, setWorkout] = useState(null);
  const [err, setErr] = useState("");

  const [durationMin, setDurationMin] = useState(30);
  const [notes, setNotes] = useState("");

  const [q, setQ] = useState("");
  const [exercises, setExercises] = useState([]);
  const [selectedExerciseId, setSelectedExerciseId] = useState("");

  const [reps, setReps] = useState(10);
  const [weight, setWeight] = useState(40);

  const loadWorkout = async () => {
    setErr("");
    try {
      const res = await http.get(`/workouts/${id}`);
      setWorkout(res.data);
      setDurationMin(res.data.durationMin ?? 30);
      setNotes(res.data.notes ?? "");
    } catch (e) {
      setErr(e?.response?.data?.error || "Failed to load workout");
    }
  };

  const loadExercises = async () => {
    try {
      const res = await http.get(`/exercises?q=${encodeURIComponent(q)}&limit=50`);
      setExercises(res.data.items || []);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    loadWorkout();
  }, [id]);

  useEffect(() => {
    const t = setTimeout(() => loadExercises(), 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  useEffect(() => {
    loadExercises();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectedExercise = useMemo(
    () => exercises.find((x) => x._id === selectedExerciseId),
    [exercises, selectedExerciseId]
  );

  const saveWorkout = async () => {
    try {
      await http.put(`/workouts/${id}`, {
        date: workout.date,
        durationMin: Number(durationMin),
        notes: notes ?? ""
      });
      await loadWorkout();
    } catch (e) {
      setErr(e?.response?.data?.error || "Failed to update workout");
    }
  };

  const addExerciseToWorkout = async () => {
    try {
      await http.post(`/workouts/${id}/items`, { exerciseId: selectedExerciseId });
      setSelectedExerciseId("");
      await loadWorkout();
    } catch (e) {
      setErr(e?.response?.data?.error || "Failed to add exercise");
    }
  };

  const addSet = async (exerciseId) => {
    try {
      await http.post(`/workouts/${id}/items/${exerciseId}/sets`, {
        reps: Number(reps),
        weight: Number(weight),
        restSec: 60
      });
      await loadWorkout();
    } catch (e) {
      setErr(e?.response?.data?.error || "Failed to add set");
    }
  };

  const deleteSet = async (exerciseId, setId) => {
    try {
      await http.delete(`/workouts/${id}/items/${exerciseId}/sets/${setId}`);
      await loadWorkout();
    } catch (e) {
      setErr(e?.response?.data?.error || "Failed to delete set");
    }
  };

  const removeItem = async (exerciseId) => {
    try {
      await http.delete(`/workouts/${id}/items/${exerciseId}`);
      await loadWorkout();
    } catch (e) {
      setErr(e?.response?.data?.error || "Failed to remove exercise");
    }
  };

  if (err) return <div style={{ color: "crimson" }}>{err}</div>;
  if (!workout) return <div>Loading...</div>;

  return (
    <div>
      <h2>Workout Details</h2>
      <div>Date: {new Date(workout.date).toISOString().slice(0, 10)}</div>

      {/* EDIT WORKOUT */}
      <div style={{ marginTop: 12, border: "1px solid #ddd", padding: 14, borderRadius: 12 }}>
        <h3>Edit workout</h3>

        <input
          type="number"
          placeholder="duration (minutes)"
          value={durationMin}
          onChange={(e) => setDurationMin(e.target.value)}
        />

        <input
          placeholder="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        <button className="btn primary" onClick={saveWorkout}>
          Save workout
        </button>
      </div>

      {/* ADD EXERCISE */}
      <div style={{ marginTop: 12, border: "1px solid #ddd", padding: 14, borderRadius: 12 }}>
        <h3>Add exercise</h3>

        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search exercise (e.g., bench, squat, back...)"
        />

        <select value={selectedExerciseId} onChange={(e) => setSelectedExerciseId(e.target.value)}>
          <option value="">Select exercise...</option>
          {exercises.map((x) => (
            <option key={x._id} value={x._id}>
              {x.name} — {x.muscleGroup}
            </option>
          ))}
        </select>

        <button onClick={addExerciseToWorkout} disabled={!selectedExerciseId} className="btn primary">
          Add exercise
        </button>

        {selectedExercise && (
          <div style={{ marginTop: 8, opacity: 0.85 }}>
            Selected: {selectedExercise.name} ({selectedExercise.muscleGroup})
          </div>
        )}
      </div>

      {/* ADD SET */}
      <div style={{ marginTop: 12, border: "1px solid #ddd", padding: 14, borderRadius: 12 }}>
        <h3>Add set values</h3>
        <div style={{ display: "flex", gap: 8 }}>
          <input type="number" value={reps} onChange={(e) => setReps(e.target.value)} />
          <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} />
        </div>
      </div>

      <h3 style={{ marginTop: 16 }}>Exercises</h3>

      {workout.items.map((it) => {
        const ex = it.exerciseId; // populated object: { _id, name, muscleGroup }
        const exId = ex?._id || it.exerciseId;

        return (
          <div
            key={it._id}
            style={{ border: "1px solid #ddd", padding: 14, borderRadius: 12, marginBottom: 10 }}
          >
            <div style={{ fontSize: 16, fontWeight: 800 }}>
              {ex?.name || "Exercise"}
              {ex?.muscleGroup ? ` — ${ex.muscleGroup}` : ""}
            </div>

            <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
              <button onClick={() => addSet(exId)} className="btn">
                Add set
              </button>
              <button onClick={() => removeItem(exId)} className="btn danger">
                Remove exercise
              </button>
            </div>

            <ul>
              {it.sets.map((s) => (
                <li key={s._id} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <span>
                    reps: {s.reps}, weight: {s.weight}
                  </span>
                  <button onClick={() => deleteSet(exId, s._id)} className="btn danger">
                    delete set
                  </button>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}