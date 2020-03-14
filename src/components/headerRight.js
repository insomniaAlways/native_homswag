import React from "react";
import { View, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import CartButton from './cartButton';
import { Linking } from 'expo';

const HeaderRightView = function (props) {

  const openWhatsApp = () => {
    let url = `whatsapp://send?text=&phone=916366505567`
    Linking.canOpenURL(url)
    .then((supported) => {
      if (!supported) {
        alert(url);
      } else {
        return Linking.openURL(`whatsapp://send?text=&phone=916366505567`);
      }
    })
    .catch((err) => alert(err));
  }
  return (
    <View style={{flexDirection: 'row', flexDirection: 'row', justifyContent: 'space-around', width: 120, alignItems: 'center', paddingRight: 10}}>
      <TouchableOpacity onPress={() => openWhatsApp()}>
        <FontAwesome name="whatsapp" size={30} color="#fff"/>
      </TouchableOpacity>
      <CartButton navigation={props.navigation}/>
      <TouchableOpacity style={{width: 20, alignItems: 'center'}} onPress={() => props.navigation.toggleDrawer()}>
        <FontAwesome name="ellipsis-v" size={25} color="#fff"/>
      </TouchableOpacity>
    </View>
  )
}

export default HeaderRightView;