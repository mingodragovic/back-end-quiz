// src/quiz/quiz.module.ts
import { Module } from '@nestjs/common';
import { QuizController } from './quiz.controller';
import { QuizService } from './quiz.service';
import { ScoringModule } from './scoring/scoring.module';

@Module({
  imports: [ScoringModule],
  controllers: [QuizController],
  providers: [QuizService],
  exports: [QuizService],
})
export class QuizModule {}