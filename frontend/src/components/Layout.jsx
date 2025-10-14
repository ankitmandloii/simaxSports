import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import AdminSidebar from './Sidebar/sidebar';
import ProductContainer from './ProductContainer';
import Header from '../components/Header/Header.jsx'
import Footer from '../components/Footer/Footer.jsx'
import { useMediaQuery } from 'react-responsive'

const Layout = () => {
  // const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1023px)' })
  const isDesktopOrLaptop = useMediaQuery({ query: '(min-width: 1100px)' })
  const location = useLocation();
  const isQuantityPage = location.pathname === "/quantity" || location.pathname === '/review';
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1100px)' });

  // const isProductPage = location.pathname === "/product";



  return (
    <>
      <Header />

      <div className="layout-main-container">

        <div className="layout-container">

          <div className="page-content">
            {isDesktopOrLaptop && <div className="layout-toolbar">
              {!isQuantityPage && <AdminSidebar />}
              <Outlet />
            </div>}
            {(isTabletOrMobile && isQuantityPage) && <Outlet />}
            {!(isTabletOrMobile && isQuantityPage) && <ProductContainer />}
          </div>
        </div>
      </div>
      {!(isQuantityPage && isDesktopOrLaptop) && <Footer />}

    </>

  );
};

export default Layout;
