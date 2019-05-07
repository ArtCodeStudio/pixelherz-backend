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

  @Get('a1')
  async a1(): Promise<string> {
    await this.animationService.animation1();
    return 'a';
  }

  @Get('a2')
  async a2(): Promise<string> {
    await this.animationService.animation2();
    return 'a';
  }

  @Post('test')
  display(@Req() request: Request): string {
    this.animationService.data = Array(1);

    let frame = new AnimationFrame(100000, request.body['pixels']);
    this.animationService.data[0] = frame;
    console.log("received frame");
    return 'a';
  }
}
