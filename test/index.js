import Session from "../dist/Session.js"
import * as ScoreKeeper from "../dist/ScoreKeeper.js"

const s = new Session();
const g = s.newGame();
const id = g.id;

// Frame 1
g.editDelivery(`${id}_1_1`, { foul: false, pins: [false, false, true, false, false] }); // H only → HP
g.editDelivery(`${id}_1_2`, { foul: false, pins: [true, true, false, false, false] }); // L2+L3 = 5
g.editDelivery(`${id}_1_3`, { foul: false, pins: [false, false, false, false, false] }); // missed shot

// Frame 2: knock all but R2 (leave = R corner pin)
g.editDelivery(`${id}_2_1`, { foul: false, pins: [true, true, true, true, false] }); // → R leave
g.editDelivery(`${id}_2_2`, { foul: false, pins: [false, false, false, false, true] }); // R2 → spare

// Frame 3: A = knock H+L3+R3, leave L2+R2
g.editDelivery(`${id}_3_1`, { foul: false, pins: [false, true, true, true, false] }); // → A leave
g.editDelivery(`${id}_3_2`, { foul: false, pins: [true, false, false, false, false] }); // L2 = 2
g.editDelivery(`${id}_3_3`, { foul: false, pins: [false, false, false, false, false] }); // OOB / missed

// Frame 4: L = knock all but L2 (leave = L corner pin)
g.editDelivery(`${id}_4_1`, { foul: false, pins: [false, true, true, true, true] }); // → L leave
g.editDelivery(`${id}_4_2`, { foul: false, pins: [false, false, false, false, false] }); // missed
g.editDelivery(`${id}_4_3`, { foul: false, pins: [false, false, false, false, false] }); // missed

// Frame 5: knock R3+R2 only (no headpin) = 5, then spare
g.editDelivery(`${id}_5_1`, { foul: false, pins: [false, false, false, true, true] }); // R3+R2 = 5
g.editDelivery(`${id}_5_2`, { foul: false, pins: [true, true, true, false, false] }); // L2+L3+H → spare

// Frames 6-8: Strikes
g.editDelivery(`${id}_6_1`, { foul: false, pins: [true, true, true, true, true] });
g.editDelivery(`${id}_7_1`, { foul: false, pins: [true, true, true, true, true] });
g.editDelivery(`${id}_8_1`, { foul: false, pins: [true, true, true, true, true] });

// Frame 9: HS = knock H+L3; then R3+R2=5 with foul; then L2=2
g.editDelivery(`${id}_9_1`, { foul: false, pins: [false, true, true, false, false] }); // H+L3 → HS
g.editDelivery(`${id}_9_2`, { foul: true, pins: [false, false, false, true, true] }); // R3+R2, FOUL
g.editDelivery(`${id}_9_3`, { foul: false, pins: [true, false, false, false, false] }); // L2 = 2

// Frame 10: C/O = knock H+R3+R2 (leave L3+L2); then spare; then R3=3
g.editDelivery(`${id}_10_1`, { foul: false, pins: [true, true, true, false, false] }); // H+R3+R2 → C/O
g.editDelivery(`${id}_10_2`, { foul: false, pins: [false, false, false, true, true] }); // L2+L3 → spare
g.editDelivery(`${id}_10_3`, { foul: false, pins: [false, false, false, true, false] }); // R3 = 3

const frames = ScoreKeeper.simplifyFrames(g.frames);
const formatted = frames.map((e, index) => {
  return e.deliveries.map((b, index2) => g.getDeliveryForDisplay(`${g.id}_${index + 1}_${index2 + 1}`, true, b));
})

console.log(formatted);
console.log(ScoreKeeper.calculateTotals(g));
console.log(ScoreKeeper.calculatePerFrameTotals(g));