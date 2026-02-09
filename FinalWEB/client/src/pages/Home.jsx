import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  const token = localStorage.getItem("token");

  return (
    <div className="homeWrap">
      <div className="homeCard">
        <div className="homeLeft">
          <h1 className="homeTitle">FitTrack</h1>
          <p className="homeText">
            Track your workouts, daily metrics, and fitness progress in one place.
            Simple, clear, and built with MongoDB analytics.
          </p>

          <ul className="homeList">
            <li>✔ Create and manage workouts</li>
            <li>✔ Track weight, steps, sleep and water</li>
            <li>✔ View analytics and weekly summaries</li>
          </ul>

          <div className="homeActions">
            {token ? (
              <>
                <Link to="/workouts" className="btn primary">Go to Workouts</Link>
                <Link to="/analytics" className="btn">View Analytics</Link>
              </>
            ) : (
              <>
                <Link to="/register" className="btn primary">Get started</Link>
                <Link to="/login" className="btn">Login</Link>
              </>
            )}
          </div>
        </div>

        <div className="homeRight">
          <img
            src="https://www.primalstrength.com/cdn/shop/files/gymdesign_render_Two_collumn_grid_cb1b5850-fa8e-4a7b-a2b3-190c2e45facd.jpg?v=1680719688&width=1500"
            alt="Fitness"
          />
        </div>
      </div>
    </div>
  );
}