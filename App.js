import React from 'react';
import { SafeAreaView } from 'react-native';
import { Provider } from 'react-redux';
import store from './src/store';
import AppNavigator from './src/navigations';

const App = () => {
  return (
    <>
      <SafeAreaView>
        <Provider store={store}>
          <AppNavigator />
        </Provider>
      </SafeAreaView>
    </>
  );
};

export default App;
