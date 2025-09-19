// import React, { useState } from 'react';
// import styles from './ShareDesignPopup.module.css';
// import { CrossIcon } from '../../iconsSvg/CustomIcon';
// import { TfiEmail } from "react-icons/tfi";
// import { FaFacebookSquare } from "react-icons/fa";
// import { FaTwitter } from "react-icons/fa";
// import { FaPinterest } from "react-icons/fa";


// const ShareDesignPopup = ({ setSavedesignPopupHandler }) => {
//     const [isPreviewOpen, setIsPreviewOpen] = useState(false);

//     const handleCopy = () => {
//         navigator.clipboard.writeText('https://www.ninjaprinthouse.com/design/?design=MTEyMzkxODk=&i');
//         alert('Link copied to clipboard!');
//     };

//     const handlePreview = () => {
//         setIsPreviewOpen(true);
//     };

//     const closePreview = () => {
//         setIsPreviewOpen(false);
//     };

//     return (
//         <div className="modal-overlay">
//             <div className={styles.popup}>
//                 <div className={styles.modalHeader}>
//                     <h3>Share your Design</h3>
//                     <span onClick={setSavedesignPopupHandler}><CrossIcon /></span>
//                 </div>
//                 <div className={styles.content}>
//                     <div className={styles.designimg}>
//                         <img src="https://cdn.shopify.com/s/files/1/0622/9560/5382/files/82601_f_fl.jpg?v=1754920925" alt="Hoodie Design" className={styles.designImage} />
//                     </div>
//                     <div className={styles.textContainer}>
//                         <h2 className={styles.title}>Share your design</h2>
//                         <p className={styles.description}>Your design "kik" has been saved and emailed to you.</p>
//                         <p className={styles.description}>Copy your design link below and share with others.</p>
//                         <div className={styles.linkContainer}>
//                             <input
//                                 type="text"
//                                 value="https://www.ninjaprinthouse.com/design/?design=MTEyMzkxODk=&i"
//                                 readOnly
//                                 className={styles.linkInput}
//                             />
//                             <button onClick={handleCopy} className={styles.copyButton}>
//                                 Copy
//                             </button>
//                         </div>
//                         <div className={styles.shareOptions}>
//                             <div className={styles.shareItem}>
//                                 <span className={styles.shareIcon}><TfiEmail /></span>
//                                 <span className={styles.shareLabel}>Email</span>
//                             </div>
//                             <div className={styles.shareItem}>
//                                 <span className={styles.shareIcon}>< FaFacebookSquare /></span>
//                                 <span className={styles.shareLabel}>Share</span>
//                             </div>
//                             <div className={styles.shareItem}>
//                                 <span className={styles.shareIcon}><FaTwitter /></span>
//                                 <span className={styles.shareLabel}>Tweet</span>
//                             </div>
//                             <div className={styles.shareItem}>
//                                 <span className={styles.shareIcon}><FaPinterest /></span>
//                                 <span className={styles.shareLabel}>Pin</span>
//                             </div>

//                         </div>
//                         <button className={styles.continueButton}>Continue to Pricing</button>
//                     </div>
//                 </div>

//             </div>
//         </div>
//     );
// };

// export default ShareDesignPopup;
import React, { useState } from 'react';
import styles from './ShareDesignPopup.module.css';
import { CrossIcon } from '../../iconsSvg/CustomIcon';
import { TfiEmail } from "react-icons/tfi";
import { FaFacebookSquare } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import { FaPinterest } from "react-icons/fa";
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import CloseButton from '../../CommonComponent/CrossIconCommon/CrossIcon';

