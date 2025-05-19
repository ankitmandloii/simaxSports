

// import React, { useState, useEffect } from 'react';
// import CollectionPopupList from '../CollectionPopupList/CollectionPopupList';
// import CollectionProductPopup from '../CollectionProductPopup/CollectionProductPopup';
// import './ChangePopup.css';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchCollections, resetCollections } from '../../../redux/ProductSlice/CollectionSlice';

// const ChangePopup = ({ onClose, onProductSelect }) => {
//   const dispatch = useDispatch();
//   const { collections, loading, hasNextPage, cursor } = useSelector((state) => state.collections);
//   const dataaa=useSelector((state)=>state.collections)
//   console.log("--collections",collections)
//   console.log("--collections data",dataaa)

//   const [scrolling, setScrolling] = useState(false);

//   // Fetch collections on initial load or when cursor changes
//   useEffect(() => {
//     dispatch(fetchCollections({ cursor: '' })); // Initial fetch
//     return () => {
//       dispatch(resetCollections()); // Reset when the popup is closed
//     };
//   }, [dispatch]);

//   // Load more collections on scroll
//   const handleLoadMore = () => {
//     if (hasNextPage && !loading) {
//       dispatch(fetchCollections({ cursor }));  // Fetch next page with the current cursor
//     }
//   };

//   // Handle scroll event
//   const handleScroll = (e) => {
//     const bottom = e.target.scrollHeight === e.target.scrollTop + e.target.clientHeight;
//     if (bottom && !scrolling) {
//       setScrolling(true);
//       handleLoadMore();
//     } else {
//       setScrolling(false);
//     }
//   };

//   return (
//     <div className="popup-overlay">
//       <div className="popup-container">
//         <div className="popup-header">
//           <h2>Select a Collection</h2>
//           <button className="close-btn" onClick={onClose}>×</button>
//         </div>

//         <div className="popup-content changProduct-popup">
//           <div className="product-grid" onScroll={handleScroll}>
//             <div className="collection-card-container">
//               {loading ? (
//                 <p>Loading collections...</p>
//               ) : collections.length === 0 ? (
//                 <div className="no-collections">No collections found</div>
//               ) : (
//                 collections.map((collection) => (
//                   <div
//                     key={collection.id}
//                     className="collection-card"
//                     onClick={() => {
//                       onProductSelect(collection);
//                       onClose();
//                     }}
//                   >

//                     <p>{collection.title}</p>
//                   </div>
//                 ))
//               )}
//             </div>

//             {/* Button to load more collections if available */}
//             {!loading && hasNextPage && (
//               <button className="load-more" onClick={handleLoadMore}>
//                 LOAD MORE
//               </button>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ChangePopup;
import React, { useState } from 'react';
import './ChangePopup.css';
import CollectionPopupList from '../CollectionPopupList/CollectionPopupList';
import CollectionProductPopup from '../CollectionProductPopup/CollectionProductPopup';

const ChangePopup = ({ onClose, onProductSelect }) => {
  const [selectedCollectionId, setSelectedCollectionId] = useState(null);

  return (
    <div className="changeProdcutPopup-mainContainer">
      <div className="popup-overlay">
        <div className="popup-container">
          <div className="popup-header">
            <h2>Select a Collection</h2>
            <button className="close-btn" onClick={onClose}>×</button>
          </div>

          <div className="popup-body-layout">
            {/* Sidebar - Collection list */}
            <div className="popup-sidebar">
              <CollectionPopupList onCollectionSelect={setSelectedCollectionId} />
            </div>

            {/* Right panel - Products from collection */}
            <div className="popup-products">
              <CollectionProductPopup collectionId={selectedCollectionId} onProductSelect={onProductSelect} onClose={onClose} />
            </div>
          </div>
        </div>
      </div>
    </div>

  );
};

export default ChangePopup;
