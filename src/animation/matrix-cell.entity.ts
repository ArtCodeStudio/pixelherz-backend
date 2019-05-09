import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, PrimaryColumn, Index, JoinColumn } from "typeorm";
import { AnimationFrame } from "./animation-frame.entity";

@Entity()
@Index(['position', 'frame'])
export class MatrixCell {

    @PrimaryGeneratedColumn()
    public cellId: number;

    @ManyToOne(type => AnimationFrame, frame => frame.data, {onDelete: "CASCADE"})
    public frame: AnimationFrame;
    
    @Column()
    public position: number;
    
    @Column()
    public red: number;
    @Column()
    public green: number;
    @Column()
    public blue: number;

    constructor(position: number, red: number, green: number, blue: number) {
        this.position = position;
        this.red = red;
        this.green = green;
        this.blue = blue;
    }
    
    toObject(): object {
        return {id: this.cellId, position: this.position, red: this.red, green: this.green, blue: this.blue};
    }
}