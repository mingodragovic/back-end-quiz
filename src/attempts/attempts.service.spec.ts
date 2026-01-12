// src/attempts/attempts.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { AttemptsService } from './attempts.service';
import { PrismaService } from '../prisma/prisma.service';

describe('AttemptsService', () => {
  let service: AttemptsService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AttemptsService,
        {
          provide: PrismaService,
          useValue: {
            quizAttempt: {
              findUnique: jest.fn(),
              findMany: jest.fn(),
              count: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<AttemptsService>(AttemptsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAttemptById', () => {
    it('should throw NotFoundException when attempt not found', async () => {
      jest.spyOn(prisma.quizAttempt, 'findUnique').mockResolvedValue(null);
      
      await expect(service.getAttemptById(999))
        .rejects.toThrow(NotFoundException);
    });
  });
});