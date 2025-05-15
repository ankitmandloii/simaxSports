

// // const AddProductContainer = ({ isOpen, onClose, products }) => {
//  import React, { useEffect, useState } from "react";
// import axios from "axios";
// import "./AddProductContainer.css";
// import colorwheel1 from '../../images/color-wheel1.png';

// const AddProductContainer = ({ isOpen, onClose }) => {
//   const [products, setProducts] = useState([]);

//   useEffect(() => {
//     if (!isOpen) return;

//     const fetchProducts = async () => {
//       try {
//         const response = await axios.post("https://c71d-49-249-2-6.ngrok-free.app/api/products/list", {
//           limit: 8,
//         });
// console.log("--res",response.json)
//        const edges = response.data.result.data.products.edges;


//         console.log("edeges",edges)
//         const productList = edges.map((edge) => {
//           const variant = edge.node.variants.edges[0].node; // get first variant
//           return {
//             name: edge.node.title || variant.title,
//             imgurl: variant.image?.originalSrc,
//             colors: edge.node.options.find(opt => opt.name === "Color")?.values || [],
//           };
//         });

//         setProducts(productList);
//       } catch (error) {
//         console.error("Error fetching products:", error);
//       }
//     };

//     fetchProducts();
//   }, [isOpen]);

//   if (!isOpen) return null;

//   return (
//     <div className="addProduct-popup-mainContainer">
//       <div className="modal-overlay">
//         <div className="modal-content">
//           <div className="modal-header">
//             <h2>Add Product</h2>
//             <button onClick={onClose} className="modal-close">&times;</button>
//           </div>
//           <hr />
//           <p>Select From Our Most Popular Products</p>

//           <ul className="product-list">
//             {products.map((product, index) => (
//               <li className="modal-product" key={index}>
//                 <img src={product.imgurl} alt={product.name} className="modal-productimg" />
//                 <p>{product.name}</p>
//                 <br />
//                 <div className="modal-productcolor-container">
//                   <img src={colorwheel1} alt="colors" className="modal-productcolor-img" />
           
//                   <p>{product.colors.length} Colors</p>
//                 </div>
//               </li>
//             ))}
//           </ul>

//           <div className="modal-allproductButtonContainer">
//             <button className="modal-AllproductButton">BROWSE ALL PRODUCTS</button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddProductContainer;
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./AddProductContainer.css";
import colorwheel1 from '../../images/color-wheel1.png';
import { fetchProducts } from "../../../redux/ProductSlice/ProductSlice";

const AddProductContainer = ({ isOpen, onClose,onProductSelect }) => {
  const dispatch = useDispatch();

  const { list: products, loading, error } = useSelector((state) => state.products);
   const handleSelect = (product) => {
    onProductSelect(product); // 👈 send to parent
    onClose(); // close the modal
  };

  useEffect(() => {
    if (isOpen) {
      dispatch(fetchProducts());
    }
  }, [isOpen, dispatch]);

  if (!isOpen) return null;

  return (
    <div className="addProduct-popup-mainContainer">
      <div className="modal-overlay">
        <div className="modal-content">
          <div className="modal-header">
            <h3>Add Product</h3>
            <button onClick={onClose} className="modal-close">&times;</button>
          </div>
          <hr />
          <p>Select From Our Most Popular Products</p>

          {loading && <p>Loading...</p>}
          {error && <p style={{ color: "red" }}>{error}</p>}

          <ul className="product-list">
            {products.map((product, index) => (
             
              <li className="modal-product" key={index} onClick={() => handleSelect(product)}>
                <img src={product.imgurl} alt={product.name} className="modal-productimg" />
                <p>{product.name}</p>
                <br />
                <div className="modal-productcolor-container">
                  <img src={colorwheel1} alt="colors" className="modal-productcolor-img" />
                  <p>{product.colors.length} Colors</p>
                </div>
              </li>
            ))}
          </ul>

          <div className="modal-allproductButtonContainer">
            <button className="modal-AllproductButton">BROWSE ALL PRODUCTS</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProductContainer;
