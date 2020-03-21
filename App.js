import React, { useLayoutEffect } from 'react';
import { Provider } from 'react-redux';
import store from './src/store';
import AppNavigator from './src/navigations';
import SplashScreen from 'react-native-splash-screen'
import moment from 'moment';

const App = () => {
  console.log('add load', moment().format('mm:ss, SS'))

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
