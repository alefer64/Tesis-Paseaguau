import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { updatePricing } from '../../actions/settings';
import "./css/style.css";

const Pricing = ({ updatePricing, auth: { user } }) => {
  const [price, setPrice] = useState(user ? user.pricePerWalk : '');

  const onChange = (e) => setPrice(e.target.value);

  const onSubmit = (e) => {
    e.preventDefault();
    updatePricing({ pricePerWalk: price });
  };

  return (
    <section className='container'>
      <h1 className='large text-primary'>Precio del Servicio</h1>
      <p>
        El precio que determines sólo será una referencia para tu perfil, el precio final del servicio lo negociarás uno a uno con cada cliente.
      </p>
      <form className='form' onSubmit={onSubmit}>
        <div className='form-group'>
          <label htmlFor='price'>Paseos</label>
          <div className='price-input'>
            <span className='currency-symbol'>$</span>
            <input
              type='number'
              name='price'
              id='price'
              value={price}
              onChange={onChange}
              required
            />
          </div>
        </div>
        <button type='submit' className='btn btn-primary'>guardar</button>
        <Link to='settings' className='btn btn-light'>cancelar</Link>
      </form>
    </section>
  );
};

Pricing.propTypes = {
  updatePricing: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  auth: state.auth
});

export default connect(mapStateToProps, { updatePricing })(Pricing);
