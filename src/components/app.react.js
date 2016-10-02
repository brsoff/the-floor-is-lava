import React from 'react';
import Component from './component.react';
import Player from './player/player.react';
import Board from './board/board.react';
import initialState from '../lib/initial-state';
import {FALL, JUMP, FALL_KEY, JUMP_KEY, FALL_DURATION_WAIT, JUMP_DURATION_WAIT} from '../lib/constants';
import * as h from '../lib/helpers';
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
      activeBoardId,
      activeSquareIndex,
      playerCoords,
      playerIsFalling,
      playerIsJumping,
      lastPlayerCoords
    } = this.state;


    const activeBoard = this.getActiveBoard();
    const isOnFall = this.isOnFall();
    const isOnJump = this.isOnJump();
    const player = (
      <Player
        isOnFall={isOnFall}
        isOnJump={isOnJump}
        isFalling={playerIsFalling}
        isJumping={playerIsJumping}
        performAction={this.performAction}
        lastPlayerCoords={lastPlayerCoords}
        playerCoords={playerCoords}
        stopAction={this.stopAction} />
    );

    return (
      <div id="app-container">
        {playerIsFalling && player}
        {playerIsJumping && player}

        {boards.map(board => {
          const active = activeBoardId === board.id;
          const includePlayer = (active && !playerIsFalling && !playerIsJumping);

          let equivalentSquare = null;

          if (!active) {
            equivalentSquare = h.getEquivalentSquareOnNewBoard(activeSquareIndex, activeBoard, board);
          }

          return (
            <Board
              key={board.id}
              activeBoardId={activeBoardId}
              active={active}
              activeSquare={activeSquareIndex}
              equivalentSquare={equivalentSquare}
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
    const activeSquareIndex = this.state.activeSquareIndex;

    if (key === FALL_KEY) {
      this.performAction(FALL, h.getPlayerCoords());
      return;
    }

    if (key === JUMP_KEY) {
      this.performAction(JUMP, h.getPlayerCoords());
      return;
    }

    const newSquare = h.getNewSquareIndex(key, board, activeSquareIndex);

    if (newSquare !== null) {
      this.setNewSquare(board.id, newSquare, key);
    }
  }

  getActiveBoard = () => {
    return this.state.boards.find(b => {
      return this.state.activeBoardId === b.id;
    });
  }

  isOnFall = () => {
    return this.getActiveBoard().falls.indexOf(this.state.activeSquareIndex) > -1;
  }

  isOnJump = () => {
    return this.state.activeSquareIndex === this.getActiveBoard().jump;
  }

  setNewSquare = (boardId, newSquare, direction) => {
    let coords = this.state.playerCoords;

    coords = h.modifyCoordinates(coords, direction);

    this.setState({
      activeSquareIndex: newSquare,
      playerCoords: coords
    });
  }

  performAction = (type, lastPlayerCoords) => {
    const {boards, activeSquareIndex, activeBoardId} = this.state;
    const activeBoard = this.getActiveBoard();

    const newBoard = boards.find(board => {
      let op;

      if (type === FALL) op  = 1;
      if (type === JUMP) op  = -1;

      return board.id === activeBoardId + op;
    });

    const newBoardId = newBoard.id;

    const equivalentSquare = h.getEquivalentSquareOnNewBoard(
      activeSquareIndex,
      activeBoard,
      newBoard
    );

    if (equivalentSquare !== null) {

      let state = {
        activeBoardId: newBoardId,
        activeSquareIndex: equivalentSquare,
        playerCoords: h.getSquareCoords(newBoardId, equivalentSquare),
        lastPlayerCoords: lastPlayerCoords
      };

      if (type === FALL) {
        state.playerIsFalling = true;
        state.boards = h.addFallToBoard(
          this.state.boards,
          activeBoardId,
          activeSquareIndex
        );
      }

      if (type === JUMP) state.playerIsJumping = true;

      this.setState(state);
    } else {
      console.log('cant go down!');
    }

    const duration = type === FALL ? FALL_DURATION_WAIT : JUMP_DURATION_WAIT;

    setTimeout(() => {
      this.stopAction(type);
    }, duration);
  }

  stopAction = (type) => {
    const {activeSquareIndex} = this.state;

    let state = {
      playerCoords: h.getCoordsFromSquarePositionRelativeToBoard(
        this.getActiveBoard().columns,
        activeSquareIndex
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
