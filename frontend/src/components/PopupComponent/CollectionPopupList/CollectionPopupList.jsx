import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchCollections,
  resetCollections,
} from '../../../redux/ProductSlice/CollectionSlice';
import { AngleActionIconBlack } from '../../iconsSvg/CustomIcon';
import styles from './CollectionPopupList.module.css';

const CollectionPopupList = ({ onCollectionSelect }) => {
  const dispatch = useDispatch();
  const {
    collections = [],
    loading,
    hasNextPage,
    cursor,
  } = useSelector((state) => state.collections);

  const [selected, setSelected] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchCollections({ cursor: '' }));
    return () => dispatch(resetCollections());
  }, [dispatch]);

  const handleSelect = useCallback(
    (collection) => {
      setSelected(collection);
      setDropdownOpen(false);
      onCollectionSelect?.(collection.id);
    },
    [onCollectionSelect]
  );

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

  return (
    <div
      className={`${styles.collectionSidebar} ${dropdownOpen ? styles.open : ''}`}
      onScroll={handleScroll}
    >
      {/* Dropdown header for mobile */}
      <div
        className={styles.dropdownToggle}
        onClick={() => setDropdownOpen((prev) => !prev)}
      >
        <span>{selected?.title || 'Select Collection'}</span>
        <span className={`${styles.arrow} ${dropdownOpen ? styles.up : styles.down}`}>
          <AngleActionIconBlack />
        </span>
      </div>

      {/* Collection List */}
      <ul className={styles.collectionUl}>
        {collections.map((collection) => (
          <li
            key={collection.id}
            className={`${styles.collectionCard} ${styles.collectionLi} ${selected?.id === collection.id ? styles.active : ''
              }`}
            onClick={() => handleSelect(collection)}
          >
            <span>{collection.title}</span>
            <AngleActionIconBlack />
          </li>
        ))}
      </ul>
      {/* {loading && <img src="https://upload.wikimedia.org/wikipedia/commons/b/b1/Loading_icon.gif" alt="loading" className={styles.filterImage} />} */}

      {/* {loading && <div className={styles.loader}>Loading...</div>} */}
    </div>
  );
};

export default CollectionPopupList;
