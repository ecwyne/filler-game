import { GameState, colors, Game, ColorKey, rows, columns } from './Game';
import { mm } from './mm';

const winsAt = Math.ceil((rows * columns) / 2);

export const compute = (depth: number = 2, state: GameState) => {
    console.log(state);
    return mm<GameState>({
        depth,
        node: state,
        generate: n =>
            Object.keys(colors)
                .filter(c => c !== n.player1Color && c !== n.player2Color)
                .map(c => new Game(n).playTurn(c as ColorKey)),
        // heuristic: n =>
        //     n.currentPlayer === 1
        //         ? n.player1.length - n.player2.length
        //         : n.player2.length - n.player1.length,
        heuristic: n => n.player2.length - n.player1.length,
    });
};
