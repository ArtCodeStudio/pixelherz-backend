
import { Injectable } from '@nestjs/common';
import { AnimationFrame } from './animation-frame';
var fs = require("fs");

@Injectable()
export class AnimationService {
    public _data: AnimationFrame[];
    private index: number;
    private taskId: any;

    constructor() {
        this.animation1();
        this.animate();
    }

    async animate() {
        if(typeof this.data === 'undefined' || this.data.length == 0) {
            this.taskId = setTimeout(() => {this.animate()}, 100);
        } else {
            if(typeof this.data[this.index] === 'undefined') {
                this.taskId = setTimeout(() => {this.animate()}, 100);
                console.log('abc');
                this.index = 0;
                return;   
            } 

            var buffer = new Buffer(128);

            for(var i = 0; i < 64; i++) {
                //TODO übersichtlicher
                if(typeof this.data[this.index].data[i] !== 'undefined') {
                    var r = (this.data[this.index].data[i][0] >> 3) & 0x1F;
                    var g = (this.data[this.index].data[i][1] >> 2) & 0x3F;
                    var b = (this.data[this.index].data[i][2] >> 3) & 0x1F;
                    var bits16 = (r << 11) + (g << 5) + b;
                    buffer.writeUInt16LE(bits16, i*2);
                } else {
                    buffer.writeUInt16LE(0x0, i*2);
                }
            }

            await fs.writeFile("/dev/fb1", buffer, (err) => {
                if (err) console.log(err);
            });

            this.taskId = setTimeout(() => {this.animate()}, this.data[this.index].duration);

            this.index++;
            if(this.data.length <= this.index) this.index = 0;

        }
    }

    animation1() {
        this.data = Array(64);
        for(let i = 0; i < 64; i++) {
            let data = Array(64).fill([0,0,0]);
            data[i] = [255,255,255];
            this.cut(data);
            this.data[i] = new AnimationFrame(40, data); 
        }
    }
    
    animation2() {
        this.data = Array(2);
        let a = Array(64).fill([0,0,0]);
        for(let i = 0; i < 64; i+=2) {
            a[i] = [255,255,255]; 
        }
        let b = Array(64).fill([0,0,0]);
        for(let i = 1; i < 64; i+=2) {
            b[i] = [255,255,255]; 
        }
        this.cut(a);
        this.cut(b);
        this.data[0] = new AnimationFrame(400, a);
        this.data[1] = new AnimationFrame(400, b);
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
    
    
    private sleep(millis: number) {
        return new Promise(resolve => setTimeout(resolve, millis));
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
