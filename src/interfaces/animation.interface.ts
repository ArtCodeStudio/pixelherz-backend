import { IAnimationFrame } from './frame.interface';

export interface IAnimation {
    animationId?: number;
    name?: string;
    frames?: IAnimationFrame[];
    repeats?: number;
    enabled?: boolean;
}