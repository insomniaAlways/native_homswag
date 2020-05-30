import React, { useEffect, useState } from 'react';
import { fetchItems } from '../store/actions/itemActions';
import { connect } from 'react-redux';
import ItemsList from '../components/itemList';
import * as Animatable from 'react-native-animatable';
import _ from 'lodash';
import DynamicTabs from '../components/dynamicTabs';
import { View, TouchableOpacity, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { brandColor } from '../style/customStyles';
import { fetchCategories } from '../store/actions/index';
import { fetchCartItems } from '../store/actions/cartItemAction';
import { fetchAllItems } from '../store/actions/itemActions';
import * as Sentry from '@sentry/react-native';
import { useSafeArea } from 'react-native-safe-area-context';
import ShowAlert from '../controllers/alert';

function Items(props) {
  const insets = useSafeArea();
  const { navigation, items, cartItemModel, cart } = props;
  const category = navigation.getParam('category')
  const [ selectedItems, setSelectedItems ] = useState([])
  const [ showButton, setShowButton ] = useState(false)

  useEffect(() => {
    if(category.id) {
      setSelectedItems(_.filter(items, ['category_id', category.id]))
    }
  }, [category])


  useEffect(() => {
    if(!cartItemModel.isLoading && cartItemModel.error) {
      ShowAlert('Oops!', cartItemModel.error)
      Sentry.captureException(cartItemModel.error)
    }
  }, [cartItemModel.error])

  useEffect(() => {
    if(cartItemModel.values.length) {
      setShowButton(true)
    } else {
      setShowButton(false)
      }
  }, [cartItemModel.values.length])

  return (
    <View style={{flex: 1, backgroundColor: "#F7F9FC", paddingBottom: insets.bottom}}>
      { category.hasSubCategory ?
        <DynamicTabs
          category={category}
          selectedItems={selectedItems}
          showButton={showButton}
          setShowButton={setShowButton}
          {...props}/> :
        (
          selectedItems.isLoading ? 
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View> :
          <Animatable.View
            animation={'fadeInLeft'}
            duration={400}
            style={{flex: 1}}
          >
            <ItemsList
              data={selectedItems}
              showButton={showButton}
              setShowButton={setShowButton}
              cartItems={cartItemModel.values}
              cart={cart}
              navigation={navigation} {...props}/>
          </Animatable.View>
        )
      }
      {
        showButton && 
        <TouchableOpacity style={styles.bookAppointmentButton} onPress={() => navigation.navigate('BookAppointment')}>
          <Text style={styles.buttonText}>Schedule Appointment</Text>
        </TouchableOpacity>
      }
    </View>
  );
}

mapStateToProps = state => {
  return {
    items: state.items.values,
    cartItemModel: state.cartItems,
    cart: state.cart.values
  }
}

mapDispatchToProps = dispatch => {
  return {
    getfetchItemsFor: (category_id) => dispatch(fetchItems(category_id)),
    getAllCategories: () => dispatch(fetchCategories()),
    getAllCartItems: () => dispatch(fetchCartItems()),
    getAllItems: () => dispatch(fetchAllItems()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Items);

const styles = StyleSheet.create({
  bookAppointmentButton: {
    height: 53,
    backgroundColor: brandColor,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
    width: '100%',
    textAlign: 'center'
  }
})
