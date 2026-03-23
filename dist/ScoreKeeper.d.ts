import Game from "./Game.js";
import { Frame, PinState } from "./types.js";
export declare function calculateTotals(game: Game): {
    pinfall: number;
    penalties: number;
    total: number;
};
export declare function calculatePerFrameTotals(game: Game): (number | null)[];
export declare function simplifyFrames(frames: Frame[]): Frame[];
export declare function addPins(...pins: PinState[]): PinState;
export declare function getPinCount(pins: PinState): number;
export declare function getFrameType(frame: Frame): "OPEN" | "SPARE" | "STRIKE" | "INCOMPLETE";
//# sourceMappingURL=ScoreKeeper.d.ts.map