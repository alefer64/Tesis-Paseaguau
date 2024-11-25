import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { hacerPremium } from '../../actions/billing';
import { Card, Button, Typography, message } from 'antd';
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';
import './css/Premium.css';

const { Title, Paragraph } = Typography;

const Premium = ({ hacerPremium, user }) => {
  const [preferenceId, setPreferenceId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    initMercadoPago(process.env.REACT_APP_public_mercadopago_secret, { locale: 'es-AR' });
  }, []);

  const handleSubscription = async () => {
    if (preferenceId) {
      message.error('Ya existe una transacción pendiente. Completa o cancela la anterior.');
      return;
    }
    setLoading(true);
    try {
      const res = await hacerPremium();
      if (res && res.preferenceId) {
        setPreferenceId(res.preferenceId);
      }
    } catch (error) {
      message.error('Error al iniciar el proceso de suscripción');
    }
    setLoading(false);
  };

  return (
    <div className='premium-container'>
      {user && user.premium ? (
        <Card className='premium-card'>
          <Title className='premium-title'>
            <span role="img" aria-label="star">⭐</span> Eres Premium <span role="img" aria-label="star">⭐</span>
          </Title>
          <Paragraph className='premium-thanks'>¡Gracias por ser un usuario premium!</Paragraph>
          <ul className='premium-benefits'>
            <li>Hasta 12 fotos en tu perfil</li>
            <li>Banner en tu perfil</li>
            <li>Más chats simultáneos</li>
          </ul>
        </Card>
      ) : (
        <Card className='premium-card'>
          <Title className='premium-title'>
            <span role="img" aria-label="star">⭐</span> Hacerse Premium <span role="img" aria-label="star">⭐</span>
          </Title>
          <Paragraph className='premium-price'>Precio: $2000 ARS / mes</Paragraph>
          <Paragraph className='premium-benefits-title'>Beneficios:</Paragraph>
          <ul className='premium-benefits'>
            <li>Hasta 12 fotos en tu perfil</li>
            <li>Banner en tu perfil</li>
            <li>Más chats simultáneos</li>
          </ul>
          <Button type='primary' onClick={handleSubscription} loading={loading}>
            Pagar
          </Button>
          {preferenceId && (
            <Wallet
              initialization={{preferenceId: preferenceId}}
              onPaymentComplete={() => {
                message.success('Pago completado con éxito');
                setPreferenceId(null);
              }}
              onError={() => {
                message.error('Error al procesar el pago');
                setPreferenceId(null);
              }}
            />
          )}
        </Card>
      )}
    </div>
  );
};

const mapStateToProps = (state) => ({
  user: state.auth.user
});

export default connect(mapStateToProps, { hacerPremium })(Premium);
