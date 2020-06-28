import React, { useState, useEffect, useLayoutEffect } from 'react';
import { connect } from 'react-redux';
import { fetchCart } from '../store/actions/cartAction';
import { createOrder } from '../store/actions/orderActions';
import Graphics from '../assets/images/order_confirm_background.png'
import { View, StyleSheet, ScrollView, ImageBackground, Text, Platform } from 'react-native';
import ItemView from '../components/itemView';
import { TouchableOpacity } from 'react-native';
import moment from 'moment';
import { brandColor, brandLightBackdroundColor } from '../style/customStyles';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Sentry from '@sentry/react-native';
import { useSafeArea } from 'react-native-safe-area-context';
import ShowAlert from '../controllers/alert';
import { CheckBox } from 'react-native-elements';
import { applyReward } from '../store/actions/reward.action';

function ReviewOrderScreen (props) {
  const insets = useSafeArea();
  const { cart, orderModel, getCart, placeOrder, appointment, networkAvailability, currentUserModel, applyRewardPoints, rewardModel } = props
  const [ isloading, setLoading ] = useState(false)
  const { cart_items, cart_total, item_total_price } = cart.values
  const [ useRewards, setUseRewards ] = useState(false)
  const [ appliedReward, setAppliedReward ] = useState({})

  useLayoutEffect(() => {
    if(!networkAvailability.isOffline) {
      setLoading(true)
      getCart()
      applyRewardPoints()
    }
  }, [])

  useEffect(() => {
    if(!rewardModel.isloading && !rewardModel.error && Object.keys(rewardModel.values).length) {
      setLoading(false)
      setAppliedReward(rewardModel.values)
    } else if(rewardModel.error) {
      setLoading(false)
      if(rewardModel.error.message) {
        ShowAlert('Opps!', rewardModel.error.message)
      } else {
        ShowAlert('Opps!', "Something went wrong")
      }
      Sentry.captureEvent(error)
    }
  }, [cart_total, rewardModel])

  useEffect(() => {
    if(!orderModel.isloading && orderModel.error) {
      if(orderModel.error && orderModel.error.message) {
        ShowAlert('Oops!', orderModel.error.message)
      } else {
        ShowAlert("Oops!", orderModel.error)
      }
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
        "reward_applied": useRewards,
        "discount_details": appliedReward,
        "from": from,
        "to": to,
        "address_id": appointmentDetails.selectedAddress.id,
        "total_paid": 0, //need to change when online payment
        "status": 1,
        "special_instruction": appointmentDetails.special_instruction,
        "preferred_beautician": appointmentDetails.prefered_beautician,
        "device": {
          modelName: Platform.constants.Model,
          Fingerprint: Platform.constants.Fingerprint,
          osName: Platform.OS,
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
            <View style={styles.rewardContainer}>
              {appliedReward && !(appliedReward.available_points >= 500) && (
                <View style={{justifyContent: 'center', alignItems: 'center', width: '100%', marginTop: 10}}>
                  <Text style={{fontSize: 10}}>Not applicable</Text>
                  <Text style={{fontSize: 10}}>Minimum of 500 Reward Points Not Available</Text>
                </View>
              )}
              <View style={{justifyContent: 'flex-start', alignItems: 'flex-start', paddingHorizontal: 15, paddingVertical: 10}}>
                <CheckBox
                  title='Use Reward Points'
                  checked={useRewards}
                  containerStyle={{borderWidth: 0, backgroundColor: 'transparent', paddingVertical: 0, paddingHorizontal: 0}}
                  onPress={() => setUseRewards(!useRewards)}
                  disabled={isloading ||!(appliedReward.available_points >= 500)}
                />
                <View style={{paddingHorizontal: 15}}>
                  <View style={{flexDirection: 'row'}}>
                    <Text style={{color: "#43484d"}}>*Applicable Reward Points: </Text>
                    <Text style={{paddingLeft: 5}}>{appliedReward && appliedReward.applicable_reward_points}</Text>
                  </View>
                  <View style={{flexDirection: 'row'}}>
                    <Text style={{color: "#43484d"}}>Total Available Reward Points: </Text>
                    <Text style={{paddingLeft: 5}}>{appliedReward && appliedReward.available_points}</Text>
                  </View>
                </View>
                <View style={{justifyContent: 'center', alignItems: 'center', width: '100%', marginTop: 10}}>
                  <Text style={{fontSize: 10}}>*T&C apply</Text>
                </View>
              </View>
            </View>
            <View style={styles.orderDetailsContainer}>
              <View style={[styles.orderDetailsScroller, {borderTopEndRadius: 20}]}>
                <View style={{justifyContent: 'center', alignItems: 'center', paddingBottom: 10}}>
                  <Text style={{fontSize: 16, fontWeight: 'bold'}}>Appointment Summary</Text>
                </View>
                {cart_items.map(cartItem => (
                  <ItemView key={cartItem.id} item={cartItem.item} cartItem={cartItem}/>
                ))}
                {useRewards && (
                  <View style={{paddingVertical: 10, justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', paddingHorizontal: 10, borderTopWidth: 1, borderColor: '#eee'}}>
                    <Text style={{fontSize: 14}}>Discount</Text>
                    <Text style={{fontSize: 14, color: 'green'}}>- {appliedReward && appliedReward.discount_amount}</Text>
                  </View>
                )}
                {useRewards ? 
                  (
                    <View style={{paddingVertical: 20, justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', paddingHorizontal: 10, borderTopWidth: 1, borderColor: '#eee'}}>
                      <Text style={{fontSize: 16}}>Total Payable Amount</Text>
                      <Text style={{fontSize: 16}}>{cart_total - (appliedReward && appliedReward.discount_amount)}</Text>
                    </View>
                  ): (
                    <View style={{paddingVertical: 20, justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', paddingHorizontal: 10, borderTopWidth: 1, borderColor: '#eee'}}>
                      <Text style={{fontSize: 16}}>Total Payable Amount</Text>
                      <Text style={{fontSize: 16}}>{cart_total}</Text>
                    </View>
                  )
                }
              </View>
            </View>
            <View style={styles.totalSaveContainer}>
              <Text style={{color: "#fff", fontWeight: "bold", width: '100%', textAlign: 'center'}}>You saved total Rs. {useRewards ? (item_total_price - (cart_total - (appliedReward && appliedReward.discount_amount))) : (item_total_price - cart_total)}</Text>
            </View>
            <View style={{flexDirection: 'row', marginHorizontal: 30, marginVertical: 28, borderWidth: 1, borderColor: '#a9d5de', padding: 10, borderRadius: 5, backgroundColor: '#f8ffff'}}>
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
  currentUserModel: state.currentUser,
  networkAvailability: state.networkAvailability,
  rewardModel: state.rewards
})

const mapDispatchToProps = dispatch => ({
  getCart: () => dispatch(fetchCart()),
  placeOrder: (orderDetails) => dispatch(createOrder(orderDetails)),
  applyRewardPoints: () => dispatch(applyReward())
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
  rewardContainer: {
    marginHorizontal: 20,
    marginVertical: 20,
    borderRadius: 20,
    // paddingHorizontal: 10,
    // paddingVertical: 10,
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
