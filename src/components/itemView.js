import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { fetchAllItems } from '../../store/actions/itemActions';
import _ from 'lodash';
import { Layout, Text } from '@ui-kitten/components';
import { StyleSheet } from 'react-native';

function ItemView (props) {
  const { itemModel, getItems, cartItem, packageModel } =  props
  const [ currentItem, setCurrentItem ] = useState()
  const data = cartItem.is_package ? cartItem.package : cartItem.item

  useEffect(() => {
    getItems()
  }, [])

  useEffect(() => {
    if(!data.id) {
      let value
      if(cartItem.is_package) {
        value = _.find(packageModel.values, ['id', data.id])
      } else {
        value = _.find(itemModel.values, ['id', data.id])
      }
      setCurrentItem(value)
    } else {
      setCurrentItem(data)
    }
  }, [data])

    return (
      <Layout style={styles.itemCard}>
        <Text>{currentItem && currentItem.name}</Text>
        <Text>{cartItem && cartItem.quantity}</Text>
      </Layout>
    )
}


const mapStateToProps = state => ({
  itemModel: state.items,
  packageModel: state.packages
})

const mapDispatchToProps = dispatch => ({
  getItems: () => dispatch(fetchAllItems())
})

export default connect(mapStateToProps, mapDispatchToProps)(ItemView);


const styles = StyleSheet.create({
  itemCard: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    // paddingHorizontal: 20,
    padding: 10
  }
})