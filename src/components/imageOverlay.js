import React from 'react';
import { ImageBackground, StyleSheet } from 'react-native';

const DEFAULT_OVERLAY_COLOR = 'rgba(0, 0, 0, 0.45)';

export const ImageOverlay = (props) => {

  const { style, children, ...imageBackgroundProps } = props;
  const { overlayColor, ...imageBackgroundStyle } = StyleSheet.flatten(style);

  return (
    <ImageBackground
      {...imageBackgroundProps}
      style={{width: '100%', height: '100%'}}>
      {/* <View style={[StyleSheet.absoluteFill, { backgroundColor: overlayColor || DEFAULT_OVERLAY_COLOR }]}/> */}
      {children}
    </ImageBackground>
  );
};