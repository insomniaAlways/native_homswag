import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Text } from 'react-native';
import _ from 'lodash';

function PlaceHolderTextInput(props) {
  const { setValue, itemKey, value, disabled } = props;
  const editable = _.isNil(props.editable) ? true : props.editable
  const updateText = function(text) {
    if(props.previousState) {
      setValue({...props.previousState, [itemKey]: text})
    } else {
      setValue(text)
    }
  }

  const [ inputStyle, setStyle ] = useState(styles.placeholder);
  return (
    <View style={[props.containerStyle]}>
      {disabled ?
       (<Text style={[styles.placeholder, styles.disabledInput, props.styles]}>{value}</Text>) :
        <TextInput
          style={[inputStyle, props.styles]}
          keyboardType={props.keyboardType ? props.keyboardType : 'default'}
          onChangeText={text => updateText(text)}
          maxLength={props.maxLength ? props.maxLength : null}
          placeholder={props.placeholder}
          onFocus={() => setStyle(styles.input)}
          onBlur={() => setStyle(styles.placeholder)}
          editable={editable}
          value={value}
          disabled={disabled}
        />
      }
    </View>
  )
}

export default PlaceHolderTextInput;

const styles = StyleSheet.create({
  input: {
    height: 40,
    borderColor: '#4A90E2',
    borderBottomWidth: 1
  },
  placeholder: {
    height: 40,
    borderColor: '#eee',
    borderBottomWidth: 1
  },
  disabledInput: {
    borderColor: '#eee',
    borderBottomWidth: 1,
    height: 30
  }
})