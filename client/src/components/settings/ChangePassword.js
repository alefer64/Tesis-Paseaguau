import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { logout } from '../../actions/auth';
import { connect } from 'react-redux';
import { changePassword } from '../../actions/settings';
import { Link } from 'react-router-dom';

const ChangePassword = ({logout, changePassword}) => {
  const [passwordData, setPasswordData] = useState({
    passwordActual: '',
    nuevaContrasena: '',
    confirmarContrasena: '',
  });
  const [passwordChanged, setPasswordChanged] = useState(false);
  const [errors, setErrors] = useState('');
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(passwordData.nuevaContrasena !== passwordData.confirmarContrasena){
      setErrors('Las contraseñas no coinciden');
      return;
    }

    if (passwordData.nuevaContrasena.length < 6){
      setErrors('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    if( passwordData.passwordActual === passwordData.nuevaContrasena){
      setErrors('La nueva contraseña no puede ser igual a la anterior');
      return;
    }

    try{
    await changePassword(passwordData);
    setPasswordChanged(true);
    logout();
    } catch (error) {
      setErrors(error.response.data.msg);
    }
  };

  return (
    <section className='container'>
    <h2>Cambiar Contraseña</h2>
      <form onSubmit={handleSubmit}>
        <div className='form-group'>
          <input
            type='password'
            placeholder='Contraseña Actual'
            name='passwordActual'
            value={passwordData.passwordActual}
            onChange={handleChange}
          />
        </div>
        <div className='form-group'>
          <input
            type='password'
            placeholder='Nueva Contraseña'
            name='nuevaContrasena'
            value={passwordData.nuevaContrasena}
            onChange={handleChange}
          />
        </div>
        <div className='form-group'>
          <input
            type='password'
            placeholder='Confirmar Nueva Contraseña'
            name='confirmarContrasena'
            value={passwordData.confirmarContrasena}
            onChange={handleChange}
          />
        </div>
        <button type='submit' className='btn btn-primary'>
          Cambiar Contraseña
        </button>
        <Link to='/settings' className='btn btn-light'>cancelar</Link>

        <br/>
        <i>* La contraseña debe tener al menos 6 dígitos</i>
      </form>
      {passwordChanged && (
        <p className='text-success'>Contraseña cambiada con éxito</p>
      )}
      {errors && <p className='text-danger'>{errors}</p>}
    </section>
  );
};

ChangePassword.propTypes = {
  logout: PropTypes.func.isRequired,
  changePassword: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
});

export default connect(mapStateToProps, { logout, changePassword })(ChangePassword);
