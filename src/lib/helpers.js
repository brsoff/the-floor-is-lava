import {Range} from 'immutable';
import {SQUARE_SIDE, LEFT, RIGHT, UP, DOWN} from './constants';

export function modifyCoordinates(coords, direction) {
  switch (direction) {
  case LEFT:
    coords.left -= SQUARE_SIDE;
    break;
  case RIGHT:
    coords.left += SQUARE_SIDE;
    break;
  case UP:
    coords.top -= SQUARE_SIDE;
    break;
  case DOWN:
    coords.top += SQUARE_SIDE;
    break;
  }

  return coords;
};

export function getEquivalentSquare(activeSquare, currentBoard, newBoard) {
  const {rows, columns} = currentBoard;
  const square = activeSquare + 1;
  const currentRow = Math.ceil(square / rows);
  const offsetFromRight = Math.abs((currentRow * rows) - square);
  const currentColumn = rows - offsetFromRight;
  const newBoardRowCount = newBoard.rows;
  const newBoardColumnCount = newBoard.columns;
  const rowDiff = newBoardRowCount / rows;
  const columnDiff = newBoardColumnCount / columns;
  const equivalentRow = Math.round(currentRow * rowDiff);
  const equivalentColumn = Math.round(currentColumn * columnDiff);

  return ((equivalentRow * newBoardColumnCount) - 1) -
         (newBoardColumnCount - equivalentColumn);
}

export function getNewSquareIndex(direction, board, activeSquare) {
  switch (direction) {
  case LEFT:
    return left(board, activeSquare);
  case RIGHT:
    return right(board, activeSquare);
  case UP:
    return up(board, activeSquare);
  case DOWN:
    return down(board, activeSquare);
  default:
    return null;
  }
}

function left(board, activeSquare) {
  const {columns, rows} = board;
  const leftIndices = Range(0, rows).map(b => b * columns);

  if (!leftIndices.includes(activeSquare)) {
    return Math.abs(activeSquare - 1);
  } else {
    return null;
  }
}

function right(board, activeSquare) {
  const {columns, rows} = board;
  const rightIndices = Range(0, rows).map((r, i) => {
    return (columns + (columns * i) - 1);
  });

  if (!rightIndices.includes(activeSquare)) {
    return activeSquare + 1;
  } else {
    return null;
  }
}

function down(board, activeSquare) {
  const {columns, rows} = board;
  const tileCount = rows * columns;
  const bottomIndices = Range((tileCount - columns), tileCount).map((r, i) => {
    return r;
  });

  if (!bottomIndices.includes(activeSquare)) {
    return activeSquare + columns;
  } else {
    return null;
  }
}

function up(board, activeSquare) {
  const {columns} = board;
  const topIndices = Range(0, columns).map((r, i) => r);

  if (!topIndices.includes(activeSquare)) {
    return  Math.abs(activeSquare - columns);
  } else {
    return null;
  }
}

export function getSquareCoords(boardId, squareId) {
  return getCoords(getSquare(boardId, squareId));
}

export function getSquareDimensions(boardId, squareId) {
  const dims = getSquare(boardId, squareId).getBoundingClientRect();
  return {height: dims.height, width: dims.width};
}

function getSquare(boardId, squareId) {
  return document.getElementById(`square-${boardId}-${squareId}`);
}

// http://stackoverflow.com/a/26230989
export function getCoords(elem) {
  const box = elem.getBoundingClientRect();

  const body = document.body;
  const docEl = document.documentElement;

  const scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
  const scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;

  const clientTop = docEl.clientTop || body.clientTop || 0;
  const clientLeft = docEl.clientLeft || body.clientLeft || 0;

  const top  = box.top +  scrollTop - clientTop;
  const left = box.left + scrollLeft - clientLeft;

  return {top: top, left: left};
}

// http://stackoverflow.com/a/8918062
export function scrollTo(element, to, duration) {
  if (duration <= 0) return;

  const difference = to - element.scrollTop;
  const perTick = difference / duration * 10;

  setTimeout(() => {
    element.scrollTop = element.scrollTop + perTick;
    if (element.scrollTop === to) return;
    scrollTo(element, to, duration - 10);
  }, 10);
}

export function getSquareCoordsFromRowsAndColumns(rows, activeSquare) {
  const square = activeSquare + 1;
  const currentRow = Math.ceil(square / rows);
  const offsetFromRight = Math.abs((currentRow * rows) - square);
  const currentColumn = rows - offsetFromRight;
  const top = (currentRow - 1) * SQUARE_SIDE;
  const left = (currentColumn - 1) * SQUARE_SIDE;

  return {top: top, left: left};
}
