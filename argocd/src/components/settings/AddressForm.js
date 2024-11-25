import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getAddress, updateAddress, deleteAddress } from '../../actions/settings';
import { Autocomplete, useLoadScript } from '@react-google-maps/api';
import GoogleMapReact from 'google-map-react';
import validateFormAddress from './validaciones/validateFormAddress';

const libraries = ['places'];

const barriosBuenosAires = [
  'Agronomía', 'Almagro', 'Balvanera', 'Barracas', 'Belgrano', 'Boedo', 'Caballito',
  'Chacarita', 'Coghlan', 'Colegiales', 'Constitución', 'Flores', 'Floresta', 'La Boca',
  'Liniers', 'Mataderos', 'Monserrat', 'Monte Castro', 'Nueva Pompeya', 'Núñez', 'Palermo',
  'Parque Avellaneda', 'Parque Chacabuco', 'Parque Chas', 'Parque Patricios', 'Paternal',
  'Puerto Madero', 'Recoleta', 'Retiro', 'Saavedra', 'San Cristóbal', 'San Nicolás', 'San Telmo',
  'Vélez Sarsfield', 'Versalles', 'Villa Crespo', 'Villa del Parque', 'Villa Devoto', 'Villa Gral. Mitre',
  'Villa Lugano', 'Villa Luro', 'Villa Ortúzar', 'Villa Pueyrredón', 'Villa Real', 'Villa Riachuelo',
  'Villa Santa Rita', 'Villa Soldati', 'Villa Urquiza'
];

