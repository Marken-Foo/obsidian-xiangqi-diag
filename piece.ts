import type { Piece, PieceType } from "types";

export function hanziFromPiece(piece: Piece): string {
	switch (piece.side) {
		case "red":
			return redHanziFromPieceType(piece.pieceType);
		case "black":
			return blackHanziFromPieceType(piece.pieceType);
	}
}

function redHanziFromPieceType(pieceType: PieceType): string {
	switch (pieceType) {
		case "king":
			return "帥";
		case "chariot":
			return "俥";
		case "cannon":
			return "炮";
		case "horse":
			return "傌";
		case "elephant":
			return "相";
		case "advisor":
			return "仕";
		case "pawn":
			return "兵";
	}
}

function blackHanziFromPieceType(pieceType: PieceType): string {
	switch (pieceType) {
		case "king":
			return "將";
		case "chariot":
			return "車";
		case "cannon":
			return "砲";
		case "horse":
			return "馬";
		case "elephant":
			return "象";
		case "advisor":
			return "士";
		case "pawn":
			return "卒";
	}
}

export function pieceTypeFromFenChar(c: string): PieceType | null {
	switch (c.toUpperCase()) {
		case "K":
			return "king";
		case "R":
			return "chariot";
		case "C":
			return "cannon";
		case "H":
		case "N":
			return "horse";
		case "E":
		case "B":
			return "elephant";
		case "A":
			return "advisor";
		case "P":
			return "pawn";
		default:
			return null;
	}
}
