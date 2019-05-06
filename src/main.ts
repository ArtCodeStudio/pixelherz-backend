import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
const linuxdevice = require('linux-device')

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();

const abc = linuxdevice.DeviceHandle('/dev/fb1');