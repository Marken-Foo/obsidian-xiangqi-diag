export type Side = "red" | "black";
export type PieceType =
	| "pawn"
	| "advisor"
	| "elephant"
	| "cannon"
	| "horse"
	| "chariot"
	| "king";

export type Piece = {
	side: Side;
	pieceType: PieceType;
};

export type Square = {
	col: number;
	row: number;
};

export type PiecePositions = Map<Square, Piece>;
