import React from "react";
import { Routes, Route, Link, Navigate, useNavigate } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Workouts from "./pages/Workouts.jsx";
import WorkoutDetails from "./pages/WorkoutDetails.jsx";
import Metrics from "./pages/Metrics.jsx";
import Analytics from "./pages/Analytics.jsx";
import Home from "./pages/Home.jsx";

function Protected({ children }) {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

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
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

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

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </>
  );
}