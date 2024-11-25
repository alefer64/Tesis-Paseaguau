import React from 'react';
import { Layout } from 'antd';
import './css/Footer.css';

const { Footer } = Layout;

const AppFooter = () => {
  return (
    <Footer className="footer">
      <p>Paseaguau.com © 2024. Todos los derechos reservados.</p>
      <p>Desarrollado por tu Alejandro</p>
    </Footer>
  );
};

export default AppFooter;
