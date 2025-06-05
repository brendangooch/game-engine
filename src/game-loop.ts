/**
 * 
 */

import { clamp } from "@brendangooch/maths";
import type { iLoopable } from "./index.js";

export class GameLoop {

    private static SPEED_INCREMENT: number = 0.1;
    private static STEP_INCREMENT: number = 20;
    private static SKIP_INCREMENT: number = 100;
    private static FAST_FORWARD_SPEED: number = 150;

    private static MIN_SPEED: number = 0.1;
    private static MAX_SPEED: number = 5;

    private static MIN_ELAPSED: number = 0;
    private static MAX_ELAPSED: number = 300000; // 5 minutes

    private running: boolean = false;
    private RAF: ReturnType<typeof requestAnimationFrame>;
    private updateables: iLoopable[] = [];
    private speed: number = 1;
    private direction: 1 | -1 = 1;
    private fixedStep: number | null = null;
    private elapsed: number = 0;
    private previous: number = 0;
    private timeSinceLastUpdate: number = 0;

    // add
    public add(obj: iLoopable | iLoopable[]): void {
        if (Array.isArray(obj)) obj.forEach(updateable => this.updateables.push(updateable));
        else this.updateables.push(obj);
    }

    public speedUp(): void {
        this.setSpeed(this.speed + GameLoop.SPEED_INCREMENT);
    }

    public slowDown(): void {
        this.setSpeed(this.speed - GameLoop.SPEED_INCREMENT);
    }

    public normalSpeed(): void {
        this.speed = 1;
    }

    public setSpeed(speed: number): void {
        this.speed = clamp(speed, GameLoop.MIN_SPEED, GameLoop.MAX_SPEED);
    }

    public start(): void {
        if (!this.running) {
            this.reset();
            this.bindRAF();
            this.running = true;
        }
    }

    public stop(): void {
        if (this.running) {
            this.running = false;
            if (this.RAF) cancelAnimationFrame(this.RAF);
        }
    }

    public pause(): void {
        (this.running) ? this.stop() : this.start();
    }

    public play(): void {
        this.direction = 1;
        this.fixedStep = null;
        this.speed = 1;
        this.start();
    }

    public playBackwards(): void {
        this.direction = -1;
        this.fixedStep = null;
        this.speed = 1;
        this.start();
    }

    public fastForwards(): void {
        this.direction = 1;
        this.fixedStep = GameLoop.FAST_FORWARD_SPEED;
        this.start();
    }

    public rewind(): void {
        this.fixedStep = GameLoop.FAST_FORWARD_SPEED;
        this.direction = -1;
        this.start();
    }

    public step(dir: 1 | -1): void {
        this.setElapsed(this.elapsed + GameLoop.STEP_INCREMENT * dir);
        this.scrollAll();
    }

    public skip(dir: 1 | -1): void {
        this.setElapsed(this.elapsed + GameLoop.SKIP_INCREMENT * dir);
        this.scrollAll();
    }

    public restart(): void {
        this.elapsed = 0;
        this.scrollAll();
    }

    private reset(): void {
        this.previous = 0;
        // this.elapsed = 0;
        this.timeSinceLastUpdate = 0;
    }

    private bindRAF(): void {
        this.RAF = requestAnimationFrame(this.update.bind(this));
    }

    private update(): void {
        if (!this.fixedStep) {
            const now = Date.now();
            if (this.previous === 0) this.timeSinceLastUpdate = 0;
            else this.timeSinceLastUpdate = now - this.previous;
            this.previous = now;
        }
        this.updateAll();
        this.setElapsed(this.elapsed + this.deltaTime);
        this.bindRAF();
    }

    private updateAll(): void {
        this.updateables.forEach(obj => obj.update(this.deltaTime));
    }

    private scrollAll(): void {
        this.updateables.forEach(obj => obj.scroll(this.elapsed));
    }

    private setElapsed(elapsed: number): void {
        this.elapsed = clamp(elapsed, GameLoop.MIN_ELAPSED, GameLoop.MAX_ELAPSED);
    }

