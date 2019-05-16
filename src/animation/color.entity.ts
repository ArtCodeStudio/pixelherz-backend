import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, Index } from "typeorm";
import { IColor } from "src/interfaces";
import { Animation } from "./animation.entity";

@Entity()
@Index(['position', 'animation'])
export class Color {

    @PrimaryGeneratedColumn()
    public colorId: number;

    @ManyToOne(type => Animation, a => a.colors, {onDelete: "CASCADE"})
    public animation: Animation;
    
    @Column()
    public position: number;
    
    @Column()
    public red: number;
    @Column()
    public green: number;
    @Column()
    public blue: number;

    static fromData(colorData: IColor): Color {
        let color: Color = new Color();
        color.blue = colorData.blue;
        color.red = colorData.red;
        color.green = colorData.green;
        color.position = colorData.position;
        return color;
    }


    toObject(): object {
        return {id: this.colorId, position: this.position, red: this.red, green: this.green, blue: this.blue};
    }
}