import React from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import { Dimensions } from 'react-native';

const screenWidth = Math.round(Dimensions.get('window').width);

const OfferCard = (props) => {
  const { packageService, navigation } = props
  const styles = props.styles
  const bannerWidth = screenWidth - 40

  return (
    <TouchableOpacity onPress={() => navigation.navigate('Packages', { packageService: packageService })}>
      <View style={[{width: bannerWidth, marginRight: 10}, styles]}>
        <Image 
          style={{height: "100%", width: "100%", borderRadius: 10}}
          source={{uri: packageService.poster_image_source}}
          resizeMode={"stretch"}
        />
      </View>
    </TouchableOpacity>
  )
}

export default OfferCard;