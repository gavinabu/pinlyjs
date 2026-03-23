import { addPins, getPinCount } from "./ScoreKeeper.js";
import type Session from "./Session.js";
import { doesArrayMatch, parseId, PinState, type Delivery, type DeliveryId, type Frame, type FrameId, type GameId } from "./types.js";

export default class Game {
  frames: Frame[] = Array.from({ length: 10 }, () => ({ deliveries: [] } as Frame));

  constructor(public session: Session, public id: GameId) {

  }

  protected verifyId(id: GameId | FrameId | DeliveryId) {
    if (!id.startsWith(this.id)) throw new Error("Not my game.");
  }

  getFrame(id: FrameId | DeliveryId): Frame {
    const { game, frame } = parseId(id);
    this.verifyId(id);
    return this.frames[frame! - 1]!;
  }

  editDelivery(id: DeliveryId, newDelivery: Delivery) {
    const { frame, delivery } = parseId(id);
    this.verifyId(id);
    this.frames[frame! - 1]!.deliveries[delivery! - 1] = newDelivery;
  }

  getDelivery(id: DeliveryId) {
    const { frame, delivery } = parseId(id);
    this.verifyId(id);
    return this.frames[frame! - 1]!.deliveries[delivery! - 1]
  }

  getDeliveryForDisplay(id: DeliveryId, simple: boolean = false, delivery?: Delivery): string {
    const frame = this.getFrame(id)!;
    const frameIndex = this.frames.indexOf(frame);

    // If delivery was passed in, check if it's a carry-over (not in original frame)
    const isCarryOver = delivery != null && !frame.deliveries.includes(delivery);
    const d = delivery ?? this.getDelivery(id)!;
    const pins = d.pins;
    const foul = d.foul ? "." : "";

    if (simple || isCarryOver) {
      const count = getPinCount(pins);
      const prefix = isCarryOver ? "_" : "";
      return count === 0 ? `${prefix}-${foul}` : `${prefix}${count}${foul}`;
    }

    const deliveryIndex = frame.deliveries.indexOf(d);
    const allDown: PinState = [true, true, true, true, true];
    const isSpare = deliveryIndex > 0 && (() => {
      let prev: PinState = [false, false, false, false, false];
      for (const d of frame.deliveries.slice(0, deliveryIndex)) {
        if (d.foul) continue;
        const combined = addPins(prev, d.pins);
        if (doesArrayMatch(combined, allDown)) {
          prev = [false, false, false, false, false];
        } else {
          prev = combined;
        }
      }
      return doesArrayMatch(addPins(prev, pins), allDown);
    })();

    if (isSpare) return `/${foul}`;

    if (deliveryIndex === 0 || frameIndex === 9) {
      if (doesArrayMatch(pins, allDown)) return `X${foul}`;
      if (doesArrayMatch(pins, [false, false, true, false, false])) return `HP${foul}`;
      if (doesArrayMatch(pins, [false, true, true, false, false]) ||
        doesArrayMatch(pins, [false, false, true, true, false])) return `HS${foul}`;
      if (doesArrayMatch(pins, [true, true, true, true, false])) return `R${foul}`;
      if (doesArrayMatch(pins, [false, true, true, true, true])) return `L${foul}`;
      if (doesArrayMatch(pins, [false, true, true, true, false])) return `A${foul}`;
      if (doesArrayMatch(pins, [false, false, true, true, true]) ||
        doesArrayMatch(pins, [true, true, true, false, false])) return `C/O${foul}`;
    }

    const count = getPinCount(pins);
    return count === 0 ? `-${foul}` : `${count}${foul}`;
  }

  removeDelivery(id: DeliveryId) {
    const { frame, delivery } = parseId(id);
    this.verifyId(id);
    delete this.frames[frame! - 1]!.deliveries[delivery!]
  }
}