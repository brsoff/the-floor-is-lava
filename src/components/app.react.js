import React from 'react';
import Component from './component.react';
import Player from './player/player.react';
import Board from './board/board.react';
import initialState from '../lib/initial-state';
import {FALL, JUMP} from '../lib/constants';
import * as helpers from '../lib/helpers';
import './app.css';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;
  }

  componentDidMount() {
    let canMove = true;

    document.addEventListener('keydown', (e) => {
      e.preventDefault();

      if (canMove) {
        this.onKeyDown(e.key);
        canMove = false;

        setTimeout(() => {
          canMove = true;
        }, 60);
      };
    });
  }

  render() {
    const {
      boards,
      activeBoard,
      activeSquare,
      playerCoords,
      playerIsFalling,
      playerIsJumping,
      lastPlayerCoords
    } = this.state;

    const isOnFall = this.isOnFall();
    const isOnJump = this.isOnJump();
    const player = (
      <Player
        isOnFall={isOnFall}
        isOnJump={isOnJump}
        isFalling={playerIsFalling}
        isJumping={playerIsJumping}
        move={this.playerMove}
        lastPlayerCoords={lastPlayerCoords}
        playerCoords={playerCoords}
        stopAction={this.stopAction} />
    );

    return (
      <div id="app-container">
        {playerIsFalling && player}
        {playerIsJumping && player}

        {boards.map(board => {
          const active = activeBoard === board.id;
          const includePlayer = (active && !playerIsFalling && !playerIsJumping);

          return (
            <Board
              key={board.id}
              active={active}
              activeSquare={activeSquare}
              falling={isOnFall}
              jumping={isOnJump}
              player={includePlayer ? player : null}
              {...board} />
          );
        })}
      </div>
    );
  }

  onKeyDown = (key) => {
    if (this.isTransitioningToNewBoard()) return;

    const board = this.getActiveBoard();
    const activeSquare = this.state.activeSquare;
    const newSquare = helpers.getNewSquareIndex(key, board, activeSquare);

    if (newSquare !== null) {
      this.setNewSquare(board.id, newSquare, key);
    }
  }

  getActiveBoard = () => {
    return this.state.boards.find(b => {
      return this.state.activeBoard === b.id;
    });
  }

  isOnFall = () => {
    return this.state.activeSquare === this.getActiveBoard().fall;
  }

  isOnJump = () => {
    return this.state.activeSquare === this.getActiveBoard().jump;
  }

  setNewSquare = (boardId, newSquare, direction) => {
    let coords = this.state.playerCoords;

    coords = helpers.modifyCoordinates(coords, direction);

    this.setState({
      activeSquare: newSquare,
      playerCoords: coords
    });
  }

  playerMove = (type, lastPlayerCoords) => {
    const {boards, activeSquare} = this.state;
    const activeBoard = this.getActiveBoard();

    const newBoard = boards.find(board => {
      let op;

      if (type === FALL) op  = 1;
      if (type === JUMP) op  = -1;

      return board.id === activeBoard.id + op;
    });

    const newBoardId = newBoard.id;

    const equivalentSquare = helpers.getEquivalentSquare(
      activeSquare,
      activeBoard,
      newBoard
    );

    let state = {
      activeBoard: newBoardId,
      activeSquare: equivalentSquare,
      playerCoords: helpers.getSquareCoords(newBoardId, equivalentSquare),
      lastPlayerCoords: lastPlayerCoords
    };

    if (type === FALL) state.playerIsFalling = true;
    if (type === JUMP) state.playerIsJumping = true;

    this.setState(state);
  }

  stopAction = (type) => {
    const {activeSquare} = this.state;

    let state = {
      playerCoords: helpers.getSquareCoordsFromRowsAndColumns(
        this.getActiveBoard().rows,
        activeSquare
      )
    };

    if (type === FALL) state.playerIsFalling = false;
    if (type === JUMP) state.playerIsJumping = false;

    this.setState(state);
  }

  isTransitioningToNewBoard = () => {
    return this.isOnFall() ||
           this.isOnJump() ||
           this.state.playerIsFalling ||
           this.state.playerIsJumping;
  }
}
