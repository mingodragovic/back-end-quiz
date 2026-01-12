// src/quiz/dto/quiz-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';

class OptionResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Jump right in' })
  text: string;
}

export class QuestionResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'When facing a new challenge, you:' })
  text: string;

  @ApiProperty({ example: 1.5 })
  weight: number;

  @ApiProperty({ example: 1 })
  order: number;

  @ApiProperty({ type: [OptionResponseDto] })
  options: OptionResponseDto[];
}

export class PersonalityMetadataDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'The Adventurer' })
  name: string;

  @ApiProperty({ 
    example: 'You thrive on new experiences and spontaneous decisions.' 
  })
  description: string;
}

export class QuizResponseDto {
  @ApiProperty({ type: [QuestionResponseDto] })
  questions: QuestionResponseDto[];

  @ApiProperty({ type: [PersonalityMetadataDto] })
  personalities: PersonalityMetadataDto[];
}