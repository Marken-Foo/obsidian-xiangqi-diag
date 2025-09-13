import { FenParser } from "fenParser";
import { type MarkdownPostProcessorContext, Plugin, parseYaml } from "obsidian";
import { hanziFromPiece } from "piece";
import type { Piece, Side, Square } from "types";

type XiangqiDiagArgs = {
	fen: string;
	flip?: boolean;
};

export default class XiangqiDiagPlugin extends Plugin {
	async onload() {
		this.registerMarkdownCodeBlockProcessor("xiangqi-diag", xiangqiDiagHandler);
	}
}

function xiangqiDiagHandler(
	source: string,
	el: HTMLElement,
	_ctx: MarkdownPostProcessorContext,
): void {
	const args: XiangqiDiagArgs = parseYaml(source);
	const { fen, flip = false } = args;
	const fenParser = new FenParser(fen.trim());
	fenParser.parseFen();

	if (fenParser.hasErrors()) {
		el.createDiv({ text: `Failed to parse FEN: ${fenParser.getErrors()}` });
		return;
	}

	const board = el.createDiv({ cls: "xiangqi_diag" });
	addSideIndicator(board, flip);
	addTurnIndicator(board, fenParser.sideToMove);

	for (const [sq, piece] of fenParser.piecePositions.entries()) {
		putPieceOnBoard(board, sq, piece);
	}
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
	board
		.createDiv({
			cls: ["square_container"],
			attr: { style: `transform: translate(${xTranslate}%, ${yTranslate}%)` },
		})
		.createDiv({
			cls: ["text_piece", piece.side === "red" ? "red" : "black"],
			text: hanziFromPiece(piece),
		});
}
