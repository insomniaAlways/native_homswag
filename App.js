import React from 'react';
import {SafeAreaView, Text} from 'react-native';
import { Provider } from 'react-redux';
import store from './src/store';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const App = () => {
  return (
    <>
      <SafeAreaView>
        <Provider store={store}>
          <Text>Hello</Text>
          <FontAwesome name="rocket" size={30} color="#900" />
        </Provider>
      </SafeAreaView>
    </>
  );
};

export default App;
