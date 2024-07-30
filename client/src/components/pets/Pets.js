import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getCurrentPets, deletePet, addPet, editPet } from '../../actions/pets';
import validateFormAddPet from './validateFormAddPet';
import { Row, Col, Card, Button, Input, Select, message, Modal, Space } from 'antd';
import './css/Pets.css';
const { Option } = Select;

const Pets = ({ getCurrentPets, deletePet, addPet, editPet, pet }) => {
  const [formData, setFormData] = useState({
    name: '',
    photo: '',
    breed: '',
    size: 'Pequeño',
    sex: 'Macho',
    ageNumber: 0,
    ageUnit: 'Años',
    observations: ''
  });

  const [mascotas, setMascotas] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editPetId, setEditPetId] = useState(null);

  useEffect(() => {
    getCurrentPets();
  }, [getCurrentPets]);

  useEffect(() => {
    if (Array.isArray(pet.mascotas)) {
      setMascotas(pet.mascotas);
    }
  }, [pet.mascotas]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'photo') {
      setFormData({ ...formData, photo: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      validateFormAddPet(formData);
      const formPayload = new FormData();
      for (const key in formData) {
        formPayload.append(key, formData[key]);
      }

      if (editMode) {
        await editPet(editPetId, formPayload);
        setEditMode(false);
        setEditPetId(null);
      } else {
        await addPet(formPayload);
      }

      setFormData({
        name: '',
        photo: '',
        breed: '',
        size: 'Pequeño',
        sex: 'Macho',
        ageNumber: 0,
        ageUnit: 'Años',
        observations: ''
      });
      setFormVisible(false);
      getCurrentPets();
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDelete = (petId) => {
    setConfirmDelete(petId);
  };

  const handleConfirmDelete = async (petId) => {
    try {
      await deletePet(petId);
      setConfirmDelete(null);
      message.success('Mascota eliminada');
    } catch (error) {
      console.error(error);
      message.error('Error al eliminar la mascota');
    }
  };

  const handleCancelDelete = () => {
    setConfirmDelete(null);
  };

  const handleEdit = (mascota) => {
    setFormData({
      name: mascota.name,
      photo: '',
      breed: mascota.breed,
      size: mascota.size,
      sex: mascota.sex,
      ageNumber: mascota.ageNumber,
      ageUnit: mascota.ageUnit,
      observations: mascota.observations,
      petId: mascota._id
    });
    setEditMode(true);
    setEditPetId(mascota._id);
    setFormVisible(true);
  };

  return (
    <section className='container'>
      <div>
        <h3>Mis Mascotas:</h3>
        <Row gutter={[16, 16]}>
          {mascotas.map((mascota) => (
            <Col xs={24} md={12} lg={8} key={mascota._id}>
              <Card
                cover={<img alt={mascota.name} src={ process.env.REACT_APP_IMG_URL + mascota.image} />}
                actions={[
                  confirmDelete === mascota._id ? (
                    <div>
                      <p>¿Estás seguro de borrar esta mascota?</p>
                      <Button onClick={() => handleConfirmDelete(mascota._id)} type='primary'>
                        Confirmar
                      </Button>
                      <Button onClick={handleCancelDelete} type='danger'>
                        Cancelar
                      </Button>
                    </div>
                  ) : (
                    <>
                      <Button onClick={() => handleDelete(mascota._id)}>Eliminar</Button>
                      <Button onClick={() => handleEdit(mascota)}>Editar</Button>
                    </>
                  )
                ]}
              >
                <Card.Meta title={mascota.name} description={`Raza: ${mascota.breed}`} />
                <br/>
                <p>Tamaño: {mascota.size}</p>
                <p>Sexo: {mascota.sex}</p>
                <p>Edad: {mascota.ageNumber} {mascota.ageUnit}</p>
                <p>Observaciones: {mascota.observations}</p>
              </Card>
            </Col>
          ))}
        </Row>
        {mascotas.length < 3 && (
          <Button
            onClick={() => setFormVisible(true)}
            type='primary'
            style={{ marginTop: '20px' }}
          >
            Agregar Mascota
          </Button>
        )}
        <Modal
          title={editMode ? 'Editar Mascota' : 'Registrar Mascota'}
          open={formVisible}
          onCancel={() => setFormVisible(false)}
          footer={null}
        >
          <form onSubmit={handleSubmit}>
            <label>
              Nombre:
              <br />
              <Input
                type='text'
                name='name'
                value={formData.name}
                onChange={handleChange}
                required
              />
            </label>
            <br />
            <label>
              Foto:
              <br />
              <Input
                type='file'
                name='photo'
                accept='image/*'
                onChange={handleChange}
                required={!editMode}
              />
            </label>
            <br />
            <label>
              Raza:
              <br />
              <Input
                type='text'
                name='breed'
                value={formData.breed}
                onChange={handleChange}
                required
              />
            </label>
            <br />
            <label>
              Tamaño:
              <br />
              <Select
                name='size'
                value={formData.size}
                onChange={(value) => setFormData({ ...formData, size: value })}
                required
              >
                <Option value='Pequeño'>Pequeño</Option>
                <Option value='Mediano'>Mediano</Option>
                <Option value='Grande'>Grande</Option>
              </Select>
            </label>
            <br />
            <label>
              Sexo:
              <br />
              <Select
                name='sex'
                value={formData.sex}
                onChange={(value) => setFormData({ ...formData, sex: value })}
                required
              >
                <Option value='Macho'>Macho</Option>
                <Option value='Hembra'>Hembra</Option>
              </Select>
            </label>
            <br />
            <label>
              Edad:
              <br />
              <Space.Compact>
                <Input
                  style={{ width: '50%' }}
                  type='number'
                  name='ageNumber'
                  value={formData.ageNumber}
                  onChange={handleChange}
                  min='0'
                  max='20'
                  required
                />
                <Select
                  style={{ width: '50%' }}
                  name='ageUnit'
                  value={formData.ageUnit}
                  onChange={(value) => setFormData({ ...formData, ageUnit: value })}
                  required
                >
                  <Option value='Años'>Años</Option>
                  <Option value='Meses'>Meses</Option>
                </Select>
              </Space.Compact>
            </label>
            <br />
            <label>
              Observaciones:
              <br />
              <Input.TextArea
                name='observations'
                value={formData.observations}
                onChange={handleChange}
                required
                style={{ minHeight: '100px' }}
              />
            </label>
            <br />
            <Button type='primary' htmlType='submit'>
              {editMode ? 'Guardar Cambios' : 'Registrar'}
            </Button>
          </form>
          {error && <div className='error'>{error}</div>}
        </Modal>
      </div>
    </section>
  );
};

Pets.propTypes = {
  getCurrentPets: PropTypes.func.isRequired,
  deletePet: PropTypes.func.isRequired,
  addPet: PropTypes.func.isRequired,
  editPet: PropTypes.func.isRequired,
  pet: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  pet: state.pet,
  auth: state.auth
});

export default connect(mapStateToProps, { getCurrentPets, deletePet, addPet, editPet })(Pets);
