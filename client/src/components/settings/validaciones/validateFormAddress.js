const validateFormAddress = (formData) => {
  if (!formData.localidad || formData.localidad === 'Seleccione una localidad') {
    throw new Error('La localidad es obligatoria');
  }
  if (formData.localidad === "Buenos Aires, Ciudad Autónoma de Buenos Aires, Argentina" || formData.localidad === "Buenos Aires") {
    if (!formData.barrio) {
      throw new Error('El barrio es obligatorio para Buenos Aires');
    }
  }
  if (!formData.calle) {
    throw new Error('La calle es obligatoria');
  }
  if (formData.calle.length > 100) {
    throw new Error('La calle no puede superar los 100 caracteres');
  }
  if (formData.pisoDpto && formData.pisoDpto.length > 50) {
    throw new Error('El piso/departamento no puede superar los 50 caracteres');
  }
  if (formData.observacion && formData.observacion.length > 200) {
    throw new Error('La observación no puede superar los 200 caracteres');
  }
};

export default validateFormAddress;
