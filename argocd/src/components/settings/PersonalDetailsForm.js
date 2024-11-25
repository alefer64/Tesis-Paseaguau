import React, { useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { message } from 'antd';

const PersonalDetailsForm = ({ user }) => {
  const [formData, setFormData] = useState({
    name: user ? user.name : '',
    phoneType: '',
    phoneNumber: '',
    foto: null
  });

  const navigate = useNavigate();

  const {
    name,
    phoneType,
    phoneNumber,
    foto
  } = formData;

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFileChange = (e) =>
    setFormData({ ...formData, foto: e.target.files[0] });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('phoneType', phoneType);
    formData.append('phoneNumber', phoneNumber);
    if (foto) {
      formData.append('foto', foto);
    }

    try {
      const res = await api.put('/users/t', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      message.success(res.data.msg);
      navigate('/settings');
    } catch (err) {
      console.error(err.response.data);
    }
  };

  return (
    <section className='container'>
      <h1 className='large text-primary'>Datos Personales</h1>
      <form onSubmit={handleSubmit} className='form'>
        <div className='form-group'>
          <label htmlFor='email'>Email</label>
          <input
            type='email'
            id='email'
            name='email'
            value={user ? user.email : ''}
            readOnly
            className='form-control'
          />
        </div>
        <div className='form-group'>
          <label htmlFor='name'>Nombre</label>
          <input
            type='text'
            id='name'
            name='name'
            value={name}
            onChange={handleChange}
            className='form-control'
          />
        </div>
        <div className='form-group'>
          <label htmlFor='phoneType'>Teléfono</label>
          <div className='d-flex'>
            <select
              id='phoneType'
              name='phoneType'
              value={phoneType}
              onChange={handleChange}
              className='form-control'
            >
              <option value=''>Seleccionar tipo</option>
              <option value='celular'>Celular</option>
              <option value='casa'>Casa</option>
              <option value='trabajo'>Trabajo</option>
            </select>
            <input
              type='text'
              id='phoneNumber'
              name='phoneNumber'
              placeholder='números sin espacios ni guiones'
              value={phoneNumber}
              onChange={handleChange}
              className='form-control ml-2'
            />
          </div>
        </div>
        <div className='form-group'>
          <label htmlFor='foto'>Foto de perfil</label>
          <input
            type='file'
            id='foto'
            name='foto'
            onChange={handleFileChange}
            className='form-control-file'
          />
        </div>
        <div className='d-flex'>
          <button type='submit' className='btn btn-primary mr-2'>Guardar</button>
          <Link to='/settings' className='btn btn-light'>Cancelar</Link>
        </div>
      </form>
    </section>
  );
};

PersonalDetailsForm.propTypes = {
  user: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  user: state.auth.user
});

export default connect(mapStateToProps)(PersonalDetailsForm);
