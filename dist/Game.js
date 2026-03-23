import { addPins, getPinCount } from "./ScoreKeeper.js";
import { doesArrayMatch, parseId } from "./types.js";
export default class Game {
    session;
    id;
    frames = Array.from({ length: 10 }, () => ({ deliveries: [] }));
    constructor(session, id) {
        this.session = session;
        this.id = id;
    }
    verifyId(id) {
        if (!id.startsWith(this.id))
            throw new Error("Not my game.");
    }
    getFrame(id) {
        const { game, frame } = parseId(id);
        this.verifyId(id);
        return this.frames[frame - 1];
    }
    editDelivery(id, newDelivery) {
        const { frame, delivery } = parseId(id);
        this.verifyId(id);
        this.frames[frame - 1].deliveries[delivery - 1] = newDelivery;
    }
    getDelivery(id) {
        const { frame, delivery } = parseId(id);
        this.verifyId(id);
        return this.frames[frame - 1].deliveries[delivery - 1];
    }
    getDeliveryForDisplay(id, simple = false, delivery) {
        const frame = this.getFrame(id);
        const frameIndex = this.frames.indexOf(frame);
        // If delivery was passed in, check if it's a carry-over (not in original frame)
        const isCarryOver = delivery != null && !frame.deliveries.includes(delivery);
        const d = delivery ?? this.getDelivery(id);
        const pins = d.pins;
        const foul = d.foul ? "." : "";
        if (simple || isCarryOver) {
            const count = getPinCount(pins);
            const prefix = isCarryOver ? "_" : "";
            return count === 0 ? `${prefix}-${foul}` : `${prefix}${count}${foul}`;
        }
        const deliveryIndex = frame.deliveries.indexOf(d);
        const allDown = [true, true, true, true, true];
        const isSpare = deliveryIndex > 0 && (() => {
            let prev = [false, false, false, false, false];
            for (const d of frame.deliveries.slice(0, deliveryIndex)) {
                if (d.foul)
                    continue;
                const combined = addPins(prev, d.pins);
                if (doesArrayMatch(combined, allDown)) {
                    prev = [false, false, false, false, false];
                }
                else {
                    prev = combined;
                }
            }
            return doesArrayMatch(addPins(prev, pins), allDown);
        })();
        if (isSpare)
            return `/${foul}`;
        if (deliveryIndex === 0 || frameIndex === 9) {
            if (doesArrayMatch(pins, allDown))
                return `X${foul}`;
            if (doesArrayMatch(pins, [false, false, true, false, false]))
                return `HP${foul}`;
            if (doesArrayMatch(pins, [false, true, true, false, false]) ||
                doesArrayMatch(pins, [false, false, true, true, false]))
                return `HS${foul}`;
            if (doesArrayMatch(pins, [true, true, true, true, false]))
                return `R${foul}`;
            if (doesArrayMatch(pins, [false, true, true, true, true]))
                return `L${foul}`;
            if (doesArrayMatch(pins, [false, true, true, true, false]))
                return `A${foul}`;
            if (doesArrayMatch(pins, [false, false, true, true, true]) ||
                doesArrayMatch(pins, [true, true, true, false, false]))
                return `C/O${foul}`;
        }
        const count = getPinCount(pins);
        return count === 0 ? `-${foul}` : `${count}${foul}`;
    }
    removeDelivery(id) {
        const { frame, delivery } = parseId(id);
        this.verifyId(id);
        delete this.frames[frame - 1].deliveries[delivery];
    }
}
//# sourceMappingURL=Game.js.map