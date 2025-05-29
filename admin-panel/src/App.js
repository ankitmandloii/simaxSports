import { AppProvider } from '@shopify/polaris';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from '../src/admin/Login';
import Signup from '../src/admin/Signup';
import Dashboard from '../src/admin/Dashboard';
import ProtectedRoute from '../src/admin/ProtectedRoute';



function App() {
  return (
    <AppProvider i18n={{}}>
    <Router>
        <Routes>
         
          <Route path="/" element={<Login />} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<Login />} />
          {/* <Route path="/admin/signup" element={<Signup />} /> */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;
