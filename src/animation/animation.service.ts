
import { Injectable } from '@nestjs/common';
import { AnimationFrame } from './animation-frame';
var fs = require("fs");

@Injectable()
export class AnimationService {
    public _data: AnimationFrame[];
    private index: number;
    private taskId: any;

    constructor() {
        this.animate();
    }

    async animate() {
        if(typeof this.data === 'undefined' || this.data.length == 0) {
            this.taskId = setTimeout(() => {this.animate()}, 100);
        } else {
            if(typeof this.data[this.index] === 'undefined') {
                this.taskId = setTimeout(() => {this.animate()}, 100);
                console.log('abc ' + this.index);
                this.index = 0;
                return;   
            } 

            var buffer = new Buffer(128);

            for(var i = 0; i < 64; i++) {
                //TODO übersichtlicher
                if(typeof this.data[this.index].data[i] !== 'undefined') {
                    var r = (this.data[this.index].data[i].red >> 3) & 0x1F;
                    var g = (this.data[this.index].data[i].green >> 2) & 0x3F;
                    var b = (this.data[this.index].data[i].blue >> 3) & 0x1F;
                    var bits16 = (r << 11) + (g << 5) + b;
                    buffer.writeUInt16LE(bits16, i*2);
                } else {
                    buffer.writeUInt16LE(0x0, i*2);
                }
            }

            await fs.writeFile("/dev/fb1", buffer, (err) => {
                if (err) console.log(err);
            });

            console.log(this.data[this.index].duration);
            this.taskId = setTimeout(() => {this.animate()}, this.data[this.index].duration);

            this.index++;
            if(this.data.length <= this.index) this.index = 0;

        }
    }

    heart: boolean[] = [
        false,false,false,false,false,false,false,false,
        false,true ,true ,true ,true ,true ,true ,false,
        true ,true ,true ,true ,true ,true ,true ,true ,
        true ,true ,true ,true ,true ,true ,true ,true ,
        true ,true ,true ,true ,true ,true ,true ,true ,
        false,true ,true ,true ,true ,true ,true ,false,
        false,false,true ,true ,true ,true ,false,false,
        false,false,false,true ,true ,false,false,false,
    ];

    cut(data: number[][]) {
        for(let i = 0; i < 64; i++) {
            if(this.heart[i] === false) {
                data[i] = [0,0,0];
            }
        }
    }
    
    
    get data(): AnimationFrame[] {
        return this._data;
    }

    set data(frames: AnimationFrame[]) {
        this._data = frames;
        if(this.taskId) {
            clearTimeout(this.taskId);
            this.animate();
        }
    }
}
