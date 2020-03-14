import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import OfferCard from './offerCard';
import { connect } from 'react-redux';

function OfferView(props) {
  const { packages, navigation } = props

  return (
    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
      {packages.isLoading ? 
        <View style={{height: '100%', width: 380, marginRight: 10, justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{fontFamily: 'roboto-light-italic'}}>Loading...</Text>
        </View> :
        packages.values.map((packageService, index) => <OfferCard navigation={navigation} key={packageService.id} packageService={packageService} styles={index == 0 && { marginLeft: 10 }}/>)
      }
    </ScrollView>
  )
}

export default OfferView;