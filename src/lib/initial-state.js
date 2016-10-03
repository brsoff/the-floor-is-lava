const initialState = {
  activeBoardId: 1,
  activeSquare: 1,
  playerCoords: {left: 0, top: 0},
  lastPlayerCoords: {left: 0, top: 0},
  playerIsFalling: false,
  playerIsJumping: false,
  boards: [
    {id: 1, columns: 15, rows: 15, falls: []},
    {id: 2, columns: 25, rows: 9, falls: []},
    {id: 3, columns: 13, rows: 13, falls: []}
  ]
};

export default initialState;
