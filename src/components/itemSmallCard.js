import React from 'react';
import { View, Image, Text } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import DefaultStyles from '../style/customStyles';

function ItemSmallCard(props) {
  const { id } = props
  return (
    <View style={{height: 150, width: 170, marginRight: 10, borderWidth: 1, borderColor: '#eee'}}>
      <View style={{height: '80%', borderWidth: 1, borderColor: '#eee'}}>
      <Image 
        style={{height: "100%", width: "100%"}}
        source={{uri: `https://i.picsum.photos/id/${id}/200/200.jpg`}}
      />
      </View>
      <View style={{height: '20%', borderWidth: 1, borderColor: '#eee', justifyContent: 'center'}}>
        <TouchableOpacity style={{height: '100%', width: '100%', alignItems: 'center', justifyContent: 'center'}}>
          <Text style={[DefaultStyles.brandTextColor, { fontWeight: 'bold', width: '100%', textAlign: 'center' }]}>Add</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default ItemSmallCard;