import React, { useState, useEffect, useRef } from 'react';
import { CrossIcon } from '../../iconsSvg/CustomIcon';
import style from './SaveDesignPopup.module.css'

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
    <div className="modal-overlay">
      <div className={style.popupContainer}>
        <div className={style.popupHeaderr}>
          <div className={style.popupTitle}>
            <h2>Save Your Design</h2>
            <p>Once saved, share with others and access it from anywhere!</p>
          </div>
          <button className={style.closeBtn} onClick={setSavedesignPopupHandler}>
            <CrossIcon />
          </button>
        </div>

        {!showEmailForm ? (
          <>
            <label>Enter Design Name</label>
            <input
              type="text"
              className={style.popupInput}
              placeholder="Enter Design Name"
              maxLength={25}
              value={designName}
              onChange={(e) => {
                setDesignName(e.target.value);
                setError("");
              }}
            />
            {!isValid ? (
              <p className={style.popupError}>Design Name is Required</p>
            ) : (
              <p>25 characters max, no symbols except dashes</p>
            )}
            {error && <p className={style.popupError}>{error}</p>}

            <button
              className={`${style.popupButton} ${style.emailButton} ${!isValid ? style.lockedToolbar : ''}`}
              onClick={handleContinueWithEmail}
              disabled={!isValid}
            >
              CONTINUE WITH EMAIL
            </button>

            <div className={style.popupOr}>OR</div>
            {/* <button
                className={`popup-button  google-button ${!isValid ? "locked-toolbar" : ""}`}
                disabled={!isValid}
                ref={googleButtonRef}
              >
                <GoogleIcon />
                Continue With Google
              </button> */}
            <div className="btn">
              <div ref={googleButtonRef} className={`${!isValid ? style.lockedToolbar : ""}`} />
            </div>


          </>
        ) : (
          <>
            <label>Enter Your Email</label>
            <input
              type="email"
              className={style.popupInput}
              placeholder="Your Email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
            />
            {error && <p className={style.popupError}>{error}</p>}

            <button className={`${style.popupButton} ${style.emailButton}`}
              onClick={handleSaveDesign}>
              SAVE DESIGN
            </button>

            <button className={`${style.popupButton} ${style.backButton}`} onClick={handleBack}>
              BACK
            </button>
          </>
        )}

        <p className={style.popupFooter}>
          Your email is safe and secure. <a href="#">Read our privacy policy.</a>
        </p>
      </div>
    </div >
  );
};

export default SaveDesignPopup;
