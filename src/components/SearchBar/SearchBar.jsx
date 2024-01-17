import React from 'react';
import PropTypes from 'prop-types';
import styles from './SearchBar.module.css';

export default function SearchBar({ children }) {
  return <header className={styles.searchbar}>{children}</header>;
}

SearchBar.propTypes = {
  children: PropTypes.node,
};
