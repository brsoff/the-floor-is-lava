import {Range} from 'immutable';
import {SQUARE_SIDE, LEFT, RIGHT, UP, DOWN} from './constants';

export function addFallToBoard(boards, boardId, fallIndex) {
  let boardToModify = boards[boardId - 1];
  boardToModify.falls.push(fallIndex);

  return boards;
}

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

export function getEquivalentSquareOnNewBoard(activeSquare, currentBoard, newBoard) {
  const {rows, columns} = currentBoard;
  const newBoardRows = newBoard.rows;
  const newBoardColumns = newBoard.columns;
  const square = activeSquare;
  const currentRow = Math.ceil(square / columns);
  const currentColumn = Math.abs(((currentRow * columns) - square) - columns);
  const equivalentColumn = getEquivalentRowOrColumn(currentColumn, columns, newBoardColumns);
  const equivalentRow = getEquivalentRowOrColumn(currentRow, rows, newBoardRows);

  if (equivalentColumn && equivalentRow) {
    const equivalentSquare = (equivalentRow * newBoardColumns) -
                             ((newBoardColumns - equivalentColumn));
    return equivalentSquare;
  } else {
    return null;
  }
}

function getEquivalentRowOrColumn(current, currentCount, newCount) {
  if (newCount < currentCount) {
    const offset = Math.ceil((currentCount - newCount) / 2);

    if ((current <= offset) || (current >= (newCount + offset))) {
      return null;
    } else {
      return current - offset;
    }
  } else {
    const offset = Math.ceil((newCount - currentCount) / 2);
    return current + offset;
  }
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
  const leftIndices = Range(0, rows).map(b => {
    return (b * columns) + 1;
  });

  if (!leftIndices.includes(activeSquare)) {
    return Math.abs(activeSquare - 1);
  } else {
    return null;
  }
}

function right(board, activeSquare) {
  const {columns, rows} = board;
  const rightIndices = Range(0, rows).map((r, i) => {
    return (columns + (columns * i));
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

export function getCoordsFromSquarePositionRelativeToBoard(columns, square) {
  const currentRow = Math.ceil(square / columns);
  // let currentColumn = 0;

  // if (currentRow * columns !== square) {
    const currentColumn = Math.abs(((currentRow * columns) - square) - columns);
  // }

  const coords = {
    left: (currentColumn - 1) * SQUARE_SIDE,
    top: (currentRow - 1) * SQUARE_SIDE
  };

  console.log(coords);

  return coords;
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

export function getPlayerCoords() {
  return getCoords(document.getElementById('player'));
}
