import { Controller, Get, Post, Req, Request } from '@nestjs/common';
import { AppService } from './app.service';
import { AnimationService } from './animation/animation.service';
import { Animation } from './animation/animation.entity';
import { Connection } from 'typeorm';
import { AnimationFrame } from './animation/animation-frame.entity';
import { MatrixCell } from './animation/matrix-cell.entity';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private readonly connection: Connection, private animationService: AnimationService) {}

  @Get()
  async getHello(): Promise<string> {
    return this.appService.getHello();
  }


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
    this.animationService.currentAnimation = animation;

    return {success:true};
  }

  @Get('test')
  getAnimation() {
    console.log(this.animationService.currentAnimation.toObject());
    return {animation:this.animationService.currentAnimation.toObject()};
  }
}
