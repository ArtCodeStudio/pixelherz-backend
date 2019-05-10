import { Controller, Get, Post, Req, Request, Query, BadRequestException, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { AnimationService } from './animation/animation.service';
import { Animation } from './animation/animation.entity';
import { Connection } from 'typeorm';
import { AnimationFrame } from './animation/animation-frame.entity';
import { MatrixCell } from './animation/matrix-cell.entity';

@Controller('animation')
export class AppController {
  constructor(private readonly appService: AppService, private readonly connection: Connection, private animationService: AnimationService) {}

  @Post('create')
  async create(@Req() request: Request): Promise<object> {
    let animation: Animation = new Animation();
    animation.name = request.body['name'];
    console.log(await this.connection.manager.save(Animation, animation));
    return {success:true, id: animation.animationId};
  }

  @Post('update')
  async animate(@Req() request: Request): Promise<object> {
    // TODO (Pascal): Gibt es eine einfachere Möglichkeit? Wenn ich es ohne die Objekte mache funktionieren die Animationen zwar,
    // aber es kann nicht auf die Methode zugegriffen werden, was ja auch Sinn ergibt. 

    // convert json input to typescript objects
    let id = request.body['id'];
    let animation: Animation = new Animation();
    let frames: AnimationFrame[] = Array();
    for(let i = 0; i < request.body['frames'].length; i++) {
      let cells: MatrixCell[] = Array();
      for(let j = 0; j < request.body['frames'][i].data.length; j++) {
        cells[j] = new MatrixCell(request.body['frames'][i].data[j].position, request.body['frames'][i].data[j].red, request.body['frames'][i].data[j].green, request.body['frames'][i].data[j].blue);
      }
      let frame: AnimationFrame = new AnimationFrame(i, request.body['frames'][i].duration, cells);
      frame.data.forEach(c => c.frame = frame);
      frames[i] = frame;
    }
    
    animation.frames = frames;
    animation.animationId = id;
    console.log(animation);

    await this.connection
      .createQueryBuilder()
      .delete()
      .from(AnimationFrame)
      .where('animationAnimationId = :id', {id: id})
      .execute();

    await this.connection.manager.save(Animation, animation);
    console.log(animation);
    this.animationService.loadAnimation(animation);

    return {success:true};
  }

  @Post('delete')
  async delete(@Body('id') id: string): Promise<object> {
    await this.connection
      .createQueryBuilder()
      .delete()
      .from(Animation)
      .where('animationAnimationId = :id', {id: id})
      .execute();

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
    let list = Array();
    for(let i = 0; i < this.animationService.loadedAnimations.length; i++) {
      let animation: Animation = this.animationService.loadedAnimations[i];
      list[i] = {title:animation.name, id: animation.animationId}
    }
    return {animations:list};
  }
}
