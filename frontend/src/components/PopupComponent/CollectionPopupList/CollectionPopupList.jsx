

// import React, { useEffect, useState, useCallback } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import {
//   fetchCollections,
//   resetCollections,
// } from '../../../redux/ProductSlice/CollectionSlice';
// import styles from './CollectionPopupList.module.css';

// const CollectionPopupList = ({ onCollectionSelect, mainloading, setLoading }) => {
//   console.log("----------collectionLoading", mainloading)
//   const dispatch = useDispatch();
//   const {
//     collections = [],
//     loading,
//     hasNextPage,
//     cursor,
//   } = useSelector((state) => state.collections);

//   const [selectedCategory, setSelectedCategory] = useState(null);
//   const [selectedSubcategory, setSelectedSubcategory] = useState(null);

//   useEffect(() => {
//     dispatch(fetchCollections({ cursor: '' }));
//     return () => dispatch(resetCollections());
//   }, [dispatch]);

//   // Tell parent about loading state
//   useEffect(() => {
//     if (setLoading) {
//       setLoading(loading);
//     }
//   }, [loading, setLoading]);

//   const categoryCollections = collections.filter(collection =>
//     collection.handle.includes('category')
//   );

//   const brandCollections = collections.filter(collection =>
//     !collection.handle.includes('category')
//   );

//   const categories = [
//     {
//       title: 'Featured Brands',
//       subcategories: brandCollections.map(collection => ({
//         id: collection.id,
//         title: collection.title
//       })),
//     },
//     {
//       title: 'Category',
//       subcategories: categoryCollections.map(collection => ({
//         id: collection.id,
//         title: collection.title
//       })),
//     },
//   ];

//   // Set the first subcategory as selected by default
//   useEffect(() => {
//     if (categories.length > 0 && categories[0].subcategories.length > 0 && !selectedSubcategory) {
//       const firstSub = categories[0].subcategories[0];
//       setSelectedSubcategory(firstSub);
//       onCollectionSelect?.(firstSub.id);
//     }
//   }, [collections, selectedSubcategory, onCollectionSelect, categories]);

//   const handleCategorySelect = useCallback((category) => {
//     setSelectedCategory(prev => prev?.title === category.title ? null : category);
//   }, []);

//   const handleSubcategorySelect = useCallback((subcategory) => {
//     setSelectedSubcategory(subcategory);
//     onCollectionSelect?.(subcategory.id);
//   }, [onCollectionSelect]);

//   const handleScroll = useCallback(
//     (e) => {
//       const { scrollTop, scrollHeight, clientHeight } = e.target;
//       const isNearBottom = scrollTop + clientHeight >= scrollHeight - 10;

//       if (isNearBottom && hasNextPage && !loading) {
//         dispatch(fetchCollections({ cursor }));
//       }
//     },
//     [dispatch, cursor, hasNextPage, loading]
//   );

//   if (loading && collections.length === 0) {
//     return (
//       <div className={styles.loadingContainer}>
//         Loading collections...
//       </div>
//     );
//   }

//   return (
//     <div
//       className={`${styles.collectionSidebar} ${mainloading ? styles.disabled : ''}`}
//       onScroll={handleScroll}
//     >
//       <ul className={styles.collectionUl}>
//         {categories.map((category, index) => (
//           <li key={index} className={styles.collectionLi}>
//             <div
//               className={`${styles.collectionCard} ${selectedCategory?.title === category.title ? styles.active : ''}`}
//               onClick={() => handleCategorySelect(category)}
//             >
//               <span>{category.title}</span>
//               <span className={styles.expandIcon}>
//                 {selectedCategory?.title === category.title ? '-' : '+'}
//               </span>
//             </div>

//             {selectedCategory?.title === category.title && (
//               <ul className={styles.subcategoryUl}>
//                 {category.subcategories.map((subcategory) => (
//                   <li
//                     key={subcategory.id}
//                     className={`${styles.subcategoryLi} ${selectedSubcategory?.id === subcategory.id ? styles.active : ''}`}
//                     onClick={() => handleSubcategorySelect(subcategory)}
//                   >
//                     <span>{subcategory.title}</span>
//                   </li>
//                 ))}
//               </ul>
//             )}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default CollectionPopupList;

// seconddd


