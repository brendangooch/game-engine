/**
 * package barrel file
 */

import type { Canvas } from "@brendangooch/canvas";

export interface iRenderable {
    render(canvas: Canvas): void;
}

export interface iUpdateable {
    update(deltaTime: number, doComplete: boolean): void;
}

export interface iScreenEntity extends iRenderable, iUpdateable { }

export { GameEngine } from "./game-engine.js";
export { GameLoop } from "./game-loop.js";
export { Renderer } from "./renderer.js";