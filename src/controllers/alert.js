import React from 'react';
import { Alert } from 'react-native';

export default function ShowAlert(title, message) {
  return Alert.alert( title, message,
    [
      { text: "OK" }
    ],
    { cancelable: false }
  );
}