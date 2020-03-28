import React, { useLayoutEffect } from 'react';
import { Provider } from 'react-redux';
import store from './src/store';
import AppNavigator from './src/navigations';
import SplashScreen from 'react-native-splash-screen'
import moment from 'moment';

XMLHttpRequest = GLOBAL.originalXMLHttpRequest ?
    GLOBAL.originalXMLHttpRequest :
    GLOBAL.XMLHttpRequest;

  // fetch logger
global._fetch = fetch;
global.fetch = function (uri, options, ...args) {
  return global._fetch(uri, options, ...args).then((response) => {
    return response;
  });
};

const App = () => {
  useLayoutEffect(() => {
    SplashScreen.hide()
  }, [])

  return (
    <Provider store={store}>
      <AppNavigator />
    </Provider>
  );
};

export default App;
