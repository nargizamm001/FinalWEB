import React, { useEffect, useState } from "react";
import http from "../api/http";

export default function Metrics() {
  const [date, setDate] = useState("");
  const [weightKg, setWeightKg] = useState("");
  const [steps, setSteps] = useState("");
  const [sleepHours, setSleepHours] = useState("");
  const [waterMl, setWaterMl] = useState("");
  const [history, setHistory] = useState([]);

  const loadHistory = async () => {
    try {
      const res = await http.get("/metrics");
      setHistory(res.data);
    } catch (e) {
      console.error("Failed to load metrics history");
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    try {
      await http.post("/metrics", {
        date,
        weightKg: weightKg ? Number(weightKg) : undefined,
        steps: steps ? Number(steps) : undefined,
        sleepHours: sleepHours ? Number(sleepHours) : undefined,
        waterMl: waterMl ? Number(waterMl) : undefined,
      });
      setWeightKg("");
      setSteps("");
      setSleepHours("");
      setWaterMl("");
      loadHistory();
    } catch (e) {
      console.error("Failed to save metrics");
    }
  };

  return (
    <div className="splitLayout">
      {/* LEFT SIDE — CONTENT */}
      <div>
        <h1>Metrics</h1>

        <form onSubmit={submit}>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
          <input
            placeholder="weightKg"
            value={weightKg}
            onChange={(e) => setWeightKg(e.target.value)}
          />
          <input
            placeholder="steps"
            value={steps}
            onChange={(e) => setSteps(e.target.value)}
          />
          <input
            placeholder="sleepHours"
            value={sleepHours}
            onChange={(e) => setSleepHours(e.target.value)}
          />
          <input
            placeholder="waterMl"
            value={waterMl}
            onChange={(e) => setWaterMl(e.target.value)}
          />

          <button type="submit" className="btn primary">
            Save (upsert)
          </button>
        </form>

        <h2>History</h2>

        <ul>
          {history.map((m) => (
            <li key={m._id}>
              <div>
                {m.date} | weight: {m.weightKg ?? "-"} | steps:{" "}
                {m.steps ?? "-"}
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* RIGHT SIDE — VISUAL */}
      <div className="splitVisual">
        <img
          src="https://hls.kz/wp-content/uploads/2023/04/hls.jpeg"
          alt="Fitness"
        />
      </div>
    </div>
  );
}