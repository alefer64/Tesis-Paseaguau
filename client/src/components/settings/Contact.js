import React from 'react';
import { Card, Col, Row, Typography } from 'antd';
import './css/Contact.css';

const { Title, Text } = Typography;

const Contact = () => {
  return (
    <div className='contact-container'>
      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
        <Col xs={24} md={12} lg={8}>
          <Card title='Contacto para Usuarios'>
            <Title level={4}>Soporte</Title>
            <Text>Email: soporte@paseaguau.com</Text>
            <br />
            <Text>Teléfono: +54 11 1234 5678</Text>
            <br />
            <Text>Horario: Lunes a Viernes, 9:00 AM - 6:00 PM</Text>
          </Card>
        </Col>
        <Col xs={24} md={12} lg={8}>
          <Card title='Contacto para Paseadores'>
            <Title level={4}>Síguenos en nuestras redes sociales</Title>
            <Text>Email: paseadores@paseaguau.com</Text>
            <br />
            <Text>Teléfono: +54 11 8765 4321</Text>
            <br />
            <Text>Horario: Lunes a Viernes, 9:00 AM - 6:00 PM</Text>
          </Card>
        </Col>
        <Col xs={24} md={12} lg={8}>
          <Card title='Redes Sociales'>
            <Title level={4}>Síguenos en nuestras redes sociales</Title>
            <Text>Facebook: @paseaguau</Text>
            <br />
            <Text>Instagram: @paseaguau</Text>
            <br />
            <Text>Twitter: @paseaguau</Text>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Contact;
