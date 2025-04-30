import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Design from './pages/Design/Design';
import Review from './pages/Review/Review';
import Product from './components/Product';
import AddText from './components/addText';
import ProductContainer from './components/ProductContainer';
import AdminSidebar from './components/Sidebar/sidebar';
import Header from './components/Header/Header';
import './App.css'
import Footer from './components/Footer/Footer';
function App() {
  return (
    <>
    <div className='main-container'>

 
      <div className="sidebar-container">
        <AdminSidebar />
      </div>
      <div className='layout-container'>
      <Header />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Product />} />
          <Route path='product' element={<Product />} />
          <Route path="addText" element={<AddText />} />
          <Route path="products" element={<ProductContainer />} />
        </Route>
        <Route path="review" element={<Review />} />
        {/* <Route path="design" element={<Design />} /> */}
      </Routes>
      <Footer/>

      </div>
      
      </div>
      </>
  );
}

export default App;
