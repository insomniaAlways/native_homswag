import React from 'react';
import { SafeAreaView } from 'react-native';
import { Provider } from 'react-redux';
import store from './src/store';
import AppNavigator from './src/navigations';
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { mapping, light as lightTheme } from '@eva-design/eva';
import { brandTheme } from './src/style/custom-theme';

const theme = { ...lightTheme, ...brandTheme };

const App = () => {
  return (
    <>
      <SafeAreaView>
        <Provider store={store}>
        <IconRegistry icons={EvaIconsPack} />
          <ApplicationProvider mapping={mapping} theme={theme}>
            <AppNavigator />
          </ApplicationProvider>
        </Provider>
      </SafeAreaView>
    </>
  );
};

export default App;
