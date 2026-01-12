// src/quiz/quiz.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiBody,
  ApiCreatedResponse,
} from '@nestjs/swagger';
import { QuizService } from './quiz.service';
import { SubmitQuizDto } from './dto/submit-quiz.dto';
import { QuizResponseDto } from './dto/quiz-response.dto';
import { ScoreBreakdownDto } from './dto/score-breakdown.dto';

@ApiTags('quiz')
@Controller('quiz')
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @Get()
  @ApiOperation({ summary: 'Get quiz configuration' })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns all questions and personality metadata',
    type: QuizResponseDto,
  })
  async getQuiz() {
    return this.quizService.getQuiz();
  }

  @Post('submit')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Submit quiz answers and get personality result' })
  @ApiBody({ type: SubmitQuizDto })
  @ApiCreatedResponse({
    description: 'Quiz submitted successfully',
    schema: {
      example: {
        quizAttemptId: 2,
        finalPersonality: {
          id: 1,
          name: 'The Adventurer',
          description: 'You thrive on new experiences and spontaneous decisions.'
        },
        scoreSnapshot: {
          adventurer: 75.0,
          analyst: 32.1,
          diplomat: 28.6,
          leader: 34.8
        },
        breakdown: {
          scores: [
            {
              personalityId: 1,
              name: 'The Adventurer',
              score: 75.0,
              rawPoints: 50
            }
          ],
          winnerPersonalityId: 1,
          winnerName: 'The Adventurer',
          winnerDescription: 'You thrive on new experiences and spontaneous decisions.'
        },
        createdAt: '2026-01-12T10:40:00.000Z'
      }
    }
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Validation failed (missing answers, invalid options, etc.)' 
  })
  async submitQuiz(@Body() submitQuizDto: SubmitQuizDto) {
    return this.quizService.submitQuiz(submitQuizDto);
  }

  @Get('attempt/:id')
  @ApiOperation({ summary: 'Get a specific quiz attempt by ID' })
  @ApiParam({ name: 'id', description: 'Quiz attempt ID', type: Number })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns quiz attempt details',
    schema: {
      example: {
        id: 1,
        createdAt: '2026-01-12T10:40:00.000Z',
        finalPersonalityId: 1,
        scoreSnapshot: {
          adventurer: 75.5,
          analyst: 32.1,
          diplomat: 28.6,
          leader: 34.8
        },
        finalPersonality: {
          id: 1,
          name: 'The Adventurer',
          description: 'You thrive on new experiences and spontaneous decisions.'
        },
        answers: [
          {
            id: 1,
            questionId: 1,
            optionId: 1,
            question: {
              id: 1,
              text: 'When facing a new challenge, you:'
            },
            option: {
              id: 1,
              text: 'Jump right in'
            }
          }
        ]
      }
    }
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Quiz attempt not found' 
  })
  async getQuizAttempt(@Param('id', ParseIntPipe) id: number) {
    return this.quizService.getQuizAttempt(id);
  }
}