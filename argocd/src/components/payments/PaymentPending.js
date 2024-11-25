import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { connect } from 'react-redux';
import { actualizarEstadoTransaccion } from '../../actions/billing';

const PaymentPending = ({ actualizarEstadoTransaccion }) => {
  const { transactionId } = useParams();

  useEffect(() => {
    actualizarEstadoTransaccion(transactionId, 'pending');
  }, [actualizarEstadoTransaccion, transactionId]);

  return (
    <div>
      <h1>Pago Pendiente</h1>
      <p>Tu pago está siendo procesado. Te notificaremos cuando se complete.</p>
    </div>
  );
};

export default connect(null, { actualizarEstadoTransaccion })(PaymentPending);
