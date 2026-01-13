# Personality Quiz Platform - Backend API
A production-ready personality quiz backend built with NestJS, PostgreSQL, and Prisma. Features weighted scoring, tie-breaking logic, and full quiz attempt tracking.

# Quick Links
⦿ Live API: https://personality-quiz-backend-eusl.onrender.com

⦿ Swagger Docs: https://personality-quiz-backend-eusl.onrender.com/api

⦿ Front-end: https://paradox-quiz.vercel.app

⦿ Front-end Repository: [https://github.com/mingodragovic/front-end-quiz](https://github.com/mingodragovic/front-end-quiz)

# Notes:
⦿ Swagger UI is enabled in production for easy endpoint testing during review. Normally this would be restricted in production.

⦿ This backend runs on Render’s free tier, which may idle the server after inactivity.
To prevent cold starts, UptimeRobot monitoring is enabled to send an HTTP request to the /health endpoint every 5 minutes, keeping the service responsive.

# Core Features
⦿ Quiz Management: 5 questions, 4 options each, 4 personality types

⦿ Intelligent Scoring: Weighted questions with tie-breaking rules

⦿ Data Persistence: Store attempts with detailed answer breakdown

⦿ Validation: Multi-layer validation (DTO, business logic, database)

⦿ Production Ready: Connection pooling, SSL, error handling

# Tech Stack
Backend: NestJS 11 + TypeScript

Database: PostgreSQL (Neon)

ORM: Prisma 7 with PostgreSQL adapter

Deployment: Render (Backend) + Neon (Database)

Documentation: Swagger/OpenAPI

# Key Endpoints
⦿ GET /quiz - Get quiz configuration (questions + personalities)

⦿ POST /quiz/submit - Submit answers, get personality result with scoring

⦿ GET /quiz/attempt/:id - Retrieve specific attempt

⦿ GET /attempts - Paginated attempt history

⦿ GET /questions/personalities - Get personality metadata

# How It Works
⦿ User answers all 5 questions (each has 4 options)

⦿ Backend calculates scores: personalityScore = optionPoints × questionWeight

⦿ Tie-breaking: Highest raw points → Lowest personality ID

⦿ Returns personality result with score breakdown

# Deployment
⦿ Backend: Render 
⦿ Database: Neon 
⦿ Frontend: Vercel 

# Scoring Example

⦿ Question 1 (weight: 1.5)
⦿ Option A → Adventurer: 10 points × 1.5 = 15 points
⦿ Total Score = Σ(optionPoints × questionWeight)

# Quick Test

⦿ Get quiz config
curl https://personality-quiz-backend-eusl.onrender.com/quiz


# What This Demonstrates

⦿ Full-stack architecture with clear separation of concerns

⦿ Production deployment with cloud databases

⦿ Business logic implementation (scoring, validation, tie-breaking)

RESTful API design with proper error handling

Database modeling with Prisma ORM

