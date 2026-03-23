export type Pin = "L2" | "L3" | "H" | "R3" | "R2";
/**
 * Left2,
 * Left3,
 * Headpin,
 * Right3,
 * Right2\
 * `true` for knocked down.
 */
export type PinState = [boolean, boolean, boolean, boolean, boolean];
export declare function getPinPos(pin: Pin): 0 | 1 | 2 | 3 | 4 | undefined;
export declare function getPinFromPos(pos: number): Pin;
export declare const PinValue: Record<Pin, number>;
export interface Delivery {
    /** This is what pins were knocked down in **this** delivery, **NOT** pins on lane */
    pins: PinState;
    foul: boolean;
}
export interface Frame {
    deliveries: Delivery[];
}
type FrameIdPart = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
type BallIdPart = 1 | 2 | 3;
/** session id is a uuid, but you can type a uuid since its too big. */
export type SessionId = `${string}`;
export type GameId = `${SessionId}_${number}`;
export type FrameId = `${GameId}_${FrameIdPart}`;
export type DeliveryId = `${FrameId}_${BallIdPart}`;
export declare function parseId(id: SessionId | GameId | FrameId | DeliveryId): {
    session: string;
    game: number | undefined;
    frame: number | undefined;
    delivery: number | undefined;
};
export declare function doesArrayMatch(a: any[], b: any[]): boolean;
export {};
//# sourceMappingURL=types.d.ts.map