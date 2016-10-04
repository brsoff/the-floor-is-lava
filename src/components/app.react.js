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
      activeSquare,
      playerCoords,
      playerIsFalling,
      playerIsJumping,
      lastPlayerCoords
    } = this.state;


    const activeBoard = this.getActiveBoard();
    const isOnFall = this.isOnFall();
    const player = (
      <Player
        isOnFall={isOnFall}
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
            equivalentSquare = h.getEquivalentSquareOnNewBoard(activeSquare, activeBoard, board);
          }

          return (
            <Board
              key={board.id}
              activeBoardId={activeBoardId}
              active={active}
              activeSquare={activeSquare}
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
    const activeSquare = this.state.activeSquare;

    if (key === FALL_KEY) {
      this.performAction(FALL, h.getPlayerCoords());
      return;
    }

    if (key === JUMP_KEY) {
      this.performAction(JUMP, h.getPlayerCoords());
      return;
    }

    const newSquare = h.getNewSquareIndex(key, board, activeSquare);

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
    if (this.state.playerIsJumping) return false;
    return this.getActiveBoard().falls.indexOf(this.state.activeSquare) > -1;
  }

  setNewSquare = (boardId, newSquare, direction) => {
    let coords = this.state.playerCoords;

    coords = h.modifyCoordinates(coords, direction);

    this.setState({
      activeSquare: newSquare,
      playerCoords: coords
    });
  }

  performAction = (type, lastPlayerCoords) => {
    const {boards, activeSquare, activeBoardId} = this.state;
    const activeBoard = this.getActiveBoard();

    const newBoard = boards.find(board => {
      let op;

      if (type === FALL) op  = 1;
      if (type === JUMP) op  = -1;

      return board.id === activeBoardId + op;
    });

    const newBoardId = newBoard.id;

    const equivalentSquare = h.getEquivalentSquareOnNewBoard(
      activeSquare,
      activeBoard,
      newBoard
    );

    if (equivalentSquare !== null) {

      let state = {
        activeBoardId: newBoardId,
        activeSquare: equivalentSquare,
        playerCoords: h.getSquareCoords(newBoardId, equivalentSquare),
        lastPlayerCoords: lastPlayerCoords
      };

      if (type === FALL) {
        state.playerIsFalling = true;
        state.boards = h.addFallToBoard(
          this.state.boards,
          activeBoardId,
          activeSquare
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
    const {activeSquare} = this.state;

    let state = {
      playerCoords: h.getCoordsFromSquarePositionRelativeToBoard(
        this.getActiveBoard().columns,
        activeSquare
      )
    };

    if (type === FALL) state.playerIsFalling = false;
    if (type === JUMP) state.playerIsJumping = false;

    this.setState(state);
  }

  isTransitioningToNewBoard = () => {
    return this.isOnFall() ||
           this.state.playerIsFalling ||
           this.state.playerIsJumping;
  }
}
