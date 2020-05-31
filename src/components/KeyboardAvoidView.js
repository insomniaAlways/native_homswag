import React from 'react';
import { ScrollView } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

/**
 * https://github.com/APSL/react-native-keyboard-aware-scroll-view
 */
export const KeyboardAvoidingView = (props) => {
  const defaultProps = {
    style: { flex: 1 },
    contentContainerStyle: { flexGrow: 1 },
    bounces: false,
    bouncesZoom: false,
    alwaysBounceVertical: false,
    alwaysBounceHorizontal: false,
  };

  if (!KeyboardAwareScrollView) {
    const message = [
      'react-native-keyboard-aware-scroll-view: module not installed',
      'using fake call',
    ].join('\n');

    return React.createElement(ScrollView, defaultProps);
  }

  return React.createElement(KeyboardAwareScrollView, {
    enableOnAndroid: true,
    ...defaultProps,
    ...props,
  });
};