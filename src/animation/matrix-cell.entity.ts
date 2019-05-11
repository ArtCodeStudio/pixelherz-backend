import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, PrimaryColumn, Index, JoinColumn } from "typeorm";
import { AnimationFrame } from "./animation-frame.entity";
import { IMatrixCell } from "src/interfaces";

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

    static fromData(cellData: IMatrixCell): MatrixCell {
        let matrixCell: MatrixCell = new MatrixCell();
        matrixCell.blue = cellData.blue;
        matrixCell.red = cellData.red;
        matrixCell.green = cellData.green;
        matrixCell.position = cellData.position;
        return matrixCell;
    }


    toObject(): object {
        return {id: this.cellId, position: this.position, red: this.red, green: this.green, blue: this.blue};
    }
}