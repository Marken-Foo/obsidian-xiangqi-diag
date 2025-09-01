import { pieceTypeFromFenChar } from "piece";
import type { Piece, PiecePositions, Side } from "types";

const BOARD_NUM_ROWS = 10;
const BOARD_NUM_COLS = 9;

class InputState {
	raw: string;
	fullLength: number;
	pos: number;

	constructor(str: string) {
		this.raw = str;
		this.fullLength = str.length;
		this.pos = 0;
	}

	advance(): void {
		this.pos += 1;
	}

	peek(): string | null {
		return this.raw.charAt(this.pos) || null;
	}

	takeWhile(predicate: (c: string) => boolean): string {
		const start = this.pos;
		let c = this.peek();
		while (c !== null && predicate(c)) {
			this.advance();
			c = this.peek();
		}
		return this.raw.slice(start, this.pos);
	}
}

export class FenParser {
	input: InputState;
	piecePositions: PiecePositions;
	sideToMove: Side | null;
	errors: string[];

	constructor(fen: string) {
		this.input = new InputState(fen);
		this.piecePositions = new Map();
		this.sideToMove = null;
		this.errors = [];
	}

	hasErrors(): boolean {
		return this.errors.length > 0;
	}

	getErrors(): string[] {
		return this.errors;
	}

	parseFen() {
		this.parsePosition();
		this.skipWhitespace();
		this.parseSideToMove();
		this.skipWhitespace();
		this.parseHyphen();
		this.skipWhitespace();
		this.parseHyphen();
		this.skipWhitespace();
		this.parsePlySinceLastCapture();
		this.skipWhitespace();
		this.parseMoveNum();
	}

	parsePosition() {
		for (let rowNum = BOARD_NUM_ROWS; rowNum > 1; rowNum--) {
			this.parseRow(rowNum);
			this.parseSlash();
		}
		this.parseRow(1);
	}

	parseRow(rowNum: number) {
		let colNum = 1;
		while (true) {
			const piece = this.parsePiece();
			if (piece !== null) {
				if (colNum > BOARD_NUM_COLS) {
					this.errors.push(`Too many squares in row ${rowNum}`);
					this.input.takeWhile((c) => c !== "/" && c !== " ");
					return;
				}
				this.piecePositions.set({ col: colNum, row: rowNum }, piece);
				colNum += 1;
				continue;
			}
			const gaps = this.parseInt();
			if (gaps !== null) {
				colNum += gaps;
				if (colNum > BOARD_NUM_COLS + 1) {
					this.errors.push(`Too many squares in row ${rowNum}`);
					this.input.takeWhile((c) => c !== "/" && c !== " ");
					return;
				}
				continue;
			}
			return;
		}
	}

	parseSlash() {
		const c = this.input.peek();
		if (c !== "/") {
			this.errors.push(`Expected '/', found '${c}'`);
			return;
		}
		this.input.advance();
	}

	parseHyphen() {
		const c = this.input.peek();
		if (c !== "-") {
			this.errors.push(`Expected '-', found '${c}'`);
			return;
		}
		this.input.advance();
	}

	skipWhitespace() {
		let c = this.input.peek();
		while (c === " " || c === "\t" || c === "\n") {
			this.input.advance();
			c = this.input.peek();
		}
	}

	parseSideToMove() {
		const c = this.input.peek();
		switch (c) {
			case "r":
			case "w":
				this.sideToMove = "red";
				this.input.advance();
				return;
			case "b":
				this.sideToMove = "black";
				this.input.advance();
				return;
			default:
				this.errors.push(`Expected 'r' or 'w' or 'b', found '${c}'`);
				return;
		}
	}

	parsePlySinceLastCapture() {
		this.parseInt();
	}

	parseMoveNum() {
		this.parseInt();
	}

	parseInt(): number | null {
		const s = this.input.takeWhile(isAsciiDigit);
		const n = Number.parseInt(s, 10);
		return Number.isNaN(n) ? null : n;
	}

	parsePiece(): Piece | null {
		const c = this.input.peek();
		if (c === null) {
			return null;
		}
		const pieceType = pieceTypeFromFenChar(c);
		if (pieceType === null) {
			return null;
		}
		const side = isAsciiUppercase(c) ? "red" : "black";
		this.input.advance();
		return { side, pieceType };
	}
}

function isAsciiDigit(c: string): boolean {
	const code = c.charCodeAt(0);
	return !Number.isNaN(code) && 48 <= code && code <= 57;
}

function isAsciiUppercase(c: string): boolean {
	const code = c.charCodeAt(0);
	return !Number.isNaN(code) && 65 <= code && code <= 90;
}
