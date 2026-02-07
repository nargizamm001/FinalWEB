import React, { useEffect, useState } from "react";
import http from "../api/http";
import { useParams } from "react-router-dom";

export default function WorkoutDetails() {
  const { id } = useParams();
  const [workout, setWorkout] = useState(null);
  const [err, setErr] = useState("");

  // Для простоты: exerciseId вводим руками (позже можно сделать справочник)
  const [exerciseId, setExerciseId] = useState("");
  const [reps, setReps] = useState(10);
  const [weight, setWeight] = useState(40);

  const load = async () => {
    setErr("");
    try {
      const res = await http.get(`/workouts/${id}`);
      setWorkout(res.data);
    } catch (e) {
      setErr(e?.response?.data?.error || "Failed to load workout");
    }
  };

  useEffect(() => {
    load();
  }, [id]);

  const addItem = async () => {
    await http.post(`/workouts/${id}/items`, { exerciseId });
    await load();
  };

  const addSet = async (exId) => {
    await http.post(`/workouts/${id}/items/${exId}/sets`, { reps: Number(reps), weight: Number(weight), restSec: 60 });
    await load();
  };

  const deleteSet = async (exId, setId) => {
    await http.delete(`/workouts/${id}/items/${exId}/sets/${setId}`);
    await load();
  };

  const removeItem = async (exId) => {
    await http.delete(`/workouts/${id}/items/${exId}`);
    await load();
  };

  if (err) return <div style={{ color: "crimson" }}>{err}</div>;
  if (!workout) return <div>Loading...</div>;

  return (
    <div>
      <h2>Workout Details</h2>
      <div>Date: {new Date(workout.date).toISOString().slice(0, 10)}</div>

      <div style={{ marginTop: 12, border: "1px solid #ddd", padding: 10, borderRadius: 8 }}>
        <div>Add exercise to workout (paste Exercise ObjectId)</div>
        <input value={exerciseId} onChange={(e) => setExerciseId(e.target.value)} placeholder="exerciseId (24 chars)" />
        <button onClick={addItem} disabled={exerciseId.length !== 24}>Add exercise</button>
      </div>

      <div style={{ marginTop: 12, border: "1px solid #ddd", padding: 10, borderRadius: 8 }}>
        <div>Add set values</div>
        <div style={{ display: "flex", gap: 8 }}>
          <input type="number" value={reps} onChange={(e) => setReps(e.target.value)} />
          <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} />
        </div>
      </div>

      <h3 style={{ marginTop: 16 }}>Exercises</h3>
      {workout.items.map((it) => (
        <div key={it._id} style={{ border: "1px solid #ddd", padding: 10, borderRadius: 8, marginBottom: 10 }}>
          <div>exerciseId: {it.exerciseId}</div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => addSet(it.exerciseId)}>Add set</button>
            <button onClick={() => removeItem(it.exerciseId)}>Remove exercise</button>
          </div>

          <ul>
            {it.sets.map((s) => (
              <li key={s._id}>
                reps: {s.reps}, weight: {s.weight}
                <button style={{ marginLeft: 8 }} onClick={() => deleteSet(it.exerciseId, s._id)}>
                  delete set
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}