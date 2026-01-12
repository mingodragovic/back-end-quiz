// src/quiz/quiz.service.ts
import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ScoringService } from './scoring/scoring.service';
import { SubmitQuizDto } from './dto/submit-quiz.dto';
import { QuizResponseDto, PersonalityMetadataDto } from './dto/quiz-response.dto';
import { ScoreBreakdownDto } from './dto/score-breakdown.dto';

@Injectable()
export class QuizService {
  constructor(
    private prisma: PrismaService,
    private scoringService: ScoringService,
  ) {}

  async getQuiz(): Promise<QuizResponseDto> {
    const [questions, personalities] = await Promise.all([
      this.prisma.question.findMany({
        orderBy: { order: 'asc' },
        include: {
          options: {
            select: {
              id: true,
              text: true,
            },
          },
        },
      }),
      this.prisma.personality.findMany({
        select: {
          id: true,
          name: true,
          description: true,
        },
      }),
    ]);

    return {
      questions,
      personalities,
    };
  }

  async validateSubmission(answers: SubmitQuizDto['answers']) {
    // Check if all questions are answered
    const allQuestions = await this.prisma.question.findMany();
    const answeredQuestionIds = new Set(answers.map(a => a.questionId));

    if (answeredQuestionIds.size !== allQuestions.length) {
      throw new BadRequestException('All questions must be answered');
    }

    // Check for duplicate answers to same question
    const questionIds = answers.map(a => a.questionId);
    if (new Set(questionIds).size !== questionIds.length) {
      throw new BadRequestException('Duplicate answers to the same question');
    }

    // Validate each answer
    for (const answer of answers) {
      const isValid = await this.prisma.option.findFirst({
        where: {
          id: answer.optionId,
          questionId: answer.questionId,
        },
      });

      if (!isValid) {
        throw new BadRequestException(
          `Option ${answer.optionId} does not belong to question ${answer.questionId}`,
        );
      }
    }
  }

  async submitQuiz(submitQuizDto: SubmitQuizDto) {
    const { answers } = submitQuizDto;

    // Validate submission
    await this.validateSubmission(answers);

    // Calculate scores
    const personalityScores = await this.scoringService.calculateScores(answers);
    const winner = await this.scoringService.determineWinner(personalityScores);
    const scoreSnapshot = await this.scoringService.createScoreSnapshot(personalityScores);

    // Create quiz attempt
    const quizAttempt = await this.prisma.quizAttempt.create({
      data: {
        finalPersonalityId: winner.personalityId,
        scoreSnapshot,
        answers: {
          create: answers.map(answer => ({
            questionId: answer.questionId,
            optionId: answer.optionId,
          })),
        },
      },
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

    // Prepare score breakdown
    const breakdown: ScoreBreakdownDto = {
      scores: personalityScores,
      winnerPersonalityId: winner.personalityId,
      winnerName: winner.name,
      winnerDescription: (await this.prisma.personality.findUnique({
        where: { id: winner.personalityId },
      }))!.description,
    };

    return {
      quizAttemptId: quizAttempt.id,
      finalPersonality: quizAttempt.finalPersonality,
      scoreSnapshot: quizAttempt.scoreSnapshot,
      breakdown,
      createdAt: quizAttempt.createdAt,
    };
  }

  async getQuizAttempt(id: number) {
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
}