// src/app.controller.ts
import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('health')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Welcome endpoint' })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns welcome message',
    schema: {
      example: 'Personality Quiz API is running!'
    }
  })
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  @ApiOperation({ summary: 'Health check endpoint' })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns health status',
    schema: {
      example: {
        status: 'healthy',
        timestamp: '2026-01-12T10:40:00.000Z'
      }
    }
  })
  getHealth(): { status: string; timestamp: string } {
    return this.appService.getHealth();
  }
}