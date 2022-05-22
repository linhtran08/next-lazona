import React from 'react';
import PropTypes from 'prop-types';
import createEmotionCache from '../utility/createEmotionCache';
import '../styles/globals.css';
import {StoreProvider} from "../utility/Store";
import {SnackbarProvider} from "notistack";

const clientSideEmotionCache = createEmotionCache();

const MyApp = (props) => {
  const {Component = clientSideEmotionCache, pageProps} = props;

  return (
		<SnackbarProvider anchorOrigin={{vertical: 'top', horizontal: 'center'}}>
			<StoreProvider>
				<Component {...pageProps} />
			</StoreProvider>
		</SnackbarProvider>
  );
};

export default MyApp;

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  emotionCache: PropTypes.object,
  pageProps: PropTypes.object.isRequired,
};
