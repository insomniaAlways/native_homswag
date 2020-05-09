import React from 'react';
import { StyleSheet, View, TouchableOpacity, Text, TextInput, Platform } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

export default function LoginForm(props) {
  const { phone, setPhone, otp, setOtp, showOtpField, isResendEnable, registerPhone } = props
  const keyboardType = Platform.OS === 'ios' ? 'name-phone-pad' : 'number-pad'

  return (
    <View style={styles.formContainer}>
      <Text style={{width: '100%', textAlign: 'left', marginBottom: 10, fontSize: 18, fontWeight: 'bold', color: '#fff', paddingLeft: 0}}>
        Login or Signup:
      </Text>
      <View style={styles.inputContainer}>
        <TextInput 
          style={styles.inputBox}
          placeholder='Phone Number'
          maxLength={10}
          keyboardType={keyboardType}
          value={phone}
          onChangeText={(text) => setPhone(text)}
          placeholderTextColor='#FFFFFF'
        />
        <FontAwesome name="phone" size={24} color={"#FFFFFF"} style={styles.inputIcon}/>
      </View>
      {showOtpField && 
        <View style={[styles.inputContainer, { marginTop: 10}]}>
          <TextInput 
            style={styles.inputBox}
            placeholder='OTP'
            maxLength={10}
            keyboardType={keyboardType}
            value={otp}
            onChangeText={(text) => setOtp(text)}
            placeholderTextColor='#FFFFFF'
          />
        </View>
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
  signInButtonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },

  inputContainer: {
    paddingHorizontal: 8,
    borderColor: 'rgba(255,255,255,0.40)',
    minHeight: 40,
    borderWidth: 1,
    // paddingVertical: 7,
    backgroundColor: 'rgba(0,0,0,0.3)',
    fontSize: 20,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%'
  },

  inputBox: {
    marginHorizontal: 8,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 'auto'
  },
  inputIcon: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    width: 24,
    height: 24,
    marginHorizontal: 0,
    opacity: 1,
    flex: 0
  }
});