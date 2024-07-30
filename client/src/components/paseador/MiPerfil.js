import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getCurrentProfile } from '../../actions/profile';
import { createChat } from '../../actions/chat';
import { useNavigate } from 'react-router-dom';
import { Card, Col, Row, Button, Modal, Carousel } from 'antd';
import GoogleMapReact from 'google-map-react';
import './css/MiPerfil.css';

const MiPerfil = ({ profile: { profile, loading }, getCurrentProfile, user, createChat }) => {
  const navigate = useNavigate();
  const [fileList, setFileList] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    getCurrentProfile();
  }, [getCurrentProfile]);

  useEffect(() => {
    if (profile && profile.galeriaFotos) {
      const maxPhotos = user.premium ? profile.galeriaFotos : profile.galeriaFotos.slice(0, 3);
      setFileList(maxPhotos.map((foto, index) => ({
        uid: index,
        name: `foto-${index}`,
        status: 'done',
        url: foto.replace(/\\/g, '\\')
      })));
    }
  }, [profile, user.premium]);

  if (loading || !profile) {
    return <div>Loading...</div>;
  }

  const showModal = (index) => {
    setCurrentImageIndex(index);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleCreateChat = async () => {
    const chatId = await createChat(profile._id);
    navigate(`/chats/${chatId}`);
  };

  const { direccion } = profile;
  const position = direccion && direccion.position ? direccion.position : { lat: -34.603722, lng: -58.381592 };

  return (
    <section className='container'>
      <div className='banner-container'>
        {user.premium && profile.banner &&
          <img src={`${process.env.REACT_APP_IMG_URL}${profile.banner}`} alt='Banner' className='banner-image' />}
      </div>
      <div className='profile-header'>
        <img src={`${process.env.REACT_APP_IMG_URL}${profile.foto}`} alt='Perfil' className='profile-photo' />
        <div className='profile-info'>
          <h1>{profile.nombre}</h1>
          <p>{profile.titulo}</p>
          <br/>
          <p>{profile.direccion ? profile.direccion.localidad : 'Localidad no especificada'}</p>
        </div>
        <Card className='price-card'>
          <h3>PRECIO DE PASEOS</h3>
          <div className='price'>{profile.precio !== 0 ? profile.precio : 'El precio no está definido, por favor configurelo en las configuraciones.'}</div>
          <Button type='primary' onClick={handleCreateChat} disabled={profile.precio === 0}>Comunicarse con el paseador</Button>
        </Card>
      </div>
      <Card className='profile-section'>
        <h2>Presentación Personal</h2>
        <p>{profile.descripcion}</p>
      </Card>
      <div className='profile-content'>
        <Row gutter={[16, 16]}>
          {fileList.map((file, index) => (
            <Col xs={12} sm={8} md={6} lg={4} key={index}>
              <Card
                className='gallery-card'
                cover={<img alt={`foto-${index}`} src={`${process.env.REACT_APP_IMG_URL}${file.url}`}
                            onClick={() => showModal(index)} />}
              />
            </Col>
          ))}
        </Row>

        <Modal visible={isModalVisible} footer={null} onCancel={handleCancel}>
          <Carousel initialSlide={currentImageIndex}>
            {fileList.map((file, index) => (
              <div key={index}>
                <img alt={`foto-${index}`} src={`${process.env.REACT_APP_IMG_URL}${file.url}`}
                     className='carousel-image' />
              </div>
            ))}
          </Carousel>
        </Modal>

        <div className='profile-section'>
          <h2>Ubicación</h2>
          <div style={{ height: '300px', width: '100%' }}>
            <GoogleMapReact
              bootstrapURLKeys={{ key: process.env.REACT_APP_google_maps_api_key }}
              center={position}
              defaultZoom={15}
              options={{
                draggable: false,
                zoomControl: false,
                scrollwheel: false,
                disableDoubleClickZoom: true
              }}
            >
              <Marker lat={position.lat} lng={position.lng} />
            </GoogleMapReact>
          </div>
        </div>

        <div className='profile-section'>
          <h2>Horarios Disponibles para Paseo</h2>
          <table>
            <thead>
            <tr>
              <th></th>
              <th>Lu</th>
              <th>Ma</th>
              <th>Mi</th>
              <th>Ju</th>
              <th>Vi</th>
              <th>Sa</th>
              <th>Do</th>
            </tr>
            </thead>
            <tbody>
            {['mañana', 'tarde', 'noche'].map((periodo) => (
              <tr key={periodo}>
                <td>{periodo}</td>
                {['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa', 'Do'].map((dia) => (
                  <td key={dia} className={`table-cell ${profile.horarios && profile.horarios[periodo] && profile.horarios[periodo].includes(dia) ? 'available' : 'not-available'}`}>
                    <input
                      type='checkbox'
                      disabled
                      checked={profile.horarios && profile.horarios[periodo] && profile.horarios[periodo].includes(dia)}
                    />
                  </td>
                ))}
              </tr>
            ))}
            </tbody>
          </table>
          <div className='profile-section-footer'>
            <p>Los turnos son aproximados, para coordinar horarios exactos envía una consulta a {profile.user.name}.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

MiPerfil.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  createChat: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
  profile: state.profile,
  user: state.auth.user
});

export default connect(mapStateToProps, { getCurrentProfile, createChat })(MiPerfil);

const Marker = () => (
  <div className='marker' style={{ backgroundColor: 'red', borderRadius: '50%', width: '10px', height: '10px' }} />
);
