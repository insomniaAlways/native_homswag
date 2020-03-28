import React, { useReducer, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import _ from 'lodash';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { fetchCartItems, updateItem, deleteItem } from '../store/actions/cartItemAction';
import * as Sentry from '@sentry/react-native';

function ModifyButton(props) {
  const { item, cartItem, updateCartItem, deleteCartItem, isOffline } = props
  const [ isLoading, setLoading ] = useState(false)

  const init = (initialCount) => {
    return {count: initialCount};
  }

  function reducer(state, action) {
    switch (action.type) {
      case 'increment': {
        setLoading(true)
        return {count: cartItem.quantity + 1};
      }
      case 'decrement': {
        setLoading(true)
        return {count: cartItem.quantity - 1};
      }
      case 'reset': {
        init(action.payload)
      }
      default:
        throw new Error();
    }
  }

  const [state, dispatch] = useReducer(reducer, cartItem ? cartItem.quantity : 1, init);

  useEffect(() => {
    async function updateCT() {
      if(state.count == 0) {
        try {
          await deleteCartItem(cartItem.id)
          props.removeCartItem(false)
        } catch(e) {
          alert(e)
          setLoading(false)
          Sentry.captureException(e)
        }
      } else if(cartItem && state.count && state.count >= 1) {
        let totalPrice = (+item.price * parseInt(state.count))
        try {
          await updateCartItem(cartItem.id, state.count, totalPrice)
          setLoading(false)
        } catch(e) {
          alert(e)
          setLoading(false)
          Sentry.captureException(e)
        }
      } else {
        setLoading(false)
      }
    }
    updateCT()
  }, [state.count])

  if(isOffline) {
    return (
      <View style={{flexDirection: 'row', justifyContent:'space-between', alignItems: 'center'}}>
        <Text style={{textAlign: 'center', color: 'grey'}}>Offline</Text>
      </View>
    )
  } else {
    return (
      <View style={{flexDirection: 'row',justifyContent:'space-between', alignItems: 'center'}}>
        {isLoading ?
          <View style={{width: 90, alignItems: 'center', height: 30, justifyContent: 'center'}}><Text>Loading..</Text></View>:
          <View style={{flexDirection: 'row', justifyContent:'center', alignItems: 'center'}}>
            <View style={{flex: 1, borderColor: '#eee', borderWidth: 1, height: 30}}>
              <TouchableOpacity onPress={() => dispatch({type: 'decrement'})}>
                <View style={{alignItems: 'center', justifyContent: 'center', height: 30}}>
                  <FontAwesome name='minus' size={12} color={"#0D5618"}/>
                </View>
              </TouchableOpacity>
            </View>
            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', borderTopColor: '#eee', borderTopWidth: 1, borderBottomColor: '#eee', borderBottomWidth: 1, height: 30}}>
              <Text>{cartItem.quantity}</Text>
            </View>
            <View style={{flex: 1, borderColor: '#eee', borderWidth: 1, height: 30}}>
              <TouchableOpacity onPress={() => dispatch({type: 'increment'})}>
                <View style={{alignItems: 'center', justifyContent: 'center', height: 30}}>
                  <FontAwesome name='plus' size={12} color={"#0D5618"}/>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        }
      </View>
    )
  }
}

const mapStateToProps = state => ({
  cartItemModel: state.cartItems,
  cartModel: state.cart
})

mapDispatchToProps = dispatch => {
  return {
    updateCartItem: (cart_item_id, quantity, totalPrice) => dispatch(updateItem(cart_item_id, quantity, totalPrice)),
    getCartItem: () => dispatch(fetchCartItems()),
    deleteCartItem: (cart_item_id) => dispatch(deleteItem(cart_item_id))
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(ModifyButton)