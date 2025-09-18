

// import React, { useEffect, useState } from "react";
// import * as tmImage from "@teachablemachine/image";

// const ModelComponent = () => {
//     const [model, setModel] = useState(null);
//     const [prediction, setPrediction] = useState("");
//     const [image, setImage] = useState(null);

//     // Load the model
//     useEffect(() => {
//         const loadModel = async () => {
//             const URL = "";
//             try {
//                 const loadedModel = await tmImage.load(URL + "model.json", URL + "metadata.json");
//                 console.log("Model loaded:", loadedModel);
//                 setModel(loadedModel);
//             } catch (error) {
//                 console.error("Error loading the model:", error);
//             }
//         };

//         loadModel();
//     }, []);

//     // Handle image upload
//     const handleImageUpload = (e) => {
//         const file = e.target.files[0];
//         if (file) {
//             const reader = new FileReader();
//             reader.onload = (event) => {
//                 const imgElement = new Image();
//                 imgElement.src = event.target.result;
//                 imgElement.onload = () => {
//                     setImage(imgElement);
//                 };
//             };
//             reader.readAsDataURL(file);
//         }
//     };

//     // Run prediction when the image is set
//     const predictImage = async () => {
//         if (model && image) {
//             try {
//                 const predictions = await model.predict(image);
//                 console.log("Predictions:", predictions);

//                 // Select the class with the highest probability
//                 const bestPrediction = predictions.reduce((prev, current) => {
//                     return prev.probability > current.probability ? prev : current;
//                 });

//                 const probabilityPercentage = (bestPrediction.probability * 100).toFixed(2);
//                 setPrediction(`Class: ${bestPrediction.className}, Probability: ${probabilityPercentage}%`);
//             } catch (error) {
//                 console.error("Error during prediction:", error);
//             }
//         }
//     };

//     return (
//         <div>
//             <h3>Upload an Image to Predict</h3>

//             {/* File input to upload image */}
//             <input type="file" accept="image/*" onChange={handleImageUpload} />

//             {/* Display uploaded image */}
//             {image && <img src={image.src} alt="Uploaded" width="200" />}

//             {/* Predict button */}
//             <button onClick={predictImage}>Predict</button>

//             {/* Show prediction result */}
//             <h4>{prediction}</h4>
//         </div>
//     );
// };

// export default ModelComponent;
//////////////////////////////////////
import React, { useEffect, useState } from "react";
import * as tmImage from "@teachablemachine/image";

const ModelComponent = () => {
    const [model, setModel] = useState(null);
    const [prediction, setPrediction] = useState("");
    const [image, setImage] = useState(null);

    // Load the model from the local folder
    useEffect(() => {
        const loadModel = async () => {
            // const localModelPath = "/model/model.json";
            const localModelPath = "/model/model.json";  // This should point to your local model folder
            // This should point to your local model folder

            try {
                // Load model from local directory
                const loadedModel = await tmImage.load(localModelPath, "/model/metadata.json");
                console.log("Model loaded:", loadedModel);
                setModel(loadedModel);
            } catch (error) {
                console.error("Error loading the model:", error);
            }
        };

        loadModel();
    }, []);

    // Handle image upload
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const imgElement = new Image();
                imgElement.src = event.target.result;
                imgElement.onload = () => {
                    setImage(imgElement);
                };
            };
            reader.readAsDataURL(file);
        }
    };

    // Run prediction when the image is set
    const predictImage = async () => {
        if (model && image) {
            try {
                const predictions = await model.predict(image);
                console.log("Predictions:", predictions);

                // Select the class with the highest probability
                const bestPrediction = predictions.reduce((prev, current) => {
                    return prev.probability > current.probability ? prev : current;
                });

                const probabilityPercentage = (bestPrediction.probability * 100).toFixed(2);
                setPrediction(`Class: ${bestPrediction.className}, Probability: ${probabilityPercentage}%`);
            } catch (error) {
                console.error("Error during prediction:", error);
            }
        }
    };

    return (
        <div>
            <h3>Upload an Image to Predict</h3>

            {/* File input to upload image */}
            <input type="file" accept="image/*" onChange={handleImageUpload} />

            {/* Display uploaded image */}
            {image && <img src={image.src} alt="Uploaded" width="200" />}

            {/* Predict button */}
            <button onClick={predictImage}>Predict</button>

            {/* Show prediction result */}
            <h4>{prediction}</h4>
        </div>
    );
};

export default ModelComponent;
