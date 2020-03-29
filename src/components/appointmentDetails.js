import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Moment from 'react-moment';
import { connect } from 'react-redux';

function AppointmentDetails(props) {
  const { appointment, navigation } = props
  const [ formatedAddress, setFormatedAddress ] = useState()
  const [ landmark, setLandmark ] = useState()
  const [ localAddress, setLocalAddress ] = useState()

  useEffect(() => {
    if(appointment.defaultValues.selectedAddress) {
      setFormatedAddress(appointment.defaultValues.selectedAddress.address.formatedAddress)
      setLandmark(appointment.defaultValues.selectedAddress.address.landmark)
      setLocalAddress(appointment.defaultValues.selectedAddress.address.localAddress)
    }
  }, [appointment.defaultValues.selectedAddress])

  return (
    <TouchableOpacity onPress={() => navigation.navigate('BookAppointment')}>
      <View style={{justifyContent: 'center', alignItems: 'center', borderRadius: 20}}>
        <Text style={{width: '100%', textAlign: 'center', fontSize: 16, fontWeight: 'bold', paddingBottom: 10}}>Appointment Details & Slot</Text>
        <Moment element={Text}
          date={appointment.defaultValues.from}
          format="MMMM DD, YYYY"
          style={{fontSize: 16, width: '100%', textAlign: 'center'}}
        />
        <Text>{appointment.defaultValues.slot.value}</Text>
        <Text style={{width: '100%', textAlign: 'center', fontSize: 16, fontWeight: 'bold', paddingBottom: 10, paddingTop: 10}}>Address</Text>
        {appointment && appointment.defaultValues.selectedAddress ? 
          <View style={{alignItems: 'center'}}>
            <Text style={{textAlign: 'center'}}>{formatedAddress}</Text>
            {localAddress ? (<Text>{localAddress}</Text>) : null}
            {landmark ? (<Text>{landmark}</Text>) : null}
          </View> :
          <View style={{alignItems: 'center'}}>
            <Text style={{fontSize: 14, width: '100%', textAlign: 'center', color: 'rgba(0,0,0,0.5)'}}>Address not selected</Text>
            <Text style={{fontSize: 12, color: 'rgba(0,0,0,0.5)'}}>(click here to select address)</Text>
          </View>
        }
      </View>
    </TouchableOpacity>
  )
}

const mapPropsToState = state => ({
  appointment: state.appointment,
  addresses: state.addresses
})

export default connect(mapPropsToState)(AppointmentDetails);