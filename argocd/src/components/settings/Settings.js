import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getCurrentProfile } from '../../actions/profile';
import { deleteAccount } from '../../actions/settings';
import { ReenviarConfirmacionButton } from '../auth/ReenviarConfirmacionButton';
import { Row, Col, Card, Button, message } from 'antd';
import './css/Settings.css';

const Settings = ({ getCurrentProfile, deleteAccount, auth: { user } }) => {
  const [userName] = useState(user ? user.name : '');
  const [profileLoaded, setProfileLoaded] = useState(false);
  const [esPaseador, setEsPaseador] = useState(false);

  useEffect(() => {
    if (!profileLoaded) {
      getCurrentProfile();
      setProfileLoaded(true);
    }
  }, [getCurrentProfile, profileLoaded]);

  useEffect(() => {
    if (user && user.esPaseador) {
      setEsPaseador(user.esPaseador);
    }
  }, [user]);

  const handleDeleteAccount = () => {
    deleteAccount();
    message.success('Cuenta borrada exitosamente.');
  };

  return (
    <section className='container'>
      <h1 className='large text-primary'>Configuración</h1>

      {user && user.verified === false ? (
        <>
          <p>Aún no has confirmado tu cuenta</p>
          <p>Haz click aquí para confirmarla</p>
          <ReenviarConfirmacionButton userId={user._id} />
        </>
      ) : (
        <>
          <p className='lead'>
            <i className='fas fa-user' /> Bienvenido {userName}
            <br />
            {!esPaseador && (
              <Link to='/solicitudpaseador' className='btn btn-primary my-1'>
                Ir a la Solicitud de Paseador
              </Link>
            )}
          </p>
          <>
            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
              <Col className='test' xs={24} md={12} lg={8}>
                <Card title='Sector de Información'>
                  <Link to='FAQ'>
                    <Button type='primary' block className='my-1'>FAQ</Button>
                  </Link>
                  <Link to='Contacto'>
                    <Button type='primary' block className='my-1'>Contacto</Button>
                  </Link>
                </Card>
              </Col>
              <Col className='test' xs={24} md={12} lg={8}>
                <Card title='Mi Cuenta'>
                  <Link to='personal-details'>
                    <Button type='primary' block className='my-1'>
                      Datos Personales
                    </Button>
                  </Link>
                  <Link to='historialpagos'>
                    <Button type='primary' block className='my-1'>
                      Historial de Pagos
                    </Button>
                  </Link>
                  <Link to='premium'>
                    <Button type='primary' block className='my-1'>
                      Premium
                    </Button>
                  </Link>
                  <Link to='/settings/updateaddress'>
                    <Button type='primary' block className='my-1'>
                      Ubicación
                    </Button>
                  </Link>
                  <Link to='changepassword'>
                    <Button type='primary' block className='my-1'>
                      Cambiar Contraseña
                    </Button>
                  </Link>
                  <Button type='primary' danger block className='my-1' onClick={handleDeleteAccount}>
                    <i className='fas fa-user-minus' /> Borrar mi cuenta
                  </Button>
                </Card>
              </Col>
              {esPaseador && (
                <Col className='test' xs={24} md={12} lg={8}>
                  <Card title='Tu Perfil'>
                    <Link to='/settings/profile'>
                      <Button type='primary' block className='my-1'>
                        Editar Perfil
                      </Button>
                    </Link>
                    <Link to='/settings/updateaddress'>
                      <Button type='primary' block className='my-1'>
                        Ubicación
                      </Button>
                    </Link>
                    <Link to='availability'>
                      <Button type='primary' block className='my-1'>
                        Disponibilidad para Pasear
                      </Button>
                    </Link>
                    <Link to='pricing'>
                      <Button type='primary' block className='my-1'>
                        Precio del Servicio
                      </Button>
                    </Link>
                    <Link to='gallery'>
                      <Button type='primary' block className='my-1'>
                        Galería de Fotos
                      </Button>
                    </Link>
                  </Card>
                </Col>
              )}
            </Row>
          </>
        </>
      )}
    </section>
  );
};

Settings.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  deleteAccount: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  profile: state.profile
});

export default connect(mapStateToProps, { getCurrentProfile, deleteAccount })(Settings);
