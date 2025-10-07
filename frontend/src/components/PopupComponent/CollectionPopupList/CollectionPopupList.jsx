

// seconddd


// import React, { useEffect, useState, useCallback, useRef } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import {
//   fetchCollections,
//   resetCollections,
//   selectCategories,
//   selectLoading,
//   selectHasNextPage,
//   selectCursor,
// } from '../../../redux/ProductSlice/CollectionSlice';
// import styles from './CollectionPopupList.module.css';
// import { FaPlus, FaMinus } from "react-icons/fa6";

// const CollectionPopupList = ({ onCollectionSelect, mainloading, setLoading }) => {
//   const dispatch = useDispatch();

//   const { featuredBrands, categories } = useSelector(selectCategories);
//   const loading = useSelector(selectLoading);
//   const hasNextPage = useSelector(selectHasNextPage);
//   const cursor = useSelector(selectCursor);

//   const [selectedCategory, setSelectedCategory] = useState(null);
//   const [selectedSubcategory, setSelectedSubcategory] = useState(null);
//   const [categoryOpen, setCategoryOpen] = useState(true); // Initially, Categories are open
//   const [featuredBrandsOpen, setFeaturedBrandsOpen] = useState(false); // Initially, Featured Brands are closed
//   const hasInitialized = useRef(false);
//   const onCollectionSelectRef = useRef(onCollectionSelect);

//   useEffect(() => {
//     onCollectionSelectRef.current = onCollectionSelect;
//   }, [onCollectionSelect]);

//   // fetch data once
//   useEffect(() => {
//     dispatch(fetchCollections({ cursor: '' }));
//     return () => {
//       dispatch(resetCollections());
//       hasInitialized.current = false;
//     };
//   }, [dispatch]);

//   // inform parent about loading
//   useEffect(() => {
//     if (setLoading) setLoading(loading);
//   }, [loading, setLoading]);

//   useEffect(() => {
//     if (!hasInitialized.current && categories.length > 0) {
//       hasInitialized.current = true;
//     }
//   }, [categories]);

//   // Category click handler
//   const handleCategorySelect = useCallback((category) => {
//     setSelectedCategory((prev) =>
//       prev?.title === category.title ? null : category
//     );
//   }, []);

//   // Subcategory click (fetch products)
//   const handleSubcategorySelect = useCallback((subcategory) => {
//     setSelectedSubcategory(subcategory);
//     if (onCollectionSelectRef.current) {
//       onCollectionSelectRef.current(subcategory.id);
//     }
//   }, []);

//   // Toggle category section
//   const toggleCategoryList = () => setCategoryOpen((prev) => !prev);

//   // Toggle featured brands section
//   const toggleFeaturedBrandsList = () => setFeaturedBrandsOpen((prev) => !prev);

//   // Infinite scroll
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

//   if (loading && categories.length === 0) {
//     return <div className={styles.loadingContainer}></div>;
//   }

//   return (
//     <div
//       className={`${styles.collectionSidebar} ${mainloading ? styles.disabled : ''}`}
//       onScroll={handleScroll}
//     >
//       <ul className={styles.collectionUl}>
//         {/* Featured Brands Section */}


//         {/* Categories Section */}
//         <li className={styles.collectionLi}>
//           <div
//             className={`${styles.collectionCard} ${categoryOpen ? styles.active : ''}`}
//             onClick={toggleCategoryList}
//           >
//             <span>Categories</span>
//             <span className={styles.expandIcon}>
//               {categoryOpen ? <FaMinus /> : <FaPlus />}
//             </span>
//           </div>

//           {categoryOpen && (
//             <ul className={styles.subcategoryUl}>
//               {categories.map((category, index) => (
//                 <li key={index} className={styles.subcategoryLi}>
//                   <span>{category.title}</span>
//                   <ul className={styles.subcategoryNestedUl}>
//                     {category.subcategories.map((subcategory) => (
//                       <li
//                         key={subcategory.id}
//                         className={`${styles.subcategoryLi} ${selectedSubcategory?.id === subcategory.id ? styles.active : ''}`}
//                         onClick={() => handleSubcategorySelect(subcategory)}
//                       >
//                         <span>{subcategory.title}</span>
//                       </li>
//                     ))}
//                   </ul>
//                 </li>
//               ))}
//             </ul>
//           )}
//         </li>
//         <li className={styles.collectionLi}>
//           <div
//             className={`${styles.collectionCard} ${featuredBrandsOpen ? styles.active : ''}`}
//             onClick={toggleFeaturedBrandsList}
//           >
//             <span>Featured Brands</span>
//             <span className={styles.expandIcon}>
//               {featuredBrandsOpen ? <FaMinus /> : <FaPlus />}
//             </span>
//           </div>

//           {featuredBrandsOpen && (
//             <ul className={styles.subcategoryUl}>
//               {featuredBrands.map((brand) => (
//                 <li
//                   key={brand.id}
//                   className={`${styles.subcategoryLi} ${selectedSubcategory?.id === brand.id ? styles.active : ''}`}
//                   onClick={() => handleSubcategorySelect(brand)}
//                 >
//                   <span>{brand.title}</span>
//                 </li>
//               ))}
//             </ul>
//           )}
//         </li>
//       </ul>
//     </div>
//   );
// };

// export default CollectionPopupList;
// second

