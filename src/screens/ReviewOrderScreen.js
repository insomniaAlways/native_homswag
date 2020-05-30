import React, { useState, useEffect, useLayoutEffect } from 'react';
import { connect } from 'react-redux';
import { fetchCart } from '../store/actions/cartAction';
import { createOrder } from '../store/actions/orderActions';
import Graphics from '../assets/images/order_confirm_background.png'
import { View, StyleSheet, ScrollView, ImageBackground, Text } from 'react-native';
import ItemView from '../components/itemView';
import { TouchableOpacity } from 'react-native';
import moment from 'moment';
import { brandColor, brandLightBackdroundColor } from '../style/customStyles';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Sentry from '@sentry/react-native';
import { useSafeArea } from 'react-native-safe-area-context';
import * as Device from 'expo-device';
import ShowAlert from '../controllers/alert';

function ReviewOrderScreen (props) {
  const insets = useSafeArea();
  const { cart, orderModel, getCart, placeOrder, appointment, networkAvailability } = props
  const [ isloading, setLoading ] = useState(false)
  const { cart_items, cart_total, item_total_price } = cart.values

  useLayoutEffect(() => {
    if(!networkAvailability.isOffline) {
      getCart()
    }
  }, [])

  useEffect(() => {
    if(!orderModel.isloading && orderModel.error) {
      ShowAlert('Oops!', orderModel.error)
      Sentry.captureException(orderModel.error)
    }
  }, [orderModel.error])

  const confirmBooking = async () => {
    setLoading(true)
    let appointmentDetails = appointment.defaultValues
    let from, to;
    from = moment(appointmentDetails.from).startOf('days').add(appointmentDetails.slot.from, 'hours').toISOString()
    to = moment(appointmentDetails.from).startOf('days').add(appointmentDetails.slot.to, 'hours').toISOString()
    try {
      let order = await placeOrder({
        "payment_method": 1,
        "from": from,
        "to": to,
        "address_id": appointmentDetails.selectedAddress.id,
        "total_paid": 0, //need to change when online payment
        "status": 1,
        "special_instruction": appointmentDetails.special_instruction,
        "preferred_beautician": appointmentDetails.prefered_beautician,
        "device": {
          modelName: Device.modelName,
          brand: Device.brand,
          modelId: Device.modelId,
          osName: Device.osName,
          deviceName: Device.deviceName
        }
      })
      setLoading(false)
      props.navigation.navigate('OrderComplete', { order: order.payload.currentValue })
    } catch(e) {
      setLoading(false)
    }
  }

  useEffect(() => {
    if(cart.isloading || orderModel.isloading) {
      setLoading(true)
    } else {
      setLoading(false)
    }
  }, [cart.isloading, orderModel.isloading])

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
        <ImageBackground
          style={styles.infoContainer}
          imageBackgroundStyle={styles.imageBackgroundStyle}
          source={Graphics}>
          <View style={{backgroundColor: 'transparent', justifyContent: 'center', alignItems: 'center', marginHorizontal: 10}}>
            <Text style={{color: '#fff', fontSize: 18}}>You can pay us by UPI OR Cash after services</Text>
          </View>
        </ImageBackground>
        <View style={{flex: 4, backgroundColor: "#F7F9FC", borderRadius: 20}}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.orderDetailsContainer}>
              <View style={[styles.orderDetailsScroller, {borderTopEndRadius: 20}]}>
                <View style={{justifyContent: 'center', alignItems: 'center', paddingBottom: 10}}>
                  <Text style={{fontSize: 16, fontWeight: 'bold'}}>Appointment Summary</Text>
                </View>
                {cart_items.map(cartItem => (
                  <ItemView key={cartItem.id} item={cartItem.item} cartItem={cartItem}/>
                ))}
                <View style={{paddingVertical: 20, justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', paddingHorizontal: 10, borderTopWidth: 1, borderColor: '#eee'}}>
                  <Text style={{fontSize: 16}}>Total Payable Amount</Text>
                  <Text style={{fontSize: 16}}>{cart_total}</Text>
                </View>
              </View>
            </View>
            <View style={styles.totalSaveContainer}>
              <Text style={{color: "#fff", fontWeight: "bold", width: '100%', textAlign: 'center'}}>You saved total Rs. {item_total_price - cart_total}</Text>
            </View>
            <View style={{flexDirection: 'row' ,marginHorizontal: 30, marginVertical: 28, borderWidth: 1, borderColor: '#a9d5de', padding: 10, borderRadius: 5, backgroundColor: '#f8ffff'}}>
              <Text style={{fontFamily: 'Roboto-Medium', color: '#0e566c'}}>Note: </Text>
              <Text style={{fontFamily: 'Roboto-Regular', fontSize: 14, alignItems: 'center', width: '88%', color: '#276f86', minHeight: 70}}>
                If any cancellation or reschedule Appointment after the confirmation is mandatory in prior to 2 Hours, Appreciate you cooperation on the same.
              </Text>
            </View>
          </ScrollView>
        </View>
        { isloading ?
          <TouchableOpacity style={{height: 57, justifyContent: 'center', alignItems: 'center', backgroundColor: brandLightBackdroundColor, marginBottom: insets.bottom}} disabled={true}>
            <Text style={{width: '100%', textAlign: 'center', color: '#fff', fontSize: 16, fontWeight: 'bold'}}>Booking...</Text>
          </TouchableOpacity> :
          <TouchableOpacity style={{height: 57, justifyContent: 'center', alignItems: 'center', backgroundColor: brandColor, marginBottom: insets.bottom}} onPress={() => confirmBooking()}>
            <Text style={{width: '100%', textAlign: 'center', color: '#fff', fontSize: 16, fontWeight: 'bold'}}>Book Appointment</Text>
          </TouchableOpacity>
        }
      </View>
    )
  }
}

const mapStateToProps = state => ({
  cart: state.cart,
  orderModel: state.orders,
  appointment: state.appointment,
  networkAvailability: state.networkAvailability
})

const mapDispatchToProps = dispatch => ({
  getCart: () => dispatch(fetchCart()),
  placeOrder: (orderDetails) => dispatch(createOrder(orderDetails))
})

export default connect(mapStateToProps, mapDispatchToProps)(ReviewOrderScreen);

const styles = StyleSheet.create({
  infoContainer: {
    flex: 2,
    // paddingTop: Constants.statusBarHeight,
    justifyContent: 'center',
    alignItems: 'center'
  },
  imageBackgroundStyle: {
  },
  orderDetailsContainer: {
    marginHorizontal: 20,
    marginVertical: 20,
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderRadius: 20,
    backgroundColor: '#FFFFFF'
  },
  orderDetailsScroller: {
  },
  totalSaveContainer: {
    padding: 10,
    alignItems: 'center',
    marginLeft: 30,
    marginRight: 30,
    marginTop: 10,
    borderRadius: 50,
    backgroundColor: brandLightBackdroundColor,
    borderWidth: 1,
    borderColor: brandColor
  }
})
