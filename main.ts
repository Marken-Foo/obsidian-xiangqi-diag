import { FenParser } from "fenParser";
import { type MarkdownPostProcessorContext, Plugin } from "obsidian";
import { hanziFromPiece } from "piece";
import type { Piece, Square } from "types";

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
	const fenParser = new FenParser(source.trim());
	fenParser.parseFen();

	if (fenParser.hasErrors()) {
		el.createDiv({ text: `Failed to parse FEN: ${fenParser.getErrors()}` });
		return;
	}

	const board = el.createDiv({ cls: "xiangqi_diag" });

	for (const [sq, piece] of fenParser.piecePositions.entries()) {
		putPieceOnBoard(board, sq, piece);
	}
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
			cls: ["text_piece_container"],
			attr: { style: `transform: translate(${xTranslate}%, ${yTranslate}%)` },
		})
		.createDiv({
			cls: ["text_piece", piece.side === "red" ? "red" : "black"],
			text: hanziFromPiece(piece),
		});
}
