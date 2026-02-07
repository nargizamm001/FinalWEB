import React, { useEffect, useState } from "react";
import http from "../api/http";
import { Link } from "react-router-dom";

export default function Workouts() {
  const [items, setItems] = useState([]);
  const [err, setErr] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

  const load = async () => {
    setErr("");
    try {
      const res = await http.get("/workouts?limit=50");
      setItems(res.data.items || []);
    } catch (e) {
      setErr(e?.response?.data?.error || "Failed to load workouts");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const create = async () => {
    setErr("");
    try {
      await http.post("/workouts", { date: new Date(date), durationMin: 30, notes: "" });
      await load();
    } catch (e) {
      setErr(e?.response?.data?.error || "Create failed");
    }
  };

  const remove = async (id) => {
    await http.delete(`/workouts/${id}`);
    await load();
  };

  return (
    <div>
      <h2>Workouts</h2>
      {err && <div style={{ color: "crimson" }}>{err}</div>}

      <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 12 }}>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <button onClick={create}>Create workout</button>
      </div>

      <ul style={{ display: "grid", gap: 8 }}>
        {items.map((w) => (
          <li key={w._id} style={{ border: "1px solid #ddd", padding: 10, borderRadius: 8 }}>
            <div>Date: {new Date(w.date).toISOString().slice(0, 10)}</div>
            <div>Duration: {w.durationMin} min</div>
            <div style={{ display: "flex", gap: 10 }}>
              <Link to={`/workouts/${w._id}`}>Open</Link>
              <button onClick={() => remove(w._id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}