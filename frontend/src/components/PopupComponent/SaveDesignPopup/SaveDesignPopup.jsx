import React from 'react'
import './SaveDesignPopup.css'
import { useState } from 'react';
import { CrossIcon, GoogleIcon } from '../../iconsSvg/CustomIcon';


const SaveDesignPopup = ({setSavedesignPopupHandler}) => {


  const [designName, setDesignName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const validateName = (name) => /^[a-zA-Z0-9\- ]{1,25}$/.test(name);

  const handleEmailLogin = () => {
    if (!validateName(designName)) {
      setError("Max 25 characters. No symbols except dashes.");
      return;
    }
    alert(`Continue with email: ${email}`);
  };

  const handleGoogleLogin = () => {
    alert("Continue with Google");
  };

  return (
    <div className='Save-design-popup'>
      <div className="popup-overlay">
        <div className="popup-container">
          
          
          <div className="popup-headerr">
            <div className='popup-title'>
            <h2>Save Your Design</h2>
            <p> Once saved, share with others and access it from anywhere!</p>
            </div>
         
          <button className="close-btn" onClick={setSavedesignPopupHandler} ><CrossIcon/></button>
        </div>
         <label>Enter Design Name</label>
          <input
            type="text"
            className="popup-input"
            placeholder="Enter Design Name"
            maxLength={25}
            value={designName}
            onChange={(e) => setDesignName(e.target.value)}
          />
          {/* <input
            type="email"
            className="popup-input"
            placeholder="Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          /> */}

          {error && <p className="popup-error">{error}</p>}

          <button className="popup-button email-button" onClick={handleEmailLogin}>
            CONTINUE WITH EMAIL
          </button>

          <div className="popup-or">OR</div>

          <button className="popup-button google-button" onClick={handleGoogleLogin}>
            {/* <FcGoogle className="google-icon" /> */}
            <GoogleIcon/>
            Continue With Google
          </button>

          <p className="popup-footer">
            Your email is safe and secure. <a href="#">Read our privacy policy.</a>
          </p>
        </div>
      </div>



    </div>
  )
}

export default SaveDesignPopup