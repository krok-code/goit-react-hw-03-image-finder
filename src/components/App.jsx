import React, { PureComponent } from 'react';
import styles from './App.module.css';
import { fetchImages, IMAGES_PER_PAGE } from 'api/fetch-data';
import SearchForm from './SearchForm/SearchForm';
import SearchBar from './SearchBar/SearchBar';
import Notification from './Notification';
import ImageGallery from './ImageGallery/ImageGallery';
import Button from './Button/Button';
import { Loader } from './Loader/Loader';
import Modal from './Modal/Modal';

const NOTIFICATION_TYPE = {
  succes: 'succes',
  error: 'danger',
  warning: 'warning',
  info: 'info',
};

export class App extends PureComponent {
  state = {
    images: [],
    query: '',
    page: 1,
    notification: {
      type: NOTIFICATION_TYPE.info,
      message: '',
      show: false,
    },
    isLoadMore: false,
    isLoader: false,
    modal: {
      show: false,
      largeImageUrl: '',
    },
  };

  componentDidUpdate(_, prevState) {
    const { query } = this.state;

    if (prevState.query !== query) {
      this.setState({ page: 1, isLoader: true });

      fetchImages(query)
        .then(data => {
          console.log('data :>>', data);

          if (!data.totalHits) {
            this.showNotification(
              NOTIFICATION_TYPE.info,
              'Sorry, there are no images matching your search query. Please try again.'
            );
            return;
          }

          this.setState({ images: data.hits, isLoadMore: false });

          if (data.totalHits > IMAGES_PER_PAGE) {
            this.displayLoadMoreButton(true);
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

  handleFetchError = error => {
    console.error('Fetch error:>>', error);
    this.showNotification(
      NOTIFICATION_TYPE.error,
      `Sorry, there is fetching error: ${error.message}. Please try again.`
    );
  };

  handleSearchFormSubmit = query => {
    if (!query) {
      this.showNotification(
        NOTIFICATION_TYPE.warning,
        'Please, input some search query.'
      );
      return;
    }
    this.setState({ query });
  };

  handleOnClickLoadMoreButton = () => {
    this.setState(
      prevState => ({ page: prevState.page + 1, isLoader: true }),
      () => {
        const { query, page } = this.state;
        fetchImages(query, page)
          .then(data => {
            this.setState(prevState => ({
              images: [...prevState.images, ...data.hits],
            }));

            if (IMAGES_PER_PAGE * page >= data.totalHits) {
              this.displayLoadMoreButton(
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
          <Button onClick={this.handleOnClickLoadMoreButton}>Load More</Button>
        )}
        {modal.show && (
          <Modal url={modal.largeImageUrl} onClose={this.closeModal} />
        )}
      </div>
    );
  }
}