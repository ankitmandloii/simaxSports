// import { Navigate } from 'react-router-dom';

// export default function ProtectedRoute({ children }) {
//   const isLoggedIn = !!localStorage.getItem('admin-token');
//   return isLoggedIn ? children : <Navigate to="/" />;
// }
// src/admin/ProtectedRoute.jsx
import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const [valid, setValid] = useState(null);
  const location = useLocation();
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  useEffect(() => {
    let abort = false;
    const token = localStorage.getItem('admin-token');

    if (!token) {
      setValid(false);
      return;
    }

    fetch(`${BASE_URL}auth/validate`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (abort) return;
        if (res.ok) setValid(true);
        else throw new Error();
      })
      .catch(() => {
        localStorage.removeItem('admin-token');
        setValid(false);
      });

    return () => { abort = true; };
  }, [location.pathname, BASE_URL]); // re-check on route change

  if (valid === null) return null; // or render a lightweight spinner
  return valid ? children : <Navigate to="/admin/login" replace />;
}
