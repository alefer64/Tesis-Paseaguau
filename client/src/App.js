import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import AppFooter from './components/layout/Footer';
import Landing from './components/layout/Landing';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Alert from './components/layout/Alert';
import Dashboard from './components/dashboard/Dashboard';
import Pets from './components/pets/Pets';
import NotFound from './components/layout/NotFound';
import PrivateRoute from './components/routing/PrivateRoute';
import AdminPanel from './components/admin/AdminPanel';
import MiPerfil from './components/paseador/MiPerfil';
import { LOGOUT } from './actions/types';

import { Provider } from 'react-redux';
import store from './store';
import { loadUser } from './actions/auth';
import setAuthToken from './utils/setAuthToken';

import './App.css';
import Settings from './components/settings/Settings';
import PaseadorForm from './components/paseador/PaseadorForm';
import AdminRoute from './components/routing/AdminRoute';
import PaseadorRoute from './components/routing/PaseadorRoute';
import ForgotPassword from './components/auth/ForgotPassword';
import ResetPassword from './components/auth/ResetPassword';
import ChangePassword from './components/settings/ChangePassword';
import PersonalDetailsForm from './components/settings/PersonalDetailsForm';
import Pricing from './components/settings/Pricing';
import WalkerProfileForm from './components/settings/WalkerProfileForm';
import Perfil from './components/paseador/Perfil';
import UpdateAddress from './components/settings/AddressForm';
import Gallery from './components/settings/Gallery';
import HistorialPagos from './components/settings/HistorialPagos';
import PaymentSuccess from './components/payments/PaymentSuccess';
import PaymentFailure from './components/payments/PaymentFailure';
import paymentPending from './components/payments/PaymentPending';
import Chat from './components/chat/Chat';
import SearchWalkers from './components/reservas/SearchWalkers';
import HorarioSettings from './components/settings/HorarioSettings';
import Premium from './components/settings/Premium';
import FAQ from './components/settings/FAQ';
import Contact from './components/settings/Contact';

const App = () => {
  useEffect(() => {
    if (localStorage.token) {
      setAuthToken(localStorage.token);
    }
    store.dispatch(loadUser());
    window.addEventListener('storage', () => {
      if (!localStorage.token) store.dispatch({ type: LOGOUT });
    });
  }, []);

  return (
    <Provider store={store}>
      <Router>
        <div className='App'>
          <Navbar />
          <Alert />
          <div className='content'>
            <Routes>
              <Route path='/' element={<Landing />} />
              <Route path='register' element={<Register />} />
              <Route path='login' element={<Login />} />
              <Route path='recuperar' element={<ForgotPassword />} />
              <Route path='reset-password/:token' element={<ResetPassword />} />
              <Route path='dashboard' element={<PrivateRoute component={Dashboard} />} />
              <Route path='settings' element={<PrivateRoute component={Settings} />} />
              <Route path='settings/changepassword' element={<PrivateRoute component={ChangePassword} />} />
              <Route path='settings/personal-details' element={<PrivateRoute component={PersonalDetailsForm} />} />
              <Route path='settings/pricing' element={<PaseadorRoute component={Pricing} />} />
              <Route path='settings/availability' element={<PaseadorRoute component={HorarioSettings} />} />
              <Route path='settings/profile' element={<PrivateRoute component={WalkerProfileForm} />} />
              <Route path='settings/updateaddress' element={<PrivateRoute component={UpdateAddress} />} />
              <Route path='settings/gallery' element={<PrivateRoute component={Gallery} />} />
              <Route path='settings/premium' element={<PrivateRoute component={Premium} />} />
              <Route path='settings/historialpagos' element={<PrivateRoute component={HistorialPagos} />} />
              <Route path='settings/faq' element={<PrivateRoute component={FAQ} />} />
              <Route path='settings/contacto' element={<PrivateRoute component={Contact} />} />
              <Route path='/chats' element={<PrivateRoute component={Chat} />} />
              <Route path='/chats/:chatId' element={<PrivateRoute component={Chat} />} />
              <Route path='pets' element={<PrivateRoute component={Pets} />} />
              <Route path='solicitudpaseador' element={<PrivateRoute component={PaseadorForm} />} />
              <Route path='perfil/:id' element={<PrivateRoute component={Perfil} />} />
              <Route path='admin' element={<AdminRoute component={AdminPanel} />} />
              <Route path='reservapaseo' element={<PrivateRoute component={SearchWalkers} />} />
              <Route path='miperfil' element={<PaseadorRoute component={MiPerfil} />} />
              <Route path='settings/success/:transactionId' element={<PrivateRoute component={PaymentSuccess} />} />
              <Route path='settings/failure/:transactionId' element={<PrivateRoute component={PaymentFailure} />} />
              <Route path='settings/pending/:transactionId' element={<PrivateRoute component={paymentPending} />} />
              <Route path='/*' element={<NotFound />} />
            </Routes>
          </div>
          <AppFooter />
        </div>
      </Router>
    </Provider>
  );
};

export default App;
