import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const isLoggedIn = !!localStorage.getItem('admin-token');
  return isLoggedIn ? children : <Navigate to="/admin/login" />;
}
