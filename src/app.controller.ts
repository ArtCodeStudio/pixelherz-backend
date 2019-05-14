import { Controller, Get, Post, Req, Request, Query, BadRequestException, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { AnimationService } from './animation/animation.service';
import { Animation } from './animation/animation.entity';
import { Connection } from 'typeorm';
import { AnimationFrame } from './animation/animation-frame.entity';
import { MatrixCell } from './animation/matrix-cell.entity';

import { IAnimation } from './interfaces';
import { type } from 'os';

@Controller('animation')
export class AppController {
  constructor(private readonly appService: AppService, private readonly connection: Connection, private animationService: AnimationService) {}

  @Post('create')
  async create(@Req() request: Request, @Body() animationData: IAnimation): Promise<object> {
    let animation: Animation = Animation.fromData(animationData);
    animation.name = request.body['name'];
    animation.repeats = 1;
    console.log(await this.animationService.createAnimation(animation));
    return {success:true, id: animation.animationId, name: animation.name};
  }

  /**
   * 
   * @param request 
   * @param frames 
   */
  @Post('update')
  async animate(@Req() request: Request, @Body() animationData: IAnimation): Promise<{success: boolean}> {
    // convert json input to typescript objects
    if(!animationData || typeof animationData.animationId === 'undefined' || typeof animationData.frames === 'undefined') {
      throw new BadRequestException("parameters are missing");
    }

    let animation: Animation = Animation.fromData(animationData);

    console.log(animation);

    await this.connection
      .createQueryBuilder()
      .delete()
      .from(AnimationFrame)
      .where('animationAnimationId = :id', {id: animationData.animationId})
      .execute();

    await this.connection.manager.save(Animation, animation);
    console.log(animation);
    this.animationService.loadAnimation(animation);

    return {success:true};
  }

  @Post('delete')
  async delete(@Body('id') id: string): Promise<object> {
    this.animationService.delete(id);
    return {success:true};
  }

  @Post('status')
  async status(@Body('id') id: string, @Body('enabled') enabled: boolean): Promise<object> {
    await this.animationService.setStatus(id, enabled);
    return {success:true};
  }

  @Get()
  getAnimation(@Query('id') id: string) {
    if(id !== undefined) {
      for(let i = 0; i < this.animationService.loadedAnimations.length; i++) {
        let animation: Animation = this.animationService.loadedAnimations[i];
        if(animation.animationId.toString() === id) {
          return {success:true, animation:animation.toObject()};
        }
      }
      throw new BadRequestException('Invalid id');
    } else {
      return {success:true, animation:this.animationService.currentAnimation.toObject()};
    }
  }

  @Get('list')
  getList() {
    return this.animationService.listAnimations()
  }
}
