import { Navigate } from 'react-router-dom';

const isAdmin = (user) => {
  if (!user || !user.isAdmin) {
    return <Navigate to="/dashboard" />;
  }
};

export default isAdmin;
