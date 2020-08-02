import React from "react";
import { View, TouchableOpacity, Linking } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import CartButton from './cartButton';
import * as Sentry from '@sentry/react-native';
import ShowAlert from "../controllers/alert";

const HeaderRightView = function (props) {

  const openWhatsApp = async () => {
    let url = `whatsapp://send?text=&phone=916366505567`
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        ShowAlert(`Not able to open WhatsApp`, `Either application is not avalable in your device or permission is available.`);
        Sentry.captureException(url)
      }
    } catch (e) {
      Sentry.captureException(e)
    }
  };

  return (
    <View style={{flexDirection: 'row', justifyContent: 'space-around', width: 120, alignItems: 'center', paddingRight: 10}}>
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