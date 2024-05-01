import { useEffect, useState } from 'react';
import Api from './Api';
import './App.css';
import Button from './Button/Button';
import ImageGallery from './ImageGallery/ImageGallery';
import Loader from './Loader/Loader';
import Modal from './Modal/Modal';
import OnError from './OnError/OnError';
import SearchBar from './SearchBar/SearchBar';

const App = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  // const [error, setError] = useState(null);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  // const modalInfo = useRef({
  //   modalPhotoURL: null,
  //   modalAlt: null,
  // });
  const [modalPhotoURL, setModalPhotoURL] = useState(null);
  const [modalAlt, setModalAlt] = useState(null);

  // запит
  const updateQuery = ({ query }) => {
    setQuery(query);
  };

  // приймає з бекенду картинки за пошуком
  const mapImages = fetchedImages => {
    const mappedImages = fetchedImages.map(image => ({
      id: image.id,
      small: image.webformatURL, // якщо змінити тут f на F, то картинки зникають. замість них з'являється "бита"
      large: image.largeImageURL,
      alt: image.tags,
    }));
    return mappedImages;
  };

  // наступна сторінка
  const nextPage = () => {
    setPage(prevPage => prevPage + 1);
  };
  // відкрити вікно натисненням на картинку
  const openModal = e => {
    setModalIsOpen(true);
    // значення при useRef() .current у "коробці" змінює на актуальне значення, так як при set
    // modalInfo.current = {
    //   modalPhotoURL: e.target.dataset['source'],
    //   modalAlt: e.target.alt,
    // };
    setModalPhotoURL(e.target.dataset['source']);
    setModalAlt(e.target.alt);
  };
  // закрити вікно
  const closeModal = e => {
    if (e.target.nodeName !== 'IMG') {
      setModalIsOpen(false);
    }
  };

  // закрити вікно через кнопку ESCAPE
  const closeModalEsc = e => {
    if (e.key === 'Escape') {
      setModalIsOpen(false);
    }
  };

  // геморой на два тижні

  // const fetchData = async () => {
  //   try {
  //     setLoading(true);
  //     const fetchedData = await Api.fetchPhotos(query, 1);
  //     const mappedImages = await mapImages(fetchedData.images);
  //     const lastPage = Math.ceil(fetchedData.total / 12);
  //     setPage(1);
  //     setImages([...mappedImages]);
  //     setLastPage(lastPage);
  //     window.scrollTo({ top: 0, behavior: 'smooth' });
  //   } catch (error) {
  //     console.log('Error');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   if (query !== '') {
  //     fetchData();
  //   }
  // }, [query]);

  // const fetchButton = async () => {
  //   try {
  //     setLoading(true);
  //     const fetchedData = await Api.fetchPhotos(query, page);
  //     const mappedImages = await mapImages(fetchedData.images);
  //     const concatImages = images.concat(mappedImages);
  //     setImages([...concatImages]);
  //   } catch (error) {
  //     console.log('Error');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   if (page !== 1) {
  //     fetchButton();
  //   }
  // }, [page]);

  useEffect(() => {
    if (!query) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const fetchedData = await Api.fetchPhotos(query, 1);
        const mappedImages = mapImages(fetchedData.images);
        const lastPage = Math.ceil(fetchedData.total / 12);
        setImages(mappedImages);
        setPage(1);
        setLastPage(lastPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [query]);

  useEffect(() => {
    if (page !== 1) {
      const fetchData = async () => {
        setLoading(true);
        try {
          const fetchedData = await Api.fetchPhotos(query, page);
          const mappedImages = mapImages(fetchedData.images);
          setImages(prevImages => [...prevImages, ...mappedImages]);
        } catch (error) {
          console.log(error);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [page, query]);

  return (
    <>
      {modalIsOpen && (
        <Modal
          imgSrc={modalPhotoURL}
          imgAlt={modalAlt}
          closeHandler={closeModal}
          escHandler={closeModalEsc}
        ></Modal>
      )}
      <SearchBar onSubmit={updateQuery} />
      <ImageGallery images={images} page={page} clickHandler={openModal} />
      {page !== lastPage && images.length > 0 && loading === false ? (
        <Button onClick={nextPage} />
      ) : (
        ''
      )}
      {loading && <Loader />}
      {images.length === 0 && query !== '' && loading === false && (
        <OnError>Nothing found! Try again</OnError>
      )}
    </>
  );
};

export default App;
