import React, { useCallback, useState } from 'react';
import OrderItem from './orderItem';
import { View, StyleSheet, Image, Text, FlatList } from 'react-native';
import EmptyOrder from '../assets/images/order_empty.png'

const OrderList = function(props) {
  const { orders, navigation, orderModel } = props
  const [ refreshing, setRefreshing ] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    async function fetchData() {
      await props.getOrders()
      if(refreshing) {
        setRefreshing(false)
      }
    }
    fetchData()
    return () => setRefreshing(false)
  }, [refreshing]);


  const renderItem = ({item}) => {
    return (
      <OrderItem order={item} navigation={navigation} orderModel={orderModel}/>
    )
  }

  if(orders && Array.isArray(orders) && orders.length) {
    return (
      <FlatList
        showsVerticalScrollIndicator={false}
        data={orders}
        refreshing={refreshing}
        onRefresh={onRefresh}
        renderItem={renderItem}
        keyExtractor={item => `${item.id}`}
      />
    )
  } else {
    return (
      <View style={{flex: 1,justifyContent: 'center', alignItems: 'center', marginBottom: 30}}>
        <Image source={EmptyOrder} style={{width: 80, height: 80}}/>
        <Text>No Appointment placed yet.</Text>
      </View>
    )
  }
}

export default OrderList;

const styles = StyleSheet.create({
  orderList: {

  }
})