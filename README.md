🏋️ Fitness Tracker Web Application

Course: WEB Technologies 2 (Back End)
University: Astana IT University
Group: SE-2401
Authors: Tyulebayeva Arailym, Mnaidarova Nargiza
Year: 2026

🌐 Live Demo:
https://finalweb-plum.vercel.app

📌 Project Overview

Fitness Tracker is a full-stack web application designed to help users:

register and authenticate

create and manage workout sessions

record daily fitness metrics (steps, weight, sleep, water)

analyze workout statistics through analytics

The system is built using React (frontend), Node.js + Express (backend) and MongoDB Atlas (database).

🏗 System Architecture

The system consists of three main layers:

User → Frontend (React) → Backend (Node.js + Express) → MongoDB → Backend → Frontend

🔹 Frontend

React

Axios for API calls

Private routes

UI navigation

🔹 Backend

Node.js

Express

JWT Authentication

REST API

🔹 Database

MongoDB Atlas

Embedded + Referenced models

Indexing

Aggregation pipelines

🗄 Database Design
Collections:

users

workouts

exercises

metrics

Referenced Models:

userId in workouts

userId in metrics

exercises referenced in workouts

Embedded Models:

exercises inside workouts

sets inside exercises

This hybrid structure ensures:

Fast workout retrieval

Reduced duplication

Flexible relations

🔐 Authentication & RBAC

Authentication is implemented using JWT (JSON Web Tokens).

Roles:

User → manages only own data

Admin → can delete any workout

Middleware:

JWT verification

Role verification (RBAC)

🔄 CRUD Operations

The system fully supports:

Create

Register user

Create workout

Add exercises & sets

Add daily metrics

Read

Get workouts

Get workout details

Get metrics history

Get analytics

Update

$set

$push

arrayFilters

upsert

Delete

Delete workouts

Delete metrics

$pull exercises from workouts

All queries are filtered by userId.

📊 Aggregation & Indexing
Aggregations
Weekly Summary

Group workouts by week

Calculate total duration

Top Exercises

Count exercises

$lookup for additional info

Indexes

Compound index: userId + date

Unique index: metrics (userId + date)

Unique index: users (email)

🌐 REST API Endpoints
Authentication

POST /api/auth/register
POST /api/auth/login

Workouts

POST /api/workouts
GET /api/workouts
GET /api/workouts/:id
PUT /api/workouts/:id
DELETE /api/workouts/:id

Metrics

POST /api/metrics
GET /api/metrics
DELETE /api/metrics/:id

Analytics

GET /api/analytics/weekly
GET /api/analytics/top-exercises

✔ 12+ REST endpoints
✔ JWT protected
✔ Role-based access

🧠 MongoDB Query Examples
Insert Workout
db.workouts.insertOne({
  userId: ObjectId("..."),
  date: ISODate("2026-02-01"),
  duration: 60,
  exercises: []
});

Find Workouts
db.workouts.find({ userId: ObjectId("...") });

Add Exercise
db.workouts.updateOne(
  { _id: ObjectId("...") },
  { $push: { exercises: { name: "Bench Press", sets: [] } } }
);

Remove Exercise
db.workouts.updateOne(
  { _id: ObjectId("...") },
  { $pull: { exercises: { name: "Bench Press" } } }
);

Weekly Aggregation
db.workouts.aggregate([
  { $match: { userId: ObjectId("...") } },
  {
    $group: {
      _id: { $week: "$date" },
      totalDuration: { $sum: "$duration" }
    }
  },
  { $sort: { "_id": 1 } }
]);

👩‍💻 Contribution
Tyulebayeva Arailym

Backend (Node.js, Express)

MongoDB data modeling

CRUD & aggregation

JWT authentication

Mnaidarova Nargiza

Frontend (React)

API integration

UI/UX

Testing & screenshots

✅ REST API Principles

Resource-based URLs

Stateless authentication

Proper HTTP methods

Clear separation of public/private endpoints

🎯 Conclusion

The Fitness Tracker project demonstrates:

Full-stack architecture

REST API development

JWT authentication & RBAC

Advanced MongoDB usage

Aggregation pipelines

Index optimization

The project fully satisfies the requirements of the WEB Technologies 2 (Back End) course and demonstrates practical implementation of database-driven web applications.
