import xml.etree.ElementTree as ET

OUT_FILE = "xiangqiPlain.svg"
BOARD_COLOUR = "#FDD775"

NUM_XQ_ROWS = 10
NUM_XQ_COLS = 9

WIDTH = 900
HEIGHT = 1000
BOARD_X_PAD = 50
BOARD_Y_PAD = 50
COL_GAP = 100
ROW_GAP = 100
LINE_WIDTH = 2
LINE_STYLE = f"stroke-width:{LINE_WIDTH};stroke:black"

STAR_GAP = 7
STAR_X_LENGTH = 20
STAR_Y_LENGTH = 20


# Draw a line from (x1, y1) to (x2, y2) where x and y are in the SVG units.
def _draw_line(
    parent: ET.Element, x1: int, y1: int, x2: int, y2: int, line_style: str
) -> ET.Element:
    return ET.SubElement(
        parent,
        "line",
        {
            "x1": str(x1),
            "y1": str(y1),
            "x2": str(x2),
            "y2": str(y2),
            "style": line_style,
        },
    )


def _x_from_col(c: int) -> int:
    return BOARD_X_PAD + COL_GAP * (c - 1)


def _y_from_row(r: int) -> int:
    return BOARD_Y_PAD + ROW_GAP * (r - 1)


# Draw a line from (r1, c1) to (r2, c2) where r and c are one-indexed row/column numbers from top left.
def draw_line(
    parent: ET.Element, c1: int, r1: int, c2: int, r2: int, line_style: str
) -> ET.Element:
    return _draw_line(
        parent,
        x1=_x_from_col(c1),
        y1=_y_from_row(r1),
        x2=_x_from_col(c2),
        y2=_y_from_row(r2),
        line_style=line_style,
    )


# Draw a star point at (r, c) where r and c are one-indexed row/column numbers from top left.
def draw_star(parent: ET.Element, c: int, r: int, line_style: str) -> None:
    draw_left_star(parent, c, r, line_style)
    draw_right_star(parent, c, r, line_style)


# Draw the right half of a star point at (r, c) where r and c are one-indexed row/column numbers from top left.
def draw_right_star(parent: ET.Element, c: int, r: int, line_style: str) -> None:
    x = _x_from_col(c)
    y = _y_from_row(r)

    x_plus = x + STAR_GAP
    y_minus = y - STAR_GAP
    y_plus = y + STAR_GAP
    _draw_line(parent, x_plus, y_minus, x_plus + STAR_X_LENGTH, y_minus, line_style)
    _draw_line(parent, x_plus, y_minus - STAR_Y_LENGTH, x_plus, y_minus, line_style)
    _draw_line(parent, x_plus, y_plus, x_plus + STAR_X_LENGTH, y_plus, line_style)
    _draw_line(parent, x_plus, y_plus, x_plus, y_plus + STAR_Y_LENGTH, line_style)


# Draw the left half of a star point at (r, c) where r and c are one-indexed row/column numbers from top left.
def draw_left_star(parent: ET.Element, c: int, r: int, line_style: str) -> None:
    x = _x_from_col(c)
    y = _y_from_row(r)

    x_minus = x - STAR_GAP
    y_minus = y - STAR_GAP
    y_plus = y + STAR_GAP
    _draw_line(parent, x_minus - STAR_X_LENGTH, y_minus, x_minus, y_minus, line_style)
    _draw_line(parent, x_minus, y_minus - STAR_Y_LENGTH, x_minus, y_minus, line_style)
    _draw_line(parent, x_minus - STAR_X_LENGTH, y_plus, x_minus, y_plus, line_style)
    _draw_line(parent, x_minus, y_plus, x_minus, y_plus + STAR_Y_LENGTH, line_style)


root = ET.Element(
    "svg",
    {
        "version": "1.1",
        "xmlns": "http://www.w3.org/2000/svg",
        "xmlns:xlink": "http://www.w3.org/1999/xlink",
        "viewBox": f"0 0 {WIDTH} {HEIGHT}",
    },
)

background = ET.SubElement(
    root,
    "rect",
    {
        "width": str(WIDTH),
        "height": str(HEIGHT),
        "style": f"fill:{BOARD_COLOUR};{LINE_STYLE}",
    },
)

for j in range(1, NUM_XQ_ROWS + 1):
    draw_line(root, 1, j, NUM_XQ_COLS, j, LINE_STYLE)

draw_line(root, 1, 1, 1, NUM_XQ_ROWS, LINE_STYLE)

for i in range(2, NUM_XQ_COLS):
    draw_line(root, i, 1, i, 5, LINE_STYLE)
    draw_line(root, i, 6, i, NUM_XQ_ROWS, LINE_STYLE)

draw_line(root, NUM_XQ_COLS, 1, NUM_XQ_COLS, NUM_XQ_ROWS, LINE_STYLE)

# Palaces
draw_line(root, 4, 1, 6, 3, LINE_STYLE)
draw_line(root, 4, 3, 6, 1, LINE_STYLE)
draw_line(root, 4, 8, 6, 10, LINE_STYLE)
draw_line(root, 4, 10, 6, 8, LINE_STYLE)

# Stars
draw_star(root, 2, 3, LINE_STYLE)
draw_star(root, 8, 3, LINE_STYLE)
draw_right_star(root, 1, 4, LINE_STYLE)
draw_star(root, 3, 4, LINE_STYLE)
draw_star(root, 5, 4, LINE_STYLE)
draw_star(root, 7, 4, LINE_STYLE)
draw_left_star(root, 9, 4, LINE_STYLE)

draw_star(root, 2, 8, LINE_STYLE)
draw_star(root, 8, 8, LINE_STYLE)
draw_right_star(root, 1, 7, LINE_STYLE)
draw_star(root, 3, 7, LINE_STYLE)
draw_star(root, 5, 7, LINE_STYLE)
draw_star(root, 7, 7, LINE_STYLE)
draw_left_star(root, 9, 7, LINE_STYLE)

tree = ET.ElementTree(root)
tree.write(OUT_FILE, encoding="UTF-8", xml_declaration=True)
