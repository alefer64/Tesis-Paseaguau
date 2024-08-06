import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import api from '../../utils/api';
import { useNavigate, Link } from 'react-router-dom';
import { message } from 'antd';
import './css/style.css';

const WalkerProfileForm = () => {
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [perrosPorPaseo, setPerrosPorPaseo] = useState('');
  const [tamanoPerros, setTamanoPerros] = useState({
    pequeno: false,
    mediano: false,
    grande: false,
    gigante: false
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/profile/me');
        const profile = res.data;
        setTitulo(profile.titulo || '');
        setDescripcion(profile.descripcion || '');
      } catch (err) {
        console.error(err.response.data);
      }
    };
    fetchProfile();
  }, []);

  const handleCheckboxChange = (e) => {
    setTamanoPerros({ ...tamanoPerros, [e.target.name]: e.target.checked });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      titulo,
      descripcion
    };
    try {
      await api.put('/profile/update', data, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      message.success('Perfil actualizado exitosamente');
      navigate('/settings');
    } catch (err) {
      console.error(err.response.data);
      message.error('Error al actualizar el perfil');
    }
  };

  return (
    <section className='container'>
      <h1 className='large text-primary'>Tu Perfil</h1>
      <form onSubmit={handleSubmit} className='form'>
        <div className='form-group'>
          <label htmlFor='titulo'>Título breve</label>
          <input
            type='text'
            id='titulo'
            name='titulo'
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            className='form-control'
          />
        </div>
        <div className='form-group'>
          <label htmlFor='descripcion'>Presentación Personal</label>
          <textarea
            id='descripcion'
            name='descripcion'
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className='form-control'
          />
        </div>
        <div className='form-group'>
          <label htmlFor='perrosPorPaseo'>Perros por paseo</label>
          <input
            type='number'
            id='perrosPorPaseo'
            name='perrosPorPaseo'
            value={perrosPorPaseo}
            onChange={(e) => setPerrosPorPaseo(e.target.value)}
            className='form-control'
          />
        </div>
        <div className='form-group'>
          <label>Tamaños de perros que aceptas</label>
          <div>
            <label>
              <input
                type='checkbox'
                name='pequeno'
                checked={tamanoPerros.pequeno}
                onChange={handleCheckboxChange}
              />
              Pequeño
            </label>
          </div>
          <div>
            <label>
              <input
                type='checkbox'
                name='mediano'
                checked={tamanoPerros.mediano}
                onChange={handleCheckboxChange}
              />
              Mediano
            </label>
          </div>
          <div>
            <label>
              <input
                type='checkbox'
                name='grande'
                checked={tamanoPerros.grande}
                onChange={handleCheckboxChange}
              />
              Grande
            </label>
          </div>
          <div>
            <label>
              <input
                type='checkbox'
                name='gigante'
                checked={tamanoPerros.gigante}
                onChange={handleCheckboxChange}
              />
              Gigante
            </label>
          </div>
        </div>
        <div className='d-flex'>
          <button type='submit' className='btn btn-primary mr-2'>Guardar</button>
          <Link to='/settings' className='btn btn-light'>Cancelar</Link>
        </div>
      </form>
    </section>
  );
};

const mapStateToProps = (state) => ({});

export default connect(mapStateToProps)(WalkerProfileForm);
