// src/quiz/scoring/scoring.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { TieBreakerService } from './tie-breaker.service';
import { PersonalityScore } from './types';

@Injectable()
export class ScoringService {
  constructor(
    private prisma: PrismaService,
    private tieBreaker: TieBreakerService,
  ) {}

  async calculateScores(answers: Array<{ questionId: number; optionId: number }>): Promise<PersonalityScore[]> {
    // Get all necessary data
    const questions = await this.prisma.question.findMany({
      where: {
        id: { in: answers.map(a => a.questionId) },
      },
      include: {
        options: {
          include: {
            optionScores: {
              include: {
                personality: true,
              },
            },
          },
        },
      },
    });

    const allPersonalities = await this.prisma.personality.findMany();

    // Initialize scores
    const personalityScores: PersonalityScore[] = allPersonalities.map(personality => ({
      personalityId: personality.id,
      name: personality.name,
      score: 0,
      rawPoints: 0,
    }));

    // Calculate scores
    for (const answer of answers) {
      const question = questions.find(q => q.id === answer.questionId);
      if (!question) continue;

      const option = question.options.find(o => o.id === answer.optionId);
      if (!option) continue;

      for (const optionScore of option.optionScores) {
        const personalityScore = personalityScores.find(
          ps => ps.personalityId === optionScore.personalityId,
        );

        if (personalityScore) {
          const weightedScore = optionScore.points * question.weight;
          personalityScore.score += weightedScore;
          personalityScore.rawPoints += optionScore.points;
        }
      }
    }

    return personalityScores;
  }

  async determineWinner(personalityScores: PersonalityScore[]): Promise<PersonalityScore> {
    // Find the highest score
    const maxScore = Math.max(...personalityScores.map(ps => ps.score));
    
    // Find all personalities with the max score
    const tiedPersonalities = personalityScores.filter(ps => ps.score === maxScore);

    if (tiedPersonalities.length === 1) {
      return tiedPersonalities[0];
    }

    // Apply tie-breaking rules
    return this.tieBreaker.resolveTie(tiedPersonalities);
  }

  async createScoreSnapshot(personalityScores: PersonalityScore[]): Promise<Record<string, number>> {
    const snapshot: Record<string, number> = {};
    
    for (const score of personalityScores) {
      const personalityName = score.name.toLowerCase().replace('the ', '');
      snapshot[personalityName] = parseFloat(score.score.toFixed(2));
    }

    return snapshot;
  }
}