const ShareDesignPopup = ({ setSavedesignPopupHandler, lastDesign, navigate }) => {
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [isEmailFormOpen, setIsEmailFormOpen] = useState(false);
    const location = useLocation();
    console.log(lastDesign, "lastDesing in share designpopup")
    const url = new URL(window.location.href);

    // naya URL object banao
    const shareUrlObj = new URL(`${url.origin}/design/product`);

    // optional params ko add karo agar present hai
    const pId = url.searchParams.get("pId");
    if (pId) shareUrlObj.searchParams.set("pId", pId);

    const variantId = url.searchParams.get("variantid"); // ya variantId
    if (variantId) shareUrlObj.searchParams.set("variantid", variantId);

    const designId = url.searchParams.get("designId");
    if (designId) shareUrlObj.searchParams.set("designId", designId);

    // hamesha mode=share
    shareUrlObj.searchParams.set("mode", "share");

    const shareUrl = shareUrlObj.toString();
    const handleCopy = () => {
        navigator.clipboard.writeText(shareUrl);
        toast.success("copied")
    };

    const handlePreview = () => {
        setIsPreviewOpen(true);
    };

    const closePreview = () => {
        setIsPreviewOpen(false);
    };

    const handleEmailClick = () => {
        setIsEmailFormOpen(true);
    };

    const handleBackClick = () => {
        setIsEmailFormOpen(false);
    };

    return (
        <div className="modal-overlay">
            <div className={styles.popup}>
                <div className={styles.modalHeader}>
                    <h3>Share Your Design</h3>
                    {/* <span onClick={setSavedesignPopupHandler}><CrossIcon /></span> */}
                    <CloseButton onClose={setSavedesignPopupHandler} />

                </div>
                <div className={styles.content}>
                    <div className={styles.designimg}>
                        <img src={lastDesign?.FinalImages[0]} alt="Hoodie Design" className={styles.designImage} />

                        {/* <img src="https://cdn.shopify.com/s/files/1/0622/9560/5382/files/82601_f_fl.jpg?v=1754920925" alt="Hoodie Design" className={styles.designImage} /> */}
                    </div>
                    <div className={styles.textContainer}>
                        {isEmailFormOpen ? (
                            <>
                                <h2>Email to a Friend</h2>
                                <form>
                                    <div>
                                        <label>To</label>
                                        <input
                                            type="email"
                                            placeholder="Enter Their Email Address"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label>Your Name</label>
                                        <input
                                            type="text"
                                            placeholder="Enter Your Name"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label>Your Message</label>
                                        <textarea
                                            placeholder="Please fill this field."
                                            required
                                        />
                                    </div>
                                    <button type="submit" className={styles.sendButton}>Send Link</button>
                                    <button type="button" onClick={handleBackClick} className={styles.backButton}>Back</button>
                                </form>
                            </>
                        ) : (
                            <>
                                <h2 className={styles.title}>Share Your Design</h2>
                                <p className={styles.description}>Your design <b> {lastDesign?.DesignName}</b> has been saved and emailed to you.</p>
                                <p className={styles.description}>Copy your design link below and share with others.</p>
                                <div className={styles.linkContainer}>
                                    <input
                                        type="text"
                                        value={shareUrl}
                                        readOnly
                                        className={styles.linkInput}
                                    />
                                    <button onClick={handleCopy} className={styles.copyButton}>
                                        Copy
                                    </button>
                                </div>
                                {/* <div className={styles.shareOptions}>
                                    <div className={styles.shareItem} onClick={handleEmailClick}>
                                        <span className={styles.shareIcon}><TfiEmail /></span>
                                        <span className={styles.shareLabel}>Email</span>
                                    </div>
                                    <div className={styles.shareItem}>
                                        <span className={styles.shareIcon}><FaFacebookSquare /></span>
                                        <span className={styles.shareLabel}>Share</span>
                                    </div>
                                    <div className={styles.shareItem}>
                                        <span className={styles.shareIcon}><FaTwitter /></span>
                                        <span className={styles.shareLabel}>Tweet</span>
                                    </div>
                                    <div className={styles.shareItem}>
                                        <span className={styles.shareIcon}><FaPinterest /></span>
                                        <span className={styles.shareLabel}>Pin</span>
                                    </div>
                                </div> */}
                                <button className={styles.continueButton} onClick={() => {
                                    navigate("quantity");
                                    setSavedesignPopupHandler(); // <-- call the function
                                }}>Continue to Pricing</button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div >
    );
};

export default ShareDesignPopup;