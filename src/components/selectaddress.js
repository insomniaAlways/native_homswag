import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import DefaultStyles from '../style/customStyles';

function SelectAddress(props) {
  return (
    <View style={{paddingLeft: 10, paddingRight: 10, paddingBottom: 5}}>
      <View style={{marginBottom: 10}}>
        <Text style={{fontWeight: 'bold'}}>Multiple address in this location:</Text>
      </View>
      <View style={{flexDirection: 'row'}}>
        <TouchableOpacity style={[{flex: 1, justifyContent: 'space-between',marginRight: 10 }, DefaultStyles.basicBrandColorButton]} onPress={() => props.navigation.navigate('AddAddress')}>
          <Text style={[{fontSize: 16, fontWeight: 'bold', width: '100%', textAlign: 'center' }, DefaultStyles.brandTextColor]}>Add Address</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[{flex: 1, justifyContent: 'space-between', alignItems: 'center', paddingTop: 8, paddingBottom: 8 }, DefaultStyles.brandColorButton]} onPress={() => props.navigation.navigate('Address')}>
          <Text style={[{fontSize: 16, fontWeight: 'bold', width: '100%', textAlign: 'center' }, DefaultStyles.textWhite]}>Select Address</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default SelectAddress;