// src/quiz/scoring/scoring.module.ts
import { Module } from '@nestjs/common';
import { ScoringService } from './scoring.service';
import { TieBreakerService } from './tie-breaker.service';

@Module({
  providers: [ScoringService, TieBreakerService],
  exports: [ScoringService, TieBreakerService],
})
export class ScoringModule {}