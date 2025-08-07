// import React from "react";
// import styles from "./PromptGuide.module.css";
// // The single Bears image is not needed for the final design
// import Bears from '../../images/good-news-bears.png'

// const PromptGuide = ({ onClose }) => {
//   return (
//     <div className={styles.overlay}>
//       <div className={styles.popup}>
//         <button className={styles.close} onClick={onClose}>
//           ×
//         </button>

//         <h2 className={styles.title}>Example Prompt</h2>

//         <div className={styles.promptBox}>
//           {/* This wrapper div is key for positioning the lines */}
//           <div className={styles.promptWithLines}>
//             <div className={styles.lineStyle}></div>
//             <div className={styles.lineSubject}></div>
//             <div className={styles.lineBackground}></div>
//             <div className={styles.lineText}></div>
//             <p className={styles.promptText}>
//               <span className={styles.style}>A logo</span> of a{" "}
//               <span className={styles.subject}>
//                 bear playing basketball wearing a royal blue and white jersey
//                 dunking
//               </span>{" "}
//               with{" "}
//               <span className={styles.text}>
//                 text that says Good News Bears
//               </span>{" "}
//               on a <span className={styles.background}>white background</span>
//             </p>
//           </div>

//           <div className={styles.legend}>
//             <span className={styles.legendItem}>
//               <span className={styles.style}>Style</span>
//             </span>
//             <span className={styles.legendItem}>
//               <span className={styles.subject}>Subject</span>
//             </span>
//             <span className={styles.legendItem}>
//               <span className={styles.background}>Background</span>
//             </span>
//             <span className={styles.legendItem}>
//               <span className={styles.text}>Text</span>
//             </span>
//           </div>
//         </div>

//         <h3 className={styles.subtitle}>Example Output</h3>
//        <img src={Bears} className={styles.bear}/>
        
//         {/* This div correctly displays three images */}
//         {/* <div className={styles.examples}>
//           <img src="/prompt-examples/1.png" alt="Example 1" />
//           <img src="/prompt-examples/2.png" alt="Example 2" />
//           <img src="/prompt-examples/3.png" alt="Example 3" />
//         </div> */}
//       </div>
//     </div>
//   );
// };

// export default PromptGuide;

// import React from 'react';
// import styles from './PromptGuide.module.css';
// import screenshot from '../../images/Screenshot .png'; // adjust path as needed

// const PromptGuide = ({ onClose }) => {
//   return (
//     <div className={styles.overlay}>
//       <div className={styles.popup}>
//         {/* <button className={styles.close} onClick={onClose}>×</button> */}
//         <img src={screenshot} alt="Prompt Guide" className={styles.image} onClick={onClose} />
//       </div>
//     </div>
//   );
// };

// export default PromptGuide;


// --
import React from "react";
// import "./PromptExample.css";
import "./PromptEx.css"
// import screenshot from '../../images/Screenshot .png';
import Bear from '../../images/good-news-bears.png'

const PromptGuide = ({ onClose }) => {
  return (
    <div className="overlay">
        <div className="popup">
            <div className="prompt-wrapper">
      <div className="prompt-header">Example Prompt</div>
       <button className="close" onClick={onClose}>
          ×
        </button>

      <div className="prompt-box">
        <span className="prompt-style">A logo</span> of a <span className="prompt-subject">bear playing basketball wearing a royal blue and white jersey dunking</span> with <span className="prompt-text">text that says Good News Bears</span> on a <span className="prompt-background">white background</span>
      </div>

      <div className="prompt-labels">
        <div><span className="prompt-style">Style</span></div>
        <div><span className="prompt-subject">Subject</span></div>
        <div><span className="prompt-background">Background</span></div>
        <div><span className="prompt-text">Text</span></div>
      </div>

      <div className="output-section">
        <div className="output-title">Example Output</div>
         <img src={Bear} className="bearImg"/>
        {/* <div className="output-images"> */}
           
          {/* <img src="/path/to/image1.png" alt="output 1" />
          <img src="/path/to/image2.png" alt="output 2" />
          <img src="/path/to/image3.png" alt="output 3" /> */}
        {/* </div> */}
      </div>
    </div>

        </div>
    </div>
    
    
  );
};

export default PromptGuide;

 
