import React, {PropTypes, Component} from 'react';
import ReactDOM from 'react-dom';
import {getCoords} from '../../lib/helpers';
import {FALL, JUMP, FALL_DURATION_WAIT, JUMP_DURATION_WAIT} from '../../lib/constants';
import './player.css';

export default class Player extends Component {
  static propTypes = {
    isFalling: PropTypes.bool.isRequired,
    isJumping: PropTypes.bool.isRequired,
    isOnFall: PropTypes.bool.isRequired,
    isOnJump: PropTypes.bool.isRequired,
    lastPlayerCoords: PropTypes.object.isRequired,
    move: PropTypes.func.isRequired,
    playerCoords: PropTypes.object.isRequired,
    stopAction: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.fallOnMount = props.isFalling;
    this.jumpOnMount = props.isJumping;
    this.state = {useLastPlayerCoords: false};
  }

  componentDidUpdate(oldProps) {
    if (this.props.isOnFall) this.performAction(this.fall);
    if (this.props.isOnJump) this.performAction(this.jump);
  }

  componentDidMount() {
    if (this.fallOnMount || this.jumpOnMount) {
      this.setState({useLastPlayerCoords: true});
    }
  }

  render() {
    const {playerCoords, lastPlayerCoords, isFalling, isJumping} = this.props;
    let classSet = [];
    let left = playerCoords.left;
    let top = playerCoords.top;
    let styles = {transform: `translateX(${left}px) translateY(${top}px)`};

    if (isFalling || isJumping) {
      if (!this.state.useLastPlayerCoords) {
        let left = lastPlayerCoords.left;
        let top = lastPlayerCoords.top;
        styles = {transform: `translateX(${left}px) translateY(${top}px)`};
      }

      if (isFalling) classSet.push('falling');
      if (isJumping) classSet.push('jumping');
    }

    return (
      <div id="player" style={styles} className={classSet.join(' ')}>
        <div className="bottom" />
        <div className="front" />
        <div className="back" />
        <div className="top" />
        <div className="left" />
        <div className="right" />
      </div>
    );
  }

  performAction = (func) => {
    setTimeout(() => {
      const coords = getCoords(ReactDOM.findDOMNode(this));
      func(coords);
    }, 100);
  }

  fall = (coords) => {
    this.props.move(FALL, coords);

    // wait for fall animation to end
    setTimeout(() => {
      this.props.stopAction(FALL);
    }, FALL_DURATION_WAIT);
  }

  jump = (coords) => {
    this.props.move(JUMP, coords);

    setTimeout(() => {
      this.props.stopAction(JUMP);
    }, JUMP_DURATION_WAIT);
  }
}
