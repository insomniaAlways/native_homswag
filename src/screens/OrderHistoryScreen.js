import React, { useEffect, useLayoutEffect } from 'react';
import { connect } from 'react-redux';
import { View, Text, SafeAreaView, StyleSheet, StatusBar } from 'react-native';
import { fetchAllOrder } from '../store/actions/orderActions'
import OrderList from '../components/orderList';
// import Constants from 'expo-constants';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { statusBarBrandColor } from '../style/customStyles';
import * as Sentry from '@sentry/react-native';
import ShowAlert from '../controllers/alert';

function OrderHistoryScreen(props) {
  const { orderModel, getOrders, navigation, networkAvailability } = props;

  useLayoutEffect(() => {
    if(!networkAvailability.isOffline) {
      getOrders()
    }
  }, [])

  useEffect(() => {
    if(!orderModel.isLoading && orderModel.error) {
      ShowAlert('Oops!', orderModel.error)
      Sentry.captureException(orderModel.error)
    }
  }, [orderModel.error])

  if(networkAvailability.isOffline) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <MaterialCommunityIcons name="wifi-strength-alert-outline" size={60} color='grey'/>
        <View style={{paddingTop: 30, alignItems: 'center'}}>
          <Text style={{fontSize: 22, fontFamily: 'Roboto-Medium'}}>Whoops!</Text>
          <Text style={{fontFamily: 'Roboto-LightItalic'}}>No Internet connection</Text>
        </View>
      </View>
    )
  } else {
    return (
      <View style={{flex: 1}}>
        <SafeAreaView style={{flex: 1}}>
        <StatusBar barStyle={"light-content"} backgroundColor={statusBarBrandColor}/>
          <View style={{padding: 10, paddingLeft: 20}}><Text style={{fontSize: 16, fontWeight: 'bold'}}>My Appointments: </Text></View>
          {orderModel.isLoading ? 
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <Text>Loading..</Text>
            </View> :
            <OrderList orders={orderModel.values} navigation={navigation} orderModel={orderModel} getOrders={getOrders}/>
          }
        </SafeAreaView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    // marginTop: Constants.statusBarHeight,
    flex: 1
  }
})

mapStateToProps = state => {
  return {
    orderModel: state.orders,
    networkAvailability: state.networkAvailability
  }
}

mapDispatchToProps = dispatch => {
  return {
    getOrders: () => dispatch(fetchAllOrder())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OrderHistoryScreen);