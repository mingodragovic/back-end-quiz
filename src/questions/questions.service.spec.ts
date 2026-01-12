// src/questions/questions.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { QuestionsService } from './questions.service';
import { PrismaService } from '../prisma/prisma.service';

describe('QuestionsService', () => {
  let service: QuestionsService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QuestionsService,
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
            },
          },
        },
      ],
    }).compile();

    service = module.get<QuestionsService>(QuestionsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAllQuestions', () => {
    it('should return all questions', async () => {
      const mockQuestions = [
        {
          id: 1,
          text: 'Test question',
          weight: 1.5,
          order: 1,
          options: [{ id: 1, text: 'Option 1' }],
        },
      ];
      
      jest.spyOn(prisma.question, 'findMany').mockResolvedValue(mockQuestions as any);
      
      const result = await service.getAllQuestions();
      expect(result).toEqual(mockQuestions);
    });
  });
});