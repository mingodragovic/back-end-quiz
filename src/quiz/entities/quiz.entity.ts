// src/quiz/entities/quiz.entity.ts
import { Personality, Question } from '@prisma/client';

export class QuizEntity {
  questions: (Question & {
    options: {
      id: number;
      text: string;
    }[];
  })[];
  
  personalities: Personality[];
}

export class QuizResultEntity {
  quizAttemptId: number;
  finalPersonality: Personality;
  scoreSnapshot: Record<string, number>;
  breakdown: {
    scores: Array<{
      personalityId: number;
      name: string;
      score: number;
      rawPoints: number;
    }>;
  };
}