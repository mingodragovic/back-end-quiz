// src/attempts/attempts.controller.ts
import { 
  Controller, 
  Get, 
  Param, 
  ParseIntPipe, 
  Query, 
  DefaultValuePipe 
} from '@nestjs/common';
import { AttemptsService } from './attempts.service';

@Controller('attempts')
export class AttemptsController {
  constructor(private readonly attemptsService: AttemptsService) {}

  @Get()
  async getAllAttempts(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
  ) {
    // Validate limits
    if (limit < 1 || limit > 100) {
      throw new Error('Limit must be between 1 and 100');
    }
    
    return this.attemptsService.getAllAttempts(page, limit);
  }

  @Get('count')
  async getAttemptsCount() {
    const count = await this.attemptsService.getAttemptsCount();
    return { count };
  }

  @Get(':id')
  async getAttemptById(@Param('id', ParseIntPipe) id: number) {
    return this.attemptsService.getAttemptById(id);
  }
}