import React, { useState, useEffect } from 'react';
import { TouchableOpacity, View, StyleSheet, Text } from 'react-native';
import { Dimensions } from 'react-native';
import moment from 'moment';
import Moment from 'react-moment';
import DateTimePicker from '@react-native-community/datetimepicker';
import Modal from "react-native-modal";
import { brandColor } from '../../style/customStyles';

const screenWidth = Math.round(Dimensions.get('window').width);

const mode ='date'

function IOSDateButton (props) {
  const { title, date, onSelectDate, isSelected } = props
  const [ isDatePickerVisible, enableDatePicker ] = useState(false)
  const [ isDateSelected, setDateSelected ] = useState(false)
  const [ selectedDate, setSelectedDate ] = useState()

  useEffect(() => {
    if(date) {
      setSelectedDate(date)
    } else {
      setSelectedDate(new Date())
    }
  }, [])

  const onDateSelected = () => {
    setDateSelected(true)
    enableDatePicker(false)
    onSelectDate(null, selectedDate)
  }

  return (
    <View>
      <TouchableOpacity style={styles.container} onPress={() => enableDatePicker(true)}>
        <View style={isSelected ? styles.selectedButton : styles.button}>
          <Text style={isSelected ? styles.selectedButtonText : styles.buttonText}>
            { !isDateSelected ? title :
              <Moment element={Text}
                date={date}
                format="DD/MM/YYYY"
                style={{fontSize: 16, width: '100%', textAlign: 'center'}}
              />
            }
          </Text>
        </View>
      </TouchableOpacity>
      <Modal isVisible={isDatePickerVisible}>
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={{fontSize: 22}}>Select a Date</Text>
            </View>
            <View style={styles.datePickerContainer}>
              <DateTimePicker
                mode={mode}
                value={selectedDate}
                is24Hour={true}
                minimumDate={new Date()}
                display="default" 
                onChange={(event, selectDate) => setSelectedDate(moment(selectDate).toDate())} />
            </View>
            <View style={styles.modalFooter}>
              <TouchableOpacity style={styles.cancelButtonContainer} onPress={() => enableDatePicker(false)}>
                <View style={styles.cancelButton}>
                  <Text style={{fontSize: 22, color: '#F65146'}}>Cancel</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmButtonContainer} onPress={onDateSelected}>
                <View style={styles.confirmButton}>
                  <Text style={{fontSize: 22, color: brandColor }}>Confirm</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  )
}

export default IOSDateButton;

const styles = StyleSheet.create({
  container: {
    marginRight: 10,
  },
  button: {
    width: (screenWidth - 60)/3,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#eee",
    paddingTop: 10,
    paddingBottom: 10,
  },

  selectedButton: {
    width: (screenWidth - 60)/3,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "green",
    paddingTop: 10,
    paddingBottom: 10,
  },

  buttonText: {
    color: '#000'
  },

  selectedButtonText: {
    color: '#fff'
  },

  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 20
  },

  modalHeader: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    borderBottomWidth: 2,
    paddingVertical: 15,
    borderBottomColor: '#eee'
  },

  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    borderTopWidth: 2,
    borderTopColor: '#eee'
  },

  cancelButtonContainer: {
    width: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 2,
    paddingVertical: 15,
    borderRightColor: '#eee'
  },

  confirmButtonContainer: {
    width: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
  },

  cancelButton: {
    width: '50%',
    justifyContent: 'center',
    alignItems: 'center',
  },

  confirmButton: {
    width: '50%',
    justifyContent: 'center',
    alignItems: 'center'
  },

  datePickerContainer: {
    paddingHorizontal: 20
  }
})