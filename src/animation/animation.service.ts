
import { Injectable } from '@nestjs/common';
import { AnimationFrame } from './animation-frame.entity';
import { Animation } from './animation.entity';
import { Connection } from 'typeorm';
import { AppModule } from 'src/app.module';

var fs = require("fs");

@Injectable()
export class AnimationService {
    private index: number;
    private taskId: any;
    private loadedAnimations: Animation[];
    public currentAnimation: Animation;
    
    constructor(private readonly connection: Connection) {
        this.queryAnimation(2).then(o => { 
            this.loadAnimation(o);
            this.animate();
        });
    }

    async animate() {
        if(typeof this.currentAnimation === 'undefined' || this.currentAnimation.frames.length == 0) {
            this.taskId = setTimeout(() => {this.animate()}, 100);
        } else {
            if(typeof this.currentAnimation.frames[this.index] === 'undefined') {
                this.taskId = setTimeout(() => {this.animate()}, 100);
                console.log('abc ' + this.index);
                this.index = 0;
                return;   
            } 

            var buffer = new Buffer(128);

            for(var i = 0; i < 64; i++) {
                //TODO übersichtlicher
                if(typeof this.currentAnimation.frames[this.index].data[i] !== 'undefined') {
                    var r = (this.currentAnimation.frames[this.index].data[i].red >> 3) & 0x1F;
                    var g = (this.currentAnimation.frames[this.index].data[i].green >> 2) & 0x3F;
                    var b = (this.currentAnimation.frames[this.index].data[i].blue >> 3) & 0x1F;
                    var bits16 = (r << 11) + (g << 5) + b;
                    buffer.writeUInt16LE(bits16, i*2);
                } else {
                    buffer.writeUInt16LE(0x0, i*2);
                }
            }

            await fs.writeFile("/dev/fb1", buffer, (err) => {
                if (err) console.log(err);
            });

            console.log(this.currentAnimation.frames[this.index].duration);
            this.taskId = setTimeout(() => {this.animate()}, this.currentAnimation.frames[this.index].duration);

            this.index++;
            if(this.currentAnimation.frames.length <= this.index) this.index = 0;

        }
    }

    heart: boolean[] = [
        false,false,false,false,false,false,false,false,
        false,true ,true ,true ,true ,true ,true ,false,
        true ,true ,true ,true ,true ,true ,true ,true ,
        true ,true ,true ,true ,true ,true ,true ,true ,
        true ,true ,true ,true ,true ,true ,true ,true ,
        false,true ,true ,true ,true ,true ,true ,false,
        false,false,true ,true ,true ,true ,false,false,
        false,false,false,true ,true ,false,false,false,
    ];

    cut(data: number[][]) {
        for(let i = 0; i < 64; i++) {
            if(this.heart[i] === false) {
                data[i] = [0,0,0];
            }
        }
    }
    

    loadAnimation(animation: Animation) {
        this.currentAnimation = animation;
        if(this.taskId) {
            clearTimeout(this.taskId);
            this.animate();
        }
    }

    async queryAnimation(animationId: number): Promise<Animation> {
        let animation: Animation = new Animation();
        animation.animationId = animationId;
        
        /*this.connection.manager.createQueryBuilder()
        .select('*')
        .from(Animation, 'animation')
        .where('animationAnimationId = :id', {id: id})
        .limit(1).select();*/
        return <Animation> <unknown> await this.connection.manager
        .findOne("animation", {where: {id: animation.animationId}, });
    
    }
}