// Updated CollectionPopupList.jsx - Full code with CustomSelect integration
import React, { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchCollections,
  resetCollections,
  selectCategoriesArray,
  selectLoading,
  selectHasNextPage,
  selectCursor,
} from '../../../redux/ProductSlice/CollectionSlice';
import styles from './CollectionPopupList.module.css';
import { FaPlus, FaMinus } from "react-icons/fa6";
import CustomSelect from '../../CustomSelect/CustomSelect';

const CollectionPopupList = ({ onCollectionSelect, mainloading, setLoading }) => {
  const dispatch = useDispatch();
  const categories = useSelector(selectCategoriesArray);
  const loading = useSelector(selectLoading);
  const hasNextPage = useSelector(selectHasNextPage);
  const cursor = useSelector(selectCursor);

  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [openCategories, setOpenCategories] = useState({});
  const [isMobile, setIsMobile] = useState(false);
  const hasInitialized = useRef(false);
  const onCollectionSelectRef = useRef(onCollectionSelect);

  useEffect(() => {
    onCollectionSelectRef.current = onCollectionSelect;
  }, [onCollectionSelect]);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768 || window.innerWidth <= 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // fetch data once
  useEffect(() => {
    dispatch(fetchCollections({ cursor: '' }));
    return () => {
      dispatch(resetCollections());
      hasInitialized.current = false;
      setSelectedOption(null);
    };
  }, [dispatch]);

  // inform parent about loading
  useEffect(() => {
    if (setLoading) setLoading(loading);
  }, [loading, setLoading]);

  useEffect(() => {
    if (!hasInitialized.current && categories.length > 0) {
      hasInitialized.current = true;
      // Open first category by default
      if (categories[0]) {
        setOpenCategories({ [categories[0].key]: true });
      }
    }
  }, [categories]);

  // Prepare options for CustomSelect (same as before)
  const options = useMemo(() => {
    if (!categories || categories.length === 0) {
      return [];
    }
    return categories.map(category => ({
      label: category.title || category.name || 'Untitled',
      options: (category.subcategories || category.collections || []).map(subcategory => ({
        label: subcategory.title || subcategory.name || 'Untitled Sub',
        value: subcategory,
      })),
    }));
  }, [categories]);

  // Toggle category section
  const toggleCategory = useCallback((categoryKey) => {
    setOpenCategories((prev) => ({
      ...prev,
      [categoryKey]: !prev[categoryKey],
    }));
  }, []);

  // Subcategory click (fetch products)
  const handleSubcategorySelect = useCallback((subcategory) => {
    setSelectedSubcategory(subcategory);
    const option = { label: subcategory.title || subcategory.name, value: subcategory };
    setSelectedOption(option);
    if (onCollectionSelectRef.current) {
      onCollectionSelectRef.current(subcategory.id);
    }
  }, []);

  // Handle select change for mobile
  const handleSelectChange = useCallback((selected) => {
    if (selected) {
      handleSubcategorySelect(selected.value);
    } else {
      setSelectedOption(null);
      setSelectedSubcategory(null);
    }
  }, [handleSubcategorySelect]);

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
    return <div className={styles.loadingContainer}></div>;
  }

  // Mobile view - Custom Select
  if (isMobile) {
    return (
      <div className={`${styles.collectionSidebar} ${styles.mobileView} ${mainloading ? styles.disabled : ''}`}>
        {options.length === 0 ? (
          <div>No collections available.{loading ? ' Loading...' : ' Check connection.'}</div>
        ) : (
          <CustomSelect
            options={options}
            value={selectedOption}
            onChange={handleSelectChange}
            placeholder="Select a collection"
            disabled={mainloading}
          />
        )}
      </div>
    );
  }

  //  if (isMobile) {
  //   return (
  //     <div className={`${styles.collectionSidebar} ${styles.mobileView} ${mainloading ? styles.disabled : ''}`}>
  //       <select
  //         className={styles.mobileSelect}
  //         value={selectedSubcategory ? `${selectedSubcategory.handle}::${selectedSubcategory.id}` : ''}
  //         onChange={handleSelectChange}
  //       >
  //         <option value="">Select a collection</option>

  //         {categories.map((category) => (
  //           <optgroup key={category.key} label={category.title}>
  //             {category.subcategories.map((subcategory) => (
  //               <option
  //                 key={subcategory.id}
  //                 value={`${category.key}::${subcategory.id}`}
  //               >
  //                 {subcategory.title}
  //               </option>
  //             ))}
  //           </optgroup>
  //         ))}
  //       </select>
  //     </div>
  //   );
  // }



  // Desktop view - Expandable list
  return (
    <div
      className={`${styles.collectionSidebar} ${mainloading ? styles.disabled : ''}`}
      onScroll={handleScroll}
    >
      <ul className={styles.collectionUl}>
        {categories.map((category) => (
          <li key={category.key} className={styles.collectionLi}>
            <div
              className={`${styles.collectionCard} ${openCategories[category.key] ? styles.activee : ''}`}
              onClick={() => toggleCategory(category.key)}
            >
              <span>{category.title}</span>
              <span className={styles.expandIcon}>
                {openCategories[category.key] ? <FaMinus /> : <FaPlus />}
              </span>
            </div>

            {openCategories[category.key] && (
              <ul className={styles.subcategoryUl}>
                {category.subcategories.map((subcategory) => (
                  <li
                    key={subcategory.id}
                    className={`${styles.subcategoryLi} ${selectedSubcategory?.id === subcategory.id ? styles.active : ''}`}
                    onClick={() => handleSubcategorySelect(subcategory)}
                  >
                    <span>{subcategory.title}</span>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CollectionPopupList;