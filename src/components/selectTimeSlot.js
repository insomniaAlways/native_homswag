import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import moment from 'moment';
import _ from 'lodash';

function TimeSlotButton (props) {
  const { selectedSlot, setSlot, timeSlot, date, slots } = props
  const [ isDisabled, setDisabled ] = useState(false)

  useEffect(() => {
    if(timeSlot.type == 1 && moment().isAfter(moment(date).startOf('days').add((timeSlot.to - 1), 'hours'))) {
      setDisabled(true)
    } else if(timeSlot.type == 1) {
      setDisabled(false)
    }
    if(timeSlot.type == 2 && moment().isAfter(moment(date).startOf('days').add((timeSlot.to - 1), 'hours'))) {
      setDisabled(true)
    } else if(timeSlot.type == 2) {
      setDisabled(false)
    }
  })

  useEffect(() => {
    if(isDisabled) {
      let type = timeSlot.type == 2 ? 1 : timeSlot.type + 1
      let to = _.find(slots, ['type', type])
      setSlot(to)
    }
  }, [isDisabled])

  if(isDisabled) {
    return (
      <View key={timeSlot.type} style={timeSlot.type == 2 ? styles.isLastButtonContainer : styles.buttonContainer}>
        <View style={[styles.button, styles.disableButton]}>
          <Text style={styles.disableButtonText}>{timeSlot.value}</Text>
        </View>
      </View>
    )
  } else {
    return (
      <View
        key={timeSlot.type}
        style={selectedSlot.type == timeSlot.type ?
          (timeSlot.type == 2 ? styles.isSelectedLastButtonContainer : styles.selectedButtonContainer) :
          (timeSlot.type == 2 ? styles.isLastButtonContainer : styles.buttonContainer)}
        >
        <TouchableOpacity style={styles.button} onPress={() => setSlot(timeSlot)} isDisabled={isDisabled}>
          <Text style={selectedSlot.type == timeSlot.type ? {color: 'white'} : {color: 'black'}}>{timeSlot.value}</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

function SelectTimeSlot(props) {
  const { slots } = props

  return (
    <View style={{flexDirection: 'row', justifyContent: 'center', margin: 10}}>
      { slots.map((timeSlot, index) => (
        <TimeSlotButton key={index} timeSlot={timeSlot} {...props}/>
      ))}
    </View>
  )
}

export default SelectTimeSlot;

const styles = StyleSheet.create({
  buttonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#eee",
    marginRight: 10,
    borderRadius: 8
  },
  selectedButtonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "green",
    marginRight: 10,
    borderRadius: 8
  },
  isLastButtonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#eee",
    marginRight: 0,
    borderRadius: 8
  },
  isSelectedLastButtonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "green",
    marginRight: 0,
    borderRadius: 8
  },
  button: {
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 10,
    width: '100%',
    borderRadius: 8
  },
  disableButton: {
    backgroundColor: '#eeeeee',
    borderWidth: 1,
    borderColor: '#d4d4d4'
  },
  disableButtonText: {
    color: 'rgba(0,0,0, 0.4)'
  }
})