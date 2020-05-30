import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, SafeAreaView, RefreshControl, ActivityIndicator, StatusBar } from 'react-native';
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
import { statusBarBrandColor } from '../style/customStyles';
import * as Animatable from 'react-native-animatable';
import * as Sentry from '@sentry/react-native';
import ShowAlert from '../controllers/alert';

function Dashboard(props) {
  const [ refreshing, setRefreshing ] = useState(false);

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
          ShowAlert('Oops!', e)
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
        } catch (e) {
          ShowAlert('Oops!', e)
          Sentry.captureException(e)
        }
      }
      fetchData()
    }
  }, [props.navigation.isFocused])

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
