/**
 * 
 */

import { Canvas } from "@brendangooch/canvas";
import { GameLoop } from "./game-loop.js";
import { Renderer } from "./renderer.js";
import type { iScreenEntity } from "./index.js";

export class GameEngine {

    public gameLoop: GameLoop;
    public renderer: Renderer;

    public constructor(canvas: Canvas) {
        this.gameLoop = new GameLoop();
        this.renderer = new Renderer(canvas);
    }

    public add(entity: iScreenEntity | iScreenEntity[]): void {
        this.gameLoop.add(entity);
        this.renderer.add(entity);
    }

    public start(): void {
        this.gameLoop.start();
        this.renderer.start();
    }

    public stop(): void {
        this.gameLoop.stop();
        this.renderer.stop();
    }

    public pause(): void {
        this.gameLoop.pause();
        this.renderer.pause();
    }

}