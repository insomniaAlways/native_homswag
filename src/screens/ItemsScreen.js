import React, { useEffect, useState, useLayoutEffect } from 'react';
import { fetchItems } from '../store/actions/itemActions';
import { connect } from 'react-redux';
import ItemsList from '../components/itemList';
import { Spinner, Layout, Text } from '@ui-kitten/components';
import * as Animatable from 'react-native-animatable';
import _ from 'lodash';
import DynamicTabs from '../components/dynamicTabs';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { brandColor } from '../style/customStyles';
import { fetchCategories } from '../store/actions/index';
import { fetchCartItems } from '../store/actions/cartItemAction';
import { fetchAllItems } from '../store/actions/itemActions';

function Items(props) {
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
      alert(cartItemModel.error)
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
    <Layout style={{flex: 1}}>
      { category.hasSubCategory ?
        <DynamicTabs
          category={category}
          selectedItems={selectedItems}
          showButton={showButton}
          setShowButton={setShowButton}
          {...props}/> :
        (
          selectedItems.isLoading ? 
          <Layout style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Spinner status='info'/>
          </Layout> :
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
    </Layout>
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
