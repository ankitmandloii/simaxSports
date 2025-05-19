import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCollections, resetCollections } from '../../../redux/ProductSlice/CollectionSlice';
import './CollectionPopupList.css'
import { AngleActionIconBlack } from '../../iconsSvg/CustomIcon';
const CollectionPopupList = ({ onCollectionSelect }) => {
  const dispatch = useDispatch();
  const { collections = [], loading, hasNextPage, cursor } = useSelector((state) => state.collections);
  const [scrolling, setScrolling] = useState(false);

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
    const isBottom = scrollHeight - scrollTop <= clientHeight + 10;

    if (isBottom && !scrolling) {
      setScrolling(true);
      handleLoadMore();
    } else if (!isBottom && scrolling) {
      setScrolling(false);
    }
  };

  return (
    <div className="collection-sidebar" onScroll={handleScroll}>
      {loading && collections.length === 0 ? (
        <div className="loader" />
      ) : (
        <ul className='collection-ul'>
          {collections?.map((collection) => (
            <li
              key={collection.id}
              className="collection-card collection-li"
              onClick={() => onCollectionSelect(collection.id)}
            >
              <span>{collection.title}</span>
              <span><AngleActionIconBlack /></span>
            </li>
          ))}
        </ul>
      )}
      {/* {!loading && hasNextPage && (
        <button className="load-more" onClick={handleLoadMore}>
          LOAD MORE
        </button>
      )} */}
    </div>
  );
};

export default CollectionPopupList;
