import React, { useLayoutEffect } from "react";
import { Provider } from "react-redux";
import store from "./src/store";
import AppNavigator from "./src/navigations";
import SplashScreen from "react-native-splash-screen";
import NetInfo from "@react-native-community/netinfo";
import {
  onNetworkAvailable,
  onNetworkUnAvailable
} from "./src/store/actions/networkActions";

import * as Sentry from "@sentry/react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import ShowAlert from "./src/controllers/alert";
import LoginModal from "./src/components/login-modal";

// XMLHttpRequest = GLOBAL.originalXMLHttpRequest ?
//     GLOBAL.originalXMLHttpRequest :
//     GLOBAL.XMLHttpRequest;

//   // fetch logger
// global._fetch = fetch;
// global.fetch = function (uri, options, ...args) {
//   return global._fetch(uri, options, ...args).then((response) => {
//     return response;
//   });
// };

Sentry.init({
  dsn: "https://16e35b4da8db4096b2298db1fb8049f0@sentry.io/2787983",
  debug: false
});

const App = () => {
  useLayoutEffect(() => {
    SplashScreen.hide();
    const unsubscribe = NetInfo.addEventListener((state) => {
      if (!state.isConnected) {
        store.dispatch(onNetworkUnAvailable());
        ShowAlert("Oops!", "Seems like you are not connected to Internet");
      } else {
        store.dispatch(onNetworkAvailable());
      }
    });
  }, []);

  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <AppNavigator />
        <LoginModal />
      </SafeAreaProvider>
    </Provider>
  );
};

export default App;