    private get deltaTime(): number {
        return (this.fixedStep) ? this.fixedStep * this.direction : this.timeSinceLastUpdate * this.speed * this.direction;
    }

}

// export class GameLoop {

//     private static MAX_RUN_RATE: number = 10;
//     private static MIN_RUN_RATE: number = 0.1;
//     private static RUN_RATE_INCREMENT: number = 0.1;
//     private static STEP_INCREMENT: number = 20;

//     private runRate: number = 1;
//     private direction: number = 1;
//     private running: boolean = false;
//     private RAF: ReturnType<typeof requestAnimationFrame> | null = null;
//     private updateables: iUpdateable[] = [];
//     private elapsed: number = 0;
//     private previous: number = 0;
//     private deltaTime: number = 0;

//     public log(msg: string = 'state'): void {
//         console.group(msg);
//         console.log(`runRate: ${this.runRate}`);
//         console.log(`direction: ${(this.direction === 1) ? 'forwards' : 'backwards'}`);
//         console.log(`running: ${this.running}`);
//         console.log(`elapsed: ${this.elapsed}`);
//         console.log(`previous: ${this.previous}`);
//         console.log(`deltaTime: ${this.deltaTime}`);
//         console.log(`updateables:`);
//         console.log(this.updateables);
//         console.groupEnd();
//     }

//     public setRunRate(runRate: number): void {
//         this.runRate = runRate;
//     }

//     public add(updateable: iUpdateable): void {
//         this.updateables.push(updateable);
//     }

//     public remove(updateable: iUpdateable): void {
//         this.updateables = this.updateables.filter(obj => obj !== updateable);
//     }

//     public start(): void {
//         if (!this.running) {
//             this.reset();
//             this.bindRAF();
//             this.running = true;
//         }
//     }

//     public stop(): void {
//         if (this.running) {
//             this.running = false;
//             if (this.RAF) cancelAnimationFrame(this.RAF);
//             this.RAF = null;
//         }
//     }

//     public pause(): void {
//         if (this.running) this.stop();
//         else this.start();
//     }

//     public switchDirection(): void {
//         this.direction = (this.direction === 1) ? -1 : 1;
//     }

//     public speedUp(): void {
//         this.runRate += GameLoop.RUN_RATE_INCREMENT;
//         this.runRate = Math.min(GameLoop.MAX_RUN_RATE, this.runRate);
//     }

//     public slowDown(): void {
//         this.runRate -= GameLoop.RUN_RATE_INCREMENT;
//         this.runRate = Math.max(GameLoop.MIN_RUN_RATE, this.runRate);
//     }

//     public normalSpeed(): void {
//         this.runRate = 1;
//     }

//     public stepForwards(): void {
//         this.deltaTime = GameLoop.STEP_INCREMENT;
//         this.elapsed += this.deltaTime;
//         this.updateObjects();
//     }

//     public stepBackwards(): void {
//         this.deltaTime = -GameLoop.STEP_INCREMENT;
//         this.elapsed += this.deltaTime;
//         this.updateObjects();
//     }

//     public rewind(): void {
//         this.deltaTime -= this.elapsed;
//         this.elapsed = 0;
//         this.updateObjects();
//     }

//     private update(): void {
//         if (this.running) {
//             this.log();
//             this.updateState();
//             this.updateObjects();
//             this.bindRAF();
//         }
//     }

//     private updateState(): void {
//         const now = Date.now();
//         if (this.previous === 0) this.deltaTime = 0;
//         else this.deltaTime = now - this.previous;
//         this.previous = now;
//         this.elapsed += this.deltaTime;
//     }

//     private updateObjects(): void {
//         this.updateables.forEach(obj => obj.update(this.delta));
//     }

//     private bindRAF(): void {
//         this.RAF = requestAnimationFrame(this.update.bind(this));
//     }

//     private reset(): void {
//         this.elapsed = 0;
//         this.previous = 0;
//         this.deltaTime = 0;
//     }

//     private get delta(): number {
//         return this.deltaTime * this.runRate * this.direction;
//     }

// }