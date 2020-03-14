import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { brandLightBackdroundColor, brandColor } from '../style/customStyles';
import { connect } from 'react-redux';
import { fetchCart } from '../../store/actions/cartAction';
import { FontAwesome } from '@expo/vector-icons';

function PriceBreakDown(props) {
  const { cart, cartItems } = props;

  useEffect(() => {
    props.getCartData()
  },[]);
  
  useEffect(() => {
    props.getCartData()
  },[cartItems.isLoading])

  return (
    <View style={{}}>
      <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingLeft:10, paddingBottom: 5}}>
        <Text>Item total</Text>
        <View style={{flexDirection: 'row', width: 70, justifyContent: 'space-between'}}>
          <Text>:  <FontAwesome name="rupee" size={12} color="black" /></Text>
          <Text>{cart.item_total_price}</Text>
        </View>
      </View>
      <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingLeft:10, paddingBottom: 5}}>
        <Text>Total discount</Text>
        <View style={{flexDirection: 'row', width: 70, justifyContent: 'space-between'}}>
          <Text>:  <FontAwesome name="rupee" size={12} color="black" /></Text>
          <Text>{cart.item_total_price - cart.cart_total}</Text>
        </View>
      </View>
      <View style={{borderColor: '#eee', borderWidth: .5}}></View>
      <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingLeft:10, paddingBottom: 5, paddingTop: 5}}>
        <Text>Total</Text>
        <View style={{flexDirection: 'row', width: 70, justifyContent: 'space-between'}}>
          <Text>:  <FontAwesome name="rupee" size={12} color="black" /></Text>
          <Text>{cart.cart_total}</Text>
        </View>
      </View>
      <View style={styles.totalSaveContainer}>
        <Text style={{color: "#fff", fontWeight: "bold", width: '100%', textAlign: 'center'}}>You saved total Rs. {cart.item_total_price - cart.cart_total}</Text>
      </View>
    </View>
  )
}

const mapStateToProps = (state) => {
  return {
    cart: state.cart.values,
    cartItems: state.cartItems
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getCartData: (user_id) => dispatch(fetchCart(user_id))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PriceBreakDown);

const styles = StyleSheet.create({
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