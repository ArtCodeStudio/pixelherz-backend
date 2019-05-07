import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AnimationService } from './animation/animation.service';
var x = [255, 255, 255];
var o = [0, 0, 0];

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(3000);
}

bootstrap();

