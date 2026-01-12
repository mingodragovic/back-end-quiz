// src/questions/questions.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class QuestionsService {
  constructor(private prisma: PrismaService) {}

  async getAllQuestions() {
    return this.prisma.question.findMany({
      orderBy: { order: 'asc' },
      include: {
        options: {
          select: {
            id: true,
            text: true,
          },
        },
      },
    });
  }

  async getQuestionsWithPersonalities() {
    return this.prisma.question.findMany({
      orderBy: { order: 'asc' },
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
  }

  async getQuestionById(id: number) {
    return this.prisma.question.findUnique({
      where: { id },
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
  }

  async validateQuestionOption(questionId: number, optionId: number) {
    const option = await this.prisma.option.findFirst({
      where: {
        id: optionId,
        questionId: questionId,
      },
    });

    return !!option;
  }

  async getPersonalities() {
    return this.prisma.personality.findMany({
      select: {
        id: true,
        name: true,
        description: true,
      },
    });
  }
}