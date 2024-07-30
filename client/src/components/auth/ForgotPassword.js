import React, { useState } from 'react';
import api from '../../utils/api';
import { Form, Input, Button, Typography } from 'antd';
import './css/ForgotPassword.css';

const { Title, Paragraph } = Typography;

const ForgotPassword = () => {
  const [message, setMessage] = useState('');

  const handleForgotPassword = async (values) => {
    const { email } = values;
    try {
      const response = await api.post('/users/request', { email });
      setMessage(response.data.mensaje);
    } catch (error) {
      console.error(error);
      setMessage('Error al enviar la solicitud de recuperación de contraseña.');
    }
  };

  return (
    <section className="container">
      <Title level={1}>¿Olvidó su Contraseña?</Title>
      <Paragraph>
        Por favor, ingrese su dirección de correo electrónico para recibir un enlace de recuperación de contraseña.
      </Paragraph>
      <Form
        name="forgotPassword"
        onFinish={handleForgotPassword}
        layout="vertical"
        className="forgot-password-form"
      >
        <Form.Item
          name="email"
          label="Correo Electrónico"
          rules={[
            { required: true, message: 'Por favor ingrese su correo electrónico' },
            { type: 'email', message: 'Por favor ingrese un correo electrónico válido' },
          ]}
        >
          <Input placeholder="Correo Electrónico" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" className="forgot-password-form-button">
            Enviar
          </Button>
        </Form.Item>
      </Form>
      {message && <div className="message">{message}</div>}
    </section>
  );
};

export default ForgotPassword;
