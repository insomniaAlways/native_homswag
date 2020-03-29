import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, StatusBar, Linking } from 'react-native';
import Logo from '../assets/images/logo_rounded.png';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import { statusBarLightColor } from '../style/customStyles';
import * as Sentry from '@sentry/react-native';

function ContactScreen(props) {

  const openLink = async (url) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        alert(`Not able to open prefered application.`);
        Sentry.captureException(url)
      }
    } catch (e) {
      Sentry.captureException(e)
    }
  };

  const openDialScreen = () => {
    let url = 'tel:+916366505567';
    openLink(url);
  };
  const openMailScreen = () => {
    let mailAddress = 'mailto: care@homswag.com';
    openLink(mailAddress);
  };

  return (
    <View style={{flex: 1, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center'}}>
      <StatusBar barStyle={"dark-content"} backgroundColor={statusBarLightColor} />
      <View style={{justifyContent: 'center', alignItems: 'center', marginHorizontal: 20, marginVertical: 40, borderRadius: 20}}>
        <View style={{flex: 1, justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 20}}>
          <Image source={Logo} style={{width: 100, height: 100}}/>
        </View>
        <View style={{flex: 3, justifyContent: 'flex-start', alignItems: 'center', paddingHorizontal: 30}}>
          <Text style={{fontSize: 18, fontWeight: 'bold', width: '100%', textAlign: 'center'}}>About HomSwag</Text>
          <Text style={{textAlign: 'center', marginTop: 10, fontStyle: 'italic'}}>
            Homswag, we want to make Beauty and Grooming experience as convenient as possible at your own comfort where we connect you with our Best Beauty Professional to have great salon experience at Home.
            We are currently serving in Bangalore, connect with us for Hair, Beauty, Waxing, Facial, Manicure, Pedicure,Spa,Hair Texture And Hair Protein Services.
          </Text>
          <Text style={{fontSize: 18, fontWeight: 'bold', width: '100%', textAlign: 'center', marginTop: 25}}>Contact details</Text>
          <View style={{flexDirection: 'row', width: "70%", marginTop: 10}}>
            <MaterialCommunityIcons name="map-marker-outline" size={16} color="black"/>
            <Text style={{textAlign: 'left', marginLeft: 10}}>
              #339 4th Floor 27th main road HSR Layout Sector - 2, Bangalore -560102
            </Text>
          </View>
          <View style={{flexDirection: 'row', width: "70%", marginTop: 10}}>
            <TouchableOpacity style={{flexDirection: 'row'}} onPress={() => openDialScreen()}>
              <FontAwesome name="phone" size={16} color="black" style={{paddingTop: 2}}/>
              <Text style={{textAlign: 'left', marginLeft: 10}}>
              +91 6366-505567
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{flexDirection: 'row', width: "70%", marginTop: 10}}>
            <TouchableOpacity style={{flexDirection: 'row'}} onPress={() => openMailScreen()}>
              <Feather name="mail" size={16} color="black" style={{paddingTop: 2}}/>
              <Text style={{textAlign: 'left', marginLeft: 10}}>care@homswag.com</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.backButtonContainer}>
          <TouchableOpacity onPress={() => props.navigation.toggleDrawer()}>
            <View style={styles.backButton}>
              <FontAwesome name="angle-right" size={20} color="white" />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

export default ContactScreen;

const styles = StyleSheet.create({
  backButtonContainer: {
    justifyContent: 'center',
    // borderWidth: 1,
    alignItems: "center",
    marginBottom: 30,
    width: '100%'
    // position: 'absolute',
    // bottom: 0
  },

  backButton: {
    paddingTop: 7,
    paddingBottom: 7,
    width: 150,
    alignItems: 'center',
    borderRadius: 50,
    backgroundColor: '#6495ed'
  }
});