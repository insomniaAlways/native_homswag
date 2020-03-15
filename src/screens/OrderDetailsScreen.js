import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { Icon, Layout } from '@ui-kitten/components';
import Moment from 'react-moment';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { connect } from 'react-redux';
import { updateOrder } from '../store/actions/orderActions';
import moment from 'moment';

const OrderDetails = function(props) {
  const order = props.navigation.getParam('order');
  const [ showModal, setShowModal ] = useState(false)
  const { orderModel, networkAvailability } = props
  const statusCode = orderModel.statusCode
  const [ currentOrder, setCurrentOrder ] = useState(order)
  const [ status, setStatus ] = useState(statusCode.find((code) => code.id == currentOrder.status))
  const [ enableCancel, setCancelEnable ] = useState(false)
  const [ showConfirmFrom, setConfirmFrom ] = useState(false)

  useEffect(() => {
    let co = orderModel.values.find((o) => o.id == currentOrder.id)
    let s = statusCode.find((code) => code.id == co.status)
    setStatus(s)
    if(currentOrder && currentOrder.confirm_from) {
      setConfirmFrom(true)
      let isBefore = moment().isBefore(moment(currentOrder.confirm_from).subtract(2, 'hours'))
      if(isBefore) {
        setCancelEnable(true)
      } else {
        setCancelEnable(false)
      }
    } else {
      setCancelEnable(true)
    }
  }, [currentOrder, orderModel.isLoading])

  const cancelOrder = async () => {
    await props.updateOrderStatus(order.id, 3)
    setShowModal(false)
  }

  useEffect(() => {
    if(!orderModel.isLoading && orderModel.error) {
      alert(orderModel.error)
    }
  }, [orderModel.error])

  const renderModalElement = () => (
    <Layout
      level='3'
      style={styles.backdrop}>
      <Layout style={styles.popUpContainer}>
        <Text style={{fontFamily: 'roboto-medium-italic', fontSize: 18}}>Heads Up</Text>
        <Text style={{fontFamily: 'roboto-regular', fontSize: 14, marginTop: 10}}>Are you sure want to cancel the appointment ?</Text>
          {orderModel.isLoading ?
            <Layout style={{flexDirection: 'row', justifyContent: 'flex-end', marginTop: 20}}>
              <Layout style={{marginRight: 20}}>
                <Text style={{color: 'grey'}}>Cancel</Text>
              </Layout>
              <Layout>
                <Text style={{color: 'grey'}}>Confirm</Text>
              </Layout>
            </Layout> :
            <Layout style={{flexDirection: 'row', justifyContent: 'flex-end', marginTop: 20}}>
              <TouchableOpacity style={{marginRight: 20}} onPress={() => setShowModal(false)}>
                <Text style={{color: 'green'}}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => cancelOrder()}>
                <Text style={{color: 'red'}}>Confirm</Text>
              </TouchableOpacity>
            </Layout>
          }
      </Layout>
    </Layout>
  );

  const RenderOrderedItem = () => {
    if(order.cartItems && Array.isArray(order.cartItems) && order.cartItems.length) {
      return order.cartItems.map((orderItem, index) => {
        let data = orderItem.is_package ? orderItem.package : orderItem.item
        return (
          <View key={index}>
            { data && 
              <View style={{flexDirection: 'row',justifyContent: 'space-between', paddingRight: 10, alignItems: 'center'}}>
                <Icon name='checkmark-circle-2-outline' width={12} height={12} fill="#0D5618"/>
                <Text ellipsizeMode={'tail'} numberOfLines={2} style={{width: '60%', textAlign: 'left'}}>{data.name}</Text>
                <Text style={{width: 30}}>x {orderItem.quantity}</Text>
                <Text style={{width: 60, textAlign: 'right'}}><FontAwesome name="rupee" size={12} color="black" /> {orderItem.total_price}</Text>
              </View>
            }
          </View>
        )
    })
    } else {
      return <Text>Item no found</Text>
    }
  }
  return (
    <Layout style={{flex: 1, paddingLeft: 10, paddingRight: 10, margin: 10, borderRadius: 20}}>
      <Layout style={{padding: 10}}>
        <Layout style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text style={{fontWeight: 'bold', fontSize: 14, width: '40%'}}>Appointment No: {order.id}</Text>
          {status && status.color && 
            <Text>Status:
              <Text style={{color: status.color}}>  {status.name}</Text>
            </Text>
          }
        </Layout>
        <Layout style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text style={{marginRight: 10, fontFamily: 'roboto-medium'}}>Placed on: </Text>
          <Moment element={Text}
              date={order.created_at}
              format="hh:mm, DD/MM/YYYY"
              style={{fontSize: 12, width: '100%', textAlign: 'left'}}
            />
        </Layout>
      </Layout>
      <Layout style={{paddingLeft: 10, paddingBottom: 10, borderBottomColor: '#eee', borderBottomWidth: 1}}>
        <RenderOrderedItem />
      </Layout>
      <Layout style={{padding: 10}}>
        <Layout style={{flexDirection: "row", justifyContent: 'space-between'}}>
          <Text style={{fontFamily: 'roboto-medium'}}>Total Amount</Text>
          <Text><FontAwesome name="rupee" size={12} color="black" /> {order.order_total}</Text>
        </Layout>
        <Layout style={{flexDirection: "row", justifyContent: 'space-between'}}>
          <Text style={{fontFamily: 'roboto-medium'}}>Total Paid</Text>
          <Text><FontAwesome name="rupee" size={12} color="black" /> {order.total_paid}</Text>
        </Layout>
        <Layout style={{marginTop: 10}}>
          <Text style={{fontFamily: 'roboto-medium'}}>Updates sent to:</Text>
          <Text>{props.currentUser.phone}</Text>
          {props.currentUser.email ? <Text>{props.currentUser.email}</Text> : null}
        </Layout>
        <Layout style={{marginTop: 10}}>
          <Text style={{fontFamily: 'roboto-medium'}}>Appointment Details: </Text>
          <Layout style={{flexDirection: "row", justifyContent: 'space-between'}}>
            <Text>Booked for</Text>
            <Moment element={Text}
              date={order.appointment.from}
              format="hh:mm A, DD/MM/YYYY"
            />
          </Layout>
        </Layout>
        { showConfirmFrom &&
          <Layout style={{marginTop: 10}}>
            <Text style={{fontFamily: 'roboto-medium'}}>Confirm Appointment Details: </Text>
            <Layout style={{flexDirection: "row", justifyContent: 'space-between'}}>
              <Text>Confirmed for</Text>
              <Moment element={Text}
                date={currentOrder.confirm_from}
                format="hh:mm A, DD/MM/YYYY"
              />
            </Layout>
          </Layout> }
        {(status.id != 3 && status.id != 4 && status.id != 5 && enableCancel) ? 
          <Layout style={{marginTop: 30}}>
            {networkAvailability.isOffline ?
              <Layout><Text>Not connected to Internet</Text></Layout>:
              <TouchableOpacity onPress={() => setShowModal(true)} style={{width: 150}}>
                <Text style={{color: 'red'}}>Cancel Appointment</Text>
              </TouchableOpacity>
            }
          </Layout> : null }
      </Layout>
      <Modal
        animationType="slide"
        transparent={true}
        visible={showModal}
        onRequestClose={() => {
          return false;
        }}>
        {renderModalElement()}
      </Modal>
    </Layout>
  )
};

const mapStateToProps = state => ({
  currentUser: state.currentUser.values,
  orderModel: state.orders,
  networkAvailability: state.networkAvailability
})

const mapDispatchToProp = dispatch => ({
  updateOrderStatus: (order_id, order_status) => dispatch(updateOrder(order_id, order_status))
})

export default connect(mapStateToProps, mapDispatchToProp)(OrderDetails);

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  popUpContainer: {
    backgroundColor: '#fff',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 10
  }
})