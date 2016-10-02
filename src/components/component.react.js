import React from 'react';
import shallowEqual from 'react-pure-render/shallowEqual';

export default class Component extends React.Component {
  static contextTypes = {
    router: React.PropTypes.func
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.context.router) {
      const changed = this.pureComponentLastPath !== this.context.router.getCurrentPath();
      this.pureComponentLastPath = this.context.router.getCurrentPath();
      if (changed) return true;
    }

    const shouldUpdate =
      !shallowEqual(this.props, nextProps) ||
      !shallowEqual(this.state, nextState);

    return shouldUpdate;
  }
}
