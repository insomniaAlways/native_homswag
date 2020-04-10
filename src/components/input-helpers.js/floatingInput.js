import React from 'react';
import { Item, Input, Label } from 'native-base';

function FloatingInput (props){
  const { setValue, itemKey, value, disabled } = props;

  const updateText = function(text) {
    if(props.previousState) {
      setValue({...props.previousState, [itemKey]: text})
    } else {
      setValue(text)
    }
  }

  return (
    <Item floatingLabel style={props.style}>
      <Label style={{paddingTop:20}}>{props.label}</Label>
      <Input 
        onChangeText={text => updateText(text)}
        value={value}
        disabled={disabled}
        />
    </Item>
  );
}

export default FloatingInput;