import React, { useEffect } from 'react';
import { TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { fetchOrder } from '../../store/actions/orderActions';
import { Layout, Text } from '@ui-kitten/components';
import { StyleSheet, BackHandler, Image } from 'react-native';
import { StackActions, NavigationActions } from 'react-navigation';
import Tick from '../../assets/images/tick.png'
import { brandColor } from '../style/customStyles';

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
    <Layout style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: "#F7F9FC"}}>
      <Layout style={styles.content}>
        <Layout style={{justifyContent: 'center', marginBottom: 30}}>
          <Image
            style={{width: 160, height: 160}}
            source={Tick}
          />
        </Layout>
        <Layout style={{height: 200, alignItems: 'center'}}>
          <Text style={styles.fontFamily}>All Right!</Text>
          <Text style={styles.fontFamily}>Sit back and relax.</Text>
          <Text style={styles.fontFamily}>The appointment has successfully placed.</Text>
        </Layout>
        <TouchableOpacity style={styles.button} onPress={() => handleBackButtonPressAndroid()}>
          <Layout style={styles.buttomView}>
            <Text style={{color: '#fff'}}>Continue Surfing</Text>
          </Layout>
        </TouchableOpacity>
      </Layout>
    </Layout>
  )
}

const mapStateToProps = state => ({
  order: state.order
})

const mapDispatchToProps = dispatch => ({
  getCurrentOrder: (order_id) => dispatch(fetchOrder(order_id))
})

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
    fontFamily: 'roboto-medium-italic'
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