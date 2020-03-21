import React, { useLayoutEffect, useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import PlaceHolderTextInput from '../components/placeHolderTextInput';
// import Constants from 'expo-constants';
import { connect } from 'react-redux';
import { brandColor, brandLightBackdroundColor } from '../style/customStyles';
import { fetchUser, updateUser } from '../store/actions/userActions';
import ImagePickerView from '../components/ImagePicker';

function UpdateProfileScreen(props) {
  const { currentUserModel, getUser, updateUserDetails, navigation, networkAvailability } = props
  const [ name, setName ] = useState()
  const [ isLoading, setLoading ] = useState(false)
  const [ image, setImage ] = useState()
  const [ isUploading, setUploding ] = useState(false)

  const updateProfile = async () => {
    if(networkAvailability.isOffline) {
      alert("Seems like you are not connected to internet")
    } else if(name && typeof(name) == "string" && name.length > 0) {
      setLoading(true)
      await updateUserDetails({ name: name, image_source: image})
      setLoading(false)
      navigation.navigate('App')
    } else {
      alert("Please enter your name. Thank You!")
    }
  }

  const imageUploaded = (uri) => {
    setImage(uri)
    setUploding(false)
  }

  useEffect(() => {
    if(!currentUserModel.isLoading && currentUserModel && currentUserModel.values.name) {
      setName(currentUserModel.values.name)
      setImage(currentUserModel.values.image_source)
      setLoading(false)
    }
  }, [currentUserModel.isLoading])

  useLayoutEffect(() => {
    if(!networkAvailability.isOffline) {
      getUser()
    }
  }, [])

  return (
    <View style={{flex: 1, justifyContent: 'center', backgroundColor: "#F7F9FC"}}>
      <View style={styles.container}>
        <View style={styles.profilePicContainer}>
        <ImagePickerView 
          styles={styles} 
          image={image} 
          isOffline={networkAvailability.isOffline}
          setImage={imageUploaded} 
          user_id={currentUserModel.values.id} 
          isEdit={true}
          isUploading={isUploading}
          setUploding={setUploding}
          />
        </View>
        <View style={styles.detialsContainer}>
          <View style={styles.item}>
            <Text style={styles.label}>Name</Text>
            <PlaceHolderTextInput
              placeholder="Name"
              containerStyle={styles.placeholderInput}
              styles={styles.field}
              value={name}
              setValue={setName}
              disabled={false}/>
          </View>
          <View style={styles.item}>
            <Text style={styles.label}>Phone</Text>
            <PlaceHolderTextInput
              placeholder="phone"
              containerStyle={styles.placeholderInput}
              styles={styles.field}
              value={currentUserModel.values.phone}
              setValue={updateProfile}
              previousState={currentUserModel.values}
              itemKey="phone"
              disabled={true}/>
          </View>
          {isLoading ? 
            <TouchableOpacity style={[styles.button, {paddingHorizontal: 40}]} disabled={true}>
              <Text style={{color: '#fff', fontFamily: 'roboto-regular'}}>Loading...</Text>
            </TouchableOpacity>:
            <View>
              {networkAvailability.isOffline ? 
                <TouchableOpacity style={[styles.button, {backgroundColor: brandLightBackdroundColor}]} disabled={true}>
                  <Text style={{color: '#fff', fontFamily: 'roboto-regular'}}>Save & Continue</Text>
                </TouchableOpacity> :
                <TouchableOpacity onPress={updateProfile} style={styles.button}>
                  <Text style={{color: '#fff', fontFamily: 'roboto-regular'}}>Save & Continue</Text>
                </TouchableOpacity>
              }  
            </View>
          }
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  button: {
    marginTop: 20,
    backgroundColor: brandColor,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20
  },
  container: {
    // paddingTop: Constants.statusBarHeight,
    paddingBottom: 40,
    marginHorizontal: 40,
    marginVertical: 60,
    shadowColor: "#000",
    backgroundColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 2, },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderRadius: 20
  },
  profilePicPlaceHolder: {
    height: 140,
    width: 140,
    borderRadius: 70,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2, },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  profilePicContainer: {
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
    // borderWidth: 1
  },
  profilePic: {
    height: 140,
    width: 140,
    borderRadius: 70,
    // borderWidth: 1
  },
  name: {
    fontWeight: 'bold',
    width: '100%',
    textAlign:'center'
  },
  detialsContainer: {
    height: 250,
    width: '100%',
    borderColor: 'blue',
    paddingTop: 20,
    paddingHorizontal: 10,
    alignItems: 'center'
  },
  item: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  placeholderInput: {
    width: '70%',
  },

  field: {
    paddingHorizontal: 10
  },
  label: {
    width: '20%',
    textAlign: 'left',
    justifyContent: 'center'
  }
})

const mapStateToProps = state => ({
  currentUserModel: state.currentUser,
  networkAvailability: state.networkAvailability
})

const mapDispatchToProps = dispatch => ({
  getUser: () => dispatch(fetchUser()),
  updateUserDetails: (data) => dispatch(updateUser(data)),
})

export default connect(mapStateToProps, mapDispatchToProps)(UpdateProfileScreen);