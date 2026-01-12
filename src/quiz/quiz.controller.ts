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
import { QuizService } from './quiz.service';
import { SubmitQuizDto } from './dto/submit-quiz.dto';

@Controller('quiz')
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @Get()
  async getQuiz() {
    return this.quizService.getQuiz();
  }

  @Post('submit')
  @HttpCode(HttpStatus.CREATED)
  async submitQuiz(@Body() submitQuizDto: SubmitQuizDto) {
    return this.quizService.submitQuiz(submitQuizDto);
  }

  @Get('attempt/:id')
  async getQuizAttempt(@Param('id', ParseIntPipe) id: number) {
    return this.quizService.getQuizAttempt(id);
  }
}