import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './Sidebar/sidebar';
import Header from './Header/Header';
import ProductContainer from './ProductContainer';

const Layout = () => {
  return (
    <div className="layout-main-container">
    
      <div className="layout-container">
  
        <div className="page-content">
          <div className="layout-toolbar">
          <Outlet /> 
          </div>
          <ProductContainer/>
        </div>
      </div>
    </div>
  );
};

export default Layout;
