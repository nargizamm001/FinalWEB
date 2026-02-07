import React, { useEffect, useState } from "react";
import http from "../api/http";

export default function Analytics() {
  const [weekly, setWeekly] = useState([]);
  const [top, setTop] = useState([]);
  const [err, setErr] = useState("");

  const load = async () => {
    setErr("");
    try {
      const w = await http.get("/analytics/weekly-summary");
      const t = await http.get("/analytics/top-exercises?limit=10");
      setWeekly(w.data);
      setTop(t.data);
    } catch (e) {
      setErr(e?.response?.data?.error || "Failed to load analytics");
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div>
      <h2>Analytics</h2>
      {err && <div style={{ color: "crimson" }}>{err}</div>}

      <h3>Weekly Summary</h3>
      <table border="1" cellPadding="6">
        <thead>
          <tr>
            <th>Year</th>
            <th>Week</th>
            <th>Workouts</th>
            <th>Total Minutes</th>
          </tr>
        </thead>
        <tbody>
          {weekly.map((r, i) => (
            <tr key={i}>
              <td>{r.year}</td>
              <td>{r.week}</td>
              <td>{r.workouts}</td>
              <td>{r.totalMinutes}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 style={{ marginTop: 16 }}>Top Exercises</h3>
      <ul>
        {top.map((x, i) => (
          <li key={i}>
            {x.name} ({x.muscleGroup}) — times: {x.times}, setsTotal: {x.setsTotal}
          </li>
        ))}
      </ul>
    </div>
  );
}