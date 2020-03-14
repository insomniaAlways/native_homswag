import React from 'react'
import { Modal, Spinner, Layout } from '@ui-kitten/components';
import { StyleSheet } from 'react-native';

export default function LoadingModal (props) {
  const { isLoading, setLoading } = props
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isLoading}
      backdropStyle={styles.modal}
      onBackdropPress={() => {
        if(setLoading) {
          setLoading(false);
        }
      }}>
        <Layout style={styles.modalContainer}>
          <Layout style={styles.controlContainer}>
            <Spinner status='control'/>
          </Layout>
        </Layout>
      </Modal>
  )
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  modal: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  controlContainer: {
    borderRadius: 4,
    padding: 12,
    backgroundColor: '#3366FF',
  },
})