import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './Sidebar/sidebar';
import Header from './Header/Header';
import ProductContainer from './ProductContainer';

const Layout = () => {
  return (
    <div className="main-container">
    
      <div className="layout-container">
  
        <div className="page-content">
          <Outlet /> 
          <ProductContainer/>
        </div>
      </div>
    </div>
  );
};

export default Layout;
