// src/quiz/dto/quiz-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';

class OptionResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  text: string;
}

export class QuestionResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  text: string;

  @ApiProperty()
  weight: number;

  @ApiProperty()
  order: number;

  @ApiProperty({ type: [OptionResponseDto] })
  options: OptionResponseDto[];
}

export class PersonalityMetadataDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;
}

export class QuizResponseDto {
  @ApiProperty({ type: [QuestionResponseDto] })
  questions: QuestionResponseDto[];

  @ApiProperty({ type: [PersonalityMetadataDto] })
  personalities: PersonalityMetadataDto[];
}