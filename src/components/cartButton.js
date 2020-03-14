import React, { useEffect } from 'react';
import { TouchableOpacity } from 'react-native';
import { Icon } from '@ui-kitten/components';
import { connect } from 'react-redux';
import { Badge } from 'react-native-elements';

function CartButton(props) {
  const { navigate } = props.navigation
  const { cartItemModel } = props
  let totalCartItem = 0
  if(cartItemModel && !cartItemModel.isLoading  && cartItemModel.values && Array.isArray(cartItemModel.values)) {
    totalCartItem = cartItemModel.values.length
  }

  useEffect(() => {
    if(cartItemModel && !cartItemModel.isLoading && cartItemModel.values && Array.isArray(cartItemModel.values) && cartItemModel.values.length) {
      totalCartItem = cartItemModel.values.length
    }
  }, [cartItemModel.isLoading, cartItemModel.values.length])
  
  return (
    <TouchableOpacity onPress={() => navigate('Cart')}>
      <Icon name='shopping-cart-outline' width={32} height={32} fill='#FFF' />
      <Badge
          status="success"
          value={totalCartItem}
          containerStyle={{ position: 'absolute', top: -4, right: -4 }}
        />
    </TouchableOpacity>
  )
}

mapStateToProps = state => {
  return {
    cartItemModel: state.cartItems
  }
}

export default connect(mapStateToProps)(CartButton);