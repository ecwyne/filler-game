import React from 'react';
import { NextPage } from 'next';
import { GameState } from '../lib/Game';
import { compute } from '../lib/ai';

const state: GameState = {
    currentPlayer: 2,
    board:
        'rrrrrrrrrrrrrrrrrrrrkkkrrrrrrrkkkrrrrrrrkkkkkrrrrrkkkkkkrrrrkkkkkkkkrrkkkkkkkkrrkkkkkkkkrpkkkkkkkkrg',
    player1: [
        90,
        91,
        80,
        81,
        70,
        92,
        71,
        82,
        60,
        93,
        83,
        50,
        73,
        51,
        74,
        52,
        84,
        64,
        53,
        41,
        85,
        54,
        65,
        61,
        75,
        31,
        72,
        94,
        40,
        63,
        42,
        44,
        66,
        21,
        30,
        62,
        43,
        95,
        55,
        76,
        67,
        22,
        32,
        20,
        86,
        77,
        87,
        97,
        96,
    ],
    player2: [
        9,
        19,
        8,
        29,
        18,
        7,
        39,
        6,
        49,
        38,
        16,
        5,
        37,
        15,
        4,
        47,
        36,
        14,
        48,
        3,
        46,
        35,
        24,
        58,
        28,
        17,
        59,
        26,
        13,
        34,
        56,
        45,
        12,
        27,
        25,
        57,
        2,
        68,
        33,
        11,
        23,
        10,
        78,
        88,
        79,
        0,
        98,
        69,
        1,
    ],
    player1Color: 'k',
    player2Color: 'r',
    lastPlay: 'k',
};

const Test: NextPage = () => {
    return <pre>{JSON.stringify(compute(1, state), null, 2)}</pre>;
};

export default Test;