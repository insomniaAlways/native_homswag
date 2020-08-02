import { Keyboard } from "react-native";
import ShowAlert, { catchError } from "../controllers/alert";
import * as Sentry from "@sentry/react-native";

const resisterPhone = async ({
  networkAvailability,
  setIsLoading,
  phone,
  registerUser,
  resendTimer,
  enableResend
}) => {
  Keyboard.dismiss();
  if (networkAvailability.isOffline) {
    return ShowAlert("Oops!", "Seems like you are not connected to Internet");
  }
  if (phone && phone.length == 10) {
    setIsLoading(true);
    try {
      await registerUser(phone);
      setIsLoading(false);
      resendTimer = setTimeout(() => {
        enableResend(true);
        clearTimeout(resendTimer);
      }, 5000);
    } catch (e) {
      setIsLoading(false);
      catchError("Oops!", e);
      Sentry.captureException(e);
    }
  } else {
    ShowAlert("Invalid data", "Please provide a valid phone number");
  }
};

export default resisterPhone;
