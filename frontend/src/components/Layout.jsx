import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import AdminSidebar from './Sidebar/sidebar';
import Header from './Header/Header';
import ProductContainer from './ProductContainer';
import RedoundoComponent from './RedoundoComponent/redoundo';

const Layout = () => {
   const location = useLocation();
  const isQuantityPage = location.pathname === "/quantity";
  return (
    
    <div className="layout-main-container">
    
      <div className="layout-container">
  
        <div className="page-content">
          <div className="layout-toolbar">
           {!isQuantityPage && <AdminSidebar />}
            <Outlet /> 
            {!isQuantityPage &&  <RedoundoComponent/>}
          </div>
          <ProductContainer/>
        </div>
      </div>
    </div>
  );
};

export default Layout;
