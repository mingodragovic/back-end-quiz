# Personality Quiz Platform - Backend API
A production-ready personality quiz backend built with NestJS, PostgreSQL, and Prisma. Features weighted scoring, tie-breaking logic, and full quiz attempt tracking.

# Quick Links
⦿ Live API: https://personality-quiz-backend-eusl.onrender.com

⦿ Swagger Docs: https://personality-quiz-backend-eusl.onrender.com/api

⦿ Frontend: https://paradox-quiz.vercel.app

⦿ Database: Neon PostgreSQL (Cloud)

⦿ Note: Swagger UI is enabled in production for easy endpoint testing during review. Normally this would be restricted in production.

# Core Features
Quiz Management: 5 questions, 4 options each, 4 personality types

Intelligent Scoring: Weighted questions with tie-breaking rules

Data Persistence: Store attempts with detailed answer breakdown

Validation: Multi-layer validation (DTO, business logic, database)

Production Ready: Connection pooling, SSL, error handling

# Tech Stack
Backend: NestJS 11 + TypeScript

Database: PostgreSQL (Neon)

ORM: Prisma 7 with PostgreSQL adapter

Deployment: Render (Backend) + Neon (Database)

Documentation: Swagger/OpenAPI

# Key Endpoints
GET /quiz - Get quiz configuration (questions + personalities)

POST /quiz/submit - Submit answers, get personality result with scoring

GET /quiz/attempt/:id - Retrieve specific attempt

GET /attempts - Paginated attempt history

GET /questions/personalities - Get personality metadata

# How It Works
User answers all 5 questions (each has 4 options)

Backend calculates scores: personalityScore = optionPoints × questionWeight

Tie-breaking: Highest raw points → Lowest personality ID

Returns personality result with score breakdown

# Deployment
Backend: Render 
Database: Neon 
Frontend: Vercel 

# Scoring Example

Question 1 (weight: 1.5)
Option A → Adventurer: 10 points × 1.5 = 15 points
Total Score = Σ(optionPoints × questionWeight)

# Quick Test

⦿ Get quiz config
curl https://personality-quiz-backend-eusl.onrender.com/quiz

⦿ Submit quiz (Adventurer profile)
curl -X POST https://personality-quiz-backend-eusl.onrender.com/quiz/submit \
  -H "Content-Type: application/json" \
  -d '{
    "answers": [
      {"questionId": 1, "optionId": 1},
      {"questionId": 2, "optionId": 5},
      {"questionId": 3, "optionId": 9},
      {"questionId": 4, "optionId": 13},
      {"questionId": 5, "optionId": 17}
    ]
  }'
⦿ Local Setup

npm install
npx prisma db push
npm run seed
npm run start:dev

🤝 What This Demonstrates
Full-stack architecture with clear separation of concerns

Production deployment with cloud databases

Business logic implementation (scoring, validation, tie-breaking)

RESTful API design with proper error handling

Database modeling with Prisma ORM

