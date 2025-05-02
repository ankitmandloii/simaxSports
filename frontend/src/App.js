import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
function App() {
  return (
    <>
    <div className='app-main-container'>

    <div className='main-inner-container'>
      
    <div className="sidebar-container">
        <AdminSidebar />
      </div>
      <div className='main-layout-container'>
      <Header />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<ProductToolbar  />} />
          <Route path='product' element={<ProductToolbar />} />
          <Route path="addText" element={<AddTextToolbar />} />
          <Route path="products" element={<ProductContainer />} />
          <Route path='uploadArt' element={<UploadArtToolbar/>}/>
        </Route>
        <Route path="review" element={<Review />} />
        {/* <Route path="design" element={<Design />} /> */}
      </Routes>
      <Footer/>

      </div>
      
    </div>
      </div>
      </>
  );
}

export default App;
