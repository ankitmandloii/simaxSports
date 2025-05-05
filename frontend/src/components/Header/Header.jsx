import React from 'react';
import './Header.css';
import { Link, useLocation } from 'react-router-dom';
import { TbCircleNumber1Filled } from "react-icons/tb";
import { IoCartSharp } from "react-icons/io5";
import { IoPersonCircleSharp } from "react-icons/io5";


const Header = () => {
  const location = useLocation();

  return (
    <header className="app-header">
      <div className="left-section">
        {/* <img src={logo} alt="SIMAX" className="logo" /> */}
        
        <nav className="nav-steps">
          <Link to="/product" className={`step ${location.pathname === '/product'|| '/addArt' || '/uploadArt' || '/addNames' ? 'active' : ''}`}>
          <span className='nav-span-number'>1</span>DESIGN
          </Link>
          <Link to="/quantity" className={`step ${location.pathname === '/quantity' ? 'active' : ''}`}>
          <span className='nav-span-number'>2</span> QUANTITY & SIZES
          </Link>
          <Link to="/review" className={`step ${location.pathname === '/review' ? 'active' : ''}`}>
          <span className='nav-span-number'>3</span>REVIEW
          </Link>
        </nav>
      </div>
      <div className="right-section">
        <button className="header-btn"><IoCartSharp />
        Cart</button>
        <button className="header-btn"> <IoPersonCircleSharp/>Login</button>
      </div>
    </header>
  );
};

export default Header;
