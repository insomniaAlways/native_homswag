import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { Tab, Tabs, ScrollableTab } from 'native-base';
import { brandColor } from '../style/customStyles';
import _ from 'lodash';
import ItemsList from './itemList';

const DynamicTabs = (props) => {
  const { category, selectedItems } = props
  const { sub_categories } = category
  const tabs = sub_categories
  const [ selectedTabIndex, setSelectedTabIndex ] = useState(0)

  tabs.forEach((tab) => {
    if(tab.type == 'all') {
      tab.items = selectedItems
    } else {
      tab.items = _.filter(selectedItems, ['sub_category.type', tab.type])
    }
  })

  return (
    <Tabs tabBarUnderlineStyle={styles.tabBarUnderlineStyle} initialPage={selectedTabIndex} renderTabBar={()=> <ScrollableTab tabsContainerStyle={styles.tabsContainerStyle}/>}>
      { tabs.map((tab, index) => (
        <Tab tabStyle={styles.tabStyle}
          activeTabStyle={styles.activeTabStyle}
          textStyle={styles.textStyle}
          activeTextStyle={styles.activeTextStyle}
          key={index} heading={tab.name}>
            <ItemsList data={tab.items} {...props}/>
        </Tab>
        ))
      }
      </Tabs>
  )
}

export default DynamicTabs;

const styles = StyleSheet.create({
  tabBarUnderlineStyle: {
    backgroundColor: brandColor,
    borderRadius: 5
  },
  tabsContainerStyle: {
    paddingLeft: 10,
    backgroundColor: '#fff'
  },
  tabStyle: {
    backgroundColor: '#fff',
    marginRight:10
  },
  activeTabStyle: {
    backgroundColor: '#fff',
    marginRight:10
  },
  textStyle: {
    color: 'rgba(0, 0, 0, 0.8)'
  },
  activeTextStyle: {
    color: brandColor,
    fontWeight: '700' 
  }
})