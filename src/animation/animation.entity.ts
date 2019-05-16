import { Entity, Column, PrimaryGeneratedColumn, OneToMany, Unique } from 'typeorm';
import { AnimationFrame } from './animation-frame.entity';
import { IAnimation, IAnimationFrame } from '../interfaces';
import { MatrixCell } from './matrix-cell.entity';
import { Color } from './color.entity';

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
        animation.repeats = animationData.repeats;
        animation.enabled = animationData.enabled;
        animation.colors = Array();
        if(animationData.frames) {
            for(let i = 0; i < animationData.frames.length; i++) {
                animation.frames[i] = AnimationFrame.fromData(animationData.frames[i]);
            }
        }
        if(animationData.colors) {
            for(let i = 0; i < animationData.colors.length; i++) {
                animation.colors[i] = Color.fromData(animationData.colors[i]);
            }
        }
        return animation;
    }

    @PrimaryGeneratedColumn()
    public animationId: number;
    
    @Column({ length: 64 })
    public name: string;

    @Column()
    public repeats: number;

    @Column()
    public enabled: boolean;

    @OneToMany(type => AnimationFrame, frame => frame.animation, {cascade: ["insert", "update", "remove"], eager:true})
    public frames: AnimationFrame[];

    @OneToMany(type => Color, c => c.animation, {cascade: ["insert", "update", "remove"], eager:true})
    public colors: Color[];

    toObject(): object {
        let frames: object[] = Array();

        for(let i = 0; this.frames && i < this.frames.length; i++) {
            frames[i] = this.frames[i].toObject();
        }

        return {id: this.animationId, name: this.name, frames: frames, repeats: this.repeats, enabled: this.enabled, colors: this.colors}
    }
    
}