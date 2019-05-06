import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AnimationService } from './animation/animation.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, AnimationService],
})
export class AppModule {}
