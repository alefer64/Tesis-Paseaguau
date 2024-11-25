import React from 'react';
import { connect } from 'react-redux';
import { Link, Navigate } from 'react-router-dom';
import { Form, Input, Button, Typography } from 'antd';
import { setAlert } from '../../actions/alert';
import { register } from '../../actions/auth';
import PropTypes from 'prop-types';
import './css/Register.css';

const { Title, Paragraph } = Typography;

const Register = ({ setAlert, register, isAuthenticated }) => {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    const { name, email, password, password2, phoneNumber } = values;
    if (password !== password2) {
      setAlert('La contraseña no coincide', 'danger');
    } else {
      register({ name, email, password, phoneNumber });
    }
  };

  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <section className="container">
      <Title level={1} className="text-primary">Registro</Title>
      <Paragraph className="lead">
        <i className="fas fa-user" /> Cree su cuenta
      </Paragraph>
      <Form
        form={form}
        name="register"
        onFinish={onFinish}
        initialValues={{
          remember: true,
        }}
        layout="vertical"
        className="register-form"
      >
        <Form.Item
          name="name"
          label="Nombre"
          rules={[{ required: true, message: 'Por favor ingrese su nombre' }]}
        >
          <Input placeholder="Nombre" />
        </Form.Item>
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
        <Form.Item
          name="password2"
          label="Confirmar Contraseña"
          dependencies={['password']}
          hasFeedback
          rules={[
            { required: true, message: 'Por favor confirme su contraseña' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Las contraseñas no coinciden'));
              },
            }),
          ]}
        >
          <Input.Password placeholder="Confirmar Contraseña" />
        </Form.Item>
        <Form.Item
          name="phoneNumber"
          label="Número de Teléfono"
          rules={[
            { required: true, message: 'Por favor ingrese su número de teléfono' },
            {
              pattern: new RegExp(/^(\+?54)?(11)?[0-9]{8}$/, 'g'),
              message: 'Por favor ingrese un número de teléfono válido',
            },
          ]}
        >
          <Input placeholder="Número de Teléfono" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" className="register-form-button">
            Registrarse
          </Button>
        </Form.Item>
      </Form>
      <Paragraph className="my-1">
        Ya tienes una cuenta? <Link to="/login">Loguearse</Link>
      </Paragraph>
    </section>
  );
};

Register.propTypes = {
  setAlert: PropTypes.func.isRequired,
  register: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, { setAlert, register })(Register);
