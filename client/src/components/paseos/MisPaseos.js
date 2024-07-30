import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

const MisPaseos = () => {

  return (
    <section className='container'>

    </section>
  );
};

MisPaseos.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, {})(MisPaseos);
