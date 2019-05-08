import { MatrixCell } from './matrix-cell';

export class AnimationFrame {
    constructor(public duration: number, public data: MatrixCell[]) {}
}