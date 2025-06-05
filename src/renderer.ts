/**
 * 
 */

import { Canvas } from "@brendangooch/canvas";
import type { iRenderable } from "./index.js";

export class Renderer {

    public static FPS: number = 60;

    private canvas: Canvas;
    private running: boolean = false;
    private renderables: iRenderable[] = [];
    private intervalID: ReturnType<typeof setInterval>;

    public constructor(canvas: Canvas) {
        this.canvas = canvas;
    }

    public add(renderable: iRenderable | iRenderable[]): void {
        if (Array.isArray(renderable)) renderable.forEach(obj => this.renderables.push(obj));
        else this.renderables.push(renderable);
    }

    public start(): void {
        this.loadInterval();
        this.running = true;
    }

    public stop(): void {
        this.running = false;
        clearInterval(this.intervalID);
    }

    public pause(): void {
        (this.running) ? this.stop() : this.start();
    }

    public render(): void {
        this.canvas.clear();
        this.renderables.forEach(obj => obj.render(this.canvas));
    }

    private loadInterval(): void {
        this.intervalID = setInterval(this.render.bind(this), 1000 / Renderer.FPS);
    }

}