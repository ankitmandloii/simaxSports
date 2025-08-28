// import { Navigate } from 'react-router-dom';

// export default function ProtectedRoute({ children }) {
//   const isLoggedIn = !!localStorage.getItem('admin-token');
//   return isLoggedIn ? children : <Navigate to="/" />;
// }


import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const [valid, setValid] = useState(null); // null = checking

  useEffect(() => {
    const token = localStorage.getItem('admin-token');
    if (!token) {
      setValid(false);
      return;
    }

    fetch(`${process.env.REACT_APP_BASE_URL}auth/validate`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (res.ok) setValid(true);
        else throw new Error();
      })
      .catch(() => {
        localStorage.removeItem('admin-token');
        setValid(false);
      });
  }, []);

  if (valid === null) return null; // or a loader/spinner
  return valid ? children : <Navigate to="/admin/login" />;
}
