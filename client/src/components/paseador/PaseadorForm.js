import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getSolicitud } from '../../actions/solicitudes';
import api from '../../utils/api';
import { Form, Input, Select, Button, Upload, Checkbox, message, Typography } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const { Option } = Select;
const { Title, Paragraph } = Typography;

const PaseadorForm = ({ getSolicitud, sol }) => {
  const [dni, setDni] = useState(null);
  const [fotoDocumentoFrente, setFotoDocumentoFrente] = useState(null);
  const [fotoDocumentoDorso, setFotoDocumentoDorso] = useState(null);
  const [aceptarTerminos, setAceptarTerminos] = useState(false);
  const [solicitudStatus, setSolicitudStatus] = useState(null);
  const [tipoDocumento, setTipoDocumento] = useState('');

  useEffect(() => {
    getSolicitud();
  }, [getSolicitud]);

  useEffect(() => {
    if (Array.isArray(sol.solicitudes) && sol.solicitudes.length > 0) {
      const estadoSolicitud = sol.solicitudes[0].estado;
      if (estadoSolicitud === 'bloqueado') {
        setSolicitudStatus('bloqueado');
      } else {
        setSolicitudStatus(estadoSolicitud);
      }
    } else {
      setSolicitudStatus(null);
    }
  }, [sol.solicitudes]);

  const handleFileChange = (file, setter) => {
    setter(file.file);
  };

  const handleSubmit = async (values) => {
    if (!aceptarTerminos) {
      message.error('Debes aceptar los términos y condiciones.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('aceptarTerminos', aceptarTerminos);
      formData.append('dni', dni);
      formData.append('tipoDocumento', values.tipoDocumento);
      if (fotoDocumentoFrente) {
        formData.append('documentoFrente', fotoDocumentoFrente, 'documentoFrente.jpg');
      }
      if (fotoDocumentoDorso) {
        formData.append('documentoDorso', fotoDocumentoDorso, 'documentoDorso.jpg');
      }
      const response = await api.post('/solicitudes/nueva-solicitud', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response.status === 200) {
        message.success('Solicitud de paseador creada con éxito');
        setSolicitudStatus('pendiente');
      }
    } catch (error) {
      console.error(error);
      message.error('Error al crear la solicitud de paseador');
    } finally {
      setFotoDocumentoFrente(null);
      setFotoDocumentoDorso(null);
      setAceptarTerminos(false);
    }
  };

  let content;

  switch (solicitudStatus) {
    case 'pendiente':
      content = <Paragraph>Tu solicitud está pendiente de aprobación.</Paragraph>;
      break;
    case 'aprobado':
      content = <Paragraph>¡Ya eres un paseador! Felicitaciones.</Paragraph>;
      break;
    case 'reintentar':
      content = (
        <div>
          <Paragraph>Lo sentimos, pero te pedimos que vuelvas a enviar el formulario.</Paragraph>
          <Button type='primary' onClick={() => setSolicitudStatus('noSolicitado')}>Volver a enviar el formulario</Button>
        </div>
      );
      break;
    case 'bloqueado':
      content = <Paragraph>Usted ha sido vetado para solicitar ser paseador.</Paragraph>;
      break;
    default:
      content = (
        <div className='container'>
          <Title level={2}>Solicitud para ser Paseador</Title>
          <Form onFinish={handleSubmit}>
            <Form.Item name='tipoDocumento' label='Tipo de Documento' rules={[{ required: true, message: 'Selecciona un tipo de documento' }]}>
              <Select value={tipoDocumento} onChange={(value) => setTipoDocumento(value)}>
                <Option value=''>Tipo Documento</Option>
                <Option value='DNI'>DNI</Option>
                <Option value='DDE'>Documento de Enrolamiento</Option>
              </Select>
            </Form.Item>
            <Form.Item name='dni' label='Número de Documento' rules={[{ required: true, message: 'Ingresa tu número de documento' }]}>
              <Input type="number" onChange={(e) => setDni(e.target.value)} />
            </Form.Item>
            <Form.Item label='Documento de Identidad (Frente)'>
              <Upload
                beforeUpload={() => false}
                onChange={(file) => handleFileChange(file, setFotoDocumentoFrente)}
                maxCount={1}
              >
                <Button icon={<UploadOutlined />}>Subir Frente</Button>
              </Upload>
            </Form.Item>
            <Form.Item label='Documento de Identidad (Dorso)'>
              <Upload
                beforeUpload={() => false}
                onChange={(file) => handleFileChange(file, setFotoDocumentoDorso)}
                maxCount={1}
              >
                <Button icon={<UploadOutlined />}>Subir Dorso</Button>
              </Upload>
            </Form.Item>
            <Form.Item>
              <Checkbox checked={aceptarTerminos} onChange={(e) => setAceptarTerminos(e.target.checked)}>
                Acepto los términos y condiciones de privacidad y seguridad
              </Checkbox>
            </Form.Item>
            <Button type='primary' htmlType='submit'>Confirmar</Button>
          </Form>
        </div>
      );
  }

  return (
    <section className="container">
      {content}
    </section>
  );
};

PaseadorForm.propTypes = {
  auth: PropTypes.object.isRequired,
  getSolicitud: PropTypes.func.isRequired,
  sol: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  sol: state.sol,
});

export default connect(mapStateToProps, { getSolicitud })(PaseadorForm);
