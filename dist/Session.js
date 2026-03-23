import Game from "./Game.js";
export default class Session {
    games = [];
    id;
    constructor(uuid) {
        this.id = uuid || crypto.randomUUID();
    }
    newGame() {
        const g = new Game(this, `${this.id}_${this.games.length + 1}`);
        this.games.push(g);
        return g;
    }
}
//# sourceMappingURL=Session.js.map