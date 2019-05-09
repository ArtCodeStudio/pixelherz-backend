import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnimationService } from './animation/animation.service';
import { Animation } from './animation/animation.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    TypeOrmModule.forFeature([Animation])
  ],
  controllers: [AppController],
  providers: [AppService, AnimationService],
})
export class AppModule {
 
}
