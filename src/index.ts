/**
 * package barrel file
 */

import type { Canvas } from "@brendangooch/canvas";

export interface iRenderable {
    render(canvas: Canvas): void;
}

export interface iLoopable {
    update(deltaTime: number): void;
    scroll(elapsed: number): void;
}

export interface iScreenEntity extends iLoopable, iRenderable { }

export { GameEngine } from "./game-engine.js";
export { GameLoop } from "./game-loop.js";
export { Renderer } from "./renderer.js";