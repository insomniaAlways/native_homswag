import React from 'react';
import { ImageBackground } from 'react-native';


export const ImageOverlay = (props) => {

  const { style, children, ...imageBackgroundProps } = props;

  return (
    <ImageBackground
      {...imageBackgroundProps}
      style={{width: '100%', height: '100%'}}>
      {children}
    </ImageBackground>
  );
};