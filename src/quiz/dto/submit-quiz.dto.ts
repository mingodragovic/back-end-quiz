// src/quiz/dto/submit-quiz.dto.ts
import { IsArray, IsInt, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class AnswerDto {
  @ApiProperty({
    description: 'The ID of the question being answered',
    example: 1,
    minimum: 1,
  })
  @IsInt()
  questionId: number;

  @ApiProperty({
    description: 'The ID of the selected option',
    example: 1,
    minimum: 1,
  })
  @IsInt()
  optionId: number;
}

export class SubmitQuizDto {
  @ApiProperty({
    description: 'Array of answers for all quiz questions',
    type: [AnswerDto],
    example: [
      { questionId: 1, optionId: 1 },
      { questionId: 2, optionId: 5 },
      { questionId: 3, optionId: 9 },
      { questionId: 4, optionId: 13 },
      { questionId: 5, optionId: 17 },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AnswerDto)
  answers: AnswerDto[];
}