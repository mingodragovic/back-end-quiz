// src/attempts/attempts.controller.ts
import { 
  Controller, 
  Get, 
  Param, 
  ParseIntPipe, 
  Query, 
  DefaultValuePipe 
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiParam, 
  ApiQuery, 
  ApiResponse 
} from '@nestjs/swagger';
import { AttemptsService } from './attempts.service';

@ApiTags('attempts')
@Controller('attempts')
export class AttemptsController {
  constructor(private readonly attemptsService: AttemptsService) {}

  @Get()
  @ApiOperation({ summary: 'Get paginated quiz attempts' })
  @ApiQuery({ 
    name: 'page', 
    required: false, 
    description: 'Page number (default: 1)',
    type: Number,
    example: 1
  })
  @ApiQuery({ 
    name: 'limit', 
    required: false, 
    description: 'Items per page (default: 10, max: 100)',
    type: Number,
    example: 10
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns paginated quiz attempts',
    schema: {
      example: {
        data: [
          {
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
            }
          }
        ],
        meta: {
          page: 1,
          limit: 10,
          total: 1,
          pages: 1,
          hasNext: false,
          hasPrevious: false
        }
      }
    }
  })
  async getAllAttempts(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
  ) {
    if (limit < 1 || limit > 100) {
      throw new Error('Limit must be between 1 and 100');
    }
    
    return this.attemptsService.getAllAttempts(page, limit);
  }

  @Get('count')
  @ApiOperation({ summary: 'Get total number of quiz attempts' })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns total count',
    schema: {
      example: { count: 42 }
    }
  })
  async getAttemptsCount() {
    const count = await this.attemptsService.getAttemptsCount();
    return { count };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific quiz attempt by ID' })
  @ApiParam({ name: 'id', description: 'Quiz attempt ID', type: Number })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns quiz attempt details' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Quiz attempt not found' 
  })
  async getAttemptById(@Param('id', ParseIntPipe) id: number) {
    return this.attemptsService.getAttemptById(id);
  }
}