import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchCollections,
  resetCollections,
  selectCategories,
  selectLoading,
  selectHasNextPage,
  selectCursor,
} from '../../../redux/ProductSlice/CollectionSlice';
import styles from './CollectionPopupList.module.css';

const CollectionPopupList = ({ onCollectionSelect, mainloading, setLoading }) => {
  const dispatch = useDispatch();

  const categories = useSelector(selectCategories);
  const loading = useSelector(selectLoading);
  const hasNextPage = useSelector(selectHasNextPage);
  const cursor = useSelector(selectCursor);

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const hasInitialized = useRef(false);
  const onCollectionSelectRef = useRef(onCollectionSelect);

  // keep callback stable
  useEffect(() => {
    onCollectionSelectRef.current = onCollectionSelect;
  }, [onCollectionSelect]);

  // fetch data once
  useEffect(() => {
    dispatch(fetchCollections({ cursor: '' }));
    return () => {
      dispatch(resetCollections());
      hasInitialized.current = false;
    };
  }, [dispatch]);

  // inform parent about loading
  useEffect(() => {
    if (setLoading) setLoading(loading);
  }, [loading, setLoading]);

  // Initialize only for expandable sections (brands/categories)
  useEffect(() => {
    if (!hasInitialized.current && categories.length > 0) {
      hasInitialized.current = true;
    }
  }, [categories]);

  // Category click handler
  const handleCategorySelect = useCallback((category) => {
    // Toggle expansion for expandable sections only
    setSelectedCategory(prev =>
      prev?.title === category.title ? null : category
    );
  }, []);

  // Subcategory click (fetch products)
  const handleSubcategorySelect = useCallback((subcategory) => {
    setSelectedSubcategory(subcategory);
    if (onCollectionSelectRef.current) {
      onCollectionSelectRef.current(subcategory.id);
    }
  }, []);

  // Infinite scroll
  const handleScroll = useCallback(
    (e) => {
      const { scrollTop, scrollHeight, clientHeight } = e.target;
      const isNearBottom = scrollTop + clientHeight >= scrollHeight - 10;

      if (isNearBottom && hasNextPage && !loading) {
        dispatch(fetchCollections({ cursor }));
      }
    },
    [dispatch, cursor, hasNextPage, loading]
  );

  if (loading && categories.length === 0) {
    return <div className={styles.loadingContainer}>Loading collections...</div>;
  }

  return (
    <div
      className={`${styles.collectionSidebar} ${mainloading ? styles.disabled : ''}`}
      onScroll={handleScroll}
    >
      <ul className={styles.collectionUl}>
        {categories.map((category, index) => {
          const isExpandable =
            category.title === 'Featured Brands' || category.title === 'Category';
          const isExpanded = selectedCategory?.title === category.title;

          return (
            <li key={index} className={styles.collectionLi}>
              {isExpandable ? (
                <>
                  {/* Expandable (Brands, Category) */}
                  <div
                    className={`${styles.collectionCard} ${isExpanded ? styles.active : ''
                      }`}
                    onClick={() => handleCategorySelect(category)}
                  >
                    <span>{category.title}</span>
                    <span className={styles.expandIcon}>
                      {isExpanded ? '-' : '+'}
                    </span>
                  </div>

                  {isExpanded && (
                    <ul className={styles.subcategoryUl}>
                      {category.subcategories.map((subcategory) => (
                        <li
                          key={subcategory.id}
                          className={`${styles.subcategoryLi} ${selectedSubcategory?.id === subcategory.id
                              ? styles.active
                              : ''
                            }`}
                          onClick={() => handleSubcategorySelect(subcategory)}
                        >
                          <span>{subcategory.title}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              ) : (
                <>
                  {/* Flat clickable subcategory (no inner list) */}
                  <h4 className={styles.subcategoryHeader}>{category.title}</h4>
                  <ul className={styles.subcategoryUl}>
                    {category.subcategories.map((subcategory) => (
                      <li
                        key={subcategory.id}
                        className={`${styles.subcategoryLi} ${selectedSubcategory?.id === subcategory.id
                            ? styles.active
                            : ''
                          }`}
                        onClick={() => handleSubcategorySelect(subcategory)}
                      >
                        <span>{subcategory.title}</span>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default CollectionPopupList;
