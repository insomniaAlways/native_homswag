import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, ActivityIndicator, Keyboard } from 'react-native';
import { connect } from 'react-redux';
import { register, validateToken } from '../../store/actions/authenticationAction';
import * as Sentry from '@sentry/react-native';
import ShowAlert from '../../controllers/alert';

function LoginButtons(props) {
  const { phone,
    otp,
    showOtpField,
    registerPhone,
    validatedOtp,
    networkAvailability,
    setShowOtpField,
    resendTimer,
    enableResend,
    isButtonLoading,
    setOtp,
    setButtonLoading } = props
  const [ isRegisterButtonEnable, setRegisterEnable ] = useState(false)
  const [ isOtpButtonEnable, setOtpEnable ] = useState(false)

  const onSubmit = async () => {
    Keyboard.dismiss()
    if(networkAvailability.isOffline) {
      ShowAlert('Oops!', 'Seems like you are not connected to Internet')
    } else {
      if(phone && phone.length == 10 && otp && otp.length) {
        try {
          setButtonLoading(true)
          await validatedOtp(phone, otp)
        } catch(e) {
          setButtonLoading(false)
          if(e && e.message) {
            ShowAlert('Oops!', e.message)
          } else {
            ShowAlert('Oops!', e)
          }
          Sentry.captureException(e)
        }
      }
    }
  }

  useEffect(() => {
    if(phone && phone.length == 10) {
      setRegisterEnable(true)
    } else {
      setRegisterEnable(false)
      setShowOtpField(false)
      setOtp('')
      clearTimeout(resendTimer)
      enableResend(false)
    }
  }, [phone])

  useEffect(() => {
    if(otp && otp.length > 0 && isRegisterButtonEnable) {
      setOtpEnable(true)
    } else {
      setOtpEnable(false)
    }
  }, [otp, phone])

  if(isButtonLoading) {
    return (
      <View style={styles.signInButtonContainer}>
        <View style={[styles.signInButton, {justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent', paddingVertical: 11}]}>
          <ActivityIndicator size="small" color="#0000ff" />
        </View>
      </View>
    )
  } else {
    return (
      <View style={styles.signInButtonContainer}>        
        { showOtpField ? 
          <TouchableOpacity style={styles.signInButton} onPress={onSubmit} disabled={!isOtpButtonEnable}>
            <Text style={{textAlign: 'center', width: '100%', fontSize: 18}}>Submit</Text>
          </TouchableOpacity>:
          <TouchableOpacity style={[styles.signInButton]} onPress={registerPhone} disabled={!isRegisterButtonEnable}>
            <Text style={{textAlign: 'center', width: '100%', fontSize: 18}}>Continue</Text>
          </TouchableOpacity>
        }
      </View>
    )
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
})

const mapDispathToProps = dispatch => ({
  registerUser: (phone) => dispatch(register(phone)),
  validatedOtp: (phone, otp) => dispatch(validateToken(phone, otp))
})

export default connect(mapStateToProps, mapDispathToProps)(LoginButtons);

const styles = StyleSheet.create({
  signInButton: {
    marginHorizontal: 16,
    marginBottom: 10,
    paddingVertical: 10,
    width: 140,
    backgroundColor: '#eee',
    borderRadius: 10
  },
  signInButtonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});