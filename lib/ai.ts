import { GameState, colors, Game, ColorKey, rows, columns } from './Game';
import { mm } from './mm';

export const compute = (depth: number = 2, state: GameState) => {
    return mm<GameState>({
        max: state.currentPlayer === 1,
        depth,
        node: state,
        generate: n => {
            const arr = Object.keys(colors)
                .filter(c => c !== n.player1Color && c !== n.player2Color)
                .map(c => {
                    const out = new Game(n).playTurn(c as ColorKey);
                    // console.log('generate', c, out);
                    return out;
                });
            // console.log({ arr });
            return arr;
        },
        // heuristic: n =>
        //     n.currentPlayer === 1
        //         ? n.player1.length - n.player2.length
        //         : n.player2.length - n.player1.length,
        heuristic: n => n.player1.length - n.player2.length,
        isTerminal: n => new Set(n.board.split('')).size === 2,
    });
};
