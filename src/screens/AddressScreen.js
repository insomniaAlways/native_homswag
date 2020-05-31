import React, { useState, useEffect, useLayoutEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import { Text, View, SafeAreaView, StyleSheet, TouchableOpacity, ActivityIndicator, FlatList, StatusBar } from 'react-native';
import DefaultStyles, { statusBarBrandColor } from '../style/customStyles';
import { fetchAddress, deleteAddresss, updateAddress } from '../store/actions/addressActions';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Sentry from '@sentry/react-native';
import ShowAlert from '../controllers/alert';

function AddressScreen(props) {
  const { addressModel, getAddress, navigation, deleteSelected, setDefault, networkAvailability } = props;
  const addresses = addressModel.values
  const [ refreshing, setRefreshing ] = useState(false);

  useLayoutEffect(() => {
    if(!networkAvailability.isOffline) {
      getAddress()
    }
  }, [])

  useEffect(() => {
    if(!addressModel.isLoading && addressModel.error) {
      if(addressModel.error && addressModel.error.messsage) {
        ShowAlert('Oops!', addressModel.error.messsage)
      } else {
        ShowAlert('Oops!', addressModel.error)
      }
      Sentry.captureException(addressModel.error)
    }
  }, [addressModel.error])

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    async function fetchData() {
      await props.getAddress()
      setRefreshing(false)
    }
    fetchData()
    return () => setRefreshing(false)
  });

  const deleteRecord = (value) => {
    deleteSelected(value.id)
  }

  const setDefaultAddress = (value) => {
    setDefault(value.id, true)
  }

  const renderItem = ({ item, index }) => (
    <View style={{backgroundColor: '#FFFFFF',paddingHorizontal: 20, marginBottom: 10, paddingTop: 10, borderRadius: 10}}>
      <View style={{flexDirection: 'row'}}>
        <View style={{marginRight: 10}}>
          <FontAwesome name="map-marker" size={20} color="black" />
        </View>
        <View style={{flex: 1}}>
          <Text style={{fontFamily: 'Roboto-Regular'}}>{item.address.formatedAddress}</Text>
          {item.address.localAddress ? <Text style={{fontFamily: 'Roboto-Regular'}}>{item.address.localAddress}</Text> : null }
          {item.address.landmark ? <Text style={{fontFamily: 'Roboto-Regular'}}>{item.address.landmark}</Text> : null}
        </View>
      </View>
      <View style={{flexDirection: 'row', justifyContent: 'flex-start', paddingHorizontal: 20, paddingVertical: 10}}>
        {item.is_default || networkAvailability.isOffline ? 
          <View style={{marginRight: 30}}><Text style={styles.isDefaultTrue}>Set default</Text></View>:
          <TouchableOpacity onPress={() => setDefaultAddress(item)} style={{marginRight: 30}}><Text style={styles.isDefaultFalse}>Set default</Text></TouchableOpacity>
        }
        {item.is_default ? 
          <View><Text style={styles.deleteButtonTrue}>Delete</Text></View>:
          <TouchableOpacity onPress={() => deleteRecord(item)}><Text style={styles.deleteButtonFalse}>Delete</Text></TouchableOpacity>
        }
      </View>
    </View>
  );


  const AddressList = function() {
    if(addresses && Array.isArray(addresses) && addresses.length) {
      return (
        <View style={{backgroundColor: "#F7F9FC", marginBottom: 55}}>
          <FlatList
            showsVerticalScrollIndicator={false}
            data={addressModel.values}
            refreshing={refreshing}
            onRefresh={onRefresh}
            renderItem={renderItem}
            keyExtractor={item => `${item.id}`}
          />
        </View>
      )
    } else {
      return (
        <View style={{flex: 1,justifyContent: 'center', alignItems: 'center', marginBottom: 55}}>
          <FontAwesome name="map-o" size={80} color="#d4d4d4" />
          <Text style={{paddingTop: 10}}>No Address found.</Text>
        </View>
      )
    }
  }
  if(networkAvailability.isOffline) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <MaterialCommunityIcons name="wifi-strength-alert-outline" size={60} color='grey'/>
        <View style={{paddingTop: 30, alignItems: 'center'}}>
          <Text style={{fontSize: 22, fontFamily: 'Roboto-Medium'}}>Whoops!</Text>
          <Text style={{fontFamily: 'Roboto-LightItalic'}}>No Internet connection</Text>
        </View>
      </View>
    )
  } else {
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: "#F7F9FC"}}>
        <StatusBar barStyle={"light-content"} backgroundColor={statusBarBrandColor} />
        <View style={{flex: 1}}>
          {addressModel.isLoading ? (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size={'small'} color={"#0000ff"} />
              <Text>Loading...</Text>
            </View>
          ) : ( 
            <View style={{flex: 1}}>
              <AddressList />
              <View style={[{height: 55, position: 'absolute', bottom: 0, width: '100%'}, DefaultStyles.brandBackgroundColor]}>
                <TouchableOpacity style={[styles.button, DefaultStyles.brandColorButton]} onPress={() => navigation.navigate('AddNewAddress', { previousRoute: 'Address' })}>
                  <Text style={{color:'#fff', fontSize: 18, fontWeight: 'bold', width: '100%', textAlign: 'center'}}>Add new Address</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    // marginTop: Constants.statusBarHeight,
    flex: 1
  },
  button: {
    alignItems: 'center',
    padding: 15,
    color:'#fff'
  },
  addressList: {
    paddingHorizontal: 10,
    paddingBottom: 16,
  },
  productItem: {
    flex: 1,
    margin: 8,
    borderRadius: 10,
  },
  itemHeader: {
    height: 140,
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff'
  },
  isDefaultTrue: {
    color: 'grey',
    fontFamily:'Roboto-Medium',
    fontSize: 12
  },
  isDefaultFalse: {
    color: 'green',
    fontSize: 12,
    fontFamily: 'Roboto-Medium'
  },
  deleteButtonTrue: {
    color: 'grey',
    fontFamily: 'Roboto-Medium',
    fontSize: 12
  },
  deleteButtonFalse: {
    color: 'red',
    fontFamily: 'Roboto-Medium',
    fontSize: 12
  }
})

mapStateToProps = state => {
  return {
    addressModel: state.addresses,
    networkAvailability: state.networkAvailability
  }
}

mapDispatchToProps = dispatch => {
  return {
    getAddress: () => dispatch(fetchAddress()),
    deleteSelected: (address_id) => dispatch(deleteAddresss(address_id)),
    setDefault: (address_id, is_default) => dispatch(updateAddress(address_id, is_default))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddressScreen);