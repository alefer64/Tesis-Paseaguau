import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { getHistorialTransacciones } from '../../actions/billing';
import { List, Card } from 'antd';

const HistorialPagos = ({ getHistorialTransacciones, historial }) => {
  useEffect(() => {
    getHistorialTransacciones();
  }, [getHistorialTransacciones]);

  return (
    <Card title="Historial de Pagos">
      <List
        itemLayout="horizontal"
        dataSource={historial}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              title={item.type === 'credit' ? 'Carga de Saldo' : 'Retiro de Saldo'}
              description={`Monto: ${item.amount} - Estado: ${item.status} - Fecha: ${new Date(item.date).toLocaleString()}`}
            />
          </List.Item>
        )}
      />
    </Card>
  );
};

const mapStateToProps = (state) => ({
  historial: state.billing.historial,
});

export default connect(mapStateToProps, { getHistorialTransacciones })(HistorialPagos);
