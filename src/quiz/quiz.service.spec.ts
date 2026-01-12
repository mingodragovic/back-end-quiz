// src/quiz/quiz.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { PrismaService } from '../prisma/prisma.service';
import { ScoringService } from './scoring/scoring.service';

describe('QuizService', () => {
  let service: QuizService;
  let prisma: PrismaService;
  let scoringService: ScoringService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QuizService,
        {
          provide: PrismaService,
          useValue: {
            question: {
              findMany: jest.fn(),
              findUnique: jest.fn(),
            },
            option: {
              findFirst: jest.fn(),
            },
            personality: {
              findMany: jest.fn(),
              findUnique: jest.fn(),
            },
            quizAttempt: {
              create: jest.fn(),
              findUnique: jest.fn(),
            },
          },
        },
        {
          provide: ScoringService,
          useValue: {
            calculateScores: jest.fn(),
            determineWinner: jest.fn(),
            createScoreSnapshot: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<QuizService>(QuizService);
    prisma = module.get<PrismaService>(PrismaService);
    scoringService = module.get<ScoringService>(ScoringService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateSubmission', () => {
    it('should throw error when not all questions answered', async () => {
      const answers = [{ questionId: 1, optionId: 1 }];
      jest.spyOn(prisma.question, 'findMany').mockResolvedValue([
        { id: 1 } as any,
        { id: 2 } as any,
      ]);

      await expect(service.validateSubmission(answers as any))
        .rejects.toThrow(BadRequestException);
    });
  });
});