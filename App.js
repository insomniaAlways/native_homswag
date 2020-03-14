import React from 'react';
import {SafeAreaView, Text} from 'react-native';
import { Provider } from 'react-redux';
import store from './src/store';

const App = () => {
  return (
    <>
      <SafeAreaView>
        <Provider store={store}>
          <Text>Hello</Text>
        </Provider>
      </SafeAreaView>
    </>
  );
};

export default App;
