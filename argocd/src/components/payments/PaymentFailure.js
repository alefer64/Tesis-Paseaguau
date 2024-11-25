import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { actualizarEstadoTransaccion } from '../../actions/billing';
import { useSearchParams } from 'react-router-dom';

const PaymentFailure = ({ actualizarEstadoTransaccion }) => {
  const [searchParams] = useSearchParams();
  const transactionId = searchParams.get('transactionId') || window.location.pathname.split('/').pop();

  useEffect(() => {
    if (transactionId) {
      actualizarEstadoTransaccion(transactionId, 'failed');
    }
  }, [transactionId, actualizarEstadoTransaccion]);

  return (
    <div>
      <h1>Pago Fallido</h1>
      <p>Hubo un problema con tu pago. Intenta nuevamente.</p>
    </div>
  );
};

export default connect(null, { actualizarEstadoTransaccion })(PaymentFailure);
