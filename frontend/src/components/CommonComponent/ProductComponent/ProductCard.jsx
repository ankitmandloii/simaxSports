// ProductCard.jsx
// import React, { useState, useEffect } from "react";
// import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import colorwheel1 from "../../images/color-wheel1.png";
// import { CrossIcon } from "../../iconsSvg/CustomIcon";
// import ColorSwatchPlaceholder from "../../CommonComponent/ColorSwatchPlaceholder.jsx/ColorSwatchPlaceholder";
// import styles from './ProductCard.module.css'; // Create a new CSS module for ProductCard, or reuse/extend from AddProductContainer.module.css

// const ProductCard = ({ product, onAdd, isExpanded, onToggleExpand, isAlreadySelected }) => {
//     const [selectedColor, setSelectedColor] = useState(null);
//     const [hoverImage, setHoverImage] = useState(null);
//     const [imageLoadStates, setImageLoadStates] = useState({});
//     const [swatchLoaded, setSwatchLoaded] = useState(false);

//     const { productKey, name, colors = [], imgurl, vendor, id } = product;
//     const displayImage = hoverImage || selectedColor?.img || imgurl;

//     const handleImageLoad = (key) => {
//         setImageLoadStates((prev) => ({
//             ...prev,
//             [key]: true,
//         }));
//     };

//     useEffect(() => {
//         if (isExpanded && colors?.length > 0) {
//             colors.slice(0, 3).forEach((color) => {
//                 const img = new Image();
//                 img.src = color.img;
//             });
//         }
//     }, [isExpanded, colors]);

//     // Auto-select first color when expanding if none selected
//     useEffect(() => {
//         if (isExpanded && colors.length > 0 && !selectedColor) {
//             setSelectedColor(colors[0]);
//             setHoverImage(colors[0].img);
//         }
//     }, [isExpanded, colors, selectedColor]);

//     const toggleExpand = (e) => {
//         e.stopPropagation();
//         if (isAlreadySelected) {
//             toast.error("Product already selected");
//             return;
//         }
//         onToggleExpand(productKey);
//     };

//     const handleColorSelect = (e, color) => {
//         e.stopPropagation();
//         setSelectedColor(color);
//         setHoverImage(color.img);
//     };

//     const handleAddProduct = (e) => {
//         e.stopPropagation();
//         if (!selectedColor) return;

//         onAdd({
//             ...product,
//             selectedColor: {
//                 name: selectedColor.name,
//                 swatchImg: selectedColor.swatchImg,
//                 img: selectedColor.img,
//                 variant: selectedColor.variant,
//             },
//             selectedImage: selectedColor.img,
//             imgurl: selectedColor.img,
//         });

//         // Reset local state
//         setSelectedColor(null);
//         setHoverImage(null);
//     };

//     const handleMouseEnterColor = (color) => {
//         setHoverImage(color.img);
//     };

//     const handleMouseLeaveColor = () => {
//         setHoverImage(selectedColor?.img || null);
//     };

//     // Reset selection when closing
//     useEffect(() => {
//         if (!isExpanded) {
//             setSelectedColor(null);
//             setHoverImage(null);
//         }
//     }, [isExpanded]);

//     const imageKey = `${productKey}-main`;
//     const imageLoaded = imageLoadStates[imageKey];

//     return (
//         <li className={styles.modalProduct}> {/* Reuse existing class or adjust in CSS */}
//             <div
//                 className={styles.productMain}
//                 onClick={toggleExpand}
//             >
//                 <div className={styles.imageWrapper}>
//                     {!imageLoaded && (
//                         <div className={styles.imagePlaceholder}></div>
//                     )}
//                     <img
//                         src={displayImage}
//                         alt={name}
//                         loading="lazy"
//                         className={`${styles.modalProductImg} ${imageLoaded ? styles.visible : styles.hidden}`}
//                         onLoad={() => handleImageLoad(imageKey)}
//                     />
//                 </div>
//                 <div className={styles.cardContent}>
//                     <p className={styles.vendorspan}>{vendor}</p>
//                     <p className={styles.addProductPara}>{name}</p>
//                 </div>

//             </div>

//             {colors.length > 0 && (
//                 <div
//                     className={styles.modalProductColorContainer}
//                     onClick={toggleExpand}
//                 >
//                     {!isExpanded && (
//                         <>
//                             <img
//                                 src={colorwheel1}
//                                 alt="colors"
//                                 className={styles.modalProductColorImg}
//                             />
//                             <p>{colors.length} Colors</p>
//                         </>
//                     )}

