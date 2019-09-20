import React from 'react';
import PropTypes from 'prop-types';

const NotFound = ({ location }: { location: Location }) => (
  <div>
    <h3 className="text-center">
      {'No match for '}
      <code>{location.pathname}</code>
    </h3>
  </div>
);

NotFound.propTypes = {
  location: PropTypes.object.isRequired,
};

export default NotFound;
