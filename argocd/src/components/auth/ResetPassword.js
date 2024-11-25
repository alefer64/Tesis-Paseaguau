import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { Form, Input, Button, Typography } from 'antd';
import './css/ResetPassword.css';

const { Title, Paragraph } = Typography;

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState('');

  const handleResetPassword = async (values) => {
    const { newPassword, confirmNewPassword } = values;

    if (newPassword !== confirmNewPassword) {
      setMessage('Las contraseñas no coinciden');
      return;
    }

    try {
      const response = await api.post('/users/reset', {
        token,
        newPassword,
        confirmNewPassword,
      });
      setMessage(response.data.mensaje);
      navigate('/login');
    } catch (error) {
      console.error(error);
      setMessage('Error al restablecer la contraseña.');
    }
  };

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await api.get(`/users/verify-token/${token}`);
        if (!response.data.valid) {
          setMessage('El token no es válido o ha expirado.');
        }
      } catch (error) {
        console.error(error);
        setMessage('Error al verificar el token.');
      }
    };

    verifyToken();
  }, [token]);

  return (
    <section className="container">
      <Title level={1}>Restablecer Contraseña</Title>
      <Paragraph>
        Por favor, ingrese su nueva contraseña y confírmela para restablecer su contraseña.
      </Paragraph>
      <Form
        name="resetPassword"
        onFinish={handleResetPassword}
        layout="vertical"
        className="reset-password-form"
      >
        <Form.Item
          name="newPassword"
          label="Nueva Contraseña"
          rules={[
            { required: true, message: 'Por favor ingrese su nueva contraseña' },
            { min: 6, message: 'La contraseña debe tener al menos 6 caracteres' },
          ]}
        >
          <Input.Password placeholder="Nueva Contraseña" />
        </Form.Item>
        <Form.Item
          name="confirmNewPassword"
          label="Confirmar Nueva Contraseña"
          dependencies={['newPassword']}
          rules={[
            { required: true, message: 'Por favor confirme su nueva contraseña' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('newPassword') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Las contraseñas no coinciden'));
              },
            }),
          ]}
        >
          <Input.Password placeholder="Confirmar Nueva Contraseña" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" className="reset-password-form-button">
            Restablecer Contraseña
          </Button>
        </Form.Item>
      </Form>
      {message && <div className="message">{message}</div>}
    </section>
  );
};

export default ResetPassword;
