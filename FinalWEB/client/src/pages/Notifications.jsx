import React, { useEffect, useState } from "react";
import http from "../api/http";

export default function Notifications({ onChanged }) {
  const [items, setItems] = useState([]);
  const [err, setErr] = useState("");

  const load = async () => {
    setErr("");
    try {
      const res = await http.get("/notifications?limit=50");
      setItems(res.data.items || []);
      onChanged && onChanged();
    } catch (e) {
      setErr(e?.response?.data?.error || "Failed to load notifications");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const markRead = async (id) => {
    await http.patch(`/notifications/${id}/read`);
    await load();
  };

  return (
    <div>
      <h2>Notifications</h2>
      {err && <div style={{ color: "crimson" }}>{err}</div>}

      <ul style={{ display: "grid", gap: 8 }}>
        {items.map((n) => (
          <li
            key={n._id}
            style={{
              border: "1px solid #ddd",
              padding: 10,
              borderRadius: 8,
              opacity: n.read ? 0.6 : 1
            }}
          >
            <div>{n.message}</div>
            <div style={{ fontSize: 12, opacity: 0.8 }}>
              {new Date(n.createdAt).toLocaleString()}
            </div>
            {!n.read && <button onClick={() => markRead(n._id)}>Mark as read</button>}
          </li>
        ))}
      </ul>
    </div>
  );
}