const AddressForm = ({ getAddress, updateAddress, deleteAddress, address }) => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_google_maps_api_key,
    libraries
  });

  const [localidad, setLocalidad] = useState('');
  const [barrio, setBarrio] = useState('');
  const [calleNumero, setCalleNumero] = useState('');
  const [pisoDpto, setPisoDpto] = useState('');
  const [observacion, setObservacion] = useState('');
  const [position, setPosition] = useState({ lat: -34.603722, lng: -58.381592 });

  const [editMode, setEditMode] = useState(false);
  const [autocompleteLocalidad, setAutocompleteLocalidad] = useState(null);
  const [autocompleteDireccion, setAutocompleteDireccion] = useState(null);

  useEffect(() => {
    getAddress();
  }, [getAddress]);

  useEffect(() => {
    if (address) {
      setLocalidad(address.localidad || '');
      setBarrio(address.barrio || '');
      setCalleNumero(address.calle || '');
      setPisoDpto(address.pisoDpto || '');
      setObservacion(address.observacion || '');
      setPosition(address.position || { lat: -34.603722, lng: -58.381592 });
    }
  }, [address]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newAddress = { localidad, barrio, calle: calleNumero, pisoDpto, observacion, position };

    try {
      validateFormAddress(newAddress);
      updateAddress(newAddress);
      setEditMode(false);
      window.location.reload();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleDelete = () => {
    deleteAddress();
    window.location.reload();
  };

  const onLoadLocalidad = (autocomplete) => {
    setAutocompleteLocalidad(autocomplete);
  };

  const onLoadDireccion = (autocomplete) => {
    setAutocompleteDireccion(autocomplete);
  };

  const onPlaceChangedLocalidad = () => {
    if (autocompleteLocalidad !== null) {
      const place = autocompleteLocalidad.getPlace();
      const newLocalidad = place.address_components[0].long_name;
      setLocalidad(newLocalidad);
      if (newLocalidad === 'Buenos Aires, Ciudad Autónoma de Buenos Aires, Argentina' || newLocalidad === 'Buenos Aires') {
        setBarrio('');
      } else {
        setBarrio(null);
      }
      const location = place.geometry.location;
      setPosition({
        lat: location.lat(),
        lng: location.lng()
      });
    }
  };

  const onPlaceChangedDireccion = () => {
    if (autocompleteDireccion !== null) {
      const place = autocompleteDireccion.getPlace();
      setCalleNumero(place.formatted_address);
      setPosition({
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng()
      });
    }
  };

  const handleCalleNumeroChange = (e) => {
    setCalleNumero(e.target.value);
  };

  const updateMapPosition = () => {
    if (calleNumero) {
      const geocoder = new window.google.maps.Geocoder();
      const address = `${calleNumero}, ${barrio ? barrio + ',' : ''} ${localidad}, Argentina`;

      geocoder.geocode({ address }, (results, status) => {
        if (status === 'OK') {
          setPosition({
            lat: results[0].geometry.location.lat(),
            lng: results[0].geometry.location.lng()
          });
        }
      });
    }
  };


  if (!isLoaded) return <div>Loading...</div>;

  return (
    <section className='container'>
      <h1 className='large text-primary'>¿Dónde vives?</h1>
      {address && !editMode ? (
        <div>
          <div className='form-group'>
            <p><strong>Localidad: </strong>{localidad}</p>
            {(localidad === 'Buenos Aires, Ciudad Autónoma de Buenos Aires, Argentina' || localidad === 'Buenos Aires') && (
              <p><strong>Barrio: </strong>{barrio}</p>
            )}
            <p><strong>Dirección: </strong>{calleNumero}</p>
            {pisoDpto && <p><strong>Piso Dpto: </strong>{pisoDpto}</p>}
            {observacion && <p><strong>Observación: </strong>{observacion}</p>}
          </div>
          <div className='form-group'>
            <label>Ubicación en el mapa</label>
            <div style={{ height: '300px', width: '100%' }}>
              <GoogleMapReact
                bootstrapURLKeys={{ key: process.env.REACT_APP_google_maps_api_key }}
                center={position}
                defaultZoom={15}
              >
                <Marker lat={position.lat} lng={position.lng} />
              </GoogleMapReact>
            </div>
          </div>
          <div className='d-flex mt-2'>
            <button type='button' className='btn btn-primary mr-2' onClick={() => setEditMode(true)}>Modificar</button>
            <button type='button' className='btn btn-danger' onClick={handleDelete}>Eliminar</button>
          </div>
        </div>
      ) : (
        <div>
          {!address && !editMode ? (
            <button type='button' className='btn btn-primary mr-2' onClick={() => setEditMode(true)}>Nueva
              Dirección</button>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className='form-group'>
                <label>Localidad</label>
                <Autocomplete
                  onLoad={onLoadLocalidad}
                  onPlaceChanged={onPlaceChangedLocalidad}
                  options={{
                    types: ['(cities)'],
                    componentRestrictions: { country: 'AR' }
                  }}
                >
                  <input
                    type='text'
                    className='form-control'
                    value={localidad}
                    onChange={(e) => setLocalidad(e.target.value)}
                  />
                </Autocomplete>
              </div>
              {localidad === 'Buenos Aires, Ciudad Autónoma de Buenos Aires, Argentina' || localidad === 'Buenos Aires' ? (
                <div className='form-group'>
                  <label>Barrio</label>
                  <select
                    className='form-control'
                    value={barrio}
                    onChange={(e) => setBarrio(e.target.value)}
                  >
                    {barriosBuenosAires.map((barrio, index) => (
                      <option key={index} value={barrio}>{barrio}</option>
                    ))}
                  </select>
                </div>
              ) : null}
              <div className='form-group'>
                <label>Dirección</label>
                <Autocomplete
                  onLoad={onLoadDireccion}
                  onPlaceChanged={onPlaceChangedDireccion}
                  options={{
                    componentRestrictions: { country: 'AR' }
                  }}
                >
                  <input
                    type='text'
                    className='form-control'
                    placeholder='Calle y Número'
                    value={calleNumero}
                    onChange={handleCalleNumeroChange}
                    onBlur={updateMapPosition}
                  />
                </Autocomplete>
                <input
                  type='text'
                  className='form-control mt-2'
                  placeholder='Piso Dpto'
                  value={pisoDpto}
                  onChange={(e) => setPisoDpto(e.target.value)}
                />
                <input
                  type='text'
                  className='form-control mt-2'
                  placeholder='opcional: cómo llegar, calles cercanas, etc.'
                  value={observacion}
                  onChange={(e) => setObservacion(e.target.value)}
                />
              </div>
              <div className='form-group'>
                <label>Verifica tu posición en el mapa</label>
                <div style={{ height: '300px', width: '100%' }}>
                  <GoogleMapReact
                    bootstrapURLKeys={{ key: process.env.REACT_APP_google_maps_api_key }}
                    center={position}
                    defaultZoom={15}
                  >
                    <Marker lat={position.lat} lng={position.lng} />
                  </GoogleMapReact>
                </div>
                <p className='mt-2'>
                  Verifica tu posición en el mapa ya que los clientes buscan por ubicación. Si la posición es incorrecta
                  puedes moverla para corregir.
                </p>
              </div>
              <div className='d-flex'>
                <button type='submit' className='btn btn-primary mr-2'>Guardar</button>
                <button type='button' className='btn btn-secondary' onClick={() => setEditMode(false)}>Cancelar</button>
              </div>
            </form>
          )}
        </div>
      )}
    </section>
  );
};

AddressForm.propTypes = {
  getAddress: PropTypes.func.isRequired,
  updateAddress: PropTypes.func.isRequired,
  deleteAddress: PropTypes.func.isRequired,
  address: PropTypes.object
};

const mapStateToProps = (state) => ({
  address: state.settings.address
});

export default connect(mapStateToProps, { getAddress, updateAddress, deleteAddress })(AddressForm);

const Marker = () => (
  <div className='marker' style={{ backgroundColor: 'red', borderRadius: '50%', width: '10px', height: '10px' }} />
);
