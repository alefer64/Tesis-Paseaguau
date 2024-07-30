import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import { connect } from 'react-redux';
import { getSolicitudes, deleteSolicitud } from '../../actions/solicitudes';
import PropTypes from 'prop-types';
import { Card, Button, Row, Col, Typography, Modal, message, Input } from 'antd';

const { Title, Paragraph } = Typography;
const { TextArea } = Input;

const AdminPanel = ({ getSolicitudes, sol, deleteSolicitud }) => {
  const [solicitudSeleccionada, setSolicitudSeleccionada] = useState(null);
  const [solicitudes, setSolicitudes] = useState([]);
  const [showReintentarModal, setShowReintentarModal] = useState(false);
  const [showBloquearModal, setShowBloquearModal] = useState(false);
  const [reintentarRazon, setReintentarRazon] = useState('');
  const [bloquearRazon, setBloquearRazon] = useState('');
  const [currentSolicitudId, setCurrentSolicitudId] = useState(null);

  useEffect(() => {
    getSolicitudes();
  }, [getSolicitudes]);

  useEffect(() => {
    if (sol.solicitudes) {
      setSolicitudes(sol.solicitudes);
    }
  }, [sol.solicitudes]);

  const toggleSolicitud = (solicitudId) => {
    if (solicitudSeleccionada === solicitudId) {
      setSolicitudSeleccionada(null);
    } else {
      setSolicitudSeleccionada(solicitudId);
    }
  };

  const handleEliminarSolicitud = async (solicitudId) => {
    try {
      const response = await deleteSolicitud(solicitudId);
      if (response.status === 200) {
        if (solicitudSeleccionada === solicitudId) {
          setSolicitudSeleccionada(null);
        }
        setSolicitudes(solicitudes.filter((solicitud) => solicitud._id !== solicitudId));
        getSolicitudes();
        message.success('Solicitud eliminada exitosamente.');
      } else {
        console.error('Error al eliminar la solicitud');
      }
    } catch (error) {
      console.error('Error al eliminar la solicitud', error);
    }
  };

  const handleShowReintentarModal = (solicitudId) => {
    setCurrentSolicitudId(solicitudId);
    setShowReintentarModal(true);
  };

  const handleShowBloquearModal = (solicitudId) => {
    setCurrentSolicitudId(solicitudId);
    setShowBloquearModal(true);
  };

  const handleReintentarSolicitud = async () => {
    try {
      const response = await api.put(`/solicitudes/reintentar-solicitud/${currentSolicitudId}`, { razon: reintentarRazon });

      if (response.status === 200) {
        if (solicitudSeleccionada === currentSolicitudId) {
          setSolicitudSeleccionada(null);
        }
        setSolicitudes((solicitudes) =>
          solicitudes.map((solicitud) =>
            solicitud._id === currentSolicitudId ? { ...solicitud, estado: 'pendiente' } : solicitud
          )
        );
        message.success('Solicitud reenviada exitosamente.');
        setShowReintentarModal(false);
        setReintentarRazon('');
        window.location.reload();
      } else {
        console.error('Error al reintentar la solicitud');
      }
    } catch (error) {
      console.error('Error al reintentar la solicitud', error);
    }
  };

  const handleBloquearSolicitud = async () => {
    try {
      const response = await api.put(`/solicitudes/bloquear-solicitud/${currentSolicitudId}`, { razon: bloquearRazon });

      if (response.status === 200) {
        if (solicitudSeleccionada === currentSolicitudId) {
          setSolicitudSeleccionada(null);
        }
        setSolicitudes((solicitudes) =>
          solicitudes.filter((solicitud) => solicitud._id !== currentSolicitudId)
        );
        message.success('Solicitud bloqueada y correo enviado con éxito.');
        setShowBloquearModal(false);
        setBloquearRazon('');
        window.location.reload();
      } else {
        console.error('Error al bloquear la solicitud');
      }
    } catch (error) {
      console.error('Error al bloquear la solicitud', error);
    }
  };

  const handleAprobarSolicitud = async (solicitudId) => {
    try {
      const response = await api.put(`/solicitudes/aprobar-solicitud/${solicitudId}`);

      if (response.status === 200) {
        if (solicitudSeleccionada === solicitudId) {
          setSolicitudSeleccionada(null);
        }
        setSolicitudes((solicitudes) =>
          solicitudes.map((solicitud) =>
            solicitud._id === solicitudId ? { ...solicitud, estado: 'aprobada' } : solicitud
          )
        );
        message.success('Solicitud aprobada exitosamente.');
        window.location.reload();
      } else {
        console.error('Error al aprobar la solicitud');
      }
    } catch (error) {
      console.error('Error al aprobar la solicitud', error);
    }
  };

  return (
    <div className='container'>
      <Title level={2}>Panel de Administrador</Title>
      <Paragraph>¡Bienvenido al panel de administrador!</Paragraph>
      <Paragraph>Aquí puedes gestionar las solicitudes de paseador pendientes y otras funciones de administración.</Paragraph>

      <Title level={3}>Solicitudes Pendientes</Title>
      <Row gutter={[16, 16]}>
        {sol.solicitudes.map((solicitud) => (
          <Col xs={24} md={12} lg={8} key={solicitud._id}>
            <Card
              title={`${solicitud.nombre}`}
              extra={<Button onClick={() => toggleSolicitud(solicitud._id)}>{solicitudSeleccionada === solicitud._id ? 'Cerrar' : 'Abrir'}</Button>}
              actions={[
                <Button type='primary' danger onClick={() => handleEliminarSolicitud(solicitud._id)}>Eliminar</Button>,
                <Button type='primary' onClick={() => handleShowBloquearModal(solicitud._id)}>Bloquear</Button>,
                <Button type='primary' onClick={() => handleShowReintentarModal(solicitud._id)}>Reintentar</Button>,
                <Button type='primary' onClick={() => handleAprobarSolicitud(solicitud._id)}>Aprobar</Button>,
              ]}
            >
              {solicitudSeleccionada === solicitud._id && (
                <div className='solicitud-detalle'>
                  <Paragraph>Fecha de Creación: {solicitud.fechaCreacion}</Paragraph>
                  <Paragraph>Nombre del Usuario: {solicitud.nombre}</Paragraph>
                  <Paragraph>Documento del Paseador: {solicitud.dni}</Paragraph>
                  <Paragraph>Estado: {solicitud.estado}</Paragraph>

                  <Row gutter={[16, 16]}>
                    <Col span={12}>
                      <Paragraph>Foto Documento Frente:</Paragraph>
                      <img src={process.env.REACT_APP_IMG_URL + solicitud.fotoDocumentoFrente} alt='Documento Frente' style={{ width: '100%' }} />
                    </Col>
                    <Col span={12}>
                      <Paragraph>Foto Documento Dorso:</Paragraph>
                      <img src={process.env.REACT_APP_IMG_URL + solicitud.fotoDocumentoDorso} alt='Documento Dorso' style={{ width: '100%' }} />
                    </Col>
                  </Row>
                </div>
              )}
            </Card>
          </Col>
        ))}
      </Row>

      <Modal
        title="Razón para reintentar solicitud"
        open={showReintentarModal}
        onOk={handleReintentarSolicitud}
        onCancel={() => setShowReintentarModal(false)}
      >
        <TextArea
          rows={4}
          value={reintentarRazon}
          onChange={(e) => setReintentarRazon(e.target.value)}
          placeholder="Escriba la razón para reintentar la solicitud"
        />
      </Modal>

      <Modal
        title="Razón para bloquear solicitud"
        open={showBloquearModal}
        onOk={handleBloquearSolicitud}
        onCancel={() => setShowBloquearModal(false)}
      >
        <TextArea
          rows={4}
          value={bloquearRazon}
          onChange={(e) => setBloquearRazon(e.target.value)}
          placeholder="Escriba la razón para bloquear la solicitud"
        />
      </Modal>
    </div>
  );
};

AdminPanel.propTypes = {
  getSolicitudes: PropTypes.func.isRequired,
  deleteSolicitud: PropTypes.func.isRequired,
  sol: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  sol: state.sol
});

export default connect(mapStateToProps, { getSolicitudes, deleteSolicitud })(AdminPanel);
