import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../images/SimaxApparel_Logo.png'
import { CartIcon, UserIcon } from '../iconsSvg/CustomIcon';
import style from './Header.module.css'
import { useMediaQuery } from 'react-responsive'

const Header = () => {
  const location = useLocation();

  // Extract current path without query params
  const currentPath = location.pathname;
  // Group of routes that map to "DESIGN"
  const designRoutes = ['/product', '/addArt', '/uploadArt', '/addNames', '/addText'];
  const isDesktopOrLaptop = useMediaQuery({ query: '(max-width: 750px)' })

  return (
    <header className={style.appHeader}>
      <div className={style.leftSection}>
        <img src={logo} alt="SIMAX" className={style.logo} />

        <nav className={style.navSteps}>
          <Link
            to="/product"
            className={`${style.step} ${designRoutes.includes(location.pathname) ? style.stepActive : ''}`}
          >
            <span className={style.navSpanNumber}>1</span> DESIGN
          </Link>

          <Link
            to="/quantity"
            className={`${style.step} ${location.pathname === '/quantity' ? style.stepActive : ''}`}
          >
            <span className={style.navSpanNumber}>2</span> QUANTITY & SIZES
          </Link>

          <Link
            to="/review"
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
        {
          isDesktopOrLaptop && (
            <div>
              {
                currentPath == "/product" &&
                <Link
                  to={`/product`}
                  className={`${style.step} ${designRoutes.includes(currentPath) ? style.stepActive : ''}`}
                >
                  <span className={style.navSpanNumber}>1</span>
                  <span className={style.navSpanHeading}>DESIGN</span>
                </Link>
              }

              {currentPath == "/quantity" && <Link
                to={`/quantity`}
                className={`${style.step} ${currentPath === '/quantity' ? style.stepActive : ''}`}
              >
                <span className={style.navSpanNumber}>2</span>
                <span className={style.navSpanHeading}>QUANTITY & SIZES</span>
              </Link>}

              {currentPath == "/review" &&
                <Link
                  to={`/review`}
                  className={`${style.step} ${currentPath === '/review' ? style.stepActive : ''}`}
                >
                  <span className={style.navSpanNumber}>3</span>
                  <span className={style.navSpanHeading}>REVIEW</span>
                </Link>
              }
            </div>
          )
        }
      </div>
    </header>
  );
};

export default Header;
