import { MatrixCell } from './matrix-cell.entity';
import { Entity, Column, OneToMany, PrimaryGeneratedColumn, ManyToOne, Unique, Index, JoinColumn } from 'typeorm';
import { Animation } from './animation.entity';
import { IAnimationFrame } from 'src/interfaces';

@Entity({
    orderBy: {
        position: "ASC"
    }
})
export class AnimationFrame {

    @PrimaryGeneratedColumn()
    public frameId: number;

    @ManyToOne(type => Animation, animation => animation.frames, { onDelete: "CASCADE"})
    public animation: Animation;

    @Column()
    public position: number;

    @Column()
    public duration: number;

    @OneToMany(type => MatrixCell, cell => cell.frame, {cascade: ["insert", "update", "remove"], eager:true})
    public data: MatrixCell[];
    
    static fromData(frameData: IAnimationFrame): AnimationFrame {
        let animationFrame: AnimationFrame = new AnimationFrame();
        animationFrame.position = frameData.position;
        animationFrame.duration = frameData.duration;
        animationFrame.data = Array();
        for(let i = 0; i < frameData.data.length; i++) {
            animationFrame.data[i] = MatrixCell.fromData(frameData.data[i]);
        }
        return animationFrame;
    }

    toObject(): object {
        let data: object[] = Array();
        for(let i = 0; i < this.data.length; i++) {
            data[i] = this.data[i].toObject();
        }
        return {frameId: this.frameId, position: this.position, duration: this.duration, data: data};
    }
}