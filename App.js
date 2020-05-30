import React, { useLayoutEffect } from 'react';
import { Provider } from 'react-redux';
import store from './src/store';
import AppNavigator from './src/navigations';
import SplashScreen from 'react-native-splash-screen'
import NetInfo from '@react-native-community/netinfo';
import { onNetworkAvailable, onNetworkUnAvailable } from './src/store/actions/networkActions';

import * as Sentry from '@sentry/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import ShowAlert from './src/controllers/alert';

Sentry.init({ 
  dsn: 'https://16e35b4da8db4096b2298db1fb8049f0@sentry.io/2787983',
  enableInExpoDevelopment: false,
  debug: false
});

const App = () => {
  useLayoutEffect(() => {
    SplashScreen.hide()
    const unsubscribe = NetInfo.addEventListener(state => {
      if(!state.isConnected) {
        store.dispatch(onNetworkUnAvailable())
        ShowAlert('Oops!', 'Seems like you are not connected to Internet')
      } else {
        store.dispatch(onNetworkAvailable())
      }
    })
  }, [])

  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <AppNavigator />
      </SafeAreaProvider>
    </Provider>
  );
};

export default App;
