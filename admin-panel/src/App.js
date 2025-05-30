// src/App.js
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './admin/Login';



import AdminLayout from './admin/AdminLayout';
import Dashboard from './admin/Dashboard';
import ProductList from './admin/ProductList';
import ProductDesign from './admin/ProductDesign';
import OrderList from './admin/OrderList';
import Setting from './admin/Setting';
import ProtectedRoute from './admin/ProtectedRoute';
import { AppProvider } from '@shopify/polaris';
function App() {
  return (
    <AppProvider i18n={{}}>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/admin/login" element={<Login />} />

          {/* Admin Pages with shared layout */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <AdminLayout><Dashboard /></AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/product-list"
            element={
              <ProtectedRoute>
                <AdminLayout><ProductList /></AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/orders"
            element={
              <ProtectedRoute>
                <AdminLayout><OrderList /></AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/setting"
            element={
              <ProtectedRoute>
                <AdminLayout><Setting /></AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/product-design"
            element={
              <ProtectedRoute>
                <AdminLayout><ProductDesign /></AdminLayout>
              </ProtectedRoute>
            }
          />
          {/* Add other pages similarly */}
        </Routes>
      </Router>
    </AppProvider>

  );
}

export default App;
