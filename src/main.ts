// src/main.ts
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ============ SWAGGER SETUP ============
  const config = new DocumentBuilder()
    .setTitle('Personality Quiz API')
    .setDescription('A full-featured personality quiz platform API')
    .setVersion('1.0')
    .addTag('quiz', 'Personality quiz operations')
    .addTag('questions', 'Quiz questions and options')
    .addTag('attempts', 'Quiz attempts history')
    .addTag('health', 'Health check endpoints')
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    customSiteTitle: 'Personality Quiz API Documentation',
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'method',
    },
  });
  // =======================================

  // Enable CORS for frontend
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'https://paradox-quiz.vercel.app',
    credentials: true,
  });

  // Global pipes for validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Global filters
  app.useGlobalFilters(new HttpExceptionFilter());

  // Global interceptors
  app.useGlobalInterceptors(new TransformInterceptor());

  const port = process.env.PORT || 3001;
  await app.listen(port);
 
}

bootstrap();