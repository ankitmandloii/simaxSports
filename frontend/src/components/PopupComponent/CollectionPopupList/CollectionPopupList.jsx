
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCollections, resetCollections } from '../../../redux/ProductSlice/CollectionSlice';
import { AngleActionIconBlack } from '../../iconsSvg/CustomIcon';
import styles from './CollectionPopupList.module.css';

const CollectionPopupList = ({ onCollectionSelect }) => {
  const dispatch = useDispatch();
  const { collections = [], loading, hasNextPage, cursor } = useSelector(
    (state) => state.collections
  );

  useEffect(() => {
    dispatch(fetchCollections({ cursor: '' }));
    return () => dispatch(resetCollections());
  }, [dispatch]);

  const handleLoadMore = () => {
    if (hasNextPage && !loading) {
      dispatch(fetchCollections({ cursor }));
    }
  };

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;


    const isBottom = scrollTop + clientHeight >= scrollHeight - 10;

    if (isBottom && hasNextPage && !loading) {
      console.log('Bottom reached → loading more...');
      handleLoadMore();
    }
  };


  return (
    <div className={styles.collectionSidebar} onScroll={handleScroll}>
      {loading && collections.length === 0 ? (
        // <div className="loader"></div>
        <div ></div>

      ) : (
        <ul className={styles.collectionUl}>
          {collections.map((collection) => (
            <li
              key={collection.id}
              className={`${styles.collectionCard} ${styles.collectionLi}`}
              onClick={() => onCollectionSelect(collection.id)}
            >
              <span>{collection.title}</span>
              <span>
                <AngleActionIconBlack />
              </span>
            </li>
          ))}
        </ul>
      )}
      {loading && collections.length > 0 && (
        <div className="loader"></div>
      )}
    </div>
  );
};

export default CollectionPopupList;
