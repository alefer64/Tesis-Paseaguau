import React, { useState } from 'react';
import { connect } from 'react-redux';
import { uploadBanner, deleteBanner } from '../../actions/settings';
import { Button, message, Upload, Tooltip } from 'antd';
import { UploadOutlined, DeleteOutlined } from '@ant-design/icons';
import './css/BannerUpload.css';

const BannerUpload = ({ uploadBanner, deleteBanner, profile }) => {
  const [loading, setLoading] = useState(false);

  const handleUpload = async (file) => {
    const formData = new FormData();
    formData.append('banner', file);
    setLoading(true);
    try {
      await uploadBanner(formData);
      message.success('Banner subido correctamente');

    } catch (error) {
      message.error('Error al subir el banner');
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteBanner();
      message.success('Banner eliminado correctamente');
    } catch (error) {
      message.error('Error al eliminar el banner');
    }
    setLoading(false);
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

  return (
    <div className='banner-upload-container'>
      {profile.banner ? (
        <div className='banner-preview'>
          <img src={`${process.env.REACT_APP_IMG_URL}${profile.banner}`} alt='Banner' className='banner-image' />
          <Tooltip title='Eliminar Banner'>
            <Button
              icon={<DeleteOutlined />}
              onClick={handleDelete}
              loading={loading}
              shape='circle'
              type='danger'
              className='banner-delete-button'
            />
          </Tooltip>
        </div>
      ) : (
        <Upload
          name='banner'
          showUploadList={false}
          beforeUpload={beforeUpload}
          className='banner-upload'
        >
          <Button icon={<UploadOutlined />} loading={loading}>
            Subir Banner
          </Button>
        </Upload>
      )}
    </div>
  );
};

const mapStateToProps = (state) => ({
  profile: state.profile.profile
});

export default connect(mapStateToProps, { uploadBanner, deleteBanner })(BannerUpload);
