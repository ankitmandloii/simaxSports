import React, { useEffect, useState } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import logo from '../images/simax-design-logo.png'
import { CartIcon, UserIcon } from '../iconsSvg/CustomIcon';
import style from './Header.module.css'
import { useMediaQuery } from 'react-responsive'
import { BsXLg } from 'react-icons/bs';

const Header = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // const CustomerLogin = searchParams.get("customerEmail");
  const [CustomerLogin, setCustomerLogin] = useState('');
  // Extract current path without query params
  const currentPath = location.pathname;
  // Group of routes that map to "DESIGN"
  const designRoutes = ['/design/product', '/design/addArt', '/design/uploadArt', '/design/addNames', '/design/addText', '/design/addImage'];
  const isDesktopOrLaptop = useMediaQuery({ query: '(max-width: 750px)' })
  useEffect(() => {
    setCustomerLogin(searchParams.get("customerEmail"));
  }, [CustomerLogin])

  return (
    <header className={style.appHeader}>
      <div className={style.leftSection}>
        <Link to="https://simaxdesigns.com">
          <img src={logo} alt="SIMAX" className={style.logo} />
        </Link>

        <nav className={style.navSteps}>
          <Link
            to="/design/product"
            className={`${style.step} ${designRoutes.includes(location.pathname) ? style.stepActive : ''}`}
          >
            <span className={style.navSpanNumber}>1</span> Design
          </Link>

          <Link
            to="/quantity"
            className={`${style.step} ${location.pathname === '/quantity' ? style.stepActive : ''}`}
          >
            <span className={style.navSpanNumber}>2</span> Quantity & Sizes
          </Link>

          <Link
            to="/review"
            className={`${style.step} ${location.pathname === '/review' ? style.stepActive : ''}`}
          >
            <span className={style.navSpanNumber}>3</span> Review
          </Link>
        </nav>
      </div>

      <div className={style.rightSection}>
        {/* <button className={style.headerBtn}>
          <CartIcon />
          <p>Cart</p>
        </button> */}
        <button className={style.headerBtn}>
          <UserIcon />
          {CustomerLogin ? <p className={style.loginName}>{CustomerLogin}</p> : <p>Login</p>}
        </button>
        {
          isDesktopOrLaptop && (
            <div>
              {designRoutes.includes(currentPath) && (
                <Link
                  to="/design/product"
                  className={`${style.step} ${style.stepActive}`}
                >
                  <span className={style.navSpanNumber}>1</span>
                  <span className={style.navSpanHeading}>DESIGN</span>
                </Link>
              )}

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
                  <span className={style.navSpanHeading}>Review</span>
                </Link>
              }
            </div>
          )
        }
      </div>
    </header >
  );
};

export default Header;
