import React from 'react';
import PropTypes from 'prop-types';
import createEmotionCache from '../utility/createEmotionCache';
import '../styles/globals.css';
import {StoreProvider} from "../utility/Store";

const clientSideEmotionCache = createEmotionCache();

const MyApp = (props) => {
  const {Component = clientSideEmotionCache, pageProps} = props;

  return (
      <StoreProvider>
        <Component {...pageProps} />
      </StoreProvider>
  );
};

export default MyApp;

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  emotionCache: PropTypes.object,
  pageProps: PropTypes.object.isRequired,
};
