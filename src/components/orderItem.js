import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Icon, Layout } from '@ui-kitten/components';
import Moment from 'react-moment';
import { FontAwesome } from '@expo/vector-icons';

const OrderItem = function(props) {
  const {order, orderModel} = props;
  const status = orderModel.statusCode.find((code) => code.id == order.status)

  const RenderOrderedItem = () => {
    if(order.cartItems && Array.isArray(order.cartItems) && order.cartItems.length) {
      return order.cartItems.map((orderItem, index) => {
        let data = orderItem.is_package ? orderItem.package : orderItem.item
        return (
          <View key={index} style={{flex: 1, flexDirection: 'row',justifyContent: 'space-between', paddingRight: 10}}>
            <Text ellipsizeMode={'tail'} numberOfLines={2} style={{width: '40%'}}>{data.name}</Text>
            <Text style={{width: 30}}>x {orderItem.quantity}</Text>
            <Text style={{width: 60, textAlign: 'right'}}><FontAwesome name="rupee" size={12} color="black" /> {orderItem.total_price}</Text>
          </View>
        )
    })
    } else {
      return <Text>Item no found</Text>
    }
  }
  
  return (
    <TouchableOpacity onPress={() => props.navigation.navigate('OrderDetails', {order: order})}>
      <Layout style={{paddingLeft: 10, paddingRight: 10, borderWidth: 1, borderColor: "#eee", margin: 10, borderBottomWidth: 3, borderRadius: 20}}>
        <View style={{padding: 10}}>
          <Layout style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={{fontWeight: 'bold', fontSize: 14, width: '100%'}}>Appointment No: {order.id}</Text>
          </Layout>
          <Text style={{color: status.color, width: '100%', textAlign: 'right'}}>  {status.name}</Text>
          <Moment element={Text}
              date={order.created_at}
              format="DD/MM/YYYY"
              style={{fontSize: 12, width: '100%', textAlign: 'left'}}
            />
        </View>
        <View style={{paddingLeft: 10, paddingBottom: 10, borderBottomColor: '#eee', borderBottomWidth: 1}}>
          <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center'}}>
            <View style={{justifyContent: 'center'}}>
              <Icon name='checkmark-circle-2-outline' width={12} height={12} fill="#0D5618"/>
            </View>
            <View style={{paddingLeft: 10, flex: 1}}>
              <RenderOrderedItem />
            </View>
          </View>
        </View>
        <View style={{padding: 10}}>
          <View style={{flexDirection: "row", justifyContent: 'space-between'}}>
            <Text>Total</Text>
            <Text><FontAwesome name="rupee" size={12} color="black" /> {order.total_paid}</Text>
          </View>
          <View style={{paddingTop: 10, flexDirection: "row", justifyContent: 'space-between'}}>
            <Text>Booked for</Text>
            <Moment element={Text}
              date={order.appointment.from}
              format="hh:mm A, DD/MM/YYYY"
            />
          </View>
        </View>
      </Layout>
    </TouchableOpacity>
  )
};

export default OrderItem;