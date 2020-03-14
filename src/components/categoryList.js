import React from 'react';
import { StyleSheet, View, Image, TouchableOpacity } from 'react-native';
import { Text } from '@ui-kitten/components';

const CategoryList = (props) => {
  let flatListProps ={numColumns: 3, horizontal: false, style: styles.list}

  const RenderItem = ({ item, index }) => (
    <TouchableOpacity onPress={() => props.navigation.navigate('Items', { category: item })}
      style={styles.itemContainer}
    >
      <Image
        style={{width: 30, height: 30}}
        source={{uri: item.image_source}}
      />
      <Text style={{width: '90%', textAlign: 'center', fontSize: 12}}>{item.display_name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={{flexWrap: 'wrap', flexDirection: 'row', borderWidth: 1, borderRadius: 5, marginTop: 10, borderColor: '#eee', paddingBottom: 10}}>
      {(props.data && Array.isArray(props.data) && props.data.length) ? props.data.map((item, index) => <RenderItem key={index} item={item} index={index}/>) : (<View><Text>Something went worng</Text></View>)}
    </View>
  )
};

export default CategoryList;

const styles = StyleSheet.create({
  itemContainer: {
    width: '33.33%',
    height: 90,
    paddingTop: 10,
    paddingBottom: 10,
    // marginTop: 10,
    alignItems: "center",
    justifyContent: 'center',
    // backgroundColor: "#eee"
  },
  list: {
    backgroundColor: "white",
    padding: 10
  }
})