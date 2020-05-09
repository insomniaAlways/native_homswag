import React from 'react';
import { View } from 'react-native';
import moment from 'moment';
import DateButton from './helpers/date-button';

const dateButtons = [
  {type: 1, title: 'Today', value: moment().toDate()},
  {type: 2, title: 'Tomorrow', value: moment().add(1, 'days').toDate()},
  {type: 3, title: 'Select Date', value: moment().add(2, 'days').toDate()}
]

function SelectDate(props) {
  const { date, setDate } = props

  return (
    <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-start', margin: 10}}>
      {dateButtons.map((dateButton, index) => (
        <DateButton
          key={index}
          date={date}
          type={dateButton.type}
          title={dateButton.title}
          value={dateButton.value}
          setDate={setDate}
        />
      ))}
    </View>
  )
}

export default SelectDate;
