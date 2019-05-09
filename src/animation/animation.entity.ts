import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { AnimationFrame } from './animation-frame.entity';

@Entity()
export class Animation {
    @PrimaryGeneratedColumn()
    public animationId: number;

    @Column({ length: 64 })
    public name: string;

    @OneToMany(type => AnimationFrame, frame => frame.animation, {cascade: ["insert", "update", "remove"], eager:true})
    public frames: AnimationFrame[];

    toObject(): object {
        let frames: object[] = Array();
        for(let i = 0; i < this.frames.length; i++) {
            frames[i] = this.frames[i].toObject();
        }
        return {id: this.animationId, name: this.name, frames: frames}
    }
    
}