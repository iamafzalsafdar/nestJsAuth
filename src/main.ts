import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      // it will convert params/query_params/body parameters into instance of their DTOs respectively.
      // it also perform primitive Type conversions
      transform: true,
      whitelist: true, // unwanted and invalid properties will be removed with the power of DTOs
      forbidNonWhitelisted: true, //with whitelist property it will throw error if unwanted property received in request
    }),
  );
  await app.listen(3000);
}
bootstrap();
