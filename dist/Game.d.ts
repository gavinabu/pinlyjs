import type Session from "./Session.js";
import { type Delivery, type DeliveryId, type Frame, type FrameId, type GameId } from "./types.js";
export default class Game {
    session: Session;
    id: GameId;
    frames: Frame[];
    constructor(session: Session, id: GameId);
    protected verifyId(id: GameId | FrameId | DeliveryId): void;
    getFrame(id: FrameId | DeliveryId): Frame;
    editDelivery(id: DeliveryId, newDelivery: Delivery): void;
    getDelivery(id: DeliveryId): Delivery | undefined;
    getDeliveryForDisplay(id: DeliveryId, simple?: boolean, delivery?: Delivery): string;
    removeDelivery(id: DeliveryId): void;
}
//# sourceMappingURL=Game.d.ts.map