const validateFormAddPet = (formData) => {
  if (formData.name === '') {
    throw new Error('Por favor, rellene todos los campos');
  }
  if (formData.observations.length > 200) {
    throw new Error('Las observaciones no pueden superar los 200 caracteres');
  }
  if (formData.name.length > 20) {
    throw new Error('El nombre no puede superar los 20 caracteres');
  }
};

module.exports = validateFormAddPet;
