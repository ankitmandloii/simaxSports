// import React, { useState } from 'react';
// import './SaveDesignPopup.css';
// import { CrossIcon, GoogleIcon } from '../../iconsSvg/CustomIcon';

// const SaveDesignPopup = ({ setSavedesignPopupHandler }) => {
//   const [designName, setDesignName] = useState("");
//   const [email, setEmail] = useState("");
//   const [error, setError] = useState("");
//   const [showEmailForm, setShowEmailForm] = useState(false);

//   const validateName = (name) => /^[a-zA-Z0-9\- ]{1,25}$/.test(name);
//   const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

//   const isValid = validateName(designName);

//   const handleContinueWithEmail = () => {
//     if (!isValid) {
//       setError("Max 25 characters. No symbols except dashes.");
//       return;
//     }
//     setShowEmailForm(true);
//   };

//   const handleBack = () => {
//     setShowEmailForm(false);
//     setEmail("");
//     setError("");
//   };

//   const handleSaveDesign = () => {
//     if (!email) {
//       setError("Email is required.");
//       return;
//     }

//     if (!validateEmail(email)) {
//       setError("Please enter a valid email address.");
//       return;
//     }

//     alert(`Saving design "${designName}" with email "${email}"`);
//   };

//   const handleGoogleLogin = () => {
//     if (!isValid) return;
//     alert("Continue with Google");
//   };

//   return (
//     <div className='Save-design-popup'>
//       <div className="modal-overlay">
//         <div className="popup-container">
//           <div className="popup-headerr">
//             <div className='popup-title'>
//               <h2>Save Your Design</h2>
//               <p>Once saved, share with others and access it from anywhere!</p>
//             </div>
//             <button className="close-btn" onClick={setSavedesignPopupHandler}>
//               <CrossIcon />
//             </button>
//           </div>

//           {!showEmailForm ? (
//             <>
//               <label>Enter Design Name</label>
//               <input
//                 type="text"
//                 className="popup-input"
//                 placeholder="Enter Design Name"
//                 maxLength={25}
//                 value={designName}
//                 onChange={(e) => {
//                   setDesignName(e.target.value);
//                   setError("");
//                 }}
//               />
//               {!isValid ? (
//                 <p className="popup-error">Design Name is Required</p>
//               ) : (
//                 <p>25 characters max, no symbols except dashes</p>
//               )}
//               {error && <p className="popup-error">{error}</p>}

//               <button
//                 className={`popup-button email-button ${!isValid ? "locked-toolbar" : ""}`}
//                 onClick={handleContinueWithEmail}
//                 disabled={!isValid}
//               >
//                 CONTINUE WITH EMAIL
//               </button>

//               <div className="popup-or">OR</div>

//               <button
//                 className={`popup-button google-button ${!isValid ? "locked-toolbar" : ""}`}
//                 onClick={handleGoogleLogin}
//                 disabled={!isValid}
//               >
//                 <GoogleIcon />
//                 Continue With Google
//               </button>
//             </>
//           ) : (
//             <>
//               <label>Enter Your Email</label>
//               <input
//                 type="email"
//                 className="popup-input"
//                 placeholder="Your Email"
//                 value={email}
//                 onChange={(e) => {
//                   setEmail(e.target.value);
//                   setError("");
//                 }}
//               />
//               {error && <p className="popup-error">{error}</p>}

//               <button className="popup-button email-button" onClick={handleSaveDesign}>
//                 SAVE DESIGN
//               </button>

//               <button className="popup-button back-button" onClick={handleBack}>
//                 BACK
//               </button>
//             </>
//           )}

//           <p className="popup-footer">
//             Your email is safe and secure. <a href="#">Read our privacy policy.</a>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SaveDesignPopup;
import React, { useState, useEffect, useRef } from 'react';
import './SaveDesignPopup.css';
import { CrossIcon, GoogleIcon } from '../../iconsSvg/CustomIcon';

