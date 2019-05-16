import { Injectable, Next } from '@nestjs/common';
import { Animation } from './animation.entity';
import { Connection } from 'typeorm';

var fs = require("fs");

@Injectable()
export class AnimationService {

    private index: number = 0;
    private repeats: number = 0;
    private taskId: any;
    public loadedAnimations: Animation[];
    public currentAnimation: Animation;
    
    constructor(private readonly connection: Connection) {
        this.queryAnimations().then(o => {
            this.loadedAnimations = o;
            for(let i = 0; i < this.loadedAnimations.length; i++) {
                //this.loadedAnimations[i].frames.sort((a, b) => {
                //    return a.position - b.position;
                //})
            };
            this.currentAnimation = this.loadedAnimations[0];
            console.log(this.loadedAnimations);
            this.animate();
        });
    }

    async animate() {
        if(typeof this.currentAnimation === 'undefined' || typeof this.currentAnimation.frames === 'undefined' || this.currentAnimation.frames.length == 0) {
            this.taskId = setTimeout(() => {this.animate()}, 100);
            this.next();
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

            this.next();

        }
    }

    next() {
        if(!this.animationAvailable()) {
            return;
        }
        this.index++;                
        if(!this.currentAnimation || typeof this.currentAnimation.frames === 'undefined' || this.currentAnimation.frames.length <= this.index || !this.currentAnimation.enabled) {

            if(this.repeats >= this.currentAnimation.repeats-1) {
                this.index = 0;
                this.repeats = 0;
                this.nextAnimation();
                while(!this.currentAnimation.enabled && this.animationAvailable()) {
                    this.index = 0;
                    this.repeats = 0;
                    this.nextAnimation();
                }  
            } else {
                this.repeats++;
                this.index = 0;
            }
        }
    }

    animationAvailable(): boolean {
        for (let i = 0; i < this.loadedAnimations.length; i++) {
            if(this.loadedAnimations[i].enabled) return true;
        }
        return false;
    }
    
    nextAnimation() {
        if(this.loadedAnimations.length-1 > this.loadedAnimations.indexOf(this.currentAnimation)) {
            console.log("new animation: " + this.loadedAnimations.indexOf(this.currentAnimation)+1);
            this.currentAnimation = this.loadedAnimations[this.loadedAnimations.indexOf(this.currentAnimation)+1];
        } else {
            this.currentAnimation = this.loadedAnimations[0];
            console.log("new animation: " + 1);
        } 
    }

    async createAnimation(animation: Animation) {
        await this.connection.manager.save(Animation, animation);
        console.log(animation)
        this.loadAnimation(animation);
    }

    loadAnimation(animation: Animation) {
        let found: boolean = false;
        for(let i = 0; i < this.loadedAnimations.length; i++) {
            if(this.loadedAnimations[i].animationId == animation.animationId) {
                this.loadedAnimations[i] = animation;
                found = true;
            }
        }
        if(!found) {
            this.loadedAnimations[this.loadedAnimations.length] = animation;
        }
        this.currentAnimation = animation;
        if(this.taskId) {
            clearTimeout(this.taskId);
            this.animate();
        }
    }

    async queryAnimation(animationId: number): Promise<Animation> {
        return await this.connection.manager.findOne("animation", {where: {animationId: animationId}}) as Animation;
    }


    async queryAnimations(): Promise<Animation[]> {
        return await this.connection.manager.find("animation");
    }
    
    async listAnimations() {
        return await this.connection.manager.find("animation", { select: ["animationId", "name", "repeats", "enabled"]});
    }
    async delete(id: string) {
        await this.connection
        .createQueryBuilder()
        .delete()
        .from(Animation)
        .where('animationId = :id', {id: id})
        .execute();
        for (let i = 0; i < this.loadedAnimations.length; i++) {
            if(this.loadedAnimations[i].animationId == Number.parseInt(id)) {
                this.loadedAnimations.splice(i, 1);
            }            
        }
    }


    async setStatus(id: string, enabled: boolean) {
        for (let i = 0; i < this.loadedAnimations.length; i++) {
            if(this.loadedAnimations[i].animationId == Number.parseInt(id)) {
                this.loadedAnimations[i].enabled = enabled;
            }            
        }
        await this.connection
        .createQueryBuilder()
        .update(Animation)
        .set({enabled: enabled})
        .where('animationId = :id', {id: Number.parseInt(id)})
        .execute();
    }

    async setRepeats(id: string, repeats: number) {
        for (let i = 0; i < this.loadedAnimations.length; i++) {
            if(this.loadedAnimations[i].animationId == Number.parseInt(id)) {
                this.loadedAnimations[i].repeats = repeats;
            }            
        }
        await this.connection
        .createQueryBuilder()
        .update(Animation)
        .set({repeats: repeats})
        .where('animationId = :id', {id: Number.parseInt(id)})
        .execute();
    }
}
