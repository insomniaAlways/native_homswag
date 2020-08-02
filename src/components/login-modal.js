import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  Platform,
  TouchableOpacity
} from "react-native";
import { connect } from "react-redux";
import { requestLoginCancel } from "../store/actions/authenticationAction";
import ModalHelper from "./helpers/modal-helper";
import PlaceHolderTextInput from "./placeHolderTextInput";
import LoginButtonHelper from "./helpers/loginHelpers/button";
import { brandColor, brandLightBackdroundColor } from "../style/customStyles";
import { setSessionAuthenticated } from "../store/actions/sessionActions";
import { catchError } from "../controllers/alert";
import * as Sentry from "@sentry/react-native";
import { fetchUser } from "../store/actions/userActions";
import { fetchCart } from "../store/actions/cartAction";
import { fetchCartItems } from "../store/actions/cartItemAction";

let resendTimer;

function LoginModal(props) {
  const { authModel, session, cancelLogin, authenticate } = props;
  const [openModal, toggleModal] = useState(false);
  const [loginContext, setLoginContext] = useState({
    phone: null,
    otp: null
  });
  const [displayButton, setDisplayableButton] = useState("continue");
  const [isResendEnable, enableResend] = useState(false);
  const [isProcessing, setProcessing] = useState(false);

  const startTimer = () => {
    enableResend(false);
    console.log("startTimer");
    clearResendTimer(resendTimer);
    resendTimer = setTimeout(() => {
      enableResend(true);
      clearResendTimer(resendTimer);
    }, 10000);
  };

  const fetchUserData = async () => {
    await props.getUser();
    await props.getCart();
    await props.getAllCartItems();
    setProcessing(false);
    toggleModal(false);
  };

  const clearResendTimer = (from) => {
    console.log("clearResendTimer", from);
    clearTimeout(resendTimer);
  };

  useEffect(() => {
    if (!session.isSessionAuthenticated) {
      toggleModal(authModel.isLoginRequested);
    }
    setDisplayableButton("continue");
    setLoginContext({ phone: null, otp: null });
    clearResendTimer("session");
    return () => clearResendTimer("session return");
  }, [authModel.isLoginRequested]);

  useEffect(() => {
    if (!authModel.isLoading && authModel.userToken && authModel.refreshToken) {
      setProcessing(true);
      authenticate(authModel.userToken, authModel.refreshToken);
      fetchUserData();
    } else if (!authModel.isLoading && authModel.error) {
      catchError("Oops!", authModel.error);
      Sentry.captureException(authModel.error);
    }
    return () => clearResendTimer("authModel");
  }, [authModel.isLoading]);

  const closeModal = () => {
    cancelLogin();
    toggleModal(false);
  };

  const resetContextValue = (key, value) => {
    setLoginContext({
      ...loginContext,
      [key]: value
    });
  };

  return (
    <ModalHelper openModal={openModal} toggleModal={closeModal}>
      <View style={{ height: "55%" }}></View>
      <View style={styles.scrollableModal}>
        <View style={styles.container}>
          <View style={{ padding: 20 }}>
            <Text style={styles.header}>Login to continue</Text>
            <View style={styles.inputContainer}>
              <PlaceHolderTextInput
                placeholder={"Enter Phone Number"}
                previousState={loginContext}
                setValue={setLoginContext}
                itemKey={"phone"}
                value={loginContext.phone}
                styles={styles.inputStyles}
                disabled={isProcessing}
                keyboardType={
                  Platform.OS === "ios" ? "name-phone-pad" : "number-pad"
                }
                maxLength={10}
              />
            </View>
            {displayButton === "otp" && (
              <View style={styles.inputContainer}>
                <PlaceHolderTextInput
                  placeholder={"Enter OTP"}
                  previousState={loginContext}
                  setValue={setLoginContext}
                  itemKey={"otp"}
                  value={loginContext.otp}
                  styles={styles.inputStyles}
                  disabled={isProcessing}
                  keyboardType={
                    Platform.OS === "ios" ? "name-phone-pad" : "number-pad"
                  }
                  maxLength={10}
                />
              </View>
            )}
            <LoginButtonHelper
              phone={loginContext.phone}
              otp={loginContext.otp}
              resetContextValue={resetContextValue}
              otpEnabled={displayButton === "otp"}
              styles={styles}
              isResendEnable={isResendEnable}
              setDisplayableButton={setDisplayableButton}
              startTimer={startTimer}
              clearResendTimer={clearResendTimer}
              isProcessing={isProcessing}
            />
          </View>
        </View>
      </View>
    </ModalHelper>
  );
}

const mapStateToProps = (state) => ({
  authModel: state.auth,
  session: state.session
});

const mapDispatchToProps = (dispatch) => ({
  cancelLogin: () => dispatch(requestLoginCancel()),
  authenticate: (token, refreshToken) =>
    dispatch(setSessionAuthenticated(token, refreshToken)),
  getUser: () => dispatch(fetchUser()),
  getCart: () => dispatch(fetchCart()),
  getAllCartItems: () => dispatch(fetchCartItems())
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginModal);

const backgroundColor = {
  backgroundColor: brandColor,
  height: "100%",
  width: "100%",
  justifyContent: "center",
  borderRadius: 5
};

const buttonTextStyle = {
  textAlign: "center",
  color: "#fff",
  fontSize: 20
};

const disabledButtton = {
  ...backgroundColor,
  backgroundColor: brandLightBackdroundColor
};

const resendButton = {
  paddingHorizontal: 10,
  paddingVertical: 5
};

const styles = StyleSheet.create({
  bottomModal: {
    justifyContent: "flex-end",
    margin: 0,
    flex: 1
  },
  container: {
    backgroundColor: "white",
    height: "100%",
    borderTopEndRadius: 20,
    borderTopLeftRadius: 20
  },
  header: {
    fontSize: 14,
    fontFamily: "Roboto-Medium"
  },
  inputContainer: {
    paddingHorizontal: 30,
    marginVertical: 10,
    height: 60,
    justifyContent: "center"
  },
  inputStyles: {
    fontSize: 19,
    paddingLeft: 10
  },
  buttonContainer: {
    paddingHorizontal: 20,
    marginVertical: 10,
    height: 50
  },
  continueButton: backgroundColor,
  continueText: buttonTextStyle,
  submitButton: backgroundColor,
  submitText: buttonTextStyle,
  disabledButtton: disabledButtton,
  resetContainer: {
    alignItems: "flex-end"
  },
  resendButton: resendButton,
  resendText: {
    color: brandColor
  },
  resendDisableText: {
    color: "#eee"
  }
});