const SaveDesignPopup = ({ setSavedesignPopupHandler }) => {
  const [designName, setDesignName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [showEmailForm, setShowEmailForm] = useState(false);
  const googleButtonRef = useRef(null);

  const validateName = (name) => /^[a-zA-Z0-9\- ]{1,25}$/.test(name);
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const isValid = validateName(designName);

  const handleContinueWithEmail = () => {
    if (!isValid) {
      setError("Max 25 characters. No symbols except dashes.");
      return;
    }
    setShowEmailForm(true);
  };

  const handleBack = () => {
    setShowEmailForm(false);
    setEmail("");
    setError("");
  };

  const handleSaveDesign = () => {
    if (!email) {
      setError("Email is required.");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    alert(`Saving design "${designName}" with email "${email}"`);
  };

  const handleGoogleLoginSuccess = (response) => {
    const credential = response.credential;

    // Decode the JWT to extract user info (optional)
    const decoded = JSON.parse(atob(credential.split('.')[1]));
    const userEmail = decoded.email;

    alert(`Saving design "${designName}" with Google email "${userEmail}"`);
    // Here, you can send this info to your backend for user creation/session management
  };

  // useEffect(() => {
  //   if (window.google && isValid) {
  //     window.google.accounts.id.initialize({
  //       client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,

  //       callback: handleGoogleLoginSuccess,
  //     });

  //     window.google.accounts.id.renderButton(googleButtonRef.current, {
  //       theme: "outline",
  //       size: "large",
  //       text: "continue_with",
  //       shape: "pill",
  //     });
  //   }
  // }, [isValid]);
  useEffect(() => {
    if (window.google && googleButtonRef.current) {
      window.google.accounts.id.initialize({
        client_id: process.env.REACT_APP_CLIENT_ID,
        callback: handleGoogleLoginSuccess,
      });

      window.google.accounts.id.renderButton(googleButtonRef.current, {
        theme: "outline",
        size: "large",
        text: "continue_with",
        shape: "pill",
      });
    }
  }, []);

  return (
    <div className='Save-design-popup'>
      <div className="modal-overlay">
        <div className="popup-container">
          <div className="popup-headerr">
            <div className='popup-title'>
              <h2>Save Your Design</h2>
              <p>Once saved, share with others and access it from anywhere!</p>
            </div>
            <button className="close-btn" onClick={setSavedesignPopupHandler}>
              <CrossIcon />
            </button>
          </div>

          {!showEmailForm ? (
            <>
              <label>Enter Design Name</label>
              <input
                type="text"
                className="popup-input"
                placeholder="Enter Design Name"
                maxLength={25}
                value={designName}
                onChange={(e) => {
                  setDesignName(e.target.value);
                  setError("");
                }}
              />
              {!isValid ? (
                <p className="popup-error">Design Name is Required</p>
              ) : (
                <p>25 characters max, no symbols except dashes</p>
              )}
              {error && <p className="popup-error">{error}</p>}

              <button
                className={`popup-button email-button ${!isValid ? "locked-toolbar" : ""}`}
                onClick={handleContinueWithEmail}
                disabled={!isValid}
              >
                CONTINUE WITH EMAIL
              </button>

              <div className="popup-or">OR</div>
              {/* <button
                className={`popup-button  google-button ${!isValid ? "locked-toolbar" : ""}`}
                disabled={!isValid}
                ref={googleButtonRef}
              >
                <GoogleIcon />
                Continue With Google
              </button> */}
              <div className="btn">
                <div ref={googleButtonRef} className={`${!isValid ? "locked-toolbar" : ""}`} />
              </div>


            </>
          ) : (
            <>
              <label>Enter Your Email</label>
              <input
                type="email"
                className="popup-input"
                placeholder="Your Email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
              />
              {error && <p className="popup-error">{error}</p>}

              <button className="popup-button email-button" onClick={handleSaveDesign}>
                SAVE DESIGN
              </button>

              <button className="popup-button back-button" onClick={handleBack}>
                BACK
              </button>
            </>
          )}

          <p className="popup-footer">
            Your email is safe and secure. <a href="#">Read our privacy policy.</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SaveDesignPopup;
