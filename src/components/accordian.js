import React, { Component, useState } from 'react';
import {
  Switch,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
// import Constants from 'expo-constants';
import * as Animatable from 'react-native-animatable';
// import Accordion from 'react-native-collapsible/Accordion';

export default function AccordionView (props) {
  const { content, activeSection, setActiveSection } = props
  const [ state, setState ] = useState({
    activeSections: [(activeSection -1)],
  })

  const setSections = sections => {
    if(sections.includes(undefined)) {
      return false;
    }
    setState({
      activeSections: sections.includes(undefined) ? [] : sections,
    });
  };

  const renderHeader = (section, _, isActive) => {
    // if(!state.activeSections.length) {
    //   return false
    // }
    return (
      <Animatable.View
        duration={400}
        style={[styles.header, isActive ? styles.activeHeader : styles.inactive]}
        transition="backgroundColor"
      >
        <Text style={styles.headerText}>{section.title}</Text>
      </Animatable.View>
    );
  };

  const renderContent = (section, _, isActive) => {
    // if(!state.activeSections.length) {
    //   return false
    // }
    return (
      <Animatable.View
        duration={400}
        style={[styles.content]}
        transition="backgroundColor"
      >
        <Animatable.View animation={isActive ? 'bounceIn' : undefined}>
          {section.content}
        </Animatable.View>
      </Animatable.View>
    );
  }

  const { activeSections } = state;

  return (
    <View style={[styles.container, props.containerStyles]}>
      <Accordion
        activeSections={activeSections}
        sections={content}
        touchableComponent={TouchableOpacity}
        renderHeader={renderHeader}
        renderContent={renderContent}
        duration={400}
        onChange={setSections}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingTop: Constants.statusBarHeight,
  },
  title: {
    textAlign: 'left',
    fontSize: 22,
    fontWeight: '300',
    marginBottom: 20,
  },
  header: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  headerText: {
    textAlign: 'left',
    fontSize: 16,
    fontWeight: 'bold',
  },
  content: {
    padding: 10,
    paddingLeft: 20,
    paddingRight: 20,
    // borderWidth:1,
    backgroundColor: '#fff',
  },
  activeHeader: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  inactive: {
  },
  selectors: {
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  activeSelector: {
    fontWeight: 'bold',
  },
  selectTitle: {
    fontSize: 14,
    fontWeight: '500',
    padding: 10,
  },
  multipleToggle: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 30,
    alignItems: 'center',
  },
  multipleToggle__title: {
    fontSize: 16,
    marginRight: 8,
  },
});