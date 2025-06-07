/**
 * 
 */

import { Canvas } from "@brendangooch/canvas";
import { GameEngine } from "./game-engine.js";
import type { GameLoop } from "./game-loop.js";

export class DevEngine extends GameEngine {

    public constructor(canvas: Canvas) {
        super(canvas);
        this.loop.setDevMode();
    }

    public get loop(): GameLoop {
        return this.gameLoop;
    }

    public render(): void {
        this.renderer.start();
    }

}