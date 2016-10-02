import React, {PropTypes} from 'react';
import ReactDOM from 'react-dom';
import Component from '../component.react';
import BoardSquare from './board-square.react';
import {Range} from 'immutable';
import {scrollTo, getCoords} from '../../lib/helpers';
import {SQUARE_SIDE, FALL_DURATION_WAIT, JUMP_DURATION_WAIT} from '../../lib/constants';
import './board.css';

export default class Board extends Component {
  static propTypes = {
    active: PropTypes.bool.isRequired,
    activeBoardId: PropTypes.number.isRequired,
    activeSquare: PropTypes.number.isRequired,
    equivalentSquare: PropTypes.number,
    jump: PropTypes.number,
    columns: PropTypes.number.isRequired,
    fall: PropTypes.number,
    id: PropTypes.number.isRequired,
    rows: PropTypes.number.isRequired,
    player: PropTypes.node
  };

  componentDidUpdate(oldProps) {
    if (!oldProps.active && this.props.active) {
      const {id, activeBoardId} = this.props;
      const el = ReactDOM.findDOMNode(this);
      let duration = 0;

      duration = id > activeBoardId ? FALL_DURATION_WAIT : JUMP_DURATION_WAIT;

      scrollTo(document.body, getCoords(el).top, duration);
    }
  }

  render() {
    const {id, rows, columns, activeSquare, active, fall, jump, player, equivalentSquare} = this.props;
    const styles = {width: columns * SQUARE_SIDE};

    const squares = Range(0, rows).map((row, rowIndex) => {
      return (
        <div className="row" key={row}>
          {Range(0, columns).map((col, colIndex) => {
            const squareIndex = ((columns * row) + colIndex);
            const isActive = active && squareIndex === activeSquare;
            const isFall = squareIndex === fall;
            const isJump = squareIndex === jump;
            const isEquivalent = squareIndex === equivalentSquare;

            return (
              <BoardSquare
                active={isActive}
                height={SQUARE_SIDE}
                id={`square-${id}-${squareIndex}`}
                isFall={isFall}
                isJump={isJump}
                isEquivalent={isEquivalent}
                key={col}
                width={SQUARE_SIDE} />
            );
          })}
        </div>
      );
    });

    return (
      <div className="board" style={styles} id={`board-${id}`}>
        {player}
        {squares}
      </div>
    );
  }
}