//                     {isExpanded && (
//                         <div className={styles.swatchSection}> {/* New class for inline expansion; adjust CSS to position below relatively */}
//                             {/* <div className={styles.colorPopupHeader}>
//                                 <button
//                                     className={styles.closePopupBtn}
//                                     onClick={(e) => {
//                                         e.stopPropagation();
//                                         onToggleExpand(productKey);
//                                     }}
//                                 >
//                                     <CrossIcon />
//                                 </button>
//                             </div> */}
//                             {/* <p>Color: {hoveredColor || selectedColor?.name || ''}</p> */}
//                             <div className={styles.colorSwatchList}> {/* Reuse or adjust class */}
//                                 {colors.map((color) => {
//                                     const isSelected = selectedColor?.name === color.name;
//                                     const swatchImage = color.swatchImg;

//                                     return (
//                                         <img
//                                             key={`${productKey}-${color.name}`}
//                                             src={swatchImage}
//                                             alt={color.name}
//                                             title={color.name}
//                                             className={`colorSwatch ${isSelected ? `selected` : ""}`}
//                                             style={{
//                                                 display: swatchLoaded ? "inline-block" : "none",
//                                             }}
//                                             onLoad={() => setSwatchLoaded(true)}
//                                             onMouseEnter={() => handleMouseEnterColor(color)}
//                                             onMouseLeave={handleMouseLeaveColor}
//                                             onClick={(e) => handleColorSelect(e, color)}
//                                         />
//                                     );
//                                 })}
//                                 {!swatchLoaded && <ColorSwatchPlaceholder size={30} />}
//                             </div>

//                             <div className={styles.popupActions}>
//                                 <button
//                                     className={styles.addProductBtnPopup}
//                                     onClick={handleAddProduct}
//                                     disabled={!selectedColor || isAlreadySelected}
//                                 >
//                                     {isAlreadySelected
//                                         ? "Product Already Selected"
//                                         : "Add Product"}
//                                 </button>
//                             </div>
//                         </div>
//                     )}
//                 </div>
//             )}
//         </li>
//     );
// };

// export default ProductCard;


// ----
import React, { useState, useEffect } from "react";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import colorwheel1 from "../../images/color-wheel1.png";
import { CrossIcon } from "../../iconsSvg/CustomIcon";
import ColorSwatchPlaceholder from "../../CommonComponent/ColorSwatchPlaceholder.jsx/ColorSwatchPlaceholder";
import styles from './ProductCard.module.css'; // Create a new CSS module for ProductCard, or reuse/extend from AddProductContainer.module.css

