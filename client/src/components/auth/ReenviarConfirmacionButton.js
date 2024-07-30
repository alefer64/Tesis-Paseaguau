import React, { useState } from 'react';
import api from '../../utils/api';

export const ReenviarConfirmacionButton = ({ userId }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleReenviarClick = () => {
    setIsLoading(true);
    setMessage('');
    api.post(`${process.env.REACT_APP_API_URL}users/reenviarconfirmacion/${userId}`)
      .then((response) => {
        setMessage(response.data.mensaje);
      })
      .catch((error) => {
        setMessage('Error al reenviar el mensaje de confirmación.');
        console.error(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div>
      <button className='btn btn-primary' onClick={handleReenviarClick} disabled={isLoading}>
        Reenviar Confirmación
      </button>
      {message && <p>{message}</p>}
    </div>
  );
};
