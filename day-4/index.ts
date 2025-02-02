import {exit} from "process";
import * as fs from "node:fs";

function usage() {
    console.log(`Usage: node day-3/index.js <input-file-path> [x-mas]`);
    exit(1);
}

const [, , ...args] = process.argv;
const ARGS_COUNT = 1;
if (args.length < ARGS_COUNT) usage();

const INPUT_FILE_PATH = args[0];
if (!INPUT_FILE_PATH) usage();

const input = fs.readFileSync(INPUT_FILE_PATH, "utf8");
const IS_XMAS = args[1] === "x-mas";

const matrix = input.split("\n").map(line => line.split(""));

function countXmas(matrix: string[][], x: number, y: number): number {
    const WORDS = ["X", "M", "A", "S"];
    if (x < 0 || x >= matrix.length || y < 0 || y >= matrix[x].length) return 0;

    let [xd, xR, yd, yR, xD, xDR, yD, yDR] = [true, true, true, true, true, true, true, true];
    for (let i = 0; i < WORDS.length; i++) {
        // x axis
        if (x + i >= matrix.length || matrix[x + i][y] !== WORDS[i]) xd = false;
        // x axis reverse
        if (x - i < 0 || matrix[x - i][y] !== WORDS[i]) xR = false;
        // y axis
        if (y + i >= matrix[x].length || matrix[x][y + i] !== WORDS[i]) yd = false;
        // y axis reverse
        if (y - i < 0 || matrix[x][y - i] !== WORDS[i]) yR = false;
        // diagonal
        if (x + i >= matrix.length || y + i >= matrix[x].length || matrix[x + i][y + i] !== WORDS[i]) xD = false;
        if (x + i >= matrix.length || y - i < 0 || matrix[x + i][y - i] !== WORDS[i]) yDR = false;
        if (x - i < 0 || y + i >= matrix[x].length || matrix[x - i][y + i] !== WORDS[i]) xDR = false;
        if (x - i < 0 || y - i < 0 || matrix[x - i][y - i] !== WORDS[i]) yD = false;
    }

    // console.debug("countXmas", x, y, matrix[x][y], {xd, xR, yd, yR, xD, xDR, yD, yDR});
    return [xd, xR, yd, yR, xD, xDR, yD, yDR].filter(x => x).length;
}

// if the character at matrix[x][y] is the center of an X-MAS
function isXMas(matrix: string[][], x: number, y: number): boolean {
    const WORDS = ["M", "A", "S"];
    if (matrix[x][y] !== WORDS[1]) return false;
    try {
        const topLeft = matrix[x - 1][y - 1];
        const topRight = matrix[x + 1][y - 1];
        const bottomLeft = matrix[x - 1][y + 1];
        const bottomRight = matrix[x + 1][y + 1];

        const chars = [topLeft, topRight, bottomLeft, bottomRight];
        if (!chars.every(char => char !== WORDS[1] && char !== undefined && char !== "X")) return false;

        if (topLeft === bottomRight) return false;
        return topRight !== bottomLeft;
    } catch (e) {
        return false;
    }
}

let count = 0;
if (!IS_XMAS) {
    for (let x = 0; x < matrix.length; x++) {
        for (let y = 0; y < matrix[x].length; y++) {
            const curr = matrix[x][y];
            if (curr !== "X") continue;
            count += countXmas(matrix, x, y);
        }
    }
} else {
    for (let x = 0; x < matrix.length; x++) {
        for (let y = 0; y < matrix[x].length; y++) {
            const curr = matrix[x][y];
            if (curr !== "A") continue;
            const isXmas = isXMas(matrix, x, y);
            if (isXmas) count++;
        }
    }
}

console.log("result", count);
