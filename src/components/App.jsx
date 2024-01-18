import React, { PureComponent } from 'react';
import styles from './App.module.css';
import { fetchImages, IMAGES_PER_PAGE } from '../api/fetch-data';
import SearchForm from './SearchForm/SearchForm';
import SearchBar from './SearchBar/SearchBar';
import Notification from './Notification';
import ImageGallery from './ImageGallery/ImageGallery';
import Button from './Button/Button';
import { Loader } from './Loader/Loader';
import Modal from './Modal/Modal';

const NOTIFICATION_TYPE = {
  success: 'success',
  error: 'danger',
  warning: 'warning',
  info: 'info',
};

const INITIAL_STATE = {
  images: [],
  query: '',
  page: 1,
  isLoadMore: false,
  isLoader: false,
  notification: {
    type: NOTIFICATION_TYPE.info,
    message: '',
    show: false,
  },
  modal: {
    show: false,
    largeImageUrl: '',
  },
};

export class App extends PureComponent {
  state = {
    ...INITIAL_STATE,
  };

  componentDidUpdate(_, prevState) {
    const { query, page } = this.state;

    if (prevState.query !== query || prevState.page !== page) {
      this.setState({ isLoader: true });

      fetchImages(query, page)
        .then(data => {
          console.log('data :>> ', data);

          if (!data.totalHits) {
            this.showNotification(
              NOTIFICATION_TYPE.info,
              'Sorry, there are no images matching your search query. Please try again.'
            );
            return;
          }

          this.setState(prevState => ({
            images: [...prevState.images, ...data.hits],
          }));

          if (data.totalHits > IMAGES_PER_PAGE) {
            this.displayLoadMoreButton(true);
          }

          if (IMAGES_PER_PAGE * page >= data.totalHits) {
            this.displayLoadMoreButton(false);
            this.showNotification(
              NOTIFICATION_TYPE.info,
              "We're sorry, but you've reached the end of search results."
            );
          }
        })
        .catch(error => {
          this.handleFetchError(error);
        })
        .finally(() => {
          this.setState({ isLoader: false });
        });
    }
  }

  handleSearchFormSubmit = query => {
    if (!query) {
      this.showNotification(
        NOTIFICATION_TYPE.warning,
        'Please, input some search query.'
      );
      return;
    }
    this.setState({ ...INITIAL_STATE, query });
  };

  handleOnClickLoadMoreButton = () => {
    this.setState(prevState => ({ page: prevState.page + 1 }));
  };

  handleFetchError = error => {
    console.error('Fetch error:>> ', error);
    this.showNotification(
      NOTIFICATION_TYPE.error,
      `Sorry, there is fetching error: ${error.message}. Please try again.`
    );
  };

  closeModal = () => {
    this.setState({ modal: { show: false } });
  };

  handleOnClickImage = url => {
    this.setState({
      modal: {
        show: true,
        largeImageUrl: url,
      },
    });
  };

  displayLoadMoreButton = isShow => {
    this.setState({ isLoadMore: isShow });
  };

  showNotification = (type, message) => {
    this.setState({
      notification: {
        type,
        message,
        show: true,
      },
    });
  };

  closeNotification = () => {
    this.setState({ notification: { show: false } });
  };

  render() {
    const { images, notification, isLoadMore, isLoader, modal } = this.state;
    return (
      <div className={styles.app}>
        <SearchBar>
          <SearchForm onSubmit={this.handleSearchFormSubmit} />
        </SearchBar>
        {notification.show && (
          <Notification
            type={notification.type}
            onClose={this.closeNotification}
          >
            {notification.message}
          </Notification>
        )}
        <ImageGallery images={images} imgOnClick={this.handleOnClickImage} />
        {isLoader && <Loader />}
        {isLoadMore && (
          <Button onClick={this.handleOnClickLoadMoreButton}>Load more</Button>
        )}
        {modal.show && (
          <Modal url={modal.largeImageUrl} onClose={this.closeModal} />
        )}
      </div>
    );
  }
}
