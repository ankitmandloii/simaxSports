import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import AdminSidebar from './Sidebar/sidebar';
import ProductContainer from './ProductContainer';

import { useMediaQuery } from 'react-responsive'

const Layout = () => {
  // const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1023px)' })
  const isDesktopOrLaptop = useMediaQuery({ query: '(min-width: 1200px)' })
  const location = useLocation();
  const isQuantityPage = location.pathname === "/quantity";
  // const isProductPage = location.pathname === "/product";



  return (

    <div className="layout-main-container">

      <div className="layout-container">

        <div className="page-content">
          {isDesktopOrLaptop && <div className="layout-toolbar">
            {!isQuantityPage && <AdminSidebar />}
            <Outlet />
          </div>}
          <ProductContainer />
        </div>
      </div>
    </div>
  );
};

export default Layout;
