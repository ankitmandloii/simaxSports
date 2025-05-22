import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import AdminSidebar from './Sidebar/sidebar';
import ProductContainer from './ProductContainer';
import RedoundoComponent from './RedoundoComponent/redoundo';
import { setActiveProduct } from '../redux/ProductSlice/SelectedProductSlice';
import { useDispatch } from 'react-redux';

const Layout = () => {
  const location = useLocation();
  const isQuantityPage = location.pathname === "/quantity";
  const isProductPage = location.pathname === "/product";
  const dispatch = useDispatch();

  
 const handleSetActiveProduct = (product) => {
    dispatch(setActiveProduct(product));
  };


  return (

    <div className="layout-main-container">

      <div className="layout-container">

        <div className="page-content">
          <div className="layout-toolbar">
            {!isQuantityPage && <AdminSidebar />}
            <Outlet context={{ setActiveProduct: handleSetActiveProduct }}/>
            {!isQuantityPage && !isProductPage&&<RedoundoComponent />}
          </div>
          <ProductContainer />
        </div>
      </div>
    </div>
  );
};

export default Layout;
