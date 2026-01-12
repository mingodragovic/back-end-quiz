// src/quiz/dto/score-breakdown.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { PersonalityScore } from '../scoring/types';

export class PersonalityScoreDto implements PersonalityScore {
  @ApiProperty()
  personalityId: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  score: number;

  @ApiProperty()
  rawPoints: number;
}

export class ScoreBreakdownDto {
  @ApiProperty({ type: [PersonalityScoreDto] })
  scores: PersonalityScoreDto[];

  @ApiProperty()
  winnerPersonalityId: number;

  @ApiProperty()
  winnerName: string;

  @ApiProperty()
  winnerDescription: string;
}