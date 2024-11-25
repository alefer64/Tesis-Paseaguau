import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { connect } from 'react-redux';
import { actualizarEstadoTransaccion } from '../../actions/billing';

const PaymentSuccess = ({ actualizarEstadoTransaccion }) => {
  const { transactionId } = useParams();

  useEffect(() => {
    actualizarEstadoTransaccion(transactionId, 'successful');
  }, [actualizarEstadoTransaccion, transactionId]);

  return (
    <div>
      <h1>Pago Exitoso</h1>
      <p>Gracias por tu pago. Tu saldo ha sido actualizado.</p>
    </div>
  );
};

export default connect(null, { actualizarEstadoTransaccion })(PaymentSuccess);
