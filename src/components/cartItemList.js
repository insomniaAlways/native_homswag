import React, { useEffect } from 'react';
import { View } from 'react-native';
import { Text } from '@ui-kitten/components';
import _ from 'lodash';
import { connect } from 'react-redux';
import { fetchCart } from '../store/actions/cartAction';
import CartItemRow from './cartItemRow';

const ItemsList = (props) => {
  const { cartItem, getCart } = props
  const cartItems = _.sortBy(cartItem.values, 'id')

  useEffect(() => {
    getCart()
  }, [cartItem.isLoading])

  if(cartItems && Array.isArray(cartItems) && cartItems.length) {
    return cartItems.map((ct, index) => <CartItemRow index={index} cartItem={ct} key={index} />)
  } else {
    return (<View><Text>Something went worng</Text></View>)
  }
};

const mapStateToProps = state => ({
  cartItem: state.cartItems
})

const mapDispatchToProps = dispatch => ({
  getCart: () => dispatch(fetchCart)
})

export default connect(mapStateToProps, mapDispatchToProps)(ItemsList);