import React from 'react';
import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';

const AdminRoute = ({
                      component: Component,
                      auth: { isAuthenticated, loading, user }
                    }) => {
  if (loading) {
    return <Spinner />;
  }

  if (isAuthenticated && user && user.isAdmin) {
    return <Component />;
  }

  return <Navigate to="/login" />;
};

AdminRoute.propTypes = {
  auth: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  auth: state.auth
});

export default connect(mapStateToProps)(AdminRoute);
