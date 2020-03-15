import React, { useState, useEffect, useLayoutEffect } from 'react';
import { connect } from 'react-redux';
import { fetchCart } from '../store/actions/cartAction';
import { createOrder } from '../store/actions/orderActions';
import { Layout, Text } from '@ui-kitten/components';
import { ImageOverlay } from '../components/imageOverlay';
import Graphics from '../assets/images/order_confirm_background.png'
import { StyleSheet, ScrollView, ImageBackground } from 'react-native';
// import Constants from 'expo-constants';
import ItemView from '../components/itemView';
import { TouchableOpacity } from 'react-native';
import moment from 'moment';
import { brandColor, brandLightBackdroundColor } from '../style/customStyles';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

function ReviewOrderScreen (props) {
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
      alert(orderModel.error)
    }
  }, [orderModel.error])

  const confirmBooking = async () => {
    setLoading(true)
    let appointmentDetails = appointment.defaultValues
    let from, to;
    if(appointmentDetails.slot.type == 1) {
      from = moment(appointmentDetails.from).startOf('days').add(9, 'hours').toISOString()
      to = moment(appointmentDetails.from).startOf('days').add(12, 'hours').toISOString()
    } else if (appointmentDetails.slot.type == 2) {
      from = moment(appointmentDetails.from).startOf('days').add(12, 'hours').toISOString()
      to = moment(appointmentDetails.from).startOf('days').add(15, 'hours').toISOString()
    } else {
      from = moment(appointmentDetails.from).startOf('days').add(15, 'hours').toISOString()
      to = moment(appointmentDetails.from).startOf('days').add(18, 'hours').toISOString()
    }
    try {
      let order = await placeOrder({
        "payment_method": 1,
        "from": from,
        "to": to,
        "address_id": appointmentDetails.selectedAddress.id,
        "total_paid": 0, //need to change when online payment
        "status": 1,
        "special_instruction": appointmentDetails.special_instruction,
        "preferred_beautician": appointmentDetails.prefered_beautician
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
      <Layout style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <MaterialCommunityIcons name="wifi-strength-alert-outline" size={60} color='grey'/>
        <Layout style={{paddingTop: 30, alignItems: 'center'}}>
          <Text style={{fontSize: 22, fontFamily: 'roboto-medium'}}>Whoops!</Text>
          <Text style={{fontFamily: 'roboto-light-italic'}}>No Internet connection</Text>
        </Layout>
      </Layout>
    )
  } else {
    return (
      <Layout style={{flex: 1}}>
        <ImageBackground
          style={styles.infoContainer}
          imageBackgroundStyle={styles.imageBackgroundStyle}
          source={Graphics}>
          <Layout style={{backgroundColor: 'transparent', justifyContent: 'center', alignItems: 'center', marginHorizontal: 10}}>
            <Text style={{color: '#fff', fontSize: 18}}>You can pay us by UPI OR Cash after services</Text>
          </Layout>
        </ImageBackground>
        <Layout style={{flex: 4, backgroundColor: "#F7F9FC"}}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Layout style={styles.orderDetailsContainer}>
              <Layout style={styles.orderDetailsScroller}>
                <Layout style={{justifyContent: 'center', alignItems: 'center', paddingBottom: 10}}>
                  <Text style={{fontSize: 16, fontWeight: 'bold'}}>Appointment Summary</Text>
                </Layout>
                {cart_items.map(cartItem => (
                  <ItemView key={cartItem.id} item={cartItem.item} cartItem={cartItem}/>
                ))}
                <Layout style={{paddingVertical: 20, justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', paddingHorizontal: 10, borderTopWidth: 1, borderColor: '#eee'}}>
                  <Text style={{fontSize: 16}}>Total Payable Amount</Text>
                  <Text style={{fontSize: 16}}>{cart_total}</Text>
                </Layout>
              </Layout>
            </Layout>
            <Layout style={styles.totalSaveContainer}>
              <Text style={{color: "#fff", fontWeight: "bold", width: '100%', textAlign: 'center'}}>You saved total Rs. {item_total_price - cart_total}</Text>
            </Layout>
            <Layout style={{flexDirection: 'row' ,marginHorizontal: 30, marginVertical: 28, borderWidth: 1, borderColor: '#a9d5de', padding: 10, borderRadius: 5, backgroundColor: '#f8ffff'}}>
              <Text style={{fontFamily: 'roboto-medium', color: '#0e566c'}}>Note: </Text>
              <Text style={{fontFamily: 'roboto-regular', fontSize: 14, alignItems: 'center', width: '88%', color: '#276f86', minHeight: 70}}>
                If any cancellation or reschedule Appointment after the confirmation is mandatory in prior to 2 Hours, Appreciate you cooperation on the same.
              </Text>
            </Layout>
          </ScrollView>
        </Layout>
        { isloading ?
          <TouchableOpacity style={{height: 57, justifyContent: 'center', alignItems: 'center', backgroundColor: brandLightBackdroundColor}} disabled={true}>
            <Text style={{width: '100%', textAlign: 'center', color: '#fff', fontSize: 16, fontWeight: 'bold'}}>Booking...</Text>
          </TouchableOpacity> :
          <TouchableOpacity style={{height: 57, justifyContent: 'center', alignItems: 'center', backgroundColor: brandColor}} onPress={() => confirmBooking()}>
            <Text style={{width: '100%', textAlign: 'center', color: '#fff', fontSize: 16, fontWeight: 'bold'}}>Book Appointment</Text>
          </TouchableOpacity>
        }
      </Layout>
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
    paddingTop: 40,
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
    borderRadius: 20 
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
