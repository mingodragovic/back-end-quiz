// src/questions/questions.controller.ts
import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { QuestionsService } from './questions.service';

@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Get()
  async getAllQuestions() {
    return this.questionsService.getAllQuestions();
  }

  @Get('personalities')
  async getPersonalities() {
    return this.questionsService.getPersonalities();
  }

  @Get(':id')
  async getQuestionById(@Param('id', ParseIntPipe) id: number) {
    return this.questionsService.getQuestionById(id);
  }

  @Get('validate/:questionId/:optionId')
  async validateQuestionOption(
    @Param('questionId', ParseIntPipe) questionId: number,
    @Param('optionId', ParseIntPipe) optionId: number,
  ) {
    const isValid = await this.questionsService.validateQuestionOption(
      questionId,
      optionId,
    );
    return { isValid };
  }
}