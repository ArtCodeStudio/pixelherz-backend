import { Controller, Get, Post, Req, Request } from '@nestjs/common';
import { AppService } from './app.service';
import { AnimationService } from './animation/animation.service';
import { animationFrame } from 'rxjs/internal/scheduler/animationFrame';
import { AnimationFrame } from './animation/animation-frame';
@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private animationService: AnimationService) {}

  @Get()
  async getHello(): Promise<string> {
    return this.appService.getHello();
  }


  @Post('test')
  animate(@Req() request: Request): string {
    this.animationService.data = Array(1);

    let frames = request.body['frames'];
    this.animationService.data = frames;
    console.log("received frames");
    console.log(frames);
    return 'a';
  }

  @Get('test')
  getAnimation() {
    return {frames:this.animationService.data};
  }
}
