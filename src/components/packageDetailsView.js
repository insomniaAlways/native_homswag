import React, { useState, useLayoutEffect, useEffect } from "react";
import { View, TouchableOpacity, ScrollView, Image, Text } from 'react-native';
import DefaultStyles from '../style/customStyles';
import { StyleSheet } from 'react-native';
import { connect } from "react-redux";
import { createCartItem, deleteItem } from "../store/actions/cartItemAction";
import _ from 'lodash';
import { Dimensions } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const screenWidth = Math.round(Dimensions.get('window').width);

const ItemContainer = ({items, packageService}) => {
  let showDescription = false
  if(packageService.description) {
    showDescription = true
  }
  return (
    <View style={{paddingHorizontal: 20, paddingVertical: 20}}>
      <View style={{flexDirection: 'row', justifyContent: 'center', marginBottom: 10, alignItems: 'center'}}>
        <Text style={{fontSize: 24, fontFamily: 'roboto-medium-italic', paddingTop: 5}}>Package Price:</Text>
        <Text style={{fontSize: 24, fontFamily: 'roboto-medium-italic', paddingTop: 5, textDecorationLine: 'line-through', color: 'red', marginLeft: 10}}>
          <FontAwesome name="rupee" size={20} color="black" />
          {packageService.mrp_price}
        </Text>
        <Text style={{fontSize: 24, fontFamily: 'roboto-medium-italic', paddingTop: 5, color: 'green', marginLeft: 10}}>
          <FontAwesome name="rupee" size={20} color="black" />
          {packageService.price}
        </Text>
      </View>
      { showDescription ?
        <View style={{paddingBottom: 10, paddingRight: 10}}>
          <Text style={{fontSize: 16}}>{packageService.description}</Text>
        </View> : null
      }
      <Text style={{fontFamily: 'roboto-medium', fontSize: 18}}>Items</Text>
      {items.map((item, index) => (
        <View key={index} style={{paddingHorizontal: 10, paddingVertical: 10}}>
          <View>
            <View style={{flexDirection: 'row'}}>
              <Image source={{uri: item.image_source}} style={{width: 60, height: 40}}/>
              <View style={{marginLeft: 10, width: '75%'}}>
                <Text>{item.name}</Text>
                <Text category='c1'>{item.description}</Text>
              </View>
            </View>
          </View>
        </View>
      ))}
    </View>
  )
}

const PackageDetails = (props) => {
  const { tab: packageService, cartItemModel, addItemToCart, deletePackage, networkAvailability } = props
  const [ isAdded, setIsAdded ] = useState(false)

  const addPackageToCart = () => {
    addItemToCart(packageService.id, packageService.price, true)
  }

  useEffect(() => {
    if(!cartItemModel.isLoading && cartItemModel.error) {
      alert(cartItemModel.error)
    }
  }, [cartItemModel.error])

  const removePackageFromCart = () => {
    let cartPackages = cartItemModel.values.filter((cartItem) => cartItem.is_package == true)
    let cartItem = _.find(cartPackages, ['package.id', packageService.id])
    deletePackage(cartItem.id)
  }

  useLayoutEffect(() => {
    isPackageAdded()
  }, [cartItemModel.isLoading])

  const isPackageAdded = () => {
    if(cartItemModel && !cartItemModel.isLoading && cartItemModel.values.length) {
      let cartPackages = cartItemModel.values.filter((cartItem) => cartItem.is_package == true)
      if(_.find(cartPackages, ['package.id', packageService.id])) {
        setIsAdded(true)
      } else {
        setIsAdded(false)
      }
    } else {
      setIsAdded(false)
    }
  }

  return (
    <View style={{flex: 1}}>
      <ScrollView style={{paddingBottom: 20}} showsVerticalScrollIndicator={false}>
        <Image source={{uri: packageService.poster_image_source}} style={{width: screenWidth, height: 260}}/>
        <ItemContainer items={packageService.items} packageService={packageService}/>
      </ScrollView>
      { cartItemModel.isLoading ?
        <View style={[styles.button, {height: 55, backgroundColor: 'grey'}]}>
          <Text style={{color:'#fff', fontSize: 18, fontWeight: 'bold', width: '100%', textAlign: 'center'}}>Loading..</Text>
        </View> :
        <View>
          {!networkAvailability.isOffline &&
            <View>
              { isAdded ? 
                <View style={[{height: 55}, DefaultStyles.brandBackgroundColor]}>
                  <TouchableOpacity style={[styles.button, DefaultStyles.brandColorButton]} onPress={removePackageFromCart}>
                    <Text style={{color:'#fff', fontSize: 18, fontWeight: 'bold', width: '100%', textAlign: 'center'}}>Remove Package</Text>
                  </TouchableOpacity>
                </View> :
                <View style={[{height: 55}, DefaultStyles.brandBackgroundColor]}>
                  <TouchableOpacity style={[styles.button, DefaultStyles.brandColorButton]} onPress={addPackageToCart}>
                    <Text style={{color:'#fff', fontSize: 18, fontWeight: 'bold', width: '100%', textAlign: 'center'}}>Book Now</Text>
                  </TouchableOpacity>
                </View>
              }
            </View>
          }
        </View>
      }
    </View>
  )
}

const mapStateToProps = state => ({
  networkAvailability: state.networkAvailability
})

const mapDispatchToProps = dispatch => ({
  addItemToCart: (package_id, package_price, is_package) => dispatch(createCartItem(package_id, package_price, is_package)),
  deletePackage: (cart_item_id) => dispatch(deleteItem(cart_item_id))
})

export default connect(mapStateToProps, mapDispatchToProps)(PackageDetails);

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    color:'#fff',
    height: 55
  }
})