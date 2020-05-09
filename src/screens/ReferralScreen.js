import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const ReferralScreen = (props)  => {
  return (
    <View style={{flex: 1}}>
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text>REFERRAL SCREEN</Text>
      </View>
      <View style={styles.backButtonContainer}>
        <TouchableOpacity onPress={() => props.navigation.toggleDrawer()}>
          <View style={styles.backButton}>
            <FontAwesome name="angle-right" size={20} color="white" />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  backButtonContainer: {
    justifyContent: 'center',
    alignContent: 'flex-end',
    alignItems: "center",
    marginBottom: 30,
    width: '100%',
  },
  backButton: {
    paddingTop: 7,
    paddingBottom: 7,
    width: 150,
    alignItems: 'center',
    borderRadius: 50,
    backgroundColor: '#6495ed'
  }
})

export default ReferralScreen;