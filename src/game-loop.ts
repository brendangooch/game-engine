/**
 * 
 */

import type { iUpdateable } from "./index.js";

export class GameLoop {

    private running: boolean = false;
    private RAF: ReturnType<typeof requestAnimationFrame>;
    private runRate: number = 1;
    private updateables: iUpdateable[] = [];
    private previous: number = 0;
    private deltaTime: number = 0;

    public setRunRate(speed: number): void {
        this.runRate = speed;
    }

    public add(updateable: iUpdateable | iUpdateable[]): void {
        if (Array.isArray(updateable)) updateable.forEach(obj => this.updateables.push(obj));
        else this.updateables.push(updateable);
    }

    public start(): void {
        if (!this.running) {
            this.reset();
            this.requestAnimationFrame();
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

    private reset(): void {
        this.previous = 0;
        this.deltaTime = 0;
    }

    private update(): void {
        this.updateDeltaTime();
        this.updateAll();
        this.requestAnimationFrame();
    }

    private updateDeltaTime(): void {
        const now = Date.now();
        if (this.previous === 0) this.deltaTime = 0;
        else this.deltaTime = (now - this.previous) * this.runRate;
        this.previous = now;
    }

    private updateAll(): void {
        this.updateables.forEach(obj => obj.update(this.deltaTime));
    }

    private requestAnimationFrame(): void {
        this.RAF = requestAnimationFrame(this.update.bind(this));
    }

}