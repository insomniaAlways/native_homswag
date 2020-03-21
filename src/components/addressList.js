import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const AddressList = function(props) {
  const { addresses, setSelectedAddress, setModal } = props

  const onSelect = (address) => {
    if(setSelectedAddress) {
      setSelectedAddress(address)
      setModal(false)
    }
  }

  const RenderItem = ({address}) => {
    return (
    <TouchableOpacity onPress={() => onSelect(address)}>
      <View>
        <Text>{address.address.formatedAddress}</Text>
        <Text>{address.address.localAddress}</Text>
        <Text>{address.address.landmark}</Text>
      </View>
    </TouchableOpacity>
  )};

  if(addresses.values && Array.isArray(addresses.values) && addresses.values.length) {
    return (
      <View style={[styles.addressList ,props.style]}>
        {addresses.values.map((address) => (<RenderItem key={address.id} address={address} />))}
      </View>
    )
  } else {
    return (
      <View style={[{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF'}, props.style]}>
        { addresses.isLoading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#0000ff" />
            <Text>Loading...</Text>
          </View>
        ) : 
          <View style={{flex: 1,justifyContent: 'center', alignItems: 'center', marginBottom: 30}}>
            <FontAwesome name="map-o" size={80} color="#d4d4d4" />
            <Text style={{paddingTop: 10}}>No Address found.</Text>
          </View>
        }
      </View>
    )
  }
}

export default AddressList;

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    padding: 15,
    color:'#fff'
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  addressList: {
    flex: 1,
    backgroundColor: '#FFFFFF'
  }
})