import { Alert } from "react-native";

export default function ShowAlert(title, message) {
  return Alert.alert(title, message, [{ text: "OK" }], { cancelable: false });
}

export function catchError(title, error) {
  if (error && error.message) {
    ShowAlert(title, error.message);
  } else {
    ShowAlert(title, error);
  }
}
