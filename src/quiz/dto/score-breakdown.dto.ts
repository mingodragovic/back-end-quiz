// src/quiz/dto/score-breakdown.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { PersonalityScore } from '../scoring/types';


export class PersonalityScoreDto implements PersonalityScore {
  @ApiProperty({ example: 1 })
  personalityId: number;

  @ApiProperty({ example: 'The Adventurer' })
  name: string;

  @ApiProperty({ example: 75.5 })
  score: number;

  @ApiProperty({ example: 50 })
  rawPoints: number;
}

export class ScoreBreakdownDto {
  @ApiProperty({ type: [PersonalityScoreDto] })
  scores: PersonalityScoreDto[];

  @ApiProperty({ example: 1 })
  winnerPersonalityId: number;

  @ApiProperty({ example: 'The Adventurer' })
  winnerName: string;

  @ApiProperty({ 
    example: 'You thrive on new experiences and spontaneous decisions.' 
  })
  winnerDescription: string;
}