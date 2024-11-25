import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { uploadPhoto, deletePhoto } from '../../actions/settings';
import { getCurrentProfile } from '../../actions/profile';
import { Upload, Button, Card, Row, Col, message, Tooltip } from 'antd';
import { UploadOutlined, DeleteOutlined } from '@ant-design/icons';
import './css/Gallery.css';
import BannerUpload from './BannerUpload';

const Gallery = ({ getCurrentProfile, uploadPhoto, deletePhoto, profile: { profile, loading }, user }) => {
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    getCurrentProfile();
  }, [getCurrentProfile]);

  useEffect(() => {
    if (profile && profile.galeriaFotos) {
      setFileList(profile.galeriaFotos.map((foto, index) => ({
        uid: index,
        name: `foto-${index}`,
        status: 'done',
        url: foto.replace(/\\/g, '\\'),
      })));
    }
  }, [profile]);

  const handleUpload = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    try {
      await uploadPhoto(formData);
      message.success(`${file.name} se ha subido correctamente.`);
      getCurrentProfile();
    } catch (error) {
      message.error(`Error al subir ${file.name}.`);
    }
  };

  const handleDelete = async (url) => {
    try {
      await deletePhoto(url);
      message.success(`Foto eliminada.`);
      setFileList(prevFileList => prevFileList.filter(file => file.url !== url));
      getCurrentProfile();
    } catch (error) {
      message.error(`Error al eliminar la foto.`);
    }
  };

  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('Solo puedes subir archivos JPG/PNG!');
      return false;
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('La imagen debe ser menor a 2MB!');
      return false;
    }
    handleUpload(file);
    return false;
  };

  if (loading || !profile) {
    return <div>Loading...</div>;
  }

  const maxPhotos = user.premium ? 12 : 3;

  return (
    <div className="gallery-container">
      <h2>Galería de Fotos</h2>
      {user.premium && <BannerUpload />}
      <Row gutter={[16, 16]} className="gallery-row">
        {fileList.map((file, index) => (
          <Col xs={24} sm={12} md={6} lg={4} key={index}>
            <Card
              className="gallery-card"
              cover={
                <Tooltip title={`Foto ${index + 1}`}>
                  <img alt={`foto-${index}`} src={ process.env.REACT_APP_IMG_URL + file.url} className="gallery-image" />
                </Tooltip>
              }
              actions={[
                <Tooltip title="Eliminar Foto">
                  <Button icon={<DeleteOutlined />} onClick={() => handleDelete(file.url)} />
                </Tooltip>
              ]}
            />
          </Col>
        ))}
        {fileList.length < maxPhotos && (
          <Col xs={24} sm={12} md={6} lg={4} key={`upload-${fileList.length}`}>
            <Card className="gallery-card">
              <Upload
                name="avatar"
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                beforeUpload={beforeUpload}
              >
                <div>
                  <UploadOutlined />
                  <div style={{ marginTop: 8 }}>Subir Foto</div>
                </div>
              </Upload>
            </Card>
          </Col>
        )}
      </Row>
    </div>
  );
};

Gallery.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  uploadPhoto: PropTypes.func.isRequired,
  deletePhoto: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  profile: state.profile,
  user: state.auth.user
});

export default connect(mapStateToProps, { getCurrentProfile, uploadPhoto, deletePhoto })(Gallery);
