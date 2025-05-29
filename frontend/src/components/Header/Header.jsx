import React from 'react';
import './Header.css';
import { Link, useLocation } from 'react-router-dom';
import logo from '../images/Logo.png'
import { CartIcon, UserIcon } from '../iconsSvg/CustomIcon';

const Header = () => {
  const location = useLocation();

  // Group of routes that map to "DESIGN"
  const designRoutes = ['/product?productId=8847707537647&title=Dusty%20Rose%20/%20S', '/addArt?productId=8847707537647&title=Dusty%20Rose%20/%20S', '/uploadArt?productId=8847707537647&title=Dusty%20Rose%20/%20S', '/addNames?productId=8847707537647&title=Dusty%20Rose%20/%20S', '/addText?productId=8847707537647&title=Dusty%20Rose%20/%20S'];

  return (
    <header className="app-header">
      <div className="left-section">
        <img src={logo} alt="SIMAX" className="logo" />

        <nav className="nav-steps">
          <Link
            to="/product?productId=8847707537647&title=Dusty%20Rose%20/%20S"
            className={`step ${designRoutes.includes(location.pathname) ? 'active' : ''}`}
          >
            <span className='nav-span-number'>1</span> DESIGN
          </Link>

          <Link
            to="/quantity?productId=8847707537647&title=Dusty%20Rose%20/%20S"
            className={`step ${location.pathname === '/quantity' ? 'active' : ''}`}
          >
            <span className='nav-span-number'>2</span> QUANTITY & SIZES
          </Link>

          <Link
            to="/review?productId=8847707537647&title=Dusty%20Rose%20/%20S"
            className={`step ${location.pathname === '/review' ? 'active' : ''}`}
          >
            <span className='nav-span-number'>3</span> REVIEW
          </Link>
        </nav>
      </div>

      <div className="right-section">
        <button className="header-btn">
          <CartIcon />
          Cart
        </button>
        <button className="header-btn">
          <UserIcon />
          Login
        </button>
      </div>
    </header>
  );
};

export default Header;
