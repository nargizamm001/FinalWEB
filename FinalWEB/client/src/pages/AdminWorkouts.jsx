import React, { useEffect, useState } from "react";
import http from "../api/http";

export default function AdminWorkouts() {
  const [items, setItems] = useState([]);
  const [err, setErr] = useState("");

  const load = async () => {
    setErr("");
    try {
      const res = await http.get("/admin/workouts?limit=100");
      setItems(res.data.items || []);
    } catch (e) {
      setErr(e?.response?.data?.error || "Failed to load admin workouts");
    }
  };

  useEffect(() => { load(); }, []);

  const del = async (id) => {
    try {
      await http.delete(`/admin/workouts/${id}`);
      await load();
    } catch (e) {
      setErr(e?.response?.data?.error || "Delete failed");
    }
  };

  return (
    <div>
      <h2>Admin: All Workouts</h2>
      {err && <div style={{ color: "crimson" }}>{err}</div>}

      <ul style={{ display: "grid", gap: 8 }}>
        {items.map((w) => (
          <li key={w._id} style={{ border: "1px solid #ddd", padding: 10, borderRadius: 8 }}>
            <div><b>User:</b> {w.userId?.email || w.userId}</div>
            <div><b>Date:</b> {new Date(w.date).toISOString().slice(0, 10)}</div>
            <div><b>Duration:</b> {w.durationMin} min</div>
            <button className="btn danger" onClick={() => del(w._id)}>
              Admin delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}