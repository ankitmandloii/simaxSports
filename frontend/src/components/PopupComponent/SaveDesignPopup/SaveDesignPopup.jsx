import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { CrossIcon } from '../../iconsSvg/CustomIcon';
import style from './SaveDesignPopup.module.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SaveDesignPopup = ({ setSavedesignPopupHandler }) => {
  const [designName, setDesignName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const exportedImages = useSelector((state) => state.canvasExport.exportedImages);
  const googleButtonRef = useRef(null);

  const validateName = (name) => /^[a-zA-Z0-9\- ]{1,25}$/.test(name);
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValid = validateName(designName);

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

  const handleSaveDesign = async () => {
    if (!email) {
      toast.error("Email is required.");
      return;
    }

    if (!validateEmail(email)) {
      toast.error("Please enter a valid email address.");

      return;
    }

    if (!exportedImages || !exportedImages.front || !exportedImages.back) {
      toast.error("Design images are not available.");

      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/design/send-email-design', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          frontSrc: exportedImages.front,
          backSrc: exportedImages.back,
          designName
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Design sent to your email successfully!");
        setSavedesignPopupHandler(); // Close modal
      } else {
        toast.error(data.message || "Failed to send design.");
        // setError(data.message || "Failed to send design.");
      }
    } catch (err) {
      toast.error("Something went wrong. Please try again.", err);
      // console.error("Error sending design:", err);
      setError("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  const handleGoogleLoginSuccess = (response) => {
    const credential = response.credential;
    const decoded = JSON.parse(atob(credential.split('.')[1]));
    const userEmail = decoded.email;
    toast.success(`Saving design "${designName}" with Google email "${userEmail}"`);
    // alert(`Saving design "${designName}" with Google email "${userEmail}"`);
    // Optional: call API here as well
  };

  return (
    <div className="modal-overlay">
      <div className={style.popupContainer}>
        <div className={style.popupHeaderr}>
          <div className={style.popupTitle}>
            <h2>SAVE YOUR DESIGN</h2>
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
              disabled={loading}
            />
            {error && <p className={style.popupError}>{error}</p>}

            <button
              className={`${style.popupButton} ${style.emailButton}`}
              onClick={handleSaveDesign}
              disabled={loading}
            >
              {loading ? "Sending..." : "Save Design"}
            </button>

            <button className={`${style.popupButton} ${style.backButton}`} onClick={handleBack} disabled={loading}>
              BACK
            </button>
          </>
        )}

        <p className={style.popupFooter}>
          Your email is safe and secure. <a href="#">Read our privacy policy.</a>
        </p>
      </div>
    </div>
  );
};

export default SaveDesignPopup;
