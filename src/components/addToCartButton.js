import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

function AddToCartButton(props) {
  const { setAdded, isOffline, isLoading, setLoading } = props
  const addItemToCart = () => {
    setLoading(true)
    if(props.addToCart) {
      props.addToCart(props.item)
    }
    if(setAdded) {
      setAdded(true)
    }
  }
  if(isOffline) {
    return (
      <View style={{ width: 70, padding: 5, borderRadius: 5}}>
        <Text style={{textAlign: 'center', color: 'grey'}}>Offline</Text>
      </View>
    )
  } else if (isLoading) {
    return (
      <View style={{ width: 70, padding: 5, borderRadius: 5 }}>
        <Text style={{textAlign: 'center', color: 'black'}}>Loading..</Text>
      </View>
    )
  } else {
    return (
      <TouchableOpacity onPress={() => addItemToCart()}>
        <View style={{ width: 70, padding: 5, borderRadius: 5, backgroundColor: '#d4d4d4' }}>
          <Text style={{textAlign: 'center', color: 'black'}}>Add</Text>
        </View>
      </TouchableOpacity>
    )
  }
}

export default AddToCartButton;