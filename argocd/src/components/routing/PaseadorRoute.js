import React from 'react';
import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';

const PaseadorRoute = ({
                      component: Component,
                      auth: { isAuthenticated, loading, user }
                    }) => {
  if (loading) {
    return <Spinner />;
  }

  if (isAuthenticated && user && user.esPaseador) {
    return <Component />;
  }

  return <Navigate to="/login" />;
};

PaseadorRoute.propTypes = {
  auth: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  auth: state.auth
});

export default connect(mapStateToProps)(PaseadorRoute);
