import React from 'react';
import { SafeAreaView } from 'react-navigation';
import { DrawerItems } from 'react-navigation-drawer';
import { StyleSheet, ScrollView, View, Image, Text, ImageBackground } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ProfileBackground from '../assets/images/blue-wave.jpg';
// import Constants from 'expo-constants';
import { onSigout } from '../store/actions/authenticationAction';
import { connect } from 'react-redux';
import { setSessionUnauthenticated } from '../store/actions/sessionActions';
import * as Sentry from '@sentry/react-native';
import ShowAlert from '../controllers/alert';

const SideDrawer = props => {
  const { navigation, signOut, currentUserModel, unAuthenticate } = props

  const logOut = async () => {
    try {
      await unAuthenticate()
      signOut()
      navigation.navigate('Auth')
    } catch(e) {
      if(e && e.message) {
        ShowAlert('Oops!', e.message)
      } else {
        ShowAlert('Oops!', e)
      }
      Sentry.captureException(e)
    }
  }

  return (
  <View style={styles.container}>
    <View style={{flex: 1}}>
      <ImageBackground source={ProfileBackground} style={styles.profilePicContainer}>
        <SafeAreaView>
          <View style={styles.profilePic}>
            {currentUserModel.values.image_source ?
            <Image style={styles.profilePic} source={{uri: currentUserModel.values.image_source}}/> :
            <View style={styles.profilePic}></View> }
          </View>
          <View style={styles.nameContainer}>
            <Text style={styles.name}>Hello, {currentUserModel.values.name}</Text>
          </View>
        </SafeAreaView>
      </ImageBackground>
      <SafeAreaView>
        <ScrollView showsVerticalScrollIndicator={false}>
          <DrawerItems {...props} labelStyle={{width: '100%'}}/>
          <TouchableOpacity onPress={() => logOut()}>
            <View style={styles.logout}>
              <MaterialCommunityIcons name="logout" size={18} style={{marginHorizontal: 16, width: 24, alignItems: 'center', opacity: 0.62, paddingLeft: 3}}/>
              <Text style={styles.logoutText}>Logout</Text>
            </View>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </View>
    <SafeAreaView>
      <View style={styles.backButtonContainer}>
        <TouchableOpacity onPress={() => props.navigation.toggleDrawer()}>
          <View style={styles.backButton}>
            <FontAwesome name="angle-left" size={20} color="white" />
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  </View>
)};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  profilePicContainer: {
    height: 230,
    // borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingLeft: 30,
    // paddingTop: Constants.statusBarHeight
  },
  profilePic: {
    height: 100,
    width: 100,
    borderRadius: 70
  },
  nameContainer: {
    marginTop: 20,
    width: '100%',
    paddingLeft: 5,
    // borderWidth: 1,
    alignItems: 'flex-start',
    justifyContent: 'center'
  },
  name: {
    fontWeight: 'bold',
    width: '100%',
    fontSize: 16,
    color: 'white'
  },
  logout: {
    backgroundColor: "transparent",
    flexDirection: 'row',
    alignItems: 'center',
    padding: 0,
  },
  logoutText: {
    fontWeight: 'bold',
    margin: 16,
    color: "rgba(0, 0, 0, .87)",
    width: '100%'
  },

  backButtonContainer: {
    justifyContent: 'center',
    // borderWidth: 1,
    alignItems: "center",
    marginBottom: 30,
    width: '100%'
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

const mapStatetoProps = state => ({
  auth: state.auth,
  currentUserModel: state.currentUser
})
const mapDispatchToProps = dispatch => ({
  signOut: () => dispatch(onSigout()),
  unAuthenticate: () => dispatch(setSessionUnauthenticated())
})
export default connect(mapStatetoProps, mapDispatchToProps)(SideDrawer);