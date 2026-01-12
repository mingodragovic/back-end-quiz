// src/common/decorators/api-response.decorator.ts
import { applyDecorators, Type } from '@nestjs/common';
import { ApiResponse, getSchemaPath } from '@nestjs/swagger';

interface ApiResponseOptions {
  status: number;
  description: string;
  type?: Type<any>;
  isArray?: boolean;
  example?: any;
}

export function ApiResponseDecorator(options: ApiResponseOptions) {
  const decorators = [];

  if (options.type) {
    decorators.push(
      ApiResponse({
        status: options.status,
        description: options.description,
        schema: {
          ...(options.isArray
            ? {
                type: 'array',
                items: { $ref: getSchemaPath(options.type) },
              }
            : { $ref: getSchemaPath(options.type) }),
        },
      }),
    );
  } else if (options.example) {
    decorators.push(
      ApiResponse({
        status: options.status,
        description: options.description,
        schema: {
          example: options.example,
        },
      }),
    );
  } else {
    decorators.push(
      ApiResponse({
        status: options.status,
        description: options.description,
      }),
    );
  }

  return applyDecorators(...decorators);
}