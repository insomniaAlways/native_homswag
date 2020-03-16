import React from 'react';
import {Text, StyleSheet, View, TouchableOpacity, TextInput } from 'react-native';
// import { Input, Text } from '@ui-kitten/components';
// import { Icon } from '@ui-kitten/components';

const PhoneIcon = (style) => (
  <Icon {...style} name='phone'/>
);

function LoginForm(props) {
  const { phone, setPhone, otp, setOtp, showOtpField, isResendEnable, registerPhone } = props

  return (
    <View style={styles.formContainer}>
      <Text style={{width: '100%', textAlign: 'left', marginBottom: 10, fontSize: 18, fontWeight: 'bold', color: '#fff', paddingLeft: 0}}>
        Login or Signup:
      </Text>
      {/* <Input
        status='control'
        placeholder='Phone Number'
        style={styles.inputBox}
        icon={PhoneIcon}
        maxLength={10}
        textStyle={{color: "#fff", fontSize: 18, fontWeight: 'bold'}}
        keyboardType={'number-pad'}
        value={phone}
        onChangeText={(text) => setPhone(text)}
      /> */}
      {showOtpField && 
        {/* <Input
          style={[styles.inputBox, styles.passwordInput]}
          status='control'
          placeholder='OTP'
          keyboardType={'number-pad'}
          value={otp}
          onChangeText={(text) => setOtp(text)}
          textStyle={{color: "#fff", fontSize: 18, fontWeight: 'bold'}}/> */}
        }
      {showOtpField && 
        <View style={{flexDirection: 'row', justifyContent: 'flex-end', width: '100%', paddingRight: 10}}>
          <TouchableOpacity onPress={registerPhone} disabled={!isResendEnable}>
            <Text style={isResendEnable ? {color: '#fff', fontWeight: 'bold'} : {color: '#d4d4d4', fontWeight: 'bold'}}>Resend OTP</Text>
          </TouchableOpacity>
        </View>
      }
    </View>
  )
}

export default LoginForm;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 216,
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  inputBox: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    fontSize: 20,
    borderRadius: 20,
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