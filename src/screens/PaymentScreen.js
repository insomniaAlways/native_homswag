import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AccordionView from '../components/accordian';
import PlaceHolderTextInput from '../components/placeHolderTextInput';

function PaymentScreen() {
  const [ paymentDetails, updatePaymentDetails] = useState({
    type: 0,
    amount: "",
    totalAmount: 0
  })
  const paymentTypes = [
    {title: "Pay Full", type: 1, content: (
      <View>
        <Text>Pay Full Amount:</Text>
        <Text>Rs. 5000</Text>
      </View>
    )},
    {title: "Pay Minimun", type: 2, content: (
      <View>
        <Text>Pay Minimun Amount</Text>
        <Text>Rs. 500</Text>
      </View>
    )},
    {title: "Pay Custom", type: 3, content: (
      <View style={{flexDirection: 'row'}}>
        <View style={{width: '40%', height: 40, justifyContent: "center"}}>
          <Text>Custom Amount: </Text>
        </View>
        <PlaceHolderTextInput
          placeholder="enter custom ammount"
          styles={{margin: 0, width:'60%', backgroundColor: '#eee', borderRadius: 50, paddingLeft: 10, paddingRight: 10, textAlign: 'center'}}
          value={paymentDetails.amount}
          setValue={updatePaymentDetails}
          previousState={paymentDetails}
          itemKey="amount" />
      </View>
    )},
  ]
  const [selectedPaymentType, setSelectedPaymentType] = useState(paymentTypes[0].type)
  return (
    <View style={{flex: 1}}>
      <View style={styles.paymentInfoContainer}>
        <View style={styles.paymentInfoBlock}>
          <Text>Minimun amount Rs. 500 needs to be paid.</Text>
        </View>
      </View>
      <View style={styles.paymentSelectionContainer}>
        <View style={styles.paymentSelectionBlock}>
          <AccordionView 
            content={paymentTypes}
            containerStyles={{paddingLeft: 10,paddingRight: 10, justifyContent: 'flex-start', paddingTop: 0}}
            activeSection={selectedPaymentType}
            setActiveSection={setSelectedPaymentType}/>
        </View>
      </View>
      <View style={styles.paymentInfoContainer}>

      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  paymentInfoContainer: {
    // borderWidth: 1,
    flex: 1,
    padding: 30
  },
  paymentInfoBlock: {
    borderWidth: 1,
    borderColor: 'red',
    flex: 1,
    justifyContent: "center",
    alignItems: 'center'
  },
  paymentSelectionContainer: {
    // borderWidth: 1,
    paddingLeft: 20,
    flex: 2,
    paddingRight: 20,
  },
  paymentSelectionBlock: {
    borderRadius: 5,
    borderWidth: 2,
    borderColor: "#d4d4d4",
    flex: 1
  },
  paymentDetailsContainer: {
    borderWidth: 1,
    flex: 1
  },
})

export default PaymentScreen;