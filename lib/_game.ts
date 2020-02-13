import { mm } from './mm';
import shuffle from 'lodash.shuffle';

export type Color = 'red' | 'black' | 'purple' | 'yellow' | 'blue' | 'green';
export type Row = Color[];
export type Board = Row[];

export type BoardState = {
    lastPlay?: Color;
    currentPlayer: 1 | 2;
    rows: Row[];
};

export const colors: Color[] = [
    'red',
    'black',
    'purple',
    'yellow',
    'blue',
    'green',
];
export const generate = (rows: number = 7, columns: number = 8): Row[] => {
    const arr: Row[] = [];
    for (let r = 0; r < rows; r++) {
        arr.push([]);
        for (let c = 0; c < columns; c++) {
            const possible = colors.filter(
                color =>
                    (c === 0 || arr[r][c - 1] !== color) &&
                    (r === 0 || arr[r - 1][c] !== color) &&
                    (r !== rows - 1 ||
                        c !== 0 ||
                        arr[0][columns - 1] !== color),
            );

            arr[r].push(r === 0 && c === 1 ? arr[0][0] : shuffle(possible)[0]);
        }
    }
    return arr;
};

export class Cell {
    constructor(
        public row: number,
        public column: number,
        private board: Board,
    ) {}
    toString = () => `${this.row},${this.column}`;
    up = () => new Cell(this.row - 1, this.column, this.board);
    down = () => new Cell(this.row + 1, this.column, this.board);
    left = () => new Cell(this.row, this.column - 1, this.board);
    right = () => new Cell(this.row, this.column + 1, this.board);
    neighbors = () => {
        const arr: Cell[] = [];
        if (this.up().value) arr.push(this.up());
        if (this.down().value) arr.push(this.down());
        if (this.left().value) arr.push(this.left());
        if (this.right().value) arr.push(this.right());

        return arr;
    };
    get value() {
        return this.board?.[this.row]?.[this.column];
    }
}

export const getShape = (
    rows: Row[],
    cells: Cell[],
    known: Set<string>,
): Set<string> => {
    const { value } = cells[0];
    cells.forEach(e => known.add(e.toString()));
    const neighbors = cells
        .map(c => c.neighbors())
        .flat()
        .filter(e => e.value === value)
        .filter(e => !known.has(e.toString()));

    return neighbors.length === 0 ? known : getShape(rows, neighbors, known);
};

export const reducer = (
    { currentPlayer, rows }: BoardState,
    color: Color,
): BoardState => {
    const startCell = new Cell(
        currentPlayer === 1 ? rows.length - 1 : 0,
        currentPlayer === 1 ? 0 : rows[0].length - 1,
        rows,
    );
    const shape = getShape(rows, [startCell], new Set());
    return {
        lastPlay: color,
        currentPlayer: currentPlayer === 1 ? 2 : 1,
        rows: rows.map((r, x) =>
            r.map((c, y) => (shape.has(`${x},${y}`) ? color : c)),
        ),
    };
};
export const compute = (depth: number = 2, board: Board) =>
    mm<BoardState>({
        depth,
        node: {
            currentPlayer: 1,
            rows: board,
        },
        generate: n =>
            colors
                .filter(
                    c =>
                        c !== n.rows[0][n.rows[0].length - 1] &&
                        c !== n.rows[n.rows.length - 1][0],
                )
                .map(c => reducer(n, c)),
        heuristic: n =>
            getShape(
                n.rows,
                [new Cell(n.rows.length - 1, 0, n.rows)],
                new Set(),
            ).size -
            getShape(
                n.rows,
                [new Cell(0, n.rows[0].length - 1, n.rows)],
                new Set(),
            ).size,
    });
