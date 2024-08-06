import React, { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { logout } from '../../actions/auth';
import { Menu, Drawer, Button } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import './css/Navbar.css';

const Navbar = ({ auth: { isAuthenticated, user }, logout }) => {
  const [visible, setVisible] = useState(false);

  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };

  const handleLinkClick = () => {
    setVisible(false);
  };

  const authLinks = (
    <Fragment>
      {user && user.isAdmin && (
        <li>
          <Link to='/admin' onClick={handleLinkClick}>Admin</Link>
        </li>
      )}
      {user && user.esPaseador && (
        <Fragment>
          <li>
            <Link to='/miperfil' onClick={handleLinkClick}>Mi Perfil</Link>
          </li>
        </Fragment>
      )}
      <li>
        <Link to='/chats' onClick={handleLinkClick}>Mis Chats</Link>
      </li>
      <li>
        <Link to='/pets' onClick={handleLinkClick}>Mis Mascotas</Link>
      </li>
      <li>
        <Link to='/reservapaseo' onClick={handleLinkClick}>Reservar Paseo</Link>
      </li>
      <li>
        <Link to='/dashboard' onClick={handleLinkClick}>
          <i className='fas fa-user' /> <span className='hide-sm'>Dashboard</span>
        </Link>
      </li>
      <li>
        <Link to='/settings' onClick={handleLinkClick}>
          <i className='fas fa-cog' /> <span className='hide-sm'>Settings</span>
        </Link>
      </li>
      <li>
        <a onClick={() => { logout(); handleLinkClick(); }} href='#!'>
          <i className='fas fa-sign-out-alt' /> <span className='hide-sm'>Logout</span>
        </a>
      </li>
    </Fragment>
  );

  const guestLinks = (
    <Fragment>
      <li>
        <Link to='/register' onClick={handleLinkClick}>Register</Link>
      </li>
      <li>
        <Link to='/login' onClick={handleLinkClick}>Login</Link>
      </li>
    </Fragment>
  );

  const drawerAuthLinks = (
    <Menu>
      {user && user.isAdmin && (
        <Menu.Item key='admin'>
          <Link to='/admin' onClick={handleLinkClick}>Admin</Link>
        </Menu.Item>
      )}
      {user && user.esPaseador && (
        <Menu.Item key='miperfil'>
          <Link to='/miperfil' onClick={handleLinkClick}>Mi Perfil</Link>
        </Menu.Item>
      )}
      <Menu.Item key='chats'>
        <Link to='/chats' onClick={handleLinkClick}>Mis Chats</Link>
      </Menu.Item>
      <Menu.Item key='pets'>
        <Link to='/pets' onClick={handleLinkClick}>Mis Mascotas</Link>
      </Menu.Item>
      <Menu.Item key='reservapaseo'>
        <Link to='/reservapaseo' onClick={handleLinkClick}>Reservar Paseo</Link></Menu.Item>
      <Menu.Item key='dashboard'>
        <Link to='/dashboard' onClick={handleLinkClick}>
          Dashboard
        </Link>
      </Menu.Item>
      <Menu.Item key='settings'>
        <Link to='/settings' onClick={handleLinkClick}>
          Settings
        </Link>
      </Menu.Item>
      <Menu.Item key='logout'>
        <a onClick={() => { logout(); handleLinkClick(); }} href='#!'>
          Cerrar Sesión
        </a>
      </Menu.Item>
    </Menu>
  );

  const drawerGuestLinks = (
    <Menu>
      <Menu.Item key='register'>
        <Link to='/register' onClick={handleLinkClick}>Register</Link></Menu.Item>
      <Menu.Item key='login'>
        <Link to='/login' onClick={handleLinkClick}>Login</Link></Menu.Item>
    </Menu>
  );

  return (
    <nav className='navbar'>
      <Button className='menu-icon' type='primary' onClick={showDrawer}>
        <MenuOutlined />
      </Button>
      <h1>
        <Link to='/'>
          <i className='fas fa-paw' /> PaseaGuau
        </Link>
      </h1>
      <ul className='nav-links'>{isAuthenticated ? authLinks : guestLinks}</ul>
      <Drawer
        title='Menu'
        placement='right'
        onClose={onClose}
        open={visible}
      >
        {isAuthenticated ? drawerAuthLinks : drawerGuestLinks}
      </Drawer>
    </nav>
  );
};

Navbar.propTypes = {
  logout: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  auth: state.auth
});

export default connect(mapStateToProps, { logout })(Navbar);
