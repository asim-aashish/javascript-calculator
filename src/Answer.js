import React, { Component } from 'react';
import { PropTypes } from 'prop-types';

import { getFontSize } from './utils';

class Answer extends Component {
  static propTypes = {
    data: PropTypes.number.isRequired
  };

  render() {
    const { data } = this.props;
    const length = String(data).length;

    return (
      <div
        className="calc__answer"
        style={{
          fontSize: getFontSize(length) + 'px'
        }}
      >
        {data}
      </div>
    );
  }
}

export default Answer;
