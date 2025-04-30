// import React from 'react'
// import './Footer.css'
// import { IoShareSocialOutline } from "react-icons/io5";

// const Footer = () => {
//   return (
//     <div className='footer-container '>
//       <div className="footer-content">
//       <button className="btn">
//       <IoShareSocialOutline style={{ marginRight: '8px' }} />
//       Home
//     </button>
// <div className="btn-footer">
// <button className="btn">
// <IoShareSocialOutline style={{ marginRight: '8px' }} />
//       Home
//     </button>
//     <button className="btn">
//     <IoShareSocialOutline style={{ marginRight: '8px' }} />
//       Home
//     </button>
//     <button className="btn">
//     <IoShareSocialOutline style={{ marginRight: '8px' }} />
//       Home
//     </button>
// </div>
//       </div>
   

//     </div>
//   )
// }

// export default Footer


import React from 'react';
import '../Header/Header';
import { Link, useLocation } from 'react-router-dom';
import { TbCircleNumber1Filled } from "react-icons/tb";


const Header = () => {
  const location = useLocation();

  return (
    <header className="app-footer">
      <div className="left-section">
        {/* <img src={logo} alt="SIMAX" className="logo" /> */}
        
        <nav className="nav-steps">
          <Link to="/product" className={`step ${location.pathname === '/design' ? 'active' : ''}`}>
          DESIGN
          </Link>
          <Link to="/quantity" className={`step ${location.pathname === '/quantity' ? 'active' : ''}`}>
            QUANTITY & SIZES
          </Link>
          <Link to="/review" className={`step ${location.pathname === '/review' ? 'active' : ''}`}>
            REVIEW
          </Link>
        </nav>
      </div>
      <div className="right-section">
        <button className="header-btn">Cart</button>
        <button className="header-btn">Login</button>
      </div>
    </header>
  );
};

export default Header;