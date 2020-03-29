import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Image, FlatList, Text } from 'react-native';
import _ from 'lodash';
import { connect } from 'react-redux';
import { fetchCart } from '../store/actions/cartAction';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AddToCartButton from './addToCartButton';
import { fetchCartItems, createCartItem } from '../store/actions/cartItemAction';

const CartPromoItemList = (props) => {
  const defaultLength = 5
  const { cartItem, getCart, items, getCartItem, creatNewCartItem } = props
  const cartItemLength = cartItem.values.length
  const defaultList = _.take(items, (defaultLength + cartItemLength))
  const [ isLoading, setLoading ] = useState(false)

  const isItemAdded = (item) => {
    return _.find(cartItem.values, ['item.id', item.id])
  }

  const addToCart = async (item) => {
    let newCartItem = await creatNewCartItem(item.id, (+item.price * 1))
    getCartItem()
    getCart()
    setLoading(false)
  }

  const renderItemFooter = (info) => (
    <View style={styles.itemCardFooter}>
      <View style={styles.itemFooter} accentStyle={{borderWidth:0}}>
        <Text category='s1' style={{color: 'green'}}>
        <FontAwesome name="rupee" size={12} color="black" /> {info.item.price}
        </Text>
        <Text category='s1' style={{textDecorationLine: 'line-through', color: 'red'}}>
        <FontAwesome name="rupee" size={12} color="black" /> {info.item.mrp_price}
        </Text>
      </View>
      <View style={{justifyContent:'center', alignItems: 'center'}}>
        <AddToCartButton addToCart={addToCart} item={info.item} setLoading={setLoading} isLoading={isLoading}/>
      </View>
    </View>
  );

  const getList = () => {
    return _.filter(defaultList, (item) => !isItemAdded(item))
  }

  const [ itemList, setItemList ] = useState(getList)

  useEffect(() => {
    setItemList(getList)
  }, [cartItem.isLoading])

  const renderItemHeader = (info) => {
    let image_source = info.item.image_source
    return (
    <Image
      style={styles.itemHeader}
      source={{uri:image_source}}
    />
  )};

  const renderProductItem = (info) => (
    <View style={[styles.itemCard, styles.productItem]}>
      <View style={styles.itemCardHeader}>
        {renderItemHeader(info)}
      </View>
      <View style={styles.itemCardBody}>
        <Text category='s1'>
          {info.item.name}
        </Text>
      </View>
      {renderItemFooter(info)}
    </View>
  );

  return (
    <FlatList
      data={itemList}
      horizontal={true}
      showsHorizontalScrollIndicator={false}
      renderItem={renderProductItem}
      keyExtractor={item => `${item.id}`}
    />
  )
};

const mapStateToProps = state => ({
  cartItem: state.cartItems,
  items: state.items.values
})

const mapDispatchToProps = dispatch => ({
  getCart: () => dispatch(fetchCart),
  getCartItem: () => dispatch(fetchCartItems()),
  creatNewCartItem: (item, quantity) => dispatch(createCartItem(item, quantity))
})

export default connect(mapStateToProps, mapDispatchToProps)(CartPromoItemList);

const styles = StyleSheet.create({
  productList: {
    paddingHorizontal: 8,
    paddingVertical: 10,
  },
  productItem: {
    margin: 8,
    borderRadius: 10,
    width: 200,
  },
  itemHeader: {
    height: 140,
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E4E9F2',
    overflow: 'hidden',
    justifyContent: 'space-between',
    flex: 1,
    margin: 8,
    maxWidth: 200,
    opacity: 1
  },
  itemCardHeader: {
    // backgroundColor: '#FFFFFF',
    // borderRadius: 10,
    // borderWidth: 1,
    // borderColor: '#E4E9F2',
    // overflow: 'hidden',
    // justifyContent: 'space-between',
    // flex: 1,
    // margin: 8,
    // maxWidth: 200,
    // opacity: 1,
  },
  itemCardBody: {
    backgroundColor: '#FFFFFF',
    // borderRadius: 10,
    // borderWidth: 1,
    // borderColor: 1,
    // borderColor: '#E4E9F2',
    overflow: 'hidden',
    justifyContent: 'space-between',
    flex: 1,
    margin: 8,
    maxWidth: 200,
    opacity: 1
  },
  itemCardFooter: {
    backgroundColor: '#FFFFFF',
    // borderRadius: 10,
    // borderWidth: 1,
    // borderColor: '#E4E9F2',
    overflow: 'hidden',
    justifyContent: 'space-between',
    flex: 1,
    margin: 8,
    maxWidth: 200,
    opacity: 1
  },

  itemNameText: {
    // fontFamily: System,
    color: '#222B45',
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 24
  },
  itemNameDescription: {
    // fontFamily: System,
    color: '#8F9BB3',
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16
  },
  itemNameDescription2: {
    // fontFamily: System,
    color: '#222B45',
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16
  },

  listView: {
    flexGrow: 1,
    flexShrink: 1,
    flexDirection: 'column',
    overflow: 'scroll',
    backgroundColor: '#FFFFFF'
  }
});