import React from 'react';
import { View, Text, StyleSheet } from "react-native";
import DefaultStyles from '../style/customStyles';
import HeaderRightView from './headerRight';
import Constants from 'expo-constants';

function CustomHeader(props) {
  const { navigation } = props
  return (
    <View style={[styles.headerContainer, DefaultStyles.brandBackgroundColor]}>
      <Text style={{color: 'white', fontWeight: 'bold', fontSize: 18, width: '74%'}}>{navigation.state.routeName}</Text>
      <HeaderRightView navigation={navigation}/>
    </View>
  )
}

export default CustomHeader;

const styles = StyleSheet.create({
  headerContainer: {
    height: 86,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingLeft: 15,
    width: '100%',
    paddingRight: 15,
    paddingTop: Constants.statusBarHeight
  },
  headerContent: {

  }
})