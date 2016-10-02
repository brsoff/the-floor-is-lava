const initialState = {
  activeBoard: 1,
  activeSquare: 0,
  playerCoords: {left: 0, top: 0},
  lastPlayerCoords: {left: 0, top: 0},
  playerIsFalling: false,
  playerIsJumping: false,
  boards: [
    {id: 1, columns: 12, rows: 12, falls: []},
    {id: 2, columns: 14, rows: 14, falls: []},
    {id: 3, columns: 13, rows: 13, falls: []}
  ]
};

export default initialState;
