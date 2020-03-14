import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import PlaceHolderTextInput from './placeHolderTextInput';
import { brandColor } from '../style/customStyles';

function BookingDetails(props) {
  const {
    setModal,
    selectedAddress,
    goToAddAddress,
    isAddressLoading,
    specialInstruction,
    setInstruction,
    preferedBeautician,
    setBeautician,
    currentUser } = props
  let address = selectedAddress && selectedAddress.address ? selectedAddress.address.formatedAddress : selectedAddress

  return (
    <View style={{padding: 10}}>
      <PlaceHolderTextInput placeholder="Name" styles={{margin: 10}} value={currentUser.name} disabled={true}/>
      <PlaceHolderTextInput placeholder="Phone Number" styles={{margin: 10}} value={currentUser.phone} disabled={true}/>
        { isAddressLoading ? 
          <View style={styles.addressContainer}>
            <Text style={styles.addressLoading}>Loading...</Text>
          </View> :
        ( selectedAddress ? 
          <View style={styles.addressContainer}>
            <View style={{width: '80%', paddingBottom: 10}}>
              <Text style={styles.addressText}>{address}</Text>
              {selectedAddress.address.localAddress || selectedAddress.address.landmark ? 
                <View>
                  <Text style={styles.addressText}>
                    {selectedAddress.address.localAddress ? selectedAddress.address.localAddress : null }
                  </Text>
                  <Text style={styles.addressText}>
                    {selectedAddress.address.landmark ? selectedAddress.address.landmark : null}
                  </Text>
                </View> : null
              }
            </View>
            <TouchableOpacity style={styles.addressChangeButton} onPress={() => setModal(true)}>
              <Text style={styles.addressChangeText}>Change</Text>
            </TouchableOpacity>
          </View> :
          <View style={styles.addressContainer}>
            <TouchableOpacity style={styles.addressAddButton} onPress={() => goToAddAddress()}>
              <Text style={styles.addressChangeText}>Add Address</Text>
            </TouchableOpacity>
          </View>
        )}
      <PlaceHolderTextInput placeholder="Special Instruction" styles={{margin: 10}} value={specialInstruction} setValue={setInstruction} />
      <PlaceHolderTextInput placeholder="Prefered Beautician" styles={{margin: 10}} value={preferedBeautician} setValue={setBeautician} />
    </View>
  )
}

export default BookingDetails;

const styles = StyleSheet.create({
  addressContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#eee',
    margin: 10
  },
  addressText: {
    width: '80%',
    fontFamily: 'roboto-regular',
  },
  addressLoading: {
    width: '100%',
    paddingBottom: 10
  },
  addressChangeButton: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10
  },
  addressAddButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingBottom: 10
  },
  addressChangeText: {
    color: brandColor
  }
})