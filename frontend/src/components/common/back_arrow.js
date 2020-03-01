import React from 'react';

const BackArrow = ({ path }) => {
  return (
    <a href={path} className="back-arrow has-margin-bottom-7">
      <i className="fas fa-arrow-left" />
    </a>
  );
};

export default BackArrow;