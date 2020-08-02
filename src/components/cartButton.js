import React, { useEffect } from 'react';
import { TouchableOpacity, View, StyleSheet, Text } from 'react-native';
import { connect } from 'react-redux';
import Feather from 'react-native-vector-icons/Feather';

function CartButton(props) {
  const { navigate } = props.navigation
  const { cartItemModel, session } = props
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
    <TouchableOpacity onPress={() => navigate('Cart')} disabled={!session.isSessionAuthenticated}>
      <Feather name='shopping-cart' size={32} color={'#FFF'} />
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{totalCartItem}</Text>
      </View>
    </TouchableOpacity>
  )
}

const mapStateToProps = state => ({
  cartItemModel: state.cartItems,
  session: state.session
})

export default connect(mapStateToProps)(CartButton);

const styles = StyleSheet.create({
  badge: {
    width: 20,
    height: 20,
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#52c41a',
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: '#fff',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  badgeText: {
    color: '#fff',
    paddingBottom: 6,
    fontSize: 14,

  }
})