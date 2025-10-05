import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggerService } from './infrastructure/config/logger/logger.service';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import {
  ResponseFormat,
  ResponseIterceptor,
} from './interfaces/interceptors/response.interceptor';
import { AllExceptionFilter } from './interfaces/filter/exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const logger = new LoggerService();
  app.useGlobalInterceptors(new ResponseIterceptor(logger));
  app.useGlobalFilters(new AllExceptionFilter(logger));

  const config = new DocumentBuilder()
    .setTitle('Reto tecnico Conexa')
    .setDescription('API para gestionar peliculas de Star Wars')
    .setVersion('1.0')
    .addTag('movies')
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    extraModels: [ResponseFormat],
    deepScanRoutes: true,
  });

  SwaggerModule.setup('api', app, document);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
