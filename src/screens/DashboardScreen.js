import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, SafeAreaView, RefreshControl, ActivityIndicator, StatusBar, Modal, StyleSheet, TouchableOpacity, Image } from 'react-native';
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

import { Linking } from 'react-native';
import VersionCheck from 'react-native-version-check';

function Dashboard(props) {
  const [ refreshing, setRefreshing ] = useState(false);
  const [ storeUrl, setStoreUrl ] = useState('');
  const [ showModal, toggleModal ] = useState(false)

  const onRefresh = useCallback(() => {
    if(!props.networkAvailability.isOffline) {
      setRefreshing(true);
      async function fetchData() {
        try {
          await props.getCart()
          await props.getAllCategories()
          await props.getUser()
          await props.getAllItems()
          await props.getPackages()
          await props.getAllCartItems()
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
  }, [refreshing]);

  useEffect(() => {
    if(!props.networkAvailability.isOffline) {
      async function fetchData() {
        try {
          props.getAllCategories()
          await props.getUser()
          props.getAllItems()
          props.getPackages()
          await props.getCart()
          await props.getAllCartItems()
          getLatestAppUpdate()
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
  }, [props.navigation.isFocused])

  const getLatestAppUpdate = async () => {
    let latestVersion = await VersionCheck.getLatestVersion()
    let currentVersion = await VersionCheck.getCurrentVersion()
    let url = await VersionCheck.getStoreUrl()
    setStoreUrl(url)
    latestVersion = latestVersion ? (typeof(latestVersion) == "string" && latestVersion.split('.').join('')) : latestVersion
    currentVersion = currentVersion ? (typeof(currentVersion) == "string" && currentVersion.split('.').join('')) : currentVersion
    if(latestVersion && currentVersion && latestVersion > currentVersion) {
      toggleModal(true)
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
                <Image source={{uri: "https://firebasestorage.googleapis.com/v0/b/homswag.appspot.com/o/images%2Fappupdate_rocket.png?alt=media&token=88f518c0-8d03-44a1-bc1a-248904e0bc08"}} style={{height: 114, borderRadius: 10}} resizeMode="stretch" />
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
    </SafeAreaView>
  );
}

mapStateToProps = state => {
  return {
    categories: state.categories,
    packages: state.packages,
    cart: state.cart,
    networkAvailability: state.networkAvailability
  }
}

mapDispatchToProps = dispatch => {
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
    // paddingVertical: 20,
    // paddingHorizontal: 20,
    borderRadius: 10
  },
  // topContainer: {
  //   height: 50,
  //   width: '100%'
  // }
})
