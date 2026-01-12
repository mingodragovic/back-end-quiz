// src/quiz/scoring/tie-breaker.service.ts
import { Injectable } from '@nestjs/common';

interface PersonalityScore {
  personalityId: number;
  name: string;
  score: number;
  rawPoints: number;
}

@Injectable()
export class TieBreakerService {
  /**
   * Resolves ties according to the business rules:
   * 1. Personality with highest total raw points wins
   * 2. If still tied → lowest personality ID wins
   */
  resolveTie(tiedPersonalities: PersonalityScore[]): PersonalityScore {
    // Rule 1: Highest raw points
    const maxRawPoints = Math.max(...tiedPersonalities.map(p => p.rawPoints));
    const withMaxRawPoints = tiedPersonalities.filter(p => p.rawPoints === maxRawPoints);

    if (withMaxRawPoints.length === 1) {
      return withMaxRawPoints[0];
    }

    // Rule 2: Lowest ID wins
    return withMaxRawPoints.reduce((prev, current) => 
      prev.personalityId < current.personalityId ? prev : current
    );
  }
}