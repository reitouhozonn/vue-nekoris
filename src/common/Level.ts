const DIFFICULTY_TYPE = {
    EASY: 1000,
    NORMAL: 500,
    HARD: 250,
    MASTER: 100,
    EXTREME: 50,
} as const;
export type DIFFICULTY_TYPE = typeof DIFFICULTY_TYPE[keyof typeof DIFFICULTY_TYPE];

export class Level {
    private type: DIFFICULTY_TYPE

    constructor(type: DIFFICULTY_TYPE) {
        this.type = type;
    }

    static id(type: DIFFICULTY_TYPE): string {
        switch (type) {
            case DIFFICULTY_TYPE.EASY:
                return "Easy";
            case DIFFICULTY_TYPE.NORMAL:
                return "Normal";
            case DIFFICULTY_TYPE.HARD:
                return "Hard";
            case DIFFICULTY_TYPE.MASTER:
                return "Master";
            case DIFFICULTY_TYPE.EXTREME:
                return "Extreme";
            default:
                return "";
        }
    }

    // static time(type: DIFFICULTY_TYPE): number {
    //     switch (type) {
    //         case DIFFICULTY_TYPE.EASY:
    //             return 1000;
    //         case DIFFICULTY_TYPE.NORMAL:
    //             return 500;
    //         case DIFFICULTY_TYPE.HARD:
    //             return 250;
    //         case DIFFICULTY_TYPE.MASTER:
    //             return 100;
    //         case DIFFICULTY_TYPE.EXTREME:
    //             return 50;
    //         default:
    //             return 1500;
    //     }
    // }

    // get data(): DIFFICULTY_TYPE {
    //     return this.type;
    // }

}
