// src/quiz/quiz.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { QuizController } from './quiz.controller';
import { QuizService } from './quiz.service';

describe('QuizController', () => {
  let controller: QuizController;
  let service: QuizService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QuizController],
      providers: [
        {
          provide: QuizService,
          useValue: {
            getQuiz: jest.fn(),
            submitQuiz: jest.fn(),
            getQuizAttempt: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<QuizController>(QuizController);
    service = module.get<QuizService>(QuizService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getQuiz', () => {
    it('should return quiz data', async () => {
      const mockQuiz = { questions: [], personalities: [] };
      jest.spyOn(service, 'getQuiz').mockResolvedValue(mockQuiz as any);
      
      const result = await controller.getQuiz();
      expect(result).toEqual(mockQuiz);
    });
  });
});