import React, { useState, useEffect } from 'react';
import { NextPage } from 'next';
import { GameState, colors, ColorKey, Game, columns } from '../lib/Game';
import { compute } from '../lib/ai';

export const Board: React.FC<{
    board: GameState['board'];
    update: React.Dispatch<React.SetStateAction<GameState>>;
    disabled: ColorKey[];
    state: GameState;
}> = ({ board, update, disabled }) => {
    return (
        <div>
            {(board.split('') as ColorKey[]).map((c, i) => (
                <React.Fragment key={i}>
                    <div
                        onClick={() =>
                            !disabled.includes(c)
                                ? update(prev => new Game(prev).playTurn(c))
                                : null
                        }
                        style={{
                            cursor: disabled.includes(c)
                                ? 'initial'
                                : 'pointer',
                            border: '2px solid black',
                            display: 'inline-block',
                            width: '30px',
                            height: '30px',
                            backgroundColor: colors[c],
                        }}
                    />
                    {i % columns === columns - 1 ? <div /> : null}
                </React.Fragment>
            ))}
        </div>
    );
};
const Index: NextPage<{ initialState: GameState }> = ({ initialState }) => {
    const [state, update] = useState<GameState>(initialState);
    const [turn, setTurn] = useState(0);
    const [strength, setStrength] = useState(6);
    const [ai, setAI] = useState(0);

    console.log(state);
    useEffect(() => {
        setTurn(prev => prev + 1);
        if (state.currentPlayer === 2) {
            update(prev => {
                const choice = compute(strength, prev);
                console.log(choice);
                setAI(choice.value);
                return choice.node || prev;
            });
        }
    }, [state]);

    const disabled = [state.player1Color, state.player2Color];
    return (
        <div>
            <input
                type="number"
                value={strength}
                onChange={e => setStrength(Number(e.target.value))}
            />
            <br />
            Turn: {turn}
            <br />
            Current Player:
            <input
                type="number"
                value={state.currentPlayer}
                onChange={e => {
                    const n = Number(e.target.value) as 1;
                    update(prev => ({
                        ...prev,
                        currentPlayer: n,
                    }));
                }}
            />
            <br />
            AI Confidence: {ai}
            <br />
            <textarea
                value={state.board}
                onChange={e => {
                    const board = e.target.value;
                    update(prev => ({
                        ...prev,
                        board,
                    }));
                }}
            />
            <br />
            <span
                style={{
                    padding: '5px',
                    backgroundColor: colors[state.player1Color],
                }}
            >
                {state.player1.length}
            </span>
            -
            <span
                style={{
                    padding: '5px',
                    backgroundColor: colors[state.player2Color],
                }}
            >
                {state.player2.length}
            </span>
            <Board
                board={state.board}
                update={update}
                disabled={disabled}
                state={state}
            />
            <div>
                <button
                    style={{ width: '50px', height: '50px' }}
                    onClick={() =>
                        update(prev => {
                            const choice = compute(strength, prev);
                            return choice.node || prev;
                        })
                    }
                >
                    AI
                </button>

                {(Object.keys(colors) as ColorKey[]).map(c => {
                    return (
                        <button
                            style={{
                                width: '50px',
                                height: '50px',
                                backgroundColor: colors[c],
                                opacity: disabled.includes(c) ? 0.5 : 1,
                            }}
                            disabled={disabled.includes(c)}
                            key={c}
                            onClick={() =>
                                update(prev => new Game(prev).playTurn(c))
                            }
                        >
                            {c}
                        </button>
                    );
                })}
                <pre>{JSON.stringify(compute(strength, state), null, 2)}</pre>
            </div>
        </div>
    );
};

Index.getInitialProps = () => ({ initialState: Game.generate().state });

export default Index;
