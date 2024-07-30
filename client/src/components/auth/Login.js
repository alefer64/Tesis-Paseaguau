import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { connect } from 'react-redux';
import { Form, Input, Button, Typography } from 'antd';
import { login } from '../../actions/auth';
import PropTypes from 'prop-types';
import './css/Login.css';

const { Title, Paragraph } = Typography;

const Login = ({ login, isAuthenticated }) => {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    const { email, password } = values;
    login(email, password);
  };

  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <section className="container">
      <Title level={1} className="text-primary">Iniciar Sesión</Title>
      <Paragraph className="lead">
        <i className="fas fa-user" /> Ingresa en tu cuenta
      </Paragraph>
      <Form
        form={form}
        name="login"
        onFinish={onFinish}
        initialValues={{
          remember: true,
        }}
        layout="vertical"
        className="login-form"
      >
        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: 'Por favor ingrese su email' },
            { type: 'email', message: 'Por favor ingrese un email válido' },
          ]}
        >
          <Input placeholder="Email" />
        </Form.Item>
        <Form.Item
          name="password"
          label="Contraseña"
          rules={[
            { required: true, message: 'Por favor ingrese su contraseña' },
            { min: 6, message: 'La contraseña debe tener al menos 6 caracteres' },
          ]}
        >
          <Input.Password placeholder="Contraseña" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" className="login-form-button">
            Iniciar Sesión
          </Button>
        </Form.Item>
      </Form>
      <Paragraph className="my-1">
        ¿Olvidaste tu contraseña? <Link to='/recuperar'>Recuperar Contraseña</Link>
      </Paragraph>
      <Paragraph className="my-1">
        ¿No tienes una cuenta? <Link to="/register">Regístrate</Link>
      </Paragraph>
    </section>
  );
};

Login.propTypes = {
  login: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, { login })(Login);
