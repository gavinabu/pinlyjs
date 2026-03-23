import { getPinFromPos, PinValue } from "./types.js";
export function calculateTotals(game) {
    const simple = simplifyFrames(game.frames);
    const deliveries = simple.map(e => e.deliveries).flat();
    const pinfall = deliveries.map(e => getPinCount(e.pins)).reduce((a, b) => a + b, 0);
    const penalties = deliveries.map(e => e.foul ? -15 : 0).reduce((a, b) => a + b, 0);
    const total = pinfall + penalties;
    return {
        pinfall,
        penalties,
        total
    };
}
export function calculatePerFrameTotals(game) {
    const simple = simplifyFrames(game.frames);
    const totals = [];
    let running = 0;
    let blocked = false;
    for (let i = 0; i < simple.length; i++) {
        const frame = simple[i];
        const type = getFrameType(game.frames[i]);
        if (blocked || type === "INCOMPLETE") {
            totals.push(null);
            blocked = true;
            continue;
        }
        if (i === 9) {
            if (type === "STRIKE" && (game.frames[9].deliveries[1] == null || game.frames[9].deliveries[2] == null)) {
                totals.push(null);
                continue;
            }
            if (type === "SPARE" && game.frames[9].deliveries[2] == null) {
                totals.push(null);
                continue;
            }
        }
        else {
            if (type === "STRIKE") {
                const nextFrame = game.frames[i + 1];
                const secondNextFrame = game.frames[i + 2];
                const hasBonus1 = nextFrame?.deliveries[0] != null;
                const hasBonus2 = nextFrame?.deliveries[1] != null || secondNextFrame?.deliveries[0] != null;
                if (!hasBonus1 || !hasBonus2) {
                    totals.push(null);
                    blocked = true;
                    continue;
                }
            }
            if (type === "SPARE") {
                const hasBonus = game.frames[i + 1]?.deliveries[0] != null;
                if (!hasBonus) {
                    totals.push(null);
                    blocked = true;
                    continue;
                }
            }
        }
        const frameScore = frame.deliveries.reduce((sum, d) => sum + getPinCount(d.pins), 0);
        running += frameScore;
        totals.push(running);
    }
    return totals;
}
export function simplifyFrames(frames) {
    return frames.map((frame, index) => {
        const type = getFrameType(frame);
        if (type === "SPARE" && index !== 9) {
            const nextFrame = frames[index + 1];
            const nextBall = nextFrame?.deliveries[0]?.pins || [false, false, false, false, false];
            return { deliveries: [frame.deliveries[0], frame.deliveries[1], { pins: nextBall, foul: false }] };
        }
        if (type === "STRIKE" && index !== 9) {
            const nextFrame = frames[index + 1];
            const secondNextFrame = frames[index + 2];
            const nextBall = nextFrame?.deliveries[0]?.pins || [false, false, false, false, false];
            const secondNextBall = (nextFrame?.deliveries[1] || secondNextFrame?.deliveries[0])?.pins || [false, false, false, false, false];
            return { deliveries: [frame.deliveries[0], { pins: nextBall, foul: false }, { pins: secondNextBall, foul: false }] };
        }
        return {
            deliveries: [
                frame.deliveries[0] || { pins: [false, false, false, false, false], foul: false },
                frame.deliveries[1] || { pins: [false, false, false, false, false], foul: false },
                frame.deliveries[2] || { pins: [false, false, false, false, false], foul: false }
            ]
        };
    });
}
export function addPins(...pins) {
    return [
        pins.some((arr) => arr[0]),
        pins.some((arr) => arr[1]),
        pins.some((arr) => arr[2]),
        pins.some((arr) => arr[3]),
        pins.some((arr) => arr[4]),
    ];
}
export function getPinCount(pins) {
    return pins.map((e, index) => e ? PinValue[getPinFromPos(index)] : 0).reduce((a, b) => a + b, 0);
}
export function getFrameType(frame) {
    const firstBall = frame.deliveries[0];
    if (!firstBall)
        return "INCOMPLETE";
    var rollingPins = firstBall.pins;
    if (rollingPins.every(Boolean))
        return "STRIKE";
    const secondBall = frame.deliveries[1];
    if (!secondBall)
        return "INCOMPLETE";
    rollingPins = addPins(firstBall.pins, secondBall.pins);
    if (rollingPins.every(Boolean))
        return "SPARE";
    const thirdBall = frame.deliveries[2];
    if (!thirdBall)
        return "INCOMPLETE";
    return "OPEN";
}
//# sourceMappingURL=ScoreKeeper.js.map