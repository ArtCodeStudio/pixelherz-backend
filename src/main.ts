import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as lindev from "linux-device";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();

const abc = new lindev.DeviceHandle('/dev/fb1');