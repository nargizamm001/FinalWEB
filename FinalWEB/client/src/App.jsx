import React, { useEffect, useState } from "react";
import {
  Routes,
  Route,
  Link,
  Navigate,
  useNavigate
} from "react-router-dom";

import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Home from "./pages/Home.jsx";

import Workouts from "./pages/Workouts.jsx";
import WorkoutDetails from "./pages/WorkoutDetails.jsx";
import Metrics from "./pages/Metrics.jsx";
import Analytics from "./pages/Analytics.jsx";

import Notifications from "./pages/Notifications.jsx";
import AdminWorkouts from "./pages/AdminWorkouts.jsx";

import http from "./api/http";

function decodeRole() {
  const t = localStorage.getItem("token");
  if (!t) return null;
  try {
    return JSON.parse(atob(t.split(".")[1])).role;
  } catch {
    return null;
  }
}

function Protected({ children }) {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

function AdminOnly({ children }) {
  const role = decodeRole();
  if (role !== "admin") return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const role = decodeRole();

  const [unreadCount, setUnreadCount] = useState(0);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const loadUnread = async () => {
    if (!token) return;
    try {
      const res = await http.get("/notifications?limit=50");
      const items = res.data.items || [];
      const unread = items.filter((n) => !n.read).length;
      setUnreadCount(unread);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    loadUnread();
    // небольшая авто-обновлялка точки
    const t = setInterval(loadUnread, 8000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <>
      <header>
        <div>
          <Link to="/">Home</Link>

          {token ? (
            <>
              <nav>
                <Link to="/workouts">Workouts</Link>
                <Link to="/metrics">Metrics</Link>
                <Link to="/analytics">Analytics</Link>

                <Link to="/notifications">
  Notifications {unreadCount > 0 ? `(${unreadCount})` : ""}
</Link>

                {/* Admin видит Admin, user — нет */}
                {role === "admin" && <Link to="/admin/workouts">Admin</Link>}
              </nav>

              <button onClick={logout}>Logout</button>
            </>
          ) : (
            <nav>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </nav>
          )}
        </div>
      </header>

      <main>
        <Routes>
          {/* public */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* protected */}
          <Route
            path="/workouts"
            element={
              <Protected>
                <Workouts />
              </Protected>
            }
          />
          <Route
            path="/workouts/:id"
            element={
              <Protected>
                <WorkoutDetails />
              </Protected>
            }
          />
          <Route
            path="/metrics"
            element={
              <Protected>
                <Metrics />
              </Protected>
            }
          />
          <Route
            path="/analytics"
            element={
              <Protected>
                <Analytics />
              </Protected>
            }
          />
          <Route
            path="/notifications"
            element={
              <Protected>
                <Notifications onChanged={loadUnread} />
              </Protected>
            }
          />

          {/* admin only */}
          <Route
            path="/admin/workouts"
            element={
              <Protected>
                <AdminOnly>
                  <AdminWorkouts />
                </AdminOnly>
              </Protected>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </>
  );
}