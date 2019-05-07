import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
const DeviceHandle = require('linux-device');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();

var fb = new DeviceHandle({path:"/dev/fb1", autoOpen: true, absoluteSize:6*8*8});
