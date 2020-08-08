import React, { useState } from 'react';
import Modal from "react-native-modal";
import { View, StyleSheet, Dimensions, ScrollView } from 'react-native';

function ModalHelper(props) {
  const { openModal, toggleModal } = props
  const [ scrollOffset, setScrollOffset ] = useState(0);
  let scrollViewRef;

  const handleScrollTo = (p) => {
    if (scrollViewRef) {
      scrollViewRef.scrollTo(p);
    }
  };

  const handleOnScroll = (event) => {
    setScrollOffset(event.nativeEvent.contentOffset.y);
  };

  return (
    <Modal
      isVisible={openModal}
      onSwipeComplete={toggleModal}
      swipeDirection="down"
      scrollTo={handleScrollTo}
      scrollOffset={scrollOffset}
      scrollOffsetMax={400 - 300}
      style={styles.bottomModal}
    >
      <ScrollView
        ref={(ref) => (scrollViewRef = ref)}
        onScroll={handleOnScroll}
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
      >
        <View
          style={{
            height: Dimensions.get("window").height
          }}
        >
          {props.children}
        </View>
      </ScrollView>
    </Modal>
  )
}

export default ModalHelper;

const styles = StyleSheet.create({
  bottomModal: {
    justifyContent: "flex-end",
    margin: 0,
    flex: 1
  },
})