const ProductCard = ({ product, onAdd, isExpanded, onToggleExpand, isAlreadySelected }) => {
    const [selectedColor, setSelectedColor] = useState(null);
    const [hoveredColor, setHoveredColor] = useState(null);
    const [hoverImage, setHoverImage] = useState(null);
    const [imageLoadStates, setImageLoadStates] = useState({});
    const [swatchLoaded, setSwatchLoaded] = useState(false);

    const { productKey, name, colors = [], imgurl, vendor, id } = product;
    const displayImage = hoverImage || selectedColor?.img || imgurl;

    const handleImageLoad = (key) => {
        setImageLoadStates((prev) => ({
            ...prev,
            [key]: true,
        }));
    };

    useEffect(() => {
        if (isExpanded && colors?.length > 0) {
            colors.slice(0, 3).forEach((color) => {
                const img = new Image();
                img.src = color.img;
            });
        }
    }, [isExpanded, colors]);

    // Auto-select first color when expanding if none selected
    useEffect(() => {
        if (isExpanded && colors.length > 0 && !selectedColor) {
            setSelectedColor(colors[0]);
            setHoveredColor(colors[0]);
            setHoverImage(colors[0].img);
        }
    }, [isExpanded, colors, selectedColor]);

    const toggleExpand = (e) => {
        e.stopPropagation();
        if (isAlreadySelected) {
            toast.error("Product already selected");
            return;
        }
        onToggleExpand(productKey);
    };

    const handleColorSelect = (e, color) => {
        e.stopPropagation();
        setSelectedColor(color);
        setHoveredColor(color);
        setHoverImage(color.img);
    };

    const handleAddProduct = (e) => {
        e.stopPropagation();
        if (!selectedColor) return;

        onAdd({
            ...product,
            selectedColor: {
                name: selectedColor.name,
                swatchImg: selectedColor.swatchImg,
                img: selectedColor.img,
                variant: selectedColor.variant,
            },
            selectedImage: selectedColor.img,
            imgurl: selectedColor.img,
        });

        // Reset local state
        setSelectedColor(null);
        setHoveredColor(null);
        setHoverImage(null);
    };

    const handleMouseEnterColor = (color) => {
        setHoverImage(color.img);
        setHoveredColor(color);
    };

    const handleMouseLeaveColor = () => {
        setHoverImage(selectedColor?.img || null);
        setHoveredColor(selectedColor || null);
    };

    // Reset selection when closing
    useEffect(() => {
        if (!isExpanded) {
            setSelectedColor(null);
            setHoveredColor(null);
            setHoverImage(null);
        }
    }, [isExpanded]);

    const imageKey = `${productKey}-main`;
    const imageLoaded = imageLoadStates[imageKey];

    const currentColor = hoveredColor || selectedColor;

    return (
        <li className={styles.modalProduct} onClick={toggleExpand}> {/* Reuse existing class or adjust in CSS */}
            <div
                className={styles.productMain}

            >
                <div className={styles.imageWrapper}>
                    {!imageLoaded && (
                        <div className={styles.imagePlaceholder}></div>
                    )}
                    <img
                        src={displayImage}
                        alt={name}
                        loading="lazy"
                        className={`${styles.modalProductImg} ${imageLoaded ? styles.visible : styles.hidden}`}
                        onLoad={() => handleImageLoad(imageKey)}
                    />
                </div>
                <div className={styles.cardContent}>
                    <p className={styles.vendorspan}>{vendor}</p>
                    <p className={styles.addProductPara}>{name}</p>
                </div>

            </div>

            {colors.length > 0 && (
                <div
                    className={styles.modalProductColorContainer}
                    onClick={toggleExpand}
                >
                    {!isExpanded && (
                        <>
                            <img
                                src={colorwheel1}
                                alt="colors"
                                className={styles.modalProductColorImg}
                            />
                            <p>{colors.length} Colors</p>
                        </>
                    )}

                    {isExpanded && (
                        <div className={styles.swatchSection}> {/* New class for inline expansion; adjust CSS to position below relatively */}
                            {/* <div className={styles.colorPopupHeader}>
                                <button
                                    className={styles.closePopupBtn}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onToggleExpand(productKey);
                                    }}
                                >
                                    <CrossIcon />
                                </button>
                            </div> */}
                            {currentColor && (
                                <div className={styles.currentColorDisplay}>
                                    <p>Color:</p>
                                    <img
                                        src={currentColor.swatchImg}
                                        alt={currentColor.name}
                                        className={styles.currentSwatch}
                                    />
                                    <p className={styles.hovercolorname}> {currentColor.name}</p>

                                </div>
                            )}
                            <div className={styles.colorSwatchList}> {/* Reuse or adjust class */}
                                {colors.map((color) => {
                                    const isSelected = selectedColor?.name === color.name;
                                    const swatchImage = color.swatchImg;

                                    return (
                                        <img
                                            key={`${productKey}-${color.name}`}
                                            src={swatchImage}
                                            alt={color.name}
                                            title={color.name}
                                            className={`colorSwatch ${isSelected ? `selected` : ""}`}
                                            style={{
                                                display: swatchLoaded ? "inline-block" : "none",
                                            }}
                                            onLoad={() => setSwatchLoaded(true)}
                                            onMouseEnter={() => handleMouseEnterColor(color)}
                                            onMouseLeave={handleMouseLeaveColor}
                                            onClick={(e) => handleColorSelect(e, color)}
                                        />
                                    );
                                })}
                                {!swatchLoaded && <ColorSwatchPlaceholder size={30} />}
                            </div>



                            <div className={styles.popupActions}>
                                <button
                                    className={styles.addProductBtnPopup}
                                    onClick={handleAddProduct}
                                    disabled={!selectedColor || isAlreadySelected}
                                >
                                    {isAlreadySelected
                                        ? "Product Already Selected"
                                        : "Add Product"}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </li>
    );
};

export default ProductCard;