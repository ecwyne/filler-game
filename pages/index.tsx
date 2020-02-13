import React, { useState, useEffect } from 'react';
import { NextPage } from 'next';
import { GameState, colors, ColorKey, Game, columns } from '../lib/Game';
import { compute } from '../lib/ai';
import styles from '../lib/board.module.css';
import clsx from 'clsx';

export const Board: React.FC<{
    board: GameState['board'];
    update: React.Dispatch<React.SetStateAction<GameState>>;
    disabled: ColorKey[];
    state: GameState;
}> = ({ board, update, disabled, state }) => {
    typeof document !== 'undefined' &&
        document.documentElement.style.setProperty(
            '--colNum',
            columns.toString(),
        );
    return (
        <div className={styles.board}>
            {(board.split('') as ColorKey[]).map((c, i) => {
                const isPlayer = [...state.player1, ...state.player2].includes(
                    i,
                );
                const size =
                    !isPlayer && disabled.includes(c) ? '10px' : '30px';
                return (
                    <div
                        key={i}
                        onClick={() =>
                            state.currentPlayer === 1 && !disabled.includes(c)
                                ? update(prev => new Game(prev).playTurn(c))
                                : null
                        }
                        className={clsx([
                            styles.cell,
                            styles[c],
                            disabled.includes(c)
                                ? styles.disabled
                                : styles.enabled,
                        ])}
                    ></div>
                );
            })}
        </div>
    );
};
const Index: NextPage<{ initialState: GameState }> = ({ initialState }) => {
    const [state, update] = useState<GameState>(initialState);
    const [strength, setStrength] = useState(8);
    useEffect(() => {
        if (state.currentPlayer === 2) {
            update(prev => compute(strength, prev).node || prev);
        }
    }, [state]);

    const disabled = [state.player1Color, state.player2Color];
    return (
        <div className={styles.container}>
            <select
                value={strength}
                onChange={e => setStrength(Number(e.target.value))}
            >
                <option value={2}>AI Strength: 2</option>
                <option value={4}>AI Strength: 4</option>
                <option value={6}>AI Strength: 6</option>
                <option value={8}>AI Strength: 8</option>
            </select>
            {/* 
            
            <textarea
                rows={5}
                value={state.board}
                onChange={e => {
                    const board = e.target.value;
                    update(prev => ({
                        ...prev,
                        board,
                    }));
                }}
            /> */}
            <div>
                <span
                    className={clsx([styles.score, styles[state.player1Color]])}
                >
                    {state.player1.length}
                </span>
                -
                <span
                    className={clsx([styles.score, styles[state.player2Color]])}
                >
                    {state.player2.length}
                </span>
            </div>
            <Board
                board={state.board}
                update={update}
                disabled={disabled}
                state={state}
            />
            <div className={styles.spaced}>
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
                            }}
                            className={clsx([
                                styles[c],
                                disabled.includes(c)
                                    ? styles.disabled
                                    : styles.enabled,
                            ])}
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
            </div>
            <div className={styles.spaced}>
                <button
                    onClick={() => location.reload()}
                    style={{ fontSize: '20px', borderRadius: '10%' }}
                >
                    Shuffle
                </button>
            </div>
        </div>
    );
};

Index.getInitialProps = () => ({ initialState: Game.generate().state });

export default Index;
