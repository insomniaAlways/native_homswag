import React, { useState, useEffect } from 'react';
import { Button, View, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView, Text } from 'react-native';
import SelectDate from '../components/SelectDate';
import SelectTimeSlot from '../components/selectTimeSlot';
import BookingDetails from '../components/bookingDetails';
import DefaultStyles, { brandColor } from '../style/customStyles';
import { connect } from 'react-redux';
import Modal from "react-native-modal";
import AddressList from '../components/addressList';
import { fetchAddress } from '../store/actions/addressActions';
import { KeyboardAvoidingView } from '../components/KeyboardAvoidView';
import { updateAppointmentState } from '../store/actions/appointmentActions';
import _ from 'lodash';
import moment from 'moment';

function ScheduleAppointmentScreen(props) {
  const { appointmentModel, addresses, getAddress, currentUserModel, updateAppointment } = props
  const [ openAddressModal, setModal ] = useState(false)
  const [ scrollOffset, setScrollOffset ] = useState(0)
  const [ date, setDate ] = useState(new Date())
  const [ selectedAddress, setSelectedAddress ] = useState()
  const [ specialInstruction, setInstruction ] = useState()
  const [ preferedBeautician, setBeautician ] = useState()
  
  let scrollViewRef;
  const { defaultValues, slots } = appointmentModel
  const [ selectedSlot, setSlot ] = useState(defaultValues.slot)

  const goToAddAddress = () => {
    setModal(false)
    props.navigation.navigate('AddAddress', { previousRoute: 'BookAppointment' })
  }

  const isValidateSlot = () => {
    if(selectedSlot && selectedSlot.type) {
      if(moment().isSame(moment(date), 'days')) {
        let cutOffTime = moment().startOf('days').add(selectedSlot.to - 1, 'hours')
        let isAfter = moment().isSameOrAfter(cutOffTime)
        switch (selectedSlot.type) {
          case 1: {
            if(isAfter) {
              if(moment().isSameOrAfter(moment().startOf('days').add(17, 'hours'))) {
                alert('Please select a time slot.')
              } else {
                alert('You cannot schedule for the selected time slot.')
              }
              return false
            } else {
              return true
            }
          }
          case 2: {
            if(isAfter) {
              alert('You cannot schedule for the selected time slot.')
              return false
            } else {
              return true
            }
          }
          case 3: {
            if(isAfter) {
              alert('You cannot schedule for the selected time slot for today')
              return false
            } else {
              return true
            }
          }
        }      
      } else {
        return true
      }
    } else {
      alert('Please select a timeslot')
    }
  }

  const save = () => {
    if(isValidateSlot()) {
      updateAppointment({
        ...appointmentModel.defaultValues,
        appointment_for: currentUserModel.values.name,
        phone_number: currentUserModel.values.phone,
        from: moment(date).toISOString(),
        date: moment(date).toISOString(),
        slot: selectedSlot,
        selectedAddress: selectedAddress,
        special_instruction: specialInstruction,
        prefered_beautician: preferedBeautician
      })
      props.navigation.navigate('Cart')
    }
  }

  useEffect(() => {
    getAddress()
    return () => setModal(false)
  }, [])

  useEffect(() => {
    if(!addresses.isLoading && addresses.values && addresses.values.length && !selectedAddress) {
      let defaultAddress = _.find(addresses.values, ['is_default', true])
      if(defaultAddress) {
        setSelectedAddress(defaultAddress)
      } else {
        setSelectedAddress(addresses.values[0])
      }
    }
    return () => setModal(false)
  }, [addresses.isLoading, addresses.values, addresses.values.length])


  const handleOnScroll = event => {
    setScrollOffset(event.nativeEvent.contentOffset.y)
  };

  const handleScrollTo = p => {
    if (scrollViewRef) {
      scrollViewRef.scrollTo(p);
    }
  };

  return (
    <KeyboardAvoidingView style={{flex: 1}} showsVerticalScrollIndicator={false}>
      <View style={{flex: 1, padding: 10, backgroundColor: "#FFFFFF"}}>
        <View>
          <Text style={{fontSize: 16, fontWeight: 'bold'}}>Select Date and Time: </Text>
          <View>
            <SelectDate date={date} setDate={setDate} />
            <SelectTimeSlot date={date} selectedSlot={selectedSlot} setSlot={setSlot} slots={slots}/>
          </View>
        </View>
        <View style={{marginTop: 10}}>
          <Text style={{fontSize: 16, fontWeight: 'bold'}}>Fill Details:</Text>
          <BookingDetails
            selectedAddress={selectedAddress}
            setModal={setModal}
            isAddressLoading={addresses.isLoading}
            goToAddAddress={goToAddAddress}
            specialInstruction={specialInstruction}
            setInstruction={setInstruction}
            preferedBeautician={preferedBeautician}
            setBeautician={setBeautician}
            currentUser={currentUserModel.values}
            />
        </View>
        <View style={{height: 100, justifyContent: 'center', alignItems: 'center'}}>
          <View style={{flexDirection: 'row' ,marginHorizontal: 20, marginVertical: 20, borderWidth: 1, borderColor: '#a9d5de', padding: 10, borderRadius: 5, backgroundColor: '#f8ffff'}}>
            <Text style={{fontFamily: 'roboto-medium', color: '#0e566c'}}>Note: </Text>
            <Text style={{fontFamily: 'roboto-regular', fontSize: 14, alignItems: 'center', width: '90%', color: '#276f86', minHeight: 60}}>
              Please note your booking slot is pending with us, Our support Team will confirm you within an hour time with details.Thank you for choosing Homswag.
            </Text>
          </View>
        </View>
      </View>
      <View style={[{height: 55}, DefaultStyles.brandBackgroundColor]}>
        <TouchableOpacity onPress={() => save()} style={{alignItems: 'center', paddingTop: 15, paddingBottom: 10, width: '100%'}}>
          <Text style={{color: '#fff', fontSize: 16}}>Save & Continue</Text>
        </TouchableOpacity>
      </View>
      <Modal
        isVisible={openAddressModal}
        onSwipeComplete={() => setModal(false)}
        swipeDirection="down"
        scrollTo={handleScrollTo}
        scrollOffset={scrollOffset}
        scrollOffsetMax={400 - 300}
        style={styles.bottomModal}>
        <ScrollView
          ref={ref => (scrollViewRef = ref)}
          onScroll={handleOnScroll}
          style={{flex: 1}}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}>
            <View style={{height: 300, backgroundColor: 'transparent'}}></View>
            <View style={styles.scrollableModal}>
              <View style={styles.addressListHeader}>
                <Text style={[styles.addressListHeaderText, {width: '70%'}]}>
                  Address Lists: 
                </Text>
                <TouchableOpacity onPress={() => goToAddAddress()}>
                  <Text style={[{width: 50}, styles.addressListHeaderText]}>+ Add</Text>
                </TouchableOpacity>
              </View>
              <AddressList addresses={addresses}
                style={{padding: 10, flex: 1}}
                setSelectedAddress={setSelectedAddress}
                setModal={setModal}
                />
            </View>
          </ScrollView>
      </Modal>
    </KeyboardAvoidingView>
  )
}

const mapPropsToState = state => ({
  appointmentModel: state.appointment,
  addresses: state.addresses,
  currentUserModel: state.currentUser
})

const mapDispatchToProps = dispatch => {
  return {
    getAddress: () => dispatch(fetchAddress()),
    updateAppointment: (appointment) => dispatch(updateAppointmentState(appointment))
  }
}

export default connect(mapPropsToState, mapDispatchToProps)(ScheduleAppointmentScreen);

const styles = StyleSheet.create({
  content: {
    backgroundColor: 'white',
    padding: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  bottomModal: {
    justifyContent: 'flex-end',
    margin: 0,
    flex: 1
  },

  addressListHeader: {
    padding: 15,
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderColor: '#eee',
    backgroundColor: brandColor,
    borderTopEndRadius: 20,
    borderTopLeftRadius: 20,
  },
  addressListHeaderText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },

  scrollableModal: {
    flex: 1,
    minHeight: 500,
    borderTopEndRadius: 20,
    borderTopLeftRadius: 20,
  },
});