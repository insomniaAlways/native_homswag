import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, SafeAreaView, RefreshControl, ActivityIndicator, StatusBar, Modal, StyleSheet, TouchableOpacity, Image, Platform } from 'react-native';
import { connect } from 'react-redux';
import { fetchCategories } from '../store/actions/index';
import CategoryList from '../components/categoryList';
import { fetchUser } from '../store/actions/userActions';
import { fetchCart } from '../store/actions/cartAction';
import { fetchCartItems } from '../store/actions/cartItemAction';
import { fetchAllItems } from '../store/actions/itemActions';
import { fetchPackages } from '../store/actions/packageActions';
import OfferView from '../components/offerView';
import PromoView from '../components/promoView';
import { statusBarBrandColor, brandColor } from '../style/customStyles';
import * as Animatable from 'react-native-animatable';
import * as Sentry from '@sentry/react-native';
import ShowAlert from '../controllers/alert';
import AsyncStorage from '@react-native-community/async-storage';

import { Linking } from 'react-native';
import VersionCheck from 'react-native-version-check';

const saftymeasures = [
  'Temperature Check', 'Face Mask', "Hands Sanitized", 'Face Shield', 'Hand Gloves', 'Single use Products', 'Disposable Items'
]

function Dashboard(props) {
  const [ refreshing, setRefreshing ] = useState(false);
  const [ storeUrl, setStoreUrl ] = useState('');
  const [ showModal, toggleModal ] = useState(false)
  const [ showSaftyModal, toggleSaftyModal ] = useState(false)
  const { session } = props

  const onRefresh = useCallback(() => {
    if(!props.networkAvailability.isOffline) {
      setRefreshing(true);
      async function fetchData() {
        try {
          await props.getAllCategories()
          await props.getPackages()
          await props.getAllItems()
          if(session && session.isSessionAuthenticated) {
            await props.getUser()
            await props.getCart()
            await props.getAllCartItems()
          }
          setRefreshing(false)
        } catch (e) {
          if(e.message) {
            ShowAlert('Oops!', e.message)
          } else {
            ShowAlert("Oops!", e)
          }
          setRefreshing(false)
          Sentry.captureException(e)
        }
      }
      fetchData()
    } else {
      setRefreshing(false)
    }
  }, [refreshing, session.isSessionAuthenticated]);

  useEffect(() => {
    getLatestAppUpdate()
  }, [])

  useEffect(() => {
    if(!props.networkAvailability.isOffline) {
      async function fetchData() {
        try {
          props.getAllCategories()
          props.getPackages()
          props.getAllItems()
          if(session && session.isSessionAuthenticated) {
            await props.getUser()
            await props.getCart()
            await props.getAllCartItems()
          }
        } catch (e) {
          if(e.message) {
            ShowAlert('Oops!', e.message)
          } else {
            ShowAlert("Oops!", e)
          }
          Sentry.captureException(e)
        }
      }
      fetchData()
    }
  }, [props.navigation.isFocused, session.isSessionAuthenticated])

  const getLatestAppUpdate = async () => {
    try {
      let latestVersion, currentVersion, url
      if(Platform.OS === 'ios') {
        latestVersion = await VersionCheck.getLatestVersion({country:'in'})
        currentVersion = await VersionCheck.getCurrentVersion()
        url = await VersionCheck.getAppStoreUrl({appID: 1519588025})
      } else {
        latestVersion = await VersionCheck.getLatestVersion()
        currentVersion = await VersionCheck.getCurrentVersion()
        url = await VersionCheck.getStoreUrl()
      }
      setStoreUrl(url)
      latestVersion = latestVersion ? (typeof(latestVersion) == "string" && latestVersion.split('.').join('')) : latestVersion
      currentVersion = currentVersion ? (typeof(currentVersion) == "string" && currentVersion.split('.').join('')) : currentVersion
      if(latestVersion && currentVersion && parseInt(latestVersion) > parseInt(currentVersion)) {
        toggleModal(true)
      } else {
        // showSafty()
      }
    } catch (e) {
      // showSafty()
      Sentry.captureException(e)
    }
  }

  const showSafty = () => {
    if(showSaftyModal) {
      toggleSaftyModal(false)
      AsyncStorage.setItem('showSaftyModal', 'false')
    } else {
      AsyncStorage.getItem('showSaftyModal').then((res) => {
        if(res && res == 'true') {
          toggleSaftyModal(true)
        }
      }).catch((e) => Sentry.captureEvent(e))
    }
  }

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: "#FFFFFF"}}>
      <StatusBar barStyle={"light-content"} backgroundColor={statusBarBrandColor} />
      <ScrollView showsVerticalScrollIndicator={false} refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} enabled={true}/>
        }>
        <View style={{height: 260, paddingTop: 10, paddingBottom: 10}}>
          <OfferView packages={props.packages} navigation={props.navigation}/>
        </View>
        <Text style={{paddingLeft: 20, paddingBottom: 0, paddingTop: 10}}>What would you like to do?</Text>
        <View style={{paddingLeft: 25, paddingRight: 25, paddingTop: 10, paddingBottom: 10, backgroundColor: "#FFFFFF"}}>
          {props.categories.isLoading ? 
            <View style={{height: 600, justifyContent: 'center', alignItems: 'center'}}>
              <ActivityIndicator size="small" color="#0000ff" />
            </View> : 
            <Animatable.View
              duration={800}
              animation={'fadeIn'}
              onRequestClose={() => {
                toggleModal(false)
              }}
              >
              <CategoryList data={props.categories.values} navigation={props.navigation}/>
            </Animatable.View>
          }
        </View>
        <View style={{height: 260, paddingTop: 10, paddingBottom: 10}}>
          <PromoView />
        </View>
        <View style={{marginBottom: 50, marginTop: 10, padding: 20, borderTopWidth: 1, borderBottomWidth: 1, borderColor: "#ABDAF6", marginLeft: 20, marginRight: 20}}>
          <Text style={{textAlign: "center", fontStyle: 'italic', color: '#e84393', fontSize: 18}}>
            An experience you’ll never forget at the cutting edge of contemporary hair & beauty
          </Text>
        </View>
      </ScrollView>
      <Modal
        animationType="slide"
        transparent={true}
        visible={showModal}
        onRequestClose={() => {
          toggleModal(false)
        }}>
        <View
          style={styles.backdrop}>
          <View style={styles.popUpContainer}>
            <View style={{borderRadius: 20}}>
              <Image source={require('../assets/images/appupdate_rocket.png')} style={{height: 114, borderRadius: 10, width: '100%'}} resizeMode="stretch" />
              <View style={{position: 'absolute', width: '100%', alignItems: 'flex-end', top: -8, right: -8}}>
                <TouchableOpacity onPress={() => { toggleModal(false)}}>
                  <View style={{width: 30, height: 30, backgroundColor: '#fff', borderRadius: 15, alignItems: 'center', justifyContent: 'center'}}>
                    <Text>X</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
            <View style={{paddingHorizontal: 10, marginTop: 10, width: '70%', justifyContent: 'center'}}>
              <Text style={{fontFamily: 'Roboto-MediumItalic', fontSize: 18, textAlign: 'center'}}>Update your app</Text>
              <Text style={{fontFamily: 'Roboto-Regular', fontSize: 14, marginTop: 10, textAlign: 'center'}}>To enjoy seemless appointment booking from your home.</Text>
              <Text style={{fontFamily: 'Roboto-Regular', fontSize: 14, marginTop: 10, textAlign: 'center'}}>Tab the button below.</Text>
              <View style={{flexDirection: 'row', justifyContent: 'center', marginTop: 20, marginBottom: 20}}>
                <TouchableOpacity onPress={() => { toggleModal(false); Linking.openURL(storeUrl)}}>
                  <View style={{backgroundColor: brandColor, borderRadius: 20, paddingVertical: 10, paddingHorizontal: 20}}>
                    <Text style={{color: '#fff'}}>Update Now</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={showSaftyModal}
        onRequestClose={() => {
          showSafty()
        }}>
        <View
          style={styles.backdrop}>
          <View style={styles.saftypopUpContainer}>
            <View style={{position: 'absolute', width: '100%', alignItems: 'flex-end', top: -8, right: -8}}>
              <TouchableOpacity onPress={() => { showSafty()}}>
                <View style={{width: 30, height: 30, backgroundColor: '#eee', borderRadius: 15, alignItems: 'center', justifyContent: 'center'}}>
                  <Text style={{color: "#000"}}>X</Text>
                </View>
              </TouchableOpacity>
            </View>
            <Text style={{fontSize: 26, fontWeight: 'bold', color: brandColor, textAlign: "center"}}>SAFETY MEASURES</Text>
            <View style={styles.saftypopUpContent}>
              <View>
                {saftymeasures.map((content, index) => (
                  <View key={index} style={styles.saftyTextContainer}>
                    <View style={styles.bulletPoint}></View>
                    <Text style={styles.listContent}>{content}</Text>
                  </View>
                ))}
              </View>
              <View style={{justifyContent: 'center', borderRadius: 10, paddingBottom: 20}}>
                <Image source={require('../assets/images/temperature-check.png')} style={{width: 170, height: 180, position: 'relative', left: -25, borderRadius: 10}} resizeMode={"stretch"}/>
              </View>
            </View>
            <View style={{justifyContent: 'center', alignItems: 'center', marginTop: 20}}>
              <Text style={{fontSize: 26, fontWeight: 'bold', color: brandColor}}>STAY AT HOME STAY SAFE</Text>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const mapStateToProps = state => {
  return {
    categories: state.categories,
    packages: state.packages,
    cart: state.cart,
    session: state.session,
    networkAvailability: state.networkAvailability
  }
}

const mapDispatchToProps = dispatch => {
  return {
    getAllCategories: () => dispatch(fetchCategories()),
    getUser: () => dispatch(fetchUser()),
    getCart: ()=> dispatch(fetchCart()),
    getAllCartItems: () => dispatch(fetchCartItems()),
    getAllItems: () => dispatch(fetchAllItems()),
    getPackages: () => dispatch(fetchPackages())
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  popUpContainer: {
    backgroundColor: '#fff',
    borderRadius: 10
  },
  saftypopUpContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    width: '90%',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#FFE7D1'
  },
  saftypopUpContent: {
    flexDirection: 'row',
    marginTop: 10
  },
  saftyTextContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingVertical: 10
  },
  bulletPoint: {
    width: 8,
    height: 8,
    borderRadius: 50,
    backgroundColor: brandColor
  },
  listContent: {
    fontSize: 20,
    marginLeft: 10
  }
})
