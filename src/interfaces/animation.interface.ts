import { IAnimationFrame } from './frame.interface';
import { IMatrixCell } from './matrix.interface';

export interface IAnimation {
    animationId?: number;
    name?: string;
    frames?: IAnimationFrame[];
    repeats?: number;
    enabled?: boolean;
    colors?: IMatrixCell[];
}