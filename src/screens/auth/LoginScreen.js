import React, { useState, useEffect, useLayoutEffect } from 'react';
import { StyleSheet, View, Image, Dimensions } from 'react-native';
import { Text, Spinner } from '@ui-kitten/components';
import { ImageOverlay } from '../../components/imageOverlay';
import { KeyboardAvoidingView } from '../../components/KeyboardAvoidView';
import ImageBackground from '../../assets/images/login_background.png'
import Logo from '../../assets/images/logo_rounded_512*512.png'
import { connect } from 'react-redux';
import { register, validatedAuthToken } from '../../store/actions/authenticationAction';
import { setSessionUnauthenticated, setSessionAuthenticated } from '../../store/actions/sessionActions';
import { fetchUser } from '../../store/actions/userActions'
import AsyncStorage from '@react-native-community/async-storage';
import * as Animatable from 'react-native-animatable';
import LoginForm from '../../components/helpers/loginForm';
import LoginButtons from '../../components/helpers/loginButtons';
// import Constants from 'expo-constants';
import moment from 'moment';
// import * as Sentry from 'sentry-expo';

const LoginScreen = (props) => {
  const { navigation,
    registerUser,
    currentUserModel,
    networkAvailability,
    unAuthenticate,
    authenticate,
    getUser,
    authModel,
    session,
    validateCurrentToken } = props
  const [ phone, setPhone ] = useState();
  const [ otp, setOtp ] = useState();
  const [ showOtpField, setShowOtpField ] = useState(false);
  const [ isLoading, setLoading ] = useState(true)
  const [ isButtonLoading, setButtonLoading ] = useState(false)
  const [ isResendEnable, enableResend ] = useState(false)
  let resendTimer;

  //  ------------------ : Methods: ---------------------

  //called when first time login and after logout
  const startLoginProcess = async () => {
    setLoading(false)
    await unAuthenticate()
  }

  //while application load
  const checkAuthentication = async () => {
    try {
      let token = await AsyncStorage.getItem('token')
      let tokenObject = JSON.parse(token)
      if(tokenObject && tokenObject.authToken && tokenObject.refreshToken) {
        validateCurrentToken(tokenObject.authToken, tokenObject.refreshToken)
      } else {
        startLoginProcess()
      }
    } catch (e) {
      if(typeof(e) == "string" && e.includes('JSON')) {
        alert('Your session has expired, Please Login again')
      } else {
        alert(e)
      }
      setLoading(false)
    }
  }

  //should called while session is authenticated and current user data loaded
  const redirectTo = () => {
    if(currentUserModel.values && currentUserModel.values.name) {
      navigation.navigate('App')
    } else if (currentUserModel.values && !currentUserModel.values.name) {
      navigation.navigate('ProfileUpdate')
    }
    setButtonLoading(false)
    setLoading(false)
  }

  const registerPhone = async () => {
    if(networkAvailability.isOffline) {
      alert('Seems like you are not connected to Internet')
    } else {
      if(phone && phone.length == 10) {
        setButtonLoading(true)
        try {
          await registerUser(phone)
          setShowOtpField(true)
          setButtonLoading(false)
          resendTimer = setTimeout(() => {
            enableResend(true)
            clearTimeout(resendTimer)
          }, 5000);
        } catch(e) {
          setButtonLoading(false)
          alert(e)
        }
      } else {
        alert("Please provide a valid phone number")
      }
    }
  }

  //  ------------------- : END: -----------------------

  // ------------------- : Hooks : ---------------------

  useLayoutEffect(() => {
    // Sentry.captureMessage(`Login screen load on: ${moment().unix()}`);
    checkAuthentication()
  }, [])

  //trigger when otp validation succeed
  useEffect(() => {
    if(!authModel.isLoading && authModel.userToken && authModel.refreshToken) {
      authenticate(authModel.userToken, authModel.refreshToken)
    } else if(!authModel.isLoading && authModel.error) {
      setButtonLoading(false)
      setLoading(false)
      if(authModel.error && authModel.error.message) {
        alert(authModel.error.message)
      } else {
        alert(authModel.error)
      }
    }
  }, [authModel.isLoading, authModel.userToken])

  //trigger after session is authenticated
  useEffect(() => {
    if(session.isSessionAuthenticated) {
      // Sentry.captureMessage(`Get User called on ${moment().unix()}`);
      getUser()
    }
  }, [session.isSessionAuthenticated])

  //trigger after only session get authenticated
  //Should responsible for redirection
  useEffect(() => {
    if(session.isSessionAuthenticated) {
      if(!currentUserModel.isLoading && currentUserModel.values && currentUserModel.values.id) {
        // Sentry.captureMessage(`Redirect To called on: ${moment().unix()}`);
        redirectTo()
      } else if(!currentUserModel.isLoading && currentUserModel.error) {
        setButtonLoading(false)
        if(currentUserModel.error && currentUserModel.error.message) {
          alert(currentUserModel.error.message)
        } else {
          alert(currentUserModel.error)
        }
      }
    }
  }, [currentUserModel.isLoading, currentUserModel.values, currentUserModel.error])

  // -------------------: END : ---------------------

  return (
    <ImageOverlay
      style={styles.container}
      source={ImageBackground}>
      <View style={{flex: 1}}>
        <View style={styles.headerContainer}>
          <Image source={Logo} style={{width: 180, height: 180}}/>
        </View>
        {!isLoading?
          <Animatable.View
            duration={400}
            style={styles.formContainer}
            animation={"fadeInUp"}
          >
            <View style={styles.formContent}>
              <KeyboardAvoidingView>
                <LoginForm
                  phone={phone}
                  setPhone={setPhone}
                  otp={otp}
                  setOtp={setOtp}
                  showOtpField={showOtpField}
                  registerPhone={registerPhone}
                  setShowOtpField={setShowOtpField}
                  isResendEnable={isResendEnable}
                  enableResend={enableResend}
                />
                { isLoading ? 
                  <View style={styles.signInButtonContainer}>
                    <View style={[styles.signInButton, {justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent'}]}>
                      <Spinner status='primary'/>
                    </View>
                  </View> :
                  <LoginButtons
                    phone={phone}
                    otp={otp}
                    resendTimer={resendTimer}
                    networkAvailability={networkAvailability}
                    showOtpField={showOtpField}
                    isButtonLoading={isButtonLoading}
                    setButtonLoading={setButtonLoading}
                    enableResend={enableResend}
                    setOtp={setOtp}
                    registerPhone={registerPhone}
                    setShowOtpField={setShowOtpField}
                  />
                }
              </KeyboardAvoidingView>
            </View>
          </Animatable.View> : 
          <View style={[{top: '39%', alignItems: 'center', position: 'absolute'}, styles.container]}>
            <Spinner status='primary'/>
            <Text style={{color: '#000', fontSize: 20, fontWeight: 'bold', marginTop: 10}}>Loading...</Text>
          </View>
        }
      </View>
    </ImageOverlay>
  );
};

const mapStateToProps = state => ({
  authModel: state.auth,
  currentUserModel: state.currentUser,
  networkAvailability: state.networkAvailability,
  session: state.session
})

const mapDispatchToProps = dispatch => ({
  registerUser: (phone) => dispatch(register(phone)),
  getUser: () => dispatch(fetchUser()),
  unAuthenticate: () => dispatch(setSessionUnauthenticated()),
  authenticate: (token, refreshToken) => dispatch(setSessionAuthenticated(token, refreshToken)),
  validateCurrentToken: (authToken, refreshToken) => dispatch(validatedAuthToken(authToken, refreshToken))
})

export default connect(mapStateToProps,mapDispatchToProps)(LoginScreen);

const styles = StyleSheet.create({
  container: {
    flex: 3,
    width: 300,
    height: 800,
    // width: Dimensions.get('window').width,
    // height: Dimensions.get('window').height,
    // paddingTop: Constants.statusBarHeight + 60
    paddingTop:60
  },
  headerContainer: {
    paddingTop: 40,
    // paddingTop: Constants.statusBarHeight + 40,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 216,
  },
  formContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop:40
  },
  formContent: {
    // flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    width: '100%',
    height: '100%',
    paddingHorizontal: 16,
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderTopEndRadius: 40,
    borderTopStartRadius: 40,
  },
  signInLabel: {
    marginTop: 16,
  },
  signInButton: {
    marginHorizontal: 16,
    marginBottom: 10,
    paddingVertical: 10,
    width: 140,
    backgroundColor: '#eee',
    borderRadius: 10
  },
  signUpButton: {
    marginVertical: 12,
    marginHorizontal: 16,
  },
  forgotPasswordContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  passwordInput: {
    marginTop: 16,
  },
  signInButtonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});