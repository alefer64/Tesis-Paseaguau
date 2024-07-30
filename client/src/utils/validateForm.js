const validateForm = (formData) => {
  if (!formData.nombre || formData.nombre.length > 50) {
    throw new Error('El nombre es obligatorio.');
  }
  if (!formData.dni || formData.dni.length !== 8) {
    throw new Error('El DNI es obligatorio.');
  }
  if (!formData.titulo || formData.titulo.length > 50) {
    throw new Error('El título es obligatorio.');
  }
  if (!formData.descripcion || formData.descripcion.length > 200) {
    throw new Error('La descripción no puede superar los 200 caracteres.');
  }
  if (!formData.ubicacion) {
    throw new Error('La ubicación es obligatoria.');
  }
  if (!formData.precio || formData.precio <= 0 || isNaN(formData.precio) || formData.precio === ''){
    throw new Error('El precio debe ser mayor a 0.');
  }
  if (!formData.aceptarTerminos) {
    throw new Error('Debes aceptar los términos y condiciones.');
  }
};

export default validateForm;
