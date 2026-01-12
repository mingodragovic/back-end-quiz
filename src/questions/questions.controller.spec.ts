// src/questions/questions.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { QuestionsController } from './questions.controller';
import { QuestionsService } from './questions.service';

describe('QuestionsController', () => {
  let controller: QuestionsController;
  let service: QuestionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QuestionsController],
      providers: [
        {
          provide: QuestionsService,
          useValue: {
            getAllQuestions: jest.fn(),
            getPersonalities: jest.fn(),
            getQuestionById: jest.fn(),
            validateQuestionOption: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<QuestionsController>(QuestionsController);
    service = module.get<QuestionsService>(QuestionsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllQuestions', () => {
    it('should return all questions', async () => {
      const mockQuestions = [{ id: 1, text: 'Test' }];
      jest.spyOn(service, 'getAllQuestions').mockResolvedValue(mockQuestions as any);
      
      const result = await controller.getAllQuestions();
      expect(result).toEqual(mockQuestions);
    });
  });
});