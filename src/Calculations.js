import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

class Calculations extends PureComponent {
  static propTypes = {
    data: PropTypes.array.isRequired
  };

  componentDidUpdate(prevProps) {
    if (this.props.data !== prevProps.data) {
      this.containerRef.scrollTop =
        this.containerRef.scrollHeight - this.containerRef.clientHeight;
    }
  }

  saveContainerRef = ref => {
    this.containerRef = ref;
  };

  render() {
    const { data } = this.props;

    return (
      <div className="calc__top-scroll-container" ref={this.saveContainerRef}>
        <div className="calc__old-calc-container">
          {data.map(({ query, answer }) => {
            return (
              <div key={query} className="calc__old-calc">
                <div>{query}</div>
                <div>{answer}</div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default Calculations;
