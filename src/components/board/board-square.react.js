import React, {PropTypes} from 'react';
import Component from '../component.react';
import './board-square.css';

export default class BoardSquare extends Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    height: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    active: PropTypes.bool.isRequired,
    isJump: PropTypes.bool.isRequired,
    isFall: PropTypes.bool.isRequired
  };

  render() {
    const {id, height, width, active, isFall, isJump} = this.props;
    const styles = {height: height, width: width};
    let classes = ['square'];

    if (active) classes.push('active');
    if (isFall) classes.push('fall');
    if (isJump) classes.push('jump');

    return <div id={id} className={classes.join(' ')} style={styles} />;
  }
}
