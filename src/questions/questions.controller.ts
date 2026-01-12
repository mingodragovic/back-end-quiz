// src/questions/questions.controller.ts
import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { QuestionsService } from './questions.service';

@ApiTags('questions')
@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all questions with options' })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns all questions with their options'
  })
  async getAllQuestions() {
    return this.questionsService.getAllQuestions();
  }

  @Get('personalities')
  @ApiOperation({ summary: 'Get all personality types' })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns all personality metadata'
  })
  async getPersonalities() {
    return this.questionsService.getPersonalities();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific question by ID' })
  @ApiParam({ name: 'id', description: 'Question ID', type: Number })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns the question with options and scoring data'
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Question not found' 
  })
  async getQuestionById(@Param('id', ParseIntPipe) id: number) {
    return this.questionsService.getQuestionById(id);
  }

  @Get('validate/:questionId/:optionId')
  @ApiOperation({ summary: 'Validate if an option belongs to a question' })
  @ApiParam({ name: 'questionId', description: 'Question ID', type: Number })
  @ApiParam({ name: 'optionId', description: 'Option ID', type: Number })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns validation result',
    schema: {
      example: { isValid: true }
    }
  })
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