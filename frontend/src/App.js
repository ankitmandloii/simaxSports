import { Routes, Route, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import Review from './pages/Review/Review';
import ProductToolbar from './components/Toolbar/ProductToolbar/ProductToolbar';
import ProductContainer from './components/ProductContainer';
import AddTextToolbar from './components/Toolbar/AddTextToolbar/AddTextToolbar';
import Header from './components/Header/Header';
import './App.css'
import Footer from './components/Footer/Footer';
import UploadArtToolbar from './components/Toolbar/UploadArtToolbar/UploadArtToolbar';
import AddArtToolbar from './components/Toolbar/AddArtToolbar/AddArtToolbar';
import NamesToolbar from './components/Toolbar/NamesToolbar/NamesToolbar';
import QuantityToolbar from './components/Toolbar/QuantityToolbar/QuantityToolbar';
import AddImageToolbar from './components/Toolbar/AddImageToolbar/AddImageToolbar';
import { ToastContainer } from 'react-toastify';

function App() {
  const location = useLocation();
  const isQuantityPage = location.pathname === "/quantity";

  return (
    <>
      <div className='app-main-container'>
        <div className='main-inner-container'>
          {/* {!isQuantityPage && (
          <div className="sidebar-container">
            <AdminSidebar />
          </div>
        )} */}
          <Header />
          <div className={`main-layout-container ${isQuantityPage ? 'quantity-page' : ''}`}>

            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<ProductToolbar />} />
                <Route path='product' element={<ProductToolbar />} />
                <Route path="addText" element={<AddTextToolbar />} />
                <Route path="addImage" element={<AddImageToolbar />} />
                <Route path="products" element={<ProductContainer />} />
                <Route path='uploadArt' element={<UploadArtToolbar />} />
                <Route path='addArt' element={<AddArtToolbar />} />
                <Route path='addNames' element={<NamesToolbar />} />
                <Route path='quantity' element={<QuantityToolbar />} />
              </Route>
              <Route path="review" element={<Review />} />

            </Routes>
            {<Footer />}

          </div>

        </div>
         <ToastContainer 
        position="bottom-center" // or 'top-center', 'bottom-left', etc.
        autoClose={3000}     // time in ms
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="light" // or "dark", "colored"
      />
      </div>
    </>
  );
}

export default App;
