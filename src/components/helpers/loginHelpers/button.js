import React, { useState, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  Keyboard
} from "react-native";
import { connect } from "react-redux";
import {
  register,
  validateToken
} from "../../../store/actions/authenticationAction";
import * as Sentry from "@sentry/react-native";
import ShowAlert, { catchError } from "../../../controllers/alert";

function LoginButtonHelper(props) {
  const {
    otpEnabled,
    styles,
    phone,
    otp,
    resetContextValue,
    registerUser,
    networkAvailability,
    setDisplayableButton,
    validatedOtp,
    startTimer,
    clearResendTimer,
    isProcessing,
    isResendEnable
  } = props;
  const [isOtpButtonEnable, setOtpEnable] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isContinueEnable, setContinueEnable] = useState(false);

  const handleContinuePress = async () => {
    Keyboard.dismiss();
    if (networkAvailability.isOffline) {
      return ShowAlert("Oops!", "Seems like you are not connected to Internet");
    }
    if (phone && phone.length == 10) {
      setIsLoading(true);
      try {
        await registerUser(phone);
        setIsLoading(false);
        setDisplayableButton("otp");
        startTimer();
      } catch (e) {
        setIsLoading(false);
        catchError("Oops!", e);
        Sentry.captureException(e);
      }
    } else {
      ShowAlert("Invalid data", "Please provide a valid phone number");
    }
  };

  const handleSubmitPress = async () => {
    Keyboard.dismiss();
    if (networkAvailability.isOffline) {
      ShowAlert("Oops!", "Seems like you are not connected to Internet");
    } else {
      if (phone && phone.length == 10 && otp && otp.length) {
        try {
          setIsLoading(true);
          clearResendTimer();
          await validatedOtp(phone, otp);
          setIsLoading(false);
        } catch (e) {
          setIsLoading(false);
          catchError("Oops!", e);
          clearResendTimer();
          Sentry.captureException(e);
        }
      }
    }
  };

  useEffect(() => {
    if (otp && otp.length > 0 && isContinueEnable) {
      setOtpEnable(true);
    } else {
      setOtpEnable(false);
    }
    return () => clearResendTimer();
  }, [otp, isContinueEnable]);

  useEffect(() => {
    if (phone && phone.length == 10) {
      setContinueEnable(true);
    } else {
      resetContextValue("otp", "");
      setContinueEnable(false);
      setDisplayableButton("continue");
      clearResendTimer();
    }
    return () => clearResendTimer();
  }, [phone]);

  console.log("isResendEnable", isResendEnable);

  if (isLoading || isProcessing) {
    return (
      <View style={styles.signInButtonContainer}>
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "transparent",
            paddingVertical: 11
          }}
        >
          <ActivityIndicator size="small" color="#0000ff" />
        </View>
      </View>
    );
  } else {
    return (
      <>
        {otpEnabled && (
          <View style={styles.resetContainer}>
            <TouchableOpacity
              style={styles.resendButton}
              disabled={!isResendEnable}
              onPress={handleContinuePress}
            >
              <Text
                style={
                  isResendEnable ? styles.resendText : styles.resendDisableText
                }
              >
                Resend OTP
              </Text>
            </TouchableOpacity>
          </View>
        )}
        <View style={styles.buttonContainer}>
          {otpEnabled ? (
            <TouchableOpacity
              onPress={handleSubmitPress}
              disabled={!isOtpButtonEnable}
            >
              <View
                style={
                  isOtpButtonEnable
                    ? styles.submitButton
                    : styles.disabledButtton
                }
              >
                <Text style={styles.submitText}>Submit</Text>
              </View>
            </TouchableOpacity>
          ) : (
            <>
              <TouchableOpacity
                onPress={handleContinuePress}
                disabled={!isContinueEnable}
              >
                <View
                  style={
                    isContinueEnable
                      ? styles.continueButton
                      : styles.disabledButtton
                  }
                >
                  <Text style={styles.continueText}>Continue</Text>
                </View>
              </TouchableOpacity>
            </>
          )}
        </View>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  networkAvailability: state.networkAvailability
});

const mapDispathToProps = (dispatch) => ({
  registerUser: (phone) => dispatch(register(phone)),
  validatedOtp: (phone, otp) => dispatch(validateToken(phone, otp))
});

export default connect(mapStateToProps, mapDispathToProps)(LoginButtonHelper);
