import React from 'react';
import { Row, Col, Card } from 'antd';
import './css/Landing.css';

const Landing = () => {
  return (
    <section className="landing">
      <div className="info-section">
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} md={12}>
            <img src="https://www.zooplus.es/magazine/wp-content/uploads/2022/08/paseador-de-perros.jpeg" alt="About PaseaGuau" className="info-image" />
          </Col>
          <Col xs={24} md={12}>
            <div className="info-text">
              <h2>Acerca de Pasea</h2>
              <p>
                PaseaGuau es la aplicación perfecta para conectar a dueños de mascotas con paseadores de confianza.
                Ofrecemos una plataforma segura y fácil de usar para que puedas asegurarte de que tu mascota está en
                buenas manos.
              </p>
              <p>
                Nuestro objetivo es brindar el mejor servicio tanto para los dueños como para los paseadores, facilitando
                la comunicación y garantizando la seguridad de todos.
              </p>
            </div>
          </Col>
        </Row>
      </div>
      <div className="services-section">
        <h2 className="services-title">Nuestros Servicios</h2>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <Card className="service-card">
              <h3>Conexión Segura</h3>
              <p>
                PaseaGuau garantiza una conexión segura entre dueños de mascotas y paseadores, asegurando que todos los datos personales estén protegidos con la mejor seguridad que se puede ofrecer.
              </p>
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card className="service-card">
              <h3>Fácil Comunicación</h3>
              <p>
                Nuestra plataforma facilita la comunicación fluida entre los dueños de mascotas y los paseadores, permitiendo coordinar horarios y detalles de paseos sin complicaciones.
              </p>
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card className="service-card">
              <h3>Rápido y facil!</h3>
              <p>Diseño e interfaz simplificado, justo para que, en unos pasos agregar tu mascota, buscar tu paseador ideal y darle a tu mascota un paseo en todo momento que lo necesites!</p>
            </Card>
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <Card className="service-card">
              <h3>Seguridad Verificada</h3>
              <p>Para asegurarnos que tus mascotas están bien cuidadas solicitamos información como Documentos para garantizar su calma</p>
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card className="service-card">
              <h3>Flexibilidad de Horarios</h3>
              <p>
                PaseaGuau ofrece una amplia flexibilidad de horarios para adaptarse a las necesidades de los dueños de mascotas y los paseadores.
              </p>
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card className="service-card">
              <h3>Soporte 24/7</h3>
              <p>
                Nuestro equipo de soporte está disponible las 24 horas del día, los 7 días de la semana, para resolver cualquier duda o inconveniente que pueda surgir.
              </p>
            </Card>
          </Col>
        </Row>
      </div>
    </section>
  );
};

export default Landing;
