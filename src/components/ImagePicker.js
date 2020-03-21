import React, { useState } from 'react';
import { View, Image, TouchableOpacity, ImageBackground, StyleSheet, Text } from 'react-native';
// import * as ImagePicker from 'expo-image-picker';
// import Constants from 'expo-constants';
// import * as Permissions from 'expo-permissions';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
// import * as firebase from 'firebase';
import ProfilePicPlaceholder from '../assets/images/profile_pic_placeholder.png'

const ImagePickerView = (props) => {
  const { image, setImage, user_id, isEdit, isUploading, setUploding, isOffline } = props
  const [ status, setStatus ] = useState()
  const [ progress, setProgress ] = useState()

  const reset = () => {
    setUploding(false)
  }

  const startModule = () =>{
    if(isOffline) {
      alert('Seems like you are not connected to Internet')
    } else {
      getPermissionAsync();
    }
  }

  const progressStatus = (snapshot) => {
    let percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    setProgress(Math.round(percentage))
    switch (snapshot.state) {
      case 'paused':
        return setStatus(snapshot.state)
      case 'running':
        return setStatus(snapshot.state)
      default: setStatus(snapshot.state)
    }
  }

  const catchError = (error) => {
    switch (error.code) {
      case 'storage/unauthorized': {
        return alert(error.code)
      }
      case 'storage/canceled': {
        return alert(error.code)
      }
      case 'storage/unknown': {
        return alert(error.code)
      }
    }
    reset()
  }

  const uploadImage = async (uri) => {
    // try {
    //   const response = await fetch(uri);
    //   const blob = await response.blob();
    //   let ref = firebase.storage().ref().child('profile_pic/' + user_id);
    //   const uploadTask = ref.put(blob);
    //   uploadTask.on('state_changed',
    //   (snapshot) => progressStatus(snapshot),
    //   (error) => catchError(error),
    //   () => uploadTask.snapshot.ref.getDownloadURL()
    //   .then((url) => setImage(url)))
    // } catch (e) {
    //   alert(e)
    //   reset()
    // }
  }

  const getPermissionAsync = async () => {
    // if (Constants.platform.ios) {
    //   const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    //   if (status !== 'granted') {
    //     alert('Sorry, we need camera roll permissions to make this work!');
    //   }
    // }
    // _pickImage()
  }

  const _pickImage = async () => {
    // let result = await ImagePicker.launchImageLibraryAsync({
    //   mediaTypes: ImagePicker.MediaTypeOptions.All,
    //   allowsEditing: true,
    //   aspect: [4, 4],
    //   quality: 0.5
    // });

    // if (!result.cancelled) {
    //   setUploding(true)
    //   uploadImage(result.uri)
    // }
  };

  return (
    <View style={props.styles.profilePicContainer}>
      { image ?
        <View>
          <View style={props.styles.profilePic}>
            <Image style={props.styles.profilePic} source={{uri: image}}/>
          </View>
          { isEdit &&
            <View style={{paddingTop: 5}}>
            { isUploading ?
              <View style={{justifyContent: 'center', alignItems: 'center'}}>
                <Text style={{fontFamily: 'roboto-light-italic', fontSize: 12}}>{progress}%</Text>
                <Text style={{fontFamily: 'roboto-light-italic', fontSize: 12}}>Uploading...</Text>
              </View> :
              <TouchableOpacity onPress={startModule} style={{justifyContent: 'center', alignItems: 'center'}}>
                <Text>Change</Text>
              </TouchableOpacity>
            }
            </View> 
          }
        </View> :
        <TouchableOpacity onPress={startModule}>
          <ImageBackground style={styles.profilePicPlaceHolder} source={ProfilePicPlaceholder}>
            <View style={{paddingBottom: 10, paddingRight: 10, backgroundColor: 'transparent'}}>
              <FontAwesome name="camera" size={24} />
            </View>
          </ImageBackground>
        </TouchableOpacity>
      }
    </View>
  )
}

export default ImagePickerView;

const styles = StyleSheet.create({
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
})