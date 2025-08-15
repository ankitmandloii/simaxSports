// src/App.js
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './admin/Login';



import AdminLayout from './admin/AdminLayout';

import ProductList from './admin/ProductList';
import ProductDesign from './admin/ProductDesign';
import OrderList from './admin/OrderList';

import ProtectedRoute from './admin/ProtectedRoute';
import { AppProvider } from '@shopify/polaris';
import GeneralSettings from './admin/settings/genaralSettings';
import AccountSettings from './admin/settings/AccountSettings';
import { ToastProvider } from './admin/ToastContext'; // Import the ToastProvider
import NotFound from './admin/NotFound';
import ActiveUsers from './admin/ActiveUsers';
import {Dashboard} from './admin/Dashboard';

function App() {
  return (
    <ToastProvider>
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
                  <AdminLayout><GeneralSettings /></AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/activeUsers"
              element={
                <ProtectedRoute>
                  <AdminLayout><ActiveUsers /></AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/setting/account-settings"
              element={
                <ProtectedRoute>
                  <AdminLayout><AccountSettings /></AdminLayout>
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
            <Route
              path="/admin/*"
              element={
                <ProtectedRoute>
                  <AdminLayout><NotFound /></AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="*"
              element={

                <NotFound />

              }
            />

            {/* Add other pages similarly */}
          </Routes>
        </Router>
      </AppProvider>
    </ToastProvider>

  );
}

export default App;
