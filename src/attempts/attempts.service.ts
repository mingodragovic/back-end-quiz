// src/attempts/attempts.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AttemptsService {
  constructor(private prisma: PrismaService) {}

  async getAttemptById(id: number) {
    const attempt = await this.prisma.quizAttempt.findUnique({
      where: { id },
      include: {
        finalPersonality: true,
        answers: {
          include: {
            question: true,
            option: true,
          },
        },
      },
    });

    if (!attempt) {
      throw new NotFoundException(`Quiz attempt with ID ${id} not found`);
    }

    return attempt;
  }

  async getAllAttempts(page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [attempts, total] = await Promise.all([
      this.prisma.quizAttempt.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          finalPersonality: true,
        },
      }),
      this.prisma.quizAttempt.count(),
    ]);

    return {
      data: attempts,
      meta: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async getAttemptsCount() {
    return this.prisma.quizAttempt.count();
  }
}