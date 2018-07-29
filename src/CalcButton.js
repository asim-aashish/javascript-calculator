import React from 'react';
import PropTypes from 'prop-types';

const CalcButton = ({ onClick, number, className }) => {
  return (
    <div className={className} onClick={() => onClick(number)}>
      {number}
    </div>
  );
};

CalcButton.defaultProps = {
  className: 'calc__button'
};

CalcButton.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func.isRequired,
  number: PropTypes.string.isRequired
};

export default CalcButton;
