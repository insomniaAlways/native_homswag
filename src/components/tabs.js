import React from 'react';
import { Tab, Tabs } from 'native-base';
import CategoryList from './categoryList';
import { View, Text } from 'react-native';

const TabViews = (props) => {

  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const shouldLoadComponent = (index) => index === selectedIndex;

  return (
    <Tabs selectedIndex={selectedIndex}
      shouldLoadComponent={shouldLoadComponent}
      onSelect={setSelectedIndex}
      tabBarStyle={{paddingBottom: 10, paddingTop: 10, borderBottomWidth: 1, borderColor: '#eee'}}
      >
      <Tab title='Services'>
        <CategoryList data={props.categories.values} navigation={props.navigation}/>
      </Tab>
      <Tab title='Packages'>
        <View style={{height: 300, justifyContent: 'center', alignItems: 'center'}}>
          <Text>No Packages Available</Text>
        </View>
      </Tab>
    </Tabs>
  );
};

export default TabViews;