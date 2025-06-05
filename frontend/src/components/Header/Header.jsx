import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../images/SimaxApparel_Logo.png'
import { CartIcon, UserIcon } from '../iconsSvg/CustomIcon';
import style from './Header.module.css'

const Header = () => {
  const location = useLocation();

  // Group of routes that map to "DESIGN"
  const designRoutes = ['/product', '/addArt', '/uploadArt', '/addNames', '/addText'];

  return (
    <header className={style.appHeader}>
      <div className={style.leftSection}>
        <img src={logo} alt="SIMAX" className={style.logo} />

        <nav className={style.navSteps}>
          <Link
            to="/product?productId=8847707537647&title=Dusty%20Rose%20/%20S"
            className={`${style.step} ${designRoutes.includes(location.pathname) ? style.stepActive : ''}`}

          >
            <span className={style.navSpanNumber}>1</span> DESIGN
          </Link>

          <Link
            to="/quantity?productId=8847707537647&title=Dusty%20Rose%20/%20S"
            className={`${style.step} ${location.pathname === '/quantity' ? style.stepActive : ''}`}
          >
            <span className={style.navSpanNumber}>2</span> QUANTITY & SIZES
          </Link>

          <Link
            to="/review?productId=8847707537647&title=Dusty%20Rose%20/%20S"
            className={`${style.step} ${location.pathname === '/review' ? style.stepActive : ''}`}
          >
            <span className={style.navSpanNumber}>3</span> REVIEW
          </Link>
        </nav>
      </div>

      <div className={style.rightSection}>
        <button className={style.headerBtn}>
          <CartIcon />
        <p>Cart</p>
        </button>
        <button className={style.headerBtn}>
          <UserIcon />
          <p>Login</p>
        </button>
      </div>
    </header>
  );
};

export default Header;
