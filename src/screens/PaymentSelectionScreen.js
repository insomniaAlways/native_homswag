import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView, ScrollView } from 'react-native';
import PlaceHolderTextInput from '../components/placeHolderTextInput';
import DefaultStyles, { brandColor } from '../style/customStyles';
import _ from 'lodash';
import {
  Radio,
  RadioGroup,
} from '@ui-kitten/components';
import * as Animatable from 'react-native-animatable';
import { connect } from 'react-redux';
import { fetchCart } from '../store/actions/cartAction';
import { createOrder, fetchAllOrder } from '../store/actions/orderActions';
import LoadingModal from '../components/loadingModal';

function PaymentScreen(props) {
  const { getCart, placeOrder, cart, order, getOrders } = props
  const totalAmount = cart.values.cart_total
  const [ payingAmount, setPayingAmount ] = useState(totalAmount)
  const [ customAmount, setCustomAmount ] = useState()
  const [ isLoading, setLoading ] = useState(false)

  useEffect(() => {
    if(cart.isLoading || order.isLoading) {
      setLoading(true)
    } else {
      setLoading(false)
    }
  }, [cart.isLoading, order.isLoading])
      
  useEffect(() => {
    getCart()
  }, [])

  const onCustonInput = (amount) => {
    setCustomAmount(amount)
    if(!_.isNil(amount)  && parseInt(amount) > totalAmount ) {
      setPayingAmount(totalAmount)
    } else if(!_.isNil(amount) && parseInt(amount) >= 0 ) {
      setPayingAmount(amount)
    } else if(!amount) {
      setPayingAmount(0)
    }
  }

  const paymentTypes = [
    { title: "Pay Full", type: 1 },
    { title: "Pay After Service", type: 2 },
    { title: "Pay Custom", type: 3, content: (
      <View style={{flexDirection: 'row', padding: 10, paddingLeft: 15, paddingRight: 15}}>
        <View style={{width: '40%', height: 40, justifyContent: "center"}}>
          <Text>Custom Amount: </Text>
        </View>
        <PlaceHolderTextInput
          placeholder="enter custom ammount"
          styles={{margin: 0, width:'60%', backgroundColor: '#eee', borderRadius: 50, paddingLeft: 12, paddingRight: 12, textAlign: 'center'}}
          value={customAmount}
          keyboardType="numeric"
          setValue={onCustonInput}
          itemKey="amount" />
      </View>
    )},
  ]

  const [ selectedIndex, setSelectedIndex ] = useState(0);
  const [ selectedPaymentType, setSelectedPaymentType] = useState(paymentTypes[selectedIndex])

  const onCheckedChange = (index) => {
    setSelectedIndex(index);
    setSelectedPaymentType(paymentTypes[index])
    if(index == 0) {
      setPayingAmount(totalAmount)
    } else if(index == 1) {
      setPayingAmount(0)
    }
    setCustomAmount()
  };


  return (
    <KeyboardAvoidingView style={{flex: 1}} behavior="height" enabled>
      <View style={{flex: 1}}>
        <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
          <View style={styles.paymentSelectionContainer}>
            <View style={styles.paymentSelectionBlock}>
              <View style={{borderBottomColor: '#eee', borderBottomWidth: 1, marginBottom: 10, paddingBottom: 10}}>
                <Text style={{width: '100%', textAlign: 'center', fontWeight: 'bold'}}>Total Payable amount: Rs. {totalAmount}</Text>
              </View>
              <Text style={{marginBottom: 5}}>Choose the amount to pay: </Text>
              <RadioGroup
                selectedIndex={selectedIndex}
                onChange={onCheckedChange}>
                {paymentTypes.map((type, index) => (
                    <Radio key={index} style={styles.radio} text={type.title}/>
                ))}
              </RadioGroup>
              { selectedPaymentType.type == 3 && 
                <Animatable.View
                  duration={800}
                  animation={'bounceIn'}
                  easing={'ease-out'}
                  useNativeDriver={true}
                  >
                  {selectedPaymentType.content}
                </Animatable.View>
              }
            </View>
          </View>
          <View style={styles.paymentDetailsContainer}>
            <View style={styles.paymentDetailsBlock}>
              <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between',}}>
                <Text style={{width: '80%'}}>Total Bill Amount</Text>
                <Text style={{width: '10%'}}>: </Text>
                <Text style={{width: '10%', textAlign: 'right'}}>{totalAmount}</Text>
              </View>
              <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text style={{width: '80%'}}>Paying Amount</Text>
                <Text style={{width: '10%'}}>: </Text>
                <Text style={{width: '10%', textAlign: 'right'}}>{payingAmount}</Text>
              </View>
              <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text style={{width: '80%'}}>Balance</Text>
                <Text style={{width: '10%'}}>: </Text>
                <Text style={{width: '10%', textAlign: 'right'}}>{parseInt(totalAmount) - parseInt(payingAmount)}</Text>
              </View>
            </View>
          </View>
        </ScrollView>
        <View style={[{height: 55}, DefaultStyles.brandBackgroundColor]}>
          <TouchableOpacity style={[styles.button, DefaultStyles.brandColorButton]} onPress={() => props.navigation.navigate('Payment')}>
            <Text style={{color:'#fff', fontSize: 18, fontWeight: 'bold', width: '100%', textAlign: 'center'}}>Next</Text>
          </TouchableOpacity>
        </View>
      </View>
      <LoadingModal isLoading={isLoading}/>
    </KeyboardAvoidingView>
  )
}

const mapStateToProps = state => ({
  cart: state.cart,
  order: state.orders
})

const mapDispatchToProps = dispatch => ({
  getCart: () => dispatch(fetchCart()),
  placeOrder: (orderDetails) => dispatch(createOrder(orderDetails)),
  getOrders: () => dispatch(fetchAllOrder())
})

export default connect(mapStateToProps, mapDispatchToProps)(PaymentScreen);

const styles = StyleSheet.create({
  paymentSelectionContainer: {
    paddingLeft: 20,
    paddingTop: 20,
    flex: 3,
    paddingRight: 20,
  },
  paymentSelectionBlock: {
    borderRadius: 5,
    borderWidth: 2,
    borderColor: "#d4d4d4",
    justifyContent: 'center',
    padding: 20,
    paddingTop: 10
  },
  paymentDetailsContainer: {
    flex: 1,
    padding: 20
  },
  paymentDetailsBlock: {
    borderWidth: 1,
    flex: 1,
    borderColor: '#eee',
    borderRadius: 5,
    padding: 20
  },
  button: {
    alignItems: 'center',
    padding: 15,
    color:'#fff'
  },
  text: {
    marginVertical: 8,
  },
  radio: {
    marginVertical: 8
  },
})