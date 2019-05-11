import { Entity, Column, PrimaryGeneratedColumn, OneToMany, Unique } from 'typeorm';
import { AnimationFrame } from './animation-frame.entity';
import { IAnimation, IAnimationFrame } from '../interfaces';

@Entity()
@Unique(['name'])
export class Animation {

    static fromData(animationData: IAnimation): Animation {
        let animation: Animation = new Animation();
        if(animationData.name) {
            animation.name = animationData.name;
        }
        animation.animationId = animationData.animationId;
        animation.frames = Array();
        if(animationData.frames) {
            for(let i = 0; i < animationData.frames.length; i++) {
                animation.frames[i] = AnimationFrame.fromData(animationData.frames[i]);
            }
        }
        return animation;
    }

    @PrimaryGeneratedColumn()
    public animationId: number;
    
    @Column({ length: 64 })
    public name: string;

    @OneToMany(type => AnimationFrame, frame => frame.animation, {cascade: ["insert", "update", "remove"], eager:true})
    public frames: AnimationFrame[];

    toObject(): object {
        let frames: object[] = Array();

        for(let i = 0; this.frames && i < this.frames.length; i++) {
            frames[i] = this.frames[i].toObject();
        }

        return {id: this.animationId, name: this.name, frames: frames}
    }
    
}