import { FenParser } from "fenParser";
import { type MarkdownPostProcessorContext, parseYaml } from "obsidian";
import { hanziFromPiece } from "piece";
import type { Piece, Side, Square } from "types";

type XiangqiDiagArgs = {
	fen: string;
	flip?: boolean;
};

export function xiangqiDiagHandler(
	source: string,
	el: HTMLElement,
	_ctx: MarkdownPostProcessorContext,
): void {
	const args: XiangqiDiagArgs = parseYaml(source);
	const { fen, flip = false } = args;
	if (fen === undefined) {
		el.createDiv({ text: "Error: must provide FEN in YAML `fen:` field" });
		return;
	}

	const fenParser = new FenParser(fen.trim());
	fenParser.parseFen();

	if (fenParser.hasErrors()) {
		el.createDiv({ text: `Failed to parse FEN: ${fenParser.getErrors()}` });
		return;
	}

	const diagram = el.createDiv({ cls: "xiangqi_diag" });
	const board = diagram.createDiv({ cls: "xiangqi_board" });
	addSideIndicator(diagram, flip);
	addTurnIndicator(diagram, fenParser.sideToMove);

	for (const [sq, piece] of fenParser.piecePositions.entries()) {
		const square = flip ? reflectSquareAboutCenter(sq) : sq;
		putPieceOnBoard(board, square, piece);
	}
}

export function setBoardColor(color: string): void {
	document.body.style.setProperty("--xiangqi-diag-board-color", color);
}

export function unsetBoardColor(): void {
	document.body.style.removeProperty("--xiangqi-diag-board-color");
}

function addSideIndicator(parent: HTMLDivElement, isFlipped: boolean): void {
	const sideIndicator = parent.createDiv({
		cls: ["square_container", "side_indicator"],
	});
	const topColor = isFlipped ? "red_triangle" : "black_triangle";
	const bottomColor = isFlipped ? "black_triangle" : "red_triangle";
	sideIndicator.createDiv({ cls: ["top_triangle", topColor] });
	sideIndicator.createDiv({ cls: ["bottom_triangle", bottomColor] });
}

function addTurnIndicator(parent: HTMLDivElement, side: Side | null): void {
	let color: string = "";
	switch (side) {
		case "red":
			color = "red";
			break;
		case "black":
			color = "black";
			break;
		case null:
			break;
	}
	const turn_container = parent.createDiv({
		cls: ["square_container", "turn_container"],
	});
	turn_container.createDiv({ cls: ["turn_indicator", color] });
}

function putPieceOnBoard(
	board: HTMLDivElement,
	sq: Square,
	piece: Piece,
): void {
	const xTranslate = 100 * (sq.col - 1);
	const yTranslate = 100 * (10 - sq.row);
	const pieceContainer = board.createDiv({ cls: ["square_container"] });
	pieceContainer.createDiv({
		cls: ["text_piece", piece.side === "red" ? "red" : "black"],
		text: hanziFromPiece(piece),
	});
	pieceContainer.style.setProperty(
		"transform",
		`translate(${xTranslate}%, ${yTranslate}%)`,
	);
}

function reflectSquareAboutCenter(sq: Square): Square {
	return { col: 10 - sq.col, row: 11 - sq.row };
}
