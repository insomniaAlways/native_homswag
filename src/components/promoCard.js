import React from 'react';
import { View, Image } from 'react-native';

function PromoCard({ style, source }) {
  return (
    <View style={[{paddingBottom: 10, paddingHorizontal: 10, borderRadius: 10}, style]}>
      <Image 
        style={{height: 220, width: 250, borderRadius: 10}}
        source={source}
      />
    </View>
  )
}

export default PromoCard;