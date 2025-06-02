import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCollections, resetCollections } from '../../../redux/ProductSlice/CollectionSlice';
import { AngleActionIconBlack } from '../../iconsSvg/CustomIcon';
import styles from './CollectionPopupList.module.css';

const CollectionPopupList = ({ onCollectionSelect }) => {
  const dispatch = useDispatch();
  const { collections = [], loading, hasNextPage, cursor } = useSelector((state) => state.collections);

  const [selected, setSelected] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchCollections({ cursor: '' }));
    return () => dispatch(resetCollections());
  }, [dispatch]);

  const handleSelect = (collection) => {
    setSelected(collection);
    setDropdownOpen(false);
    onCollectionSelect(collection.id);
  };

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    const isBottom = scrollTop + clientHeight >= scrollHeight - 10;
    if (isBottom && hasNextPage && !loading) {
      dispatch(fetchCollections({ cursor }));
    }
  };

  return (
    <div className={`${styles.collectionSidebar} ${dropdownOpen ? styles.open : ''}`} onScroll={handleScroll}>
      {/* Mobile: Only show this on small screens */}
      <div className={styles.dropdownToggle} onClick={() => setDropdownOpen(!dropdownOpen)}>
        <span>{selected ? selected.title : 'Select Collection'}</span>
        <span className={`${styles.arrow} ${dropdownOpen ? styles.up : styles.down}`}>
          <AngleActionIconBlack />
        </span>
      </div>

      {/* List of collections */}
      <ul className={styles.collectionUl}>
        {collections.map((collection) => (
          <li
            key={collection.id}
            className={`${styles.collectionCard} ${styles.collectionLi}`}
            onClick={() => handleSelect(collection)}
          >
            <span>{collection.title}</span>
            <AngleActionIconBlack />
          </li>
        ))}
      </ul>

      {loading && <div className={styles.loader}>Loading...</div>}
    </div>
  );
};

export default CollectionPopupList;
