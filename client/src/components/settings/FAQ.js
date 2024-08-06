import React from 'react';
import { Collapse } from 'antd';
import './css/FAQ.css';

const { Panel } = Collapse;

const FAQ = () => {
  return (
    <div className='faq-container'>
      <h2>Preguntas Frecuentes</h2>
      <Collapse accordion>
        <Panel header='¿Cómo puedo registrar a mi mascota?' key='1'>
          <p>Para registrar a tu mascota, ve a la sección de "Mis Mascotas" y sigue las instrucciones.</p>
        </Panel>
        <Panel header='¿Cómo me pongo en contacto con un paseador?' key='2'>
          <p>Ve a la sección de "Reservar Paseo" y selecciona el paseador que prefieras, verifica su perfil y clickee
            "Iniciar Chat".</p>
        </Panel>
        <Panel header='¿Cómo puedo contactar al soporte?' key='3'>
          <p>Puedes contactar al soporte enviando un correo a soporte@paseaguau.com o ingresa en "Contacto" en las
            configuraciones.</p>
        </Panel>
        <Panel header='¿Cómo puedo cambiar mi contraseña?' key='4'>
          <p>Ve a la sección de "Cambiar Contraseña" y sigue las instrucciones.</p>
        </Panel>
        <Panel header='¿Cómo puedo actualizar mi información personal?' key='5'>
          <p>Ve a la sección de "Detalles Personales" y sigue las instrucciones.</p>
        </Panel>
        <Panel header='¿Cómo puedo cambiar mi dirección?' key='6'>
          <p>Ve a la sección de "Actualizar Dirección" y sigue las instrucciones.</p>
        </Panel>
        <Panel header='¿Cómo se paga le pago al paseador?' key='7'>
          <p>La forma de pago queda a responsabilidad del usuario y el paseador.</p>
        </Panel>
        <Panel header='¿Qué puedo hacer si tuve una mala experiencia con un paseador?' key='8'>
          <p>Te recomendamos que te pongas en contacto con nuestro equipo para revisar la situación y tomar medidas si es necesario.</p>
        </Panel>
      </Collapse>
    </div>
  );
};

export default FAQ;
