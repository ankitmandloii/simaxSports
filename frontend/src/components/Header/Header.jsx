// import React, { useEffect, useState } from 'react';
// import { Link, useLocation, useSearchParams } from 'react-router-dom';
// import logo from '../images/simax-design-logo.png'
// import { CartIcon, UserIcon } from '../iconsSvg/CustomIcon';
// import style from './Header.module.css'
// import { useMediaQuery } from 'react-responsive'
// import { BsXLg } from 'react-icons/bs';
// import { useSelector } from 'react-redux';

// const Header = () => {
//   const location = useLocation();
//   const [searchParams] = useSearchParams();
//   const productState = useSelector((state) => state.productSelection.products);

//   // const CustomerLogin = searchParams.get("customerEmail");
//   const [CustomerLogin, setCustomerLogin] = useState('');
//   // Extract current path without query params
//   const currentPath = location.pathname;
//   // Group of routes that map to "DESIGN"
//   const designRoutes = ['/design/product', '/design/addArt', '/design/uploadArt', '/design/addNames', '/design/addText', '/design/addImage', '/design'];
//   const isDesktopOrLaptop = useMediaQuery({ query: '(max-width: 750px)' })
//   useEffect(() => {
//     // setCustomerLogin(searchParams.get("customerEmail"));
//     const customerEmail = searchParams.get('customerEmail');
//     setCustomerLogin(customerEmail);
//   }, [searchParams])

//   const shouldRedirectToReview = (productState) => {
//     if (window.location.pathname == "/design/product") return false
//     return Object.values(productState).some((product) => {
//       return Object.values(product.selections || {}).some(quantity => quantity >= 1);
//     });
//   };

//   return (
//     <header className={style.appHeader}>
//       <div className={style.leftSection}>
//         <Link to="https://simaxdesigns.com">
//           <img src={logo} alt="SIMAX" className={style.logo} />
//         </Link>

//         <nav className={style.navSteps}>
//           <Link
//             to="/design/product"
//             className={`${style.step} ${designRoutes.includes(location.pathname) ? style.stepActive : ''}`}
//           >
//             <span className={style.navSpanNumber}>1</span> Design
//           </Link>

//           <Link
//             to="/quantity"
//             className={`${style.step} ${location.pathname === '/quantity' ? style.stepActive : ''}`}
//           >
//             <span className={style.navSpanNumber}>2</span> Quantity & Sizes
//           </Link>

//           <Link
//             to="/review"
//             className={`${style.step} ${location.pathname === '/review' ? style.stepActive : ''} ${style.deasable}`}
//           >
//             <span className={style.navSpanNumber}>3</span> Review
//           </Link>
//         </nav>
//       </div>

//       <div className={style.rightSection}>
//         {/* <button className={style.headerBtn}>
//           <CartIcon />
//           <p>Cart</p>
//         </button> */}
//         <button className={style.headerBtn} onClick={() => {
//           if (!CustomerLogin) {
//             window.location.href = "https://simax-designs.myshopify.com/account/login";
//           }
//         }}>
//           <UserIcon />
//           {CustomerLogin ? <p className={style.loginName}>{CustomerLogin}</p> : <p >Login</p>}
//         </button>

//         {
//           isDesktopOrLaptop && (
//             <div>
//               {designRoutes.includes(currentPath) && (
//                 <Link
//                   to="/design/product"
//                   className={`${style.step} ${style.stepActive}`}
//                 >
//                   <span className={style.navSpanNumber}>1</span>
//                   <span className={style.navSpanHeading}>DESIGN</span>
//                 </Link>
//               )}

//               {currentPath == "/quantity" && <Link
//                 to={`/quantity`}
//                 className={`${style.step} ${currentPath === '/quantity' ? style.stepActive : ''}`}
//               >
//                 <span className={style.navSpanNumber}>2</span>
//                 <span className={style.navSpanHeading}>QUANTITY & SIZES</span>
//               </Link>}

//               {currentPath === "/review" && (
//                 <Link
//                   to="/review"
//                   className={`${style.step} ${style.stepActive} ${style.deasable}`}
//                 >
//                   <span className={style.navSpanNumber}>3</span>
//                   <span className={style.navSpanHeading}>Review</span>
//                 </Link>
//               )}

//             </div>
//           )
//         }
//       </div>
//     </header >
//   );
// };

// export default Header;
import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import logo from '../images/simax-design-logo.png'
import { CartIcon, UserIcon } from '../iconsSvg/CustomIcon';
import style from './Header.module.css'
import { useMediaQuery } from 'react-responsive'
import { BsXLg } from 'react-icons/bs';
import { useSelector } from 'react-redux';
import { FiLogOut } from 'react-icons/fi'; // Icon for Logout
import { FaUserCircle } from 'react-icons/fa'; // Icon for User Email
import { IoIosArrowDown } from "react-icons/io";

