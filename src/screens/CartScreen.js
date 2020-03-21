import React, { useEffect, useLayoutEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, ScrollView, Image, Text } from 'react-native';
import { connect } from 'react-redux';
import CartItemList from '../components/cartItemList';
import { fetchCart } from '../store/actions/cartAction';
import PriceBreakDown from '../components/priceBreackDown';
import DefaultStyles from '../style/customStyles';
import AppointmentDetails from '../components/appointmentDetails';
import CartPromoItemList from '../components/cartPromoItemList';
import EmptyCart from '../assets/images/empty_cart.png'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment'

function CartScreen(props) {
  const { navigation, cartModel, cartItemModel, appointment, networkAvailability } = props;

  useLayoutEffect(() => {
    if(!networkAvailability.isOffline) {
      props.getCart()
    }
  }, [])


  useEffect(() => {
    if(!cartItemModel.isLoading && cartItemModel.error) {
      alert(cartItemModel.error)
    }
  }, [cartItemModel.error])

  useEffect(() => {
    if(!cartModel.isLoading && cartModel.error) {
      alert(cartModel.error)
    }
  }, [cartModel.error])

  const isValidateSlot = () => {
    if(appointment.defaultValues.slot && appointment.defaultValues.slot.type) {
      if(moment().isSame(moment(appointment.defaultValues.date), 'days')) {
        let cutOffTime = moment().startOf('days').add(appointment.defaultValues.slot.to - 1, 'hours')
        let isAfter = moment().isSameOrAfter(cutOffTime)
        switch (appointment.defaultValues.slot.type) {
          case 1: {
            if(isAfter) {
              if(moment().isSameOrAfter(moment().startOf('days').add(17, 'hours'))) {
                alert('Please select a valid time slot.')
              } else {
                alert('You cannot schedule for the selected time slot.')
              }
              return false
            } else {
              return true
            }
          }
          case 2: {
            if(isAfter) {
              alert('You cannot schedule for the selected time slot.')
              return false
            } else {
              return true
            }
          }
          case 3: {
            if(isAfter) {
              alert('You cannot schedule for the selected time slot for today')
              return false
            } else {
              return true
            }
          }
        }      
      } else {
        return true
      }
    } else {
      return false
    }
  }

  const goToConfirmPage = () => {
    if(isValidateSlot()) {
      if(appointment.defaultValues && appointment.defaultValues.selectedAddress && appointment.defaultValues.selectedAddress.id) {
        return navigation.navigate('ConfirmAppointment')
      } else {
        return alert('Please select an address')
      }
    } else {
      return alert('Please select a valid timeslot')
    }
  }

  if(networkAvailability.isOffline) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <MaterialCommunityIcons name="wifi-strength-alert-outline" size={60} color='grey'/>
        <View style={{paddingTop: 30, alignItems: 'center'}}>
          <Text style={{fontSize: 22, fontFamily: 'roboto-medium'}}>Whoops!</Text>
          <Text style={{fontFamily: 'roboto-light-italic'}}>No Internet connection</Text>
        </View>
      </View>
    )
  } else {
    return (
      <View style={{flex: 1, backgroundColor: '#F7F9FC'}}>
       {cartItemModel && cartItemModel.values && cartItemModel.values.length ? (
        <View style={{flex: 1}}>
          <View style={{flex: 14}}>
            <ScrollView showsVerticalScrollIndicator={false} style={{backgroundColor: 'transparent'}}>
            <View>
              <View style={{backgroundColor: "#FFFFFF", marginVertical: 10, paddingVertical: 10, borderRadius: 20, marginHorizontal: 10, paddingHorizontal: 10}}>
                <Text style={{padding: 10, fontWeight: 'bold'}}>Added Items: </Text>
                <CartItemList cart={cartModel.values} cartItems={cartItemModel.values}/>
              </View>
              <View style={{backgroundColor: "#FFFFFF", marginVertical: 10, paddingVertical: 20, borderRadius: 20, marginHorizontal: 10}}>
                <AppointmentDetails bookingDetails={appointment.defaultValues} navigation={navigation}/>
              </View>
              <View style={{backgroundColor: "#FFFFFF", borderTopLeftRadius: 20, borderRadius: 20, paddingVertical: 10, paddingHorizontal: 10}}>
                <Text style={{paddingBottom: 10, marginTop: 10, paddingLeft: 10}}>People also search for:</Text>
              </View>
              <CartPromoItemList />
              <View style={{backgroundColor: "#FFFFFF", marginHorizontal: 10, marginBottom: 10, borderRadius: 20, borderRadius: 20, paddingBottom: 10, paddingHorizontal: 10}}>
                <Text style={{paddingTop: 10, paddingBottom: 10, fontWeight: "bold"}}>Price Breakdown: </Text>
                <PriceBreakDown />
              </View>
            </View>
            </ScrollView>
          </View>
          <View style={[{height: 55}, DefaultStyles.brandBackgroundColor]}>
            <TouchableOpacity style={[styles.button, DefaultStyles.brandColorButton]} onPress={() => goToConfirmPage()}>
              <Text style={{color:'#fff', fontSize: 18, fontWeight: 'bold', width: '100%', textAlign: 'center'}}>Next</Text>
            </TouchableOpacity>
          </View>
        </View> ) : (
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Image source={EmptyCart} style={{height: 60, width: 60}}/>
            <View style={{paddingTop: 10}}>
              <Text>No item added</Text>
            </View>
          </View>
       )}
      </View>
    );
  }

}

mapStateToProps = state => {
  return {
    cartModel: state.cart,
    cartItemModel: state.cartItems,
    user: state.user,
    appointment: state.appointment,
    networkAvailability: state.networkAvailability
  }
}

mapDispatchToProps = dispatch => {
  return {
    getCart: (user_id) => dispatch(fetchCart(user_id))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CartScreen);


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    color:'#fff',
    height: 55
  },
  countContainer: {
    alignItems: 'center',
    padding: 10
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  modal: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  controlContainer: {
    borderRadius: 4,
    padding: 12,
    backgroundColor: '#3366FF',
  },
})


