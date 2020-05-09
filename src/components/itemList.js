import React, { useState, useCallback } from 'react';
import { Dimensions, View, StyleSheet, Image, FlatList, Text } from 'react-native';
import ItemRow from './ItemRow';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const ItemsList = (props) => {
  const { data, cartItems, cart, setShowButton, getCartItems} = props
  const [ isAdded, setAdded ] = useState(false)
  const [ refreshing, setRefreshing ] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    async function fetchData() {
      await props.getAllCartItems()
      await props.getAllCategories()
      await props.getAllItems()
      setRefreshing(false)
    }
    fetchData()
  }, [refreshing]);

  const renderItemFooter = (info) => (
    <View style={styles.itemCardFooter}>
      <View style={styles.itemFooter}>
        <Text category='s1' style={{color: 'green'}}>
        <FontAwesome name="rupee" size={12} color="black" /> {info.item.price}
        </Text>
        <Text category='s1' style={{textDecorationLine: 'line-through', color: 'red'}}>
        <FontAwesome name="rupee" size={12} color="black" /> {info.item.mrp_price}
        </Text>
      </View>
      <ItemRow
        item={info.item}
        cartItems={cartItems}
        cart={cart}
        refreshing={refreshing}
        getCartItems={getCartItems}
        isAdded={isAdded}
        setAdded={setAdded}
        setShowButton={setShowButton}
        {...props}
        style={{flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 10}}/>
    </View>
  );

  const renderItemHeader = (info) => {
    let image_source = info.item.image_source
    return (
      <Image
        style={styles.itemHeader}
        source={{uri:image_source}}
      />
    )
  }

  const renderProductItem = (info) => (
    <View style={[styles.itemCard, styles.productItem]}>
      <View style={styles.itemCardHeader}>
        {renderItemHeader(info)}
      </View>
      <View style={styles.itemCardBody}>
        <View style={{minHeight: 50}}>
          <Text style={styles.itemNameText}>
            {info.item.name}
          </Text>
        </View>
        <View>
          <Text style={styles.itemNameDescription}>
            {info.item.description}
          </Text>
        </View>
        {info.item.duration && 
          <Text style={styles.itemNameDescription2}>
            Duration: {info.item.duration} min
          </Text>
        }
      </View>
      {renderItemFooter(info)}
    </View>
  );

  return (
    <FlatList
      data={data}
      columnWrapperStyle={styles.productList}
      numColumns={2}
      showsVerticalScrollIndicator={false}
      refreshing={refreshing}
      onRefresh={onRefresh}
      renderItem={renderProductItem}
      keyExtractor={item => item.id}
    />
  );
};

export default ItemsList;

const styles = StyleSheet.create({
  productList: {
    paddingHorizontal: 8,
    paddingVertical: 16,
    backgroundColor: '#F7F9FC'
  },
  productItem: {
    flex: 1,
    margin: 8,
    maxWidth: Dimensions.get('window').width / 2 - 24,
    borderRadius: 10,
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
    maxWidth: Dimensions.get('window').width / 2 - 24,
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
    // maxWidth: Dimensions.get('window').width / 2 - 24,
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
    maxWidth: Dimensions.get('window').width / 2 - 24,
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
    maxWidth: Dimensions.get('window').width / 2 - 24,
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

})