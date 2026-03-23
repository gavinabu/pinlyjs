export function getPinPos(pin) {
    if (pin === "L2")
        return 0;
    if (pin === "L3")
        return 1;
    if (pin === "H")
        return 2;
    if (pin === "R3")
        return 3;
    if (pin === "R2")
        return 4;
}
export function getPinFromPos(pos) {
    if (pos === 0)
        return "L2";
    if (pos === 1)
        return "L3";
    if (pos === 2)
        return "H";
    if (pos === 3)
        return "R3";
    if (pos === 4)
        return "R2";
    throw new Error("Pos out of range");
}
export const PinValue = {
    L2: 2,
    L3: 3,
    H: 5,
    R3: 3,
    R2: 2
};
export function parseId(id) {
    const idParts = id.split("_");
    return {
        session: idParts[0],
        game: idParts[1] ? parseInt(idParts[1]) : undefined,
        frame: idParts[2] ? parseInt(idParts[2]) : undefined,
        delivery: idParts[3] ? parseInt(idParts[3]) : undefined,
    };
}
export function doesArrayMatch(a, b) {
    return a.every((v, i) => v === b[i]);
}
//# sourceMappingURL=types.js.map