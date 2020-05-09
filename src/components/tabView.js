import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { Tab, Tabs, ScrollableTab } from 'native-base';
import { brandColor } from '../style/customStyles';
import _ from 'lodash';

const TabView = (props) => {
  const { tabs, selectedTab, ItemContainerComponent } = props
  let selectedIndex = 0
  if(selectedTab) {
    selectedIndex =  _.findIndex(tabs, ['id', selectedTab.id])
  }
  
  const [ selectedTabIndex, setSelectedTabIndex ] = useState(selectedIndex)

  return (
    <Tabs tabBarUnderlineStyle={styles.tabBarUnderlineStyle} initialPage={selectedTabIndex} renderTabBar={()=> <ScrollableTab tabsContainerStyle={styles.tabsContainerStyle}/>}>
      { tabs.map((tab) => (
        <Tab tabStyle={styles.tabStyle}
          activeTabStyle={styles.activeTabStyle}
          textStyle={styles.textStyle}
          activeTextStyle={styles.activeTextStyle}
          key={tab.id} heading={tab.name}>
            <ItemContainerComponent {...props} tab={tab}/>
        </Tab>
        ))
      }
      </Tabs>
  )
}

export default TabView;

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