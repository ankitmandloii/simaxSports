// import React from 'react'
// import styles from './ReplaceBg.module.css'
// import { useState } from 'react';
// import { CrossIcon } from '../../iconsSvg/CustomIcon';

// const ReplaceBg = ({ replacebgwithAi, setreplaceBgwithAi, img }) => {
//     // 
//     return (
//         <div>
//             <div className='toolbar-main-heading'>
//                 <h5 className='Toolbar-badge'>Upload Art</h5>
//                 <img src={img?.src} />
//                 <span className={styles.crossIcon} onClick={() => setreplaceBgwithAi(true)}><CrossIcon /></span>
//                 <h3>Replace BackGround</h3>
//                 <p>Type in a Prompt to try our AI Powered Background Replacement Tool. Keep in mind that this cannot work at the same time as the Remove Background feature.</p>
//             </div>
//             <hr />
//             <textarea className={styles.replacebginput} type='text' placeholder='Begin Typing....'></textarea>

//             {/* <input className={styles.replacebginput} type='text' placeholder='Begin Typing....'/> */}

//             <button className={styles.generateBgbtn} >Generate Background</button>
//         </div>

//     )
// }

// export default ReplaceBg

import React, { useState } from 'react';
import styles from './ReplaceBg.module.css';
import { CrossIcon } from '../../iconsSvg/CustomIcon';

const ReplaceBg = ({ replacebgwithAi, setreplaceBgwithAi, img }) => {
    console.log("========img", img)
    const [prompt, setPrompt] = useState('');
    const [loading, setLoading] = useState(false);
    const [resultImage, setResultImage] = useState(null);
    const BASE_URL = process.env.REACT_APP_BASE_URL;

    const handleGenerate = async () => {
        if (!prompt) {
            alert("Please enter a prompt first");
            return;
        }

        setLoading(true);
        async function urlToFile(url, filename, mimeType) {
            const res = await fetch(url);
            const buffer = await res.arrayBuffer();
            return new File([buffer], filename, { type: mimeType });
        }

        // usage
        const file = await urlToFile(img.src, 'image.jpg', 'image/jpeg');

        try {
            // Send data to your backend
            const formData = new FormData();
            formData.append('image', file);
            // You need `img.file` to be a File/Blob
            formData.append('prompt', prompt);
            formData.append('model', 'gpt-image-1');
            formData.append('size', '1024x1024');
            formData.append('n', '1');

            const res = await fetch(`${BASE_URL}imageOperation/editImageByAi`, {
                method: 'POST',
                body: formData
            });

            if (!res.ok) throw new Error("Failed to generate image");

            const data = await res.json();
            console.log(data, "========data")
            // setResultImage(data.imageUrl); // assuming backend returns `{ imageUrl: "..." }`
        } catch (err) {
            console.error(err);
            alert("Error generating background");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className='toolbar-main-heading'>
                <h5 className='Toolbar-badge'>Upload Art</h5>
                {/* <img src={img?.src} alt="Uploaded" /> */}
                <span className={styles.crossIcon} onClick={() => setreplaceBgwithAi(false)}>
                    <CrossIcon />
                </span>
                <h3>Replace BackGround</h3>
                <p>Type in a Prompt to try our AI Powered Background Replacement Tool.</p>
            </div>
            <hr />
            <textarea
                className={styles.replacebginput}
                placeholder='Begin Typing....'
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
            />
            <button
                className={styles.generateBgbtn}
                onClick={handleGenerate}
                disabled={loading}
            >
                {loading ? 'Generating...' : 'Generate Background'}
            </button>
            <button
                className={styles.removeBgbtn}
                // onClick={handleGenerate}
                disabled={loading}
            >
                {loading ? 'Clear...' : 'Clear Background'}
            </button>

            {resultImage && (
                <div>
                    <h4>Generated Result:</h4>
                    <img src={resultImage} alt="Generated background" style={{ maxWidth: '100%' }} />
                </div>
            )}
        </div>
    );
};

export default ReplaceBg;
