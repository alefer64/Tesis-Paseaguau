import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { searchProfilesByLocality, getProfiles } from '../../actions/profile';
import GoogleMapReact from 'google-map-react';
import './css/SearchWalkers.css';
import { Autocomplete, useLoadScript } from '@react-google-maps/api';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { StarFilled } from '@ant-design/icons';

const libraries = ['places', 'geometry'];

const SearchWalkers = ({ searchProfilesByLocality, profiles, auth }) => {
  const [localidad, setLocalidad] = useState('');
  const [position, setPosition] = useState({ lat: -34.603722, lng: -58.381592 });
  const [loading, setLoading] = useState(false);
  const [autocompleteLocalidad, setAutocompleteLocalidad] = useState(null);
  const [noLocalidadMessage, setNoLocalidadMessage] = useState('');
  const [polygon, setPolygon] = useState(null);
  const mapRef = useRef(null);
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_google_maps_api_key,
    libraries
  });

  useEffect(() => {
    const fetchUserLocalidad = async () => {
      if (auth.user) {
        try {
          const res = await api.get('/settings/direccion');
          if (res.data && res.data.localidad) {
            setLocalidad(res.data.localidad);
            await handleSearch(res.data.localidad);
          } else {
            setNoLocalidadMessage('No tiene una localidad registrada, por favor actualice su perfil.');
          }
        } catch (err) {
          console.error(err);
          setNoLocalidadMessage('No tiene una localidad registrada, por favor actualice su perfil.');
        }
      }
    };

    fetchUserLocalidad();
  }, [auth.user]);

  const handleSearch = async (localidadParam) => {
    setLoading(true);
    await searchProfilesByLocality(localidadParam || localidad);
    setLoading(false);

    if (mapRef.current && (localidadParam || localidad)) {
      const searchAddress = localidadParam || localidad;

      if (searchAddress.toLowerCase() === 'buenos aires') {
        const barrio = profiles.length > 0 && profiles[0].direccion ? profiles[0].direccion.barrio : '';
        if (barrio) {
          const geocoder = new window.google.maps.Geocoder();
          geocoder.geocode({ address: `${barrio}, Buenos Aires` }, (results, status) => {
            if (status === 'OK' && results[0]) {
              const location = results[0].geometry.location;
              setPosition({ lat: location.lat(), lng: location.lng() });
              drawPolygon(results[0].geometry.viewport);
            } else {
              console.error('Geocode was not successful for the following reason: ' + status);
            }
          });
        }
      } else {
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ address: searchAddress }, (results, status) => {
          if (status === 'OK' && results[0]) {
            const location = results[0].geometry.location;
            setPosition({ lat: location.lat(), lng: location.lng() });
            drawPolygon(results[0].geometry.viewport);
          } else {
            console.error('Geocode was not successful for the following reason: ' + status);
          }
        });
      }
    }
  };

  const handleLocalidadChange = (e) => {
    setLocalidad(e.target.value);
    setNoLocalidadMessage('');
  };

  const onLoadLocalidad = (autocomplete) => {
    setAutocompleteLocalidad(autocomplete);
  };

  const onPlaceChangedLocalidad = () => {
    if (autocompleteLocalidad !== null) {
      const place = autocompleteLocalidad.getPlace();
      const newLocalidad = place.address_components[0].long_name;
      setLocalidad(newLocalidad);
      const location = place.geometry.location;
      setPosition({
        lat: location.lat(),
        lng: location.lng()
      });
    }
  };

  const drawPolygon = (viewport) => {
    if (polygon) {
      polygon.setMap(null);
    }

    const bounds = [
      { lat: viewport.getNorthEast().lat(), lng: viewport.getNorthEast().lng() },
      { lat: viewport.getNorthEast().lat(), lng: viewport.getSouthWest().lng() },
      { lat: viewport.getSouthWest().lat(), lng: viewport.getSouthWest().lng() },
      { lat: viewport.getSouthWest().lat(), lng: viewport.getNorthEast().lng() }
    ];

    const newPolygon = new window.google.maps.Polygon({
      paths: bounds,
      strokeColor: '#FF0000',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: 'rgba(255,255,255,0)',
      fillOpacity: 0.35,
      editable: false,
      draggable: false
    });

    newPolygon.setMap(mapRef.current);
    setPolygon(newPolygon);
  };

  useEffect(() => {
    if (profiles && profiles.length > 0) {
      const firstProfilePosition = profiles[0].direccion ? profiles[0].direccion.position : {
        lat: -34.603722,
        lng: -58.381592
      };
      setPosition({
        lat: firstProfilePosition.lat,
        lng: firstProfilePosition.lng
      });
    }
  }, [profiles]);

  if (!isLoaded) return <div>Loading...</div>;

  const sortedProfiles = profiles.filter(profile => profile.precio !== 0).sort((a, b) => b.user.premium - a.user.premium);

  return (
    <section className="container-fluid">
      <h1 className="large text-primary">Buscar Paseadores</h1>
      <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }} className="form">
        <div className="form-group">
          <label htmlFor="localidad">Localidad</label>
          <Autocomplete
            onLoad={onLoadLocalidad}
            onPlaceChanged={onPlaceChangedLocalidad}
            options={{
              types: ['(cities)'],
              componentRestrictions: { country: 'AR' }
            }}
          >
            <input
              type="text"
              className="form-control"
              value={localidad}
              onChange={handleLocalidadChange}
            />
          </Autocomplete>
          {noLocalidadMessage && (
            <div className="alert alert-danger mt-2" role="alert">
              <i className="fas fa-exclamation-triangle"></i> {noLocalidadMessage}
            </div>
          )}
        </div>
        <button type="submit" className="btn btn-primary">Buscar</button>
      </form>
      <div className="row mt-4">
        <div className="col-md-6" style={{ height: '100vh', overflowY: 'auto' }}>
          <div className="profiles-list">
            {loading ? (
              <p>Cargando...</p>
            ) : sortedProfiles.length > 0 ? (
              sortedProfiles.map(profile => (
                <div key={profile._id} className="profile">
                  <div className="profile-img-container">
                    <img src={ process.env.REACT_APP_IMG_URL + profile.foto} alt={profile.nombre} className="profile-img" />
                    <p className="profile-price">${profile.precio}/paseo</p>
                    {profile.user.premium && (
                      <div className="premium-badge">
                        <StarFilled style={{ color: '#FFD700' }} />
                        <span>Usuario Premium</span>
                      </div>
                    )}
                  </div>
                  <div className="profile-details">
                    <h2>{profile.nombre}</h2>
                    <p className="profile-title">{profile.titulo}</p>
                    <p className="profile-description">{profile.descripcion}</p>
                    <p className="profile-location">{profile.direccion ? profile.direccion.localidad : 'Sin dirección'}</p>
                    <Link to={`/perfil/${profile.user._id}`} className="btn btn-primary">Ver perfil</Link>
                  </div>
                </div>
              ))
            ) : (
              <p>No se encontraron paseadores en esta localidad</p>
            )}
          </div>
        </div>
        <div className="col-md-6">
          <div className="map" style={{ height: '100vh', position: 'sticky', top: 0 }}>
            <GoogleMapReact
              bootstrapURLKeys={{ key: process.env.REACT_APP_google_maps_api_key }}
              center={position}
              defaultZoom={15}
              yesIWantToUseGoogleMapApiInternals
              onGoogleApiLoaded={({ map, maps }) => mapRef.current = map}
            >
              {sortedProfiles.map(profile => (
                profile.direccion && profile.direccion.position && (
                  <Marker
                    key={profile._id}
                    lat={profile.direccion.position.lat}
                    lng={profile.direccion.position.lng}
                  />
                )
              ))}
            </GoogleMapReact>
          </div>
        </div>
      </div>
    </section>
  );
};

const Marker = ({ lat, lng }) => (
  <div
    className="marker"
    style={{ backgroundColor: 'red', borderRadius: '50%', width: '10px', height: '10px' }}
    lat={lat}
    lng={lng}
  ></div>
);

SearchWalkers.propTypes = {
  searchProfilesByLocality: PropTypes.func.isRequired,
  getProfiles: PropTypes.func.isRequired,
  profiles: PropTypes.array.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  profiles: state.profile.profiles,
  auth: state.auth
});

export default connect(mapStateToProps, { searchProfilesByLocality, getProfiles })(SearchWalkers);
