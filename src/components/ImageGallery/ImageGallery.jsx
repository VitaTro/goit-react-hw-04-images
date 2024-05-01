import ImageGalleryItem from 'components/ImageGalleryItem/ImageGalleryItem';
import PropTypes from 'prop-types';
import { useEffect } from 'react';
import css from './ImageGallery.module.css';

const ImageGallery = ({ images, clickHandler }) => {
  useEffect(() => {
    if (images.length > 12) {
      window.scrollBy({ top: 500, behavior: 'smooth' });
    }
  }, [images]);
  return (
    <ul className={css.gallery}>
      {images.map(image => (
        <ImageGalleryItem
          key={image.id}
          id={image.id}
          src={image.small}
          alt={image.alt}
          data={image.large}
          clickHandler={clickHandler}
        />
      ))}
    </ul>
  );
};

ImageGallery.propTypes = {
  page: PropTypes.number.isRequired,
  clickHandler: PropTypes.func.isRequired,
  images: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      small: PropTypes.string.isRequired,
      alt: PropTypes.string.isRequired,
      large: PropTypes.string.isRequired,
    }).isRequired
  ).isRequired,
};

export default ImageGallery;
