import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import Design from './pages/Design/Design';
import Review from './pages/Review/Review';
import ProductToolbar from './components/Toolbar/ProductToolbar/ProductToolbar';
import ProductContainer from './components/ProductContainer';
import AdminSidebar from './components/Sidebar/sidebar';
import AddTextToolbar from './components/Toolbar/AddTextToolbar/AddTextToolbar';
import Header from './components/Header/Header';
import './App.css'
import Footer from './components/Footer/Footer';
import UploadArtToolbar from './components/Toolbar/UploadArtToolbar/UploadArtToolbar';
import AddArtToolbar from './components/Toolbar/AddArtToolbar/AddArtToolbar';
import NamesToolbar from './components/Toolbar/NamesToolbar/NamesToolbar';
import QuantityToolbar from './components/Toolbar/QuantityToolbar/QuantityToolbar';
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
          <Route index element={<ProductToolbar  />} />
          <Route path='product' element={<ProductToolbar />} />
          <Route path="addText" element={<AddTextToolbar />} />
          <Route path="products" element={<ProductContainer />} />
          <Route path='uploadArt' element={<UploadArtToolbar/>}/>
          <Route path='addArt' element={<AddArtToolbar/>}/>
          <Route path='addNames' element={<NamesToolbar/>}/>
          <Route path='quantity' element={<QuantityToolbar/>}/>
        </Route>
        <Route path="review" element={<Review />} />
        {/* <Route path="design" element={<Design />} /> */}
      </Routes>
     {<Footer/> } 

      </div>
      
    </div>
      </div>
      </>
  );
}

export default App;

// import { Routes, Route, useLocation } from 'react-router-dom';
// import Layout from './components/Layout';
// import Design from './pages/Design/Design';
// import Review from './pages/Review/Review';
// import ProductToolbar from './components/Toolbar/ProductToolbar/ProductToolbar';
// import ProductContainer from './components/ProductContainer';
// import AdminSidebar from './components/Sidebar/sidebar';
// import AddTextToolbar from './components/Toolbar/AddTextToolbar/AddTextToolbar';
// import Header from './components/Header/Header';
// import './App.css'
// import Footer from './components/Footer/Footer';
// import UploadArtToolbar from './components/Toolbar/UploadArtToolbar/UploadArtToolbar';
// import AddArtToolbar from './components/Toolbar/AddArtToolbar/AddArtToolbar';
// import NamesToolbar from './components/Toolbar/NamesToolbar/NamesToolbar';

// function App() {
//   const location = useLocation();
//   const hideSidebar = location.pathname === "/quantity";

//   return (
//     <div className='app-main-container'>
//       <div className='main-inner-container'>
//         {!hideSidebar && (
//           <div className="sidebar-container">
//             <AdminSidebar />
//           </div>
//         )}
//         <div className='main-layout-container'>
//           <Header />
//           <Routes>
//             <Route path="/" element={<Layout />}>
//               <Route index element={<ProductToolbar />} />
//               <Route path="product" element={<ProductToolbar />} />
//               <Route path="addText" element={<AddTextToolbar />} />
//               <Route path="products" element={<ProductContainer />} />
//               <Route path="uploadArt" element={<UploadArtToolbar />} />
//               <Route path="addArt" element={<AddArtToolbar />} />
//               <Route path="addNames" element={<NamesToolbar />} />
//             </Route>
//             <Route path="review" element={<Review />} />
//             <Route path="quantity" element={<div>Quantity Page</div>} />
//           </Routes>
//           <Footer />
//         </div>
//       </div>
//     </div>
//   );
// }

// export default App;

