import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Layout, Text, Spinner } from '@ui-kitten/components';
import { FontAwesome } from '@expo/vector-icons';

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
      <Layout>
        <Text>{address.address.formatedAddress}</Text>
        <Text>{address.address.localAddress}</Text>
        <Text>{address.address.landmark}</Text>
      </Layout>
    </TouchableOpacity>
  )};

  if(addresses.values && Array.isArray(addresses.values) && addresses.values.length) {
    return (
      <Layout style={[styles.addressList ,props.style]}>
        {addresses.values.map((address) => (<RenderItem key={address.id} address={address} />))}
      </Layout>
    )
  } else {
    return (
      <View style={[{flex: 1, justifyContent: 'center', alignItems: 'center'}, props.style]}>
        { addresses.isLoading ? (
          <Layout style={styles.loaderContainer}>
            <Spinner status='success' style={{height: 20, width: 20}}/>
            <Text>Loading...</Text>
          </Layout>
        ) : 
          <Layout style={{flex: 1,justifyContent: 'center', alignItems: 'center', marginBottom: 30}}>
            <FontAwesome name="map-o" size={80} color="#d4d4d4" />
            <Text style={{paddingTop: 10}}>No Address found.</Text>
          </Layout>
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
    flex: 1
  }
})