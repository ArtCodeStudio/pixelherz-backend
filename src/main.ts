import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';

var x = [255, 255, 255];
var o = [0, 0, 0];

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.use(bodyParser.json({limit: '5mb'}));
  await app.listen(3000);
}

bootstrap();

