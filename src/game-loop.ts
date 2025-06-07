/**
 * 
 */

import type { iUpdateable } from "./index.js";

export class GameLoop {

    private devMode: boolean = false;
    private running: boolean = false;
    private RAF: ReturnType<typeof requestAnimationFrame>;
    private runRate: number = 1;
    private updateables: iUpdateable[] = [];
    private previous: number = 0;
    private deltaTime: number = 0;
    private elapsed: number = 0;

    public setDevMode(): void {
        this.devMode = true;
    }

    public speed(speed: number): void {
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

    public restart(): void {
        this.deltaTime = -this.elapsed;
        this.elapsed = 0;
        this.updateAll();
    }

    public skip(ms: number): void {
        this.stop();
        this.deltaTime = ms;
        this.elapsed += this.deltaTime;
        this.updateAll();
    }

    private reset(): void {
        this.previous = 0;
        this.deltaTime = 0;
    }

    private update(): void {
        this.updateState();
        this.updateAll();
        this.requestAnimationFrame();
    }

    private updateState(): void {
        const now = Date.now();
        if (this.previous === 0) this.deltaTime = 0;
        else this.deltaTime = (now - this.previous) * this.runRate;
        this.previous = now;
        this.elapsed += this.deltaTime;
    }

    private updateAll(): void {
        this.updateables.forEach(obj => obj.update(this.deltaTime, this.doComplete));
    }

    private requestAnimationFrame(): void {
        this.RAF = requestAnimationFrame(this.update.bind(this));
    }

    private get doComplete(): boolean {
        return !this.devMode;
    }

}