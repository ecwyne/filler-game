import shuffle from 'lodash.shuffle';

export type ColorKey = 'r' | 'k' | 'p' | 'y' | 'u' | 'g';
export type Color = 'red' | 'gray' | 'purple' | 'yellow' | 'blue' | 'green';

export interface GameState {
    lastPlay?: ColorKey;
    currentPlayer: 1 | 2;
    board: string;
    player1: number[];
    player1Color: ColorKey;
    player2: number[];
    player2Color: ColorKey;
}

export const colors: Record<ColorKey, Color> = {
    r: 'red',
    k: 'gray',
    p: 'purple',
    y: 'yellow',
    u: 'blue',
    g: 'green',
};

export const columns = 3;
export const rows = 3;

export class Game {
    constructor(public state: GameState) {}

    playTurn = (c: ColorKey) => {
        const state = { ...this.state };
        const { currentPlayer: p } = this.state;
        state.lastPlay = c;
        state[`player${p}Color` as 'player1Color'] = c;
        state.currentPlayer = p === 1 ? 2 : 1;

        const set = new Set(state[`player${p}` as 'player1']);
        set.forEach(n => this.neighborsOfColor(n, c).forEach(n => set.add(n)));
        set.forEach(n => {
            state.board = this.setCharAt(state.board, n, c);
        });
        state[`player${p}` as 'player1'] = Array.from(set);
        return state;
    };

    private neighborsOfColor = (i: number, c: ColorKey) => {
        const arr: number[] = [];
        const { board } = this.state;
        if (board[i - columns] === c) arr.push(i - columns);
        if (board[i + columns] === c) arr.push(i + columns);
        if (i % columns !== 0 && board[i - 1] === c) arr.push(i - 1);
        if (i % columns !== columns - 1 && board[i + 1] === c) arr.push(i + 1);
        return arr;
    };

    private setCharAt = (board: string, n: number, c: ColorKey) =>
        board.substr(0, n) + c + board.substr(n + 1);

    static generate = () => {
        let board = '';
        const p1 = (rows - 1) * columns;
        const p2 = columns - 1;

        for (let i = 0; i < rows * columns; i++) {
            const possible = Object.keys(colors)
                .filter(c => c !== board[i - columns] && c !== board[i - 1])
                .filter(c => (i === p1 ? c !== board[p2] : true));
            board += shuffle(possible)[0];
        }

        return new Game({
            currentPlayer: 1,
            board,
            player1: [p1],
            player2: [p2],
            player1Color: board[p1] as ColorKey,
            player2Color: board[p2] as ColorKey,
        });
    };
}
