import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getHorarios, updateHorarios } from '../../actions/settings';
import { Checkbox, Button, Table, Typography, Row, Col } from 'antd';
import './css/HorarioSettings.css';

const { Title } = Typography;

const HorarioSettings = ({ getHorarios, updateHorarios, horarios }) => {
  const [editableHorarios, setEditableHorarios] = useState({
    mañana: [],
    tarde: [],
    noche: []
  });

  useEffect(() => {
    getHorarios();
  }, [getHorarios]);

  useEffect(() => {
    if (horarios) {
      setEditableHorarios(horarios);
    }
  }, [horarios]);

  const handleHorarioChange = (periodo, dia) => {
    const newHorarios = { ...editableHorarios };
    if (newHorarios[periodo].includes(dia)) {
      newHorarios[periodo] = newHorarios[periodo].filter(d => d !== dia);
    } else {
      newHorarios[periodo].push(dia);
    }
    setEditableHorarios(newHorarios);
  };

  const handleSaveHorarios = () => {
    updateHorarios(editableHorarios);
  };

  const columns = [
    {
      title: '',
      dataIndex: 'periodo',
      key: 'periodo'
    },
    ...['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa', 'Do'].map(dia => ({
      title: dia,
      dataIndex: dia.toLowerCase(),
      key: dia.toLowerCase(),
      render: (_, record) => (
        <Checkbox
          checked={record.dias.includes(dia)}
          onChange={() => handleHorarioChange(record.periodo, dia)}
        />
      )
    }))
  ];

  const data = [
    {
      key: '1',
      periodo: 'mañana',
      dias: editableHorarios.mañana
    },
    {
      key: '2',
      periodo: 'tarde',
      dias: editableHorarios.tarde
    },
    {
      key: '3',
      periodo: 'noche',
      dias: editableHorarios.noche
    }
  ];

  return (
    <div className='horario-settings-container'>
      <Row justify="center">
        <Col span={24} style={{ textAlign: 'center' }}>
          <Title level={2}>Horarios Disponibles para Paseo</Title>
        </Col>
      </Row>
      <Row justify="center">
        <Col span={24}>
          <Table
            columns={columns}
            dataSource={data}
            pagination={false}
            bordered
            className="horario-table"
          />
        </Col>
      </Row>
      <Row justify="center" style={{ marginTop: '20px' }}>
        <Col>
          <Button type='primary' onClick={handleSaveHorarios}>
            Guardar Horarios
          </Button>
        </Col>
      </Row>
    </div>
  );
};

HorarioSettings.propTypes = {
  getHorarios: PropTypes.func.isRequired,
  updateHorarios: PropTypes.func.isRequired,
  horarios: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  horarios: state.settings.horarios
});

export default connect(mapStateToProps, { getHorarios, updateHorarios })(HorarioSettings);
