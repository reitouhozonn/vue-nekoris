const tetrominos = [
    [
        // 0: 空白
        [0],
    ],
    [
        // 1: I-テトリミノ（水色）
        [1, 1, 1, 1],
    ],
    [
        // 2: O-テトリミノ（黄色）
        [2, 2],
        [2, 2],
    ],
    [
        // 3: S-テトリミノ（緑）
        [0, 3, 3],
        [3, 3, 0],
    ],
    [
        // 4: Z-テトリミノ（赤）
        [4, 4, 0],
        [0, 4, 4],
    ],
    [
        // 5: J-テトリミノ（青）
        [0, 0, 5],
        [5, 5, 5],
    ],
    [
        // 6: L-テトリミノ（オレンジ）
        [6, 0, 0],
        [6, 6, 6],
    ],
    [
        // 7: T-テトリミノ（紫）
        [0, 7, 0],
        [7, 7, 7],
    ],
];

const TETROMINO_TYPE = {
    I: 1,
    O: 2,
    S: 3,
    Z: 4,
    J: 5,
    L: 6,
    T: 7,
} as const;
export type TETROMINO_TYPE = typeof TETROMINO_TYPE[keyof typeof TETROMINO_TYPE];



export class Tetromino {
    private type: TETROMINO_TYPE

    constructor(type: TETROMINO_TYPE) {
        this.type = type;
    }

    static id(type: TETROMINO_TYPE): string {
        switch (type) {
            case TETROMINO_TYPE.I:
                return "block-i";
            case TETROMINO_TYPE.O:
                return "block-o";
            case TETROMINO_TYPE.S:
                return "block-s";
            case TETROMINO_TYPE.Z:
                return "block-z";
            case TETROMINO_TYPE.J:
                return "block-j";
            case TETROMINO_TYPE.L:
                return "block-l";
            case TETROMINO_TYPE.T:
                return "block-t";
            default:
                return "";
        }
    }

    get data(): number[][] {
        return tetrominos[this.type];
    }

    static random(): Tetromino {
        const tetrominoTypes = tetrominos.length - 1;
        const type = Math.floor(Math.random() * tetrominoTypes) + 1;

        return new Tetromino(type as TETROMINO_TYPE);
    }

    static empty(): Tetromino {
        return new Tetromino(0 as TETROMINO_TYPE);
    }

    static rotate(num: number, data: number[][]): number[][] {
        let tetromino: number[][] = data;
        for (let i = 0; i < num; i++) {
            tetromino = tetromino[0].map((_, index) =>
                tetromino.map((row) => row[index]).reverse()
            );
        }
        return tetromino;
    }
}
