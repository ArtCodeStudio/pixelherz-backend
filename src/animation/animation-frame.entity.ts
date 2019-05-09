import { MatrixCell } from './matrix-cell.entity';
import { Entity, Column, OneToMany, PrimaryGeneratedColumn, ManyToOne, Unique, Index, JoinColumn } from 'typeorm';
import { Animation } from './animation.entity';

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
    
    constructor(position: number, duration: number, data: MatrixCell[]) {
        this.duration = duration;
        this.data = data;
    }

    toObject(): object {
        let data: object[] = Array();
        for(let i = 0; i < this.data.length; i++) {
            data[i] = this.data[i].toObject();
        }
        return {frameId: this.frameId, position: this.position, duration: this.duration, data: data};
    }
}