function extractName(email) {
  let namePart = email.split("@")[0];  // Get the part before '@'
  let formattedName = namePart.replace(/[\.\-_]/g, " ")  // Replace dots, hyphens, underscores with spaces
    .replace(/\b\w/g, c => c.toUpperCase()); // Capitalize first letter of each word
  return formattedName;
}

const Header = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const productState = useSelector((state) => state.productSelection.products);

  // State to manage the visibility of the user modal
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);

  // const CustomerLogin = searchParams.get("customerEmail");
  const [CustomerLogin, setCustomerLogin] = useState('');
  // Extract current path without query params
  const currentPath = location.pathname;
  // Group of routes that map to "DESIGN"
  const designRoutes = ['/design/product', '/design/addArt', '/design/uploadArt', '/design/addNames', '/design/addText', '/design/addImage', '/design'];
  const isDesktopOrLaptop = useMediaQuery({ query: '(max-width: 750px)' })

  useEffect(() => {
    // setCustomerLogin(searchParams.get("customerEmail"));
    const customerEmail = searchParams.get('customerEmail');
    setCustomerLogin(customerEmail);
  }, [searchParams])

  const shouldRedirectToReview = (productState) => {
    if (window.location.pathname == "/design/product") return false
    return Object.values(productState).some((product) => {
      return Object.values(product.selections || {}).some(quantity => quantity >= 1);
    });
  };

  // Function to handle login redirection
  const handleLogin = () => {
    window.location.href = "https://simax-designs.myshopify.com/account/login";
  };

  // Function to handle logout (you might need to implement the actual logout logic)
  const handleLogout = () => {
    // ⚠️ TODO: Implement actual logout logic here (e.g., clearing state/cookies/API call)
    // For now, let's just clear the local state and close the modal.
    setCustomerLogin('');
    setIsUserModalOpen(false);
    // You may also want to redirect the user after logout
    // window.location.href = "https://simax-designs.myshopify.com/account/logout";
    console.log("Logged out user."); // Placeholder for actual logout
  };


  // Ref to detect outside clicks
  const userModalRef = useRef(null);

  // Close modal if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userModalRef.current && !userModalRef.current.contains(event.target)) {
        setIsUserModalOpen(false); // Close the modal
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
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
            className={`${style.step} ${location.pathname === '/review' ? style.stepActive : ''} ${style.deasable}`}
          >
            <span className={style.navSpanNumber}>3</span> Review
          </Link>
        </nav>
      </div>

      <div className={style.rightSection}>
        {/* User Icon and Modal Button */}
        <div className={style.userIconContainer}>
          <button
            className={style.headerBtn}
            onClick={() => {
              if (!CustomerLogin) {
                // If not logged in, directly navigate to login
                handleLogin();
              } else {
                // If logged in, toggle the modal
                setIsUserModalOpen(prev => !prev);
              }
            }}
          >
            <UserIcon />
            {/* {CustomerLogin ? <p className={style.loginName}>{CustomerLogin}</p> : <p >Login</p>} */}
          </button>

          {/* User Modal */}
          {isUserModalOpen && CustomerLogin && (
            <div className={style.userModal} ref={userModalRef}>
              <div className={style.userModalHeader}>
                <FaUserCircle className={style.userModalIcon} />
                <div className={style.userModalUserInfo}>
                  <p className={style.userModalName}>{extractName(CustomerLogin)}</p>
                  <span className={style.userModalEmail}>{CustomerLogin}</span>
                </div>
              </div>
            </div>
          )}

          {/* The original logic only redirects if NOT logged in.
              If you want the modal to show a login button when NOT logged in, 
              you can change the button's onClick and use this logic instead:
          {isUserModalOpen && !CustomerLogin && (
            <button className={style.userModalButton} onClick={handleLogin}>
              <FiLogIn className={style.userModalButtonIcon} />
              Login
            </button>
          )} 
          But sticking to your original request: if not logged in, it redirects directly.
          */}
        </div>

        {/* Existing right section content */}
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

              {currentPath === "/review" && (
                <Link
                  to="/review"
                  className={`${style.step} ${style.stepActive} ${style.deasable}`}
                >
                  <span className={style.navSpanNumber}>3</span>
                  <span className={style.navSpanHeading}>Review</span>
                </Link>
              )}

            </div>
          )
        }
      </div>
    </header >
  );
};

export default Header;