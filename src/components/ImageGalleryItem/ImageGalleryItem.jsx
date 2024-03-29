import React from 'react';
import PropTypes from 'prop-types';
import styles from './ImageGalleryItem.module.css';

const ImageGalleryItem = ({
  webformatURL,
  webformatWidth,
  webformatHeight,
  largeImageURL,
  tags,
  imgOnClick,
}) => {
  return (
    <li
      className={styles.galleryItem}
      onClick={() => imgOnClick(largeImageURL)}
    >
      <img
        className={styles.galleryItemImage}
        src={webformatURL}
        alt={tags}
        width={webformatWidth}
        height={webformatHeight}
      />
    </li>
  );
};

ImageGalleryItem.propTypes = {
  webformatURL: PropTypes.string.isRequired,
  webformatWidth: PropTypes.number,
  webformatHeight: PropTypes.number,
  largeImageURL: PropTypes.string,
  tags: PropTypes.string,
  imgOnClick: PropTypes.func,
};

export default ImageGalleryItem;
