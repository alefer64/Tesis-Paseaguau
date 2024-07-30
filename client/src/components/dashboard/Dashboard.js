import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Card, Row, Col, Typography } from 'antd';
import { Link } from 'react-router-dom';
import { ScheduleOutlined, SmileOutlined, TeamOutlined, BaiduOutlined } from '@ant-design/icons';
import './css/Dashboard.css';

const { Title, Text } = Typography;

const Dashboard = () => {
  return (
    <div className='dashboard-container'>
      <Title className='dashboard-title' level={2}>Listo/a para pasear?</Title>
      <br/>
      <Row gutter={[16, 16]} className='dashboard-cards'>
        <Col xs={24} sm={12} md={8}>
          <Card
            title='Mis Mascotas'
            hoverable
            className='dashboard-card'
            cover={<BaiduOutlined className='dashboard-icon' />}
          >
            <Text>Registra y gestiona las mascotas que deseas pasear.</Text>
            <br/>
            <Link to='/pets'><BaiduOutlined /> Ver Mascotas</Link>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card
            title='Paseadores'
            hoverable
            className='dashboard-card'
            cover={<TeamOutlined className='dashboard-icon' />}
          >
            <Text>Busca paseadores por tu zona</Text>
            <br/>
            <Link to='/reservapaseo'><ScheduleOutlined /> Buscar Paseadores</Link>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card
            title='Perfil'
            hoverable
            className='dashboard-card'
            cover={<SmileOutlined className='dashboard-icon' />}
          >
            <Text>Ajusta tus preferencias.</Text>
            <br/>
            <Link to='/settings'><SmileOutlined /> Mi Usuario</Link>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

Dashboard.propTypes = {
  auth: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  auth: state.auth
});

export default connect(mapStateToProps, {})(Dashboard);
