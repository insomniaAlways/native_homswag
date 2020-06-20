import React, { useEffect } from 'react';
import { TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { View, StyleSheet, BackHandler, Image, Text, StatusBar } from 'react-native';
import { StackActions, NavigationActions } from 'react-navigation';
import Tick from '../assets/images/tick.png'
import { brandColor, statusBarLightColor } from '../style/customStyles';

const resetAction = StackActions.reset({
  index: 0,
  actions: [NavigationActions.navigate({ routeName: 'Dashboard' })],
  key: null
});

const AppointmentPlacedScreen = (props) => {
  const { navigation } = props

  useEffect(() => {
    BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackButtonPressAndroid
    );
    return () =>
        BackHandler.removeEventListener('hardwareBackPress', handleBackButtonPressAndroid)
  })

  const handleBackButtonPressAndroid = () => {
    if (!props.navigation.isFocused()) {
      return false;
    }
    navigation.dispatch(resetAction)
    return true
  };

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: "#F7F9FC"}}>
      <StatusBar barStyle={"dark-content"} backgroundColor={statusBarLightColor} />
      <View style={styles.content}>
        <View style={{justifyContent: 'center', marginBottom: 30}}>
          <Image
            style={{width: 160, height: 160}}
            source={Tick}
          />
        </View>
        <View style={{height: 200, alignItems: 'center'}}>
          <Text style={styles.fontFamily}>All Right!</Text>
          <Text style={styles.fontFamily}>Sit back and relax.</Text>
          <Text style={styles.fontFamily}>The appointment has successfully placed.</Text>
        </View>
        <TouchableOpacity style={styles.button} onPress={() => handleBackButtonPressAndroid()}>
          <View style={styles.buttomView}>
            <Text style={{color: '#fff'}}>Continue Surfing</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  content : {
    // height: '50%',
    width: '80%',
    backgroundColor: '#FDFDFD',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2, },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderRadius: 15,
    paddingTop: 30,
    // justifyContent: 'center',
    alignItems: 'center'
  },
  fontFamily: {
    fontFamily: 'Roboto-MediumItalic'
  },
  button: {
    position: 'absolute',
    bottom: 30,
    // width: 200,
    padding: 5,
    alignItems: 'center'
  },
  buttomView: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2, },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 20,
    backgroundColor: brandColor
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(AppointmentPlacedScreen)