export type Pin = "L2" | "L3" | "H" | "R3" | "R2";

/**
 * Left2,
 * Left3,
 * Headpin,
 * Right3,
 * Right2\
 * `true` for knocked down.
 */
export type PinState = [boolean, boolean, boolean, boolean, boolean]

export function getPinPos(pin: Pin) {
  if (pin === "L2") return 0;
  if (pin === "L3") return 1;
  if (pin === "H") return 2;
  if (pin === "R3") return 3;
  if (pin === "R2") return 4;
}

export function getPinFromPos(pos: number): Pin {
  if (pos === 0) return "L2";
  if (pos === 1) return "L3";
  if (pos === 2) return "H";
  if (pos === 3) return "R3";
  if (pos === 4) return "R2";
  throw new Error("Pos out of range")
}


export const PinValue: Record<Pin, number> = {
  L2: 2,
  L3: 3,
  H: 5,
  R3: 3,
  R2: 2
}

export interface Delivery {
  /** This is what pins were knocked down in **this** delivery, **NOT** pins on lane */
  pins: PinState,
  foul: boolean
}

export interface Frame {
  deliveries: Delivery[],
}

type FrameIdPart = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
type BallIdPart = 1 | 2 | 3;

/** session id is a uuid, but you can type a uuid since its too big. */
export type SessionId = `${string}`;
export type GameId = `${SessionId}_${number}`;
export type FrameId = `${GameId}_${FrameIdPart}`;
export type DeliveryId = `${FrameId}_${BallIdPart}`;

export function parseId(id: SessionId | GameId | FrameId | DeliveryId): {
  session: string,
  game: number | undefined,
  frame: number | undefined,
  delivery: number | undefined,
} {
  const idParts = id.split("_");
  return {
    session: idParts[0]!,
    game: idParts[1] ? parseInt(idParts[1]) : undefined,
    frame: idParts[2] ? parseInt(idParts[2]) : undefined,
    delivery: idParts[3] ? parseInt(idParts[3]) : undefined,
  }
}

export function doesArrayMatch(a: any[], b: any[]) {
  return a.every((v, i) => v === b